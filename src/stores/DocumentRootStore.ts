import { action, observable, runInAction } from 'mobx';
import { RootStore } from './rootStore';
import { computedFn } from 'mobx-utils';
import DocumentRoot, { TypeMeta } from '../models/DocumentRoot';
import {
    Config,
    create as apiCreate,
    DocumentRootUpdate,
    find as apiFind,
    findManyFor as apiFindManyFor,
    update as apiUpdate,
    DocumentRoot as ApiDocumentRoot
} from '../api/documentRoot';
import iStore from './iStore';
import GroupPermission from '../models/GroupPermission';
import UserPermission from '../models/UserPermission';
import { DocumentType } from '../api/document';
import { debounce } from 'lodash';

type LoadConfig = {
    documents?: boolean;
    userPermissions?: boolean;
    groupPermissions?: boolean;
    documentRoot?: boolean;
};

type BatchedMeta = {
    load: LoadConfig;
    meta: TypeMeta<any>;
};

export class DocumentRootStore extends iStore {
    readonly root: RootStore;
    documentRoots = observable.array<DocumentRoot<DocumentType>>([]);
    queued = new Map<string, BatchedMeta>();

    constructor(root: RootStore) {
        super();
        this.root = root;
    }

    @action
    addDocumentRoot(documentRoot: DocumentRoot<DocumentType>, cleanupOld: boolean = false) {
        const old = this.find(documentRoot.id);
        if (old) {
            this.documentRoots.remove(old);
            if (cleanupOld) {
                this.cleanupDocumentRoot(old);
            }
        }
        this.documentRoots.push(documentRoot);
        return documentRoot;
    }

    find = computedFn(
        function <Type extends DocumentType = DocumentType>(
            this: DocumentRootStore,
            id?: string
        ): DocumentRoot<Type> | undefined {
            if (!id) {
                return;
            }
            return this.documentRoots.find((d) => d.id === id) as DocumentRoot<Type> | undefined;
        },
        { keepAlive: true }
    );

    @action
    loadInNextBatch<Type extends DocumentType>(id: string, meta: TypeMeta<Type>, config?: LoadConfig) {
        if (this.queued.has(id)) {
            return;
        }
        this.queued.set(id, {
            meta: meta,
            load: config || {
                documentRoot: true,
                documents: true,
                groupPermissions: true,
                userPermissions: true
            }
        });
        this.loadQueued();
        if (this.queued.size > 42) {
            // max 2048 characters in URL - flush if too many
            this.loadQueued.flush();
        }
    }

    /**
     * load the documentRoots only
     * - after 10 ms of "silence" (=no further load-requests during this period)
     * - or after 15ms have elapsed
     * - or when more then 42 records are queued (@see loadInNextBatch)
     *    (otherwise the URL maxlength would be reached)
     */
    loadQueued = debounce(action(this._loadQueued), 10, {
        leading: false,
        trailing: true,
        maxWait: 15
    });

    @action
    _loadQueued() {
        const current = new Map([...this.queued]);
        this.queued.clear();
        /**
         * if the user is not logged in, we can't load the documents
         * so we just mark all queued documents as loaded
         */
        if (!this.root.sessionStore.isLoggedIn) {
            [...current.keys()].forEach((id) => {
                const dummyModel = this.find(id);
                if (dummyModel && dummyModel.isDummy) {
                    dummyModel.setLoaded();
                }
            });
            return;
        }
        const userId = this.root.userStore.viewedUserId;
        const isUserSwitched = this.root.userStore.isUserSwitched;
        /**
         * the user is not yet loaded, but a session is active
         */
        if (!userId) {
            for (const [id, meta] of current.entries()) {
                this.queued.set(id, meta);
            }
            this.loadQueued();
            return;
        }
        /**
         * load all queued documents
         */
        const keys = [...current.keys()].sort();
        this.withAbortController(`load-queued-${keys.join('--')}`, async (signal) => {
            const models = await apiFindManyFor(userId, keys, isUserSwitched, signal.signal);
            // create all loaded models
            models.data.forEach(
                action((data) => {
                    const config = current.get(data.id);
                    if (!config) {
                        return;
                    }
                    this.addApiResultToStore(data, config);
                    current.delete(data.id);
                })
            );
            if (!isUserSwitched) {
                // create all missing root documents
                const created = await Promise.all(
                    [...current.keys()]
                        .filter((id) => !this.find(id)?.isLoaded)
                        .map((id) => {
                            const config = current.get(id);
                            if (config) {
                                return this.create(id, config.meta, {});
                            }
                            return Promise.resolve(undefined);
                        })
                );
                // delete all created roots from the current map
                created
                    .filter((docRoot) => !!docRoot)
                    .forEach((docRoot) => {
                        current.delete(docRoot.id);
                    });
            }
            // mark all remaining roots as loaded
            [...current.keys()].forEach((id) => {
                const dummyModel = this.find(id);
                if (dummyModel && dummyModel.isDummy) {
                    dummyModel.setLoaded();
                }
            });
        });
    }

    @action
    addApiResultToStore(data: ApiDocumentRoot, config: BatchedMeta) {
        const documentRoot = config.load.documentRoot
            ? new DocumentRoot(data, config.meta, this)
            : this.find(data.id);
        if (!documentRoot) {
            return;
        }
        if (config.load.documentRoot) {
            this.addDocumentRoot(documentRoot, true);
        }
        if (config.load.groupPermissions) {
            data.groupPermissions.forEach((gp) => {
                this.root.permissionStore.addGroupPermission(
                    new GroupPermission({ ...gp, documentRootId: documentRoot.id }, this.root.permissionStore)
                );
            });
        }
        if (config.load.userPermissions) {
            data.userPermissions.forEach((up) => {
                this.root.permissionStore.addUserPermission(
                    new UserPermission({ ...up, documentRootId: documentRoot.id }, this.root.permissionStore)
                );
            });
        }
        if (config.load.documents) {
            data.documents.forEach((doc) => {
                this.root.documentStore.addToStore(doc);
            });
        }
        return documentRoot;
    }

    @action
    create<Type extends DocumentType>(id: string, meta: TypeMeta<Type>, config: Partial<Config>) {
        return this.withAbortController(`create-${id}`, async (signal) => {
            const { data } = await apiCreate(id, config, signal.signal);
            const docRoot = new DocumentRoot(data, meta, this);
            this.addDocumentRoot(docRoot, true);
            return docRoot;
        });
    }

    @action
    handleUpdate({ id, access, sharedAccess }: DocumentRootUpdate) {
        const model = this.find(id);
        if (model) {
            model.rootAccess = access;
            model.sharedAccess = sharedAccess;
        }
    }

    /**
     * returns userPermissions and! groupPermissions
     */
    currentUsersPermissions(documentRootId: string) {
        const currentUser = this.root.userStore.current;
        if (!currentUser) {
            return [];
        }
        return this.root.permissionStore
            .permissionsByDocumentRoot(documentRootId)
            .filter((p) => p.isAffectingUser(currentUser));
    }

    @action
    removeFromStore(documentRootId: string, cleanup: boolean = true) {
        const docRoot = this.find(documentRootId);
        if (docRoot) {
            this.documentRoots.remove(docRoot);
            if (cleanup) {
                this.cleanupDocumentRoot(docRoot);
            }
        }
    }

    @action
    cleanupDocumentRoot(documentRoot: DocumentRoot<DocumentType>) {
        documentRoot.documents.forEach((doc) => {
            this.root.documentStore.removeFromStore(doc.id);
        });
    }

    @action
    save(documentRoot: DocumentRoot<any>) {
        if (!this.root.sessionStore.isLoggedIn || !this.root.userStore.current?.isAdmin) {
            return Promise.resolve('error');
        }

        const model = {
            access: documentRoot.rootAccess,
            sharedAccess: documentRoot.sharedAccess
        };

        return this.withAbortController(`save-${documentRoot.id}`, (signal) => {
            return apiUpdate(documentRoot.id, model, signal.signal);
        }).catch(() => console.warn('Error saving document root'));
    }
}
