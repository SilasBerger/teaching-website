import { action, observable } from 'mobx';
import { RootStore } from './rootStore';
import { computedFn } from 'mobx-utils';
import DocumentRoot, { TypeMeta } from '../models/DocumentRoot';
import { find as apiFind, create as apiCreate, Config } from '../api/documentRoot';
import iStore from './iStore';
import PermissionGroup from '../models/PermissionGroup';
import PermissionUser from '../models/PermissionUser';
import { DocumentType } from '../api/document';

export class DocumentRootStore extends iStore {
    readonly root: RootStore;
    documentRoots = observable.array<DocumentRoot<DocumentType>>([]);

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
    load<Type extends DocumentType>(id: string, meta: TypeMeta<Type>) {
        return this.withAbortController(`load-${id}`, async (signal) => {
            const { data } = await apiFind(id, signal.signal);
            if (!data) {
                return;
            }
            const documentRoot = new DocumentRoot(data, meta, this);
            this.addDocumentRoot(documentRoot, true);
            data.documents.forEach((doc) => {
                this.root.documentStore.addToStore(doc);
            });
            data.groupPermissions.forEach((gp) => {
                this.root.permissionStore.addGroupPermission(
                    new PermissionGroup({ ...gp, documentRootId: documentRoot.id }, this.root.permissionStore)
                );
            });
            data.userPermissions.forEach((up) => {
                this.root.permissionStore.addUserPermission(
                    new PermissionUser({ ...up, documentRootId: documentRoot.id }, this.root.permissionStore)
                );
            });
            return documentRoot;
        });
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

    usersPermissions(documentRootId: string) {
        const currentUser = this.root.userStore.current;
        if (!currentUser) {
            return [];
        }
        return this.root.permissionStore
            .permissionsByDocumentRoot(documentRootId)
            .filter((p) => p.isAffectingUser(currentUser));
    }

    @action
    cleanupDocumentRoot(documentRoot: DocumentRoot<DocumentType>) {
        documentRoot.documents.forEach((doc) => {
            this.root.documentStore.removeFromStore(doc.id);
        });
    }
}
