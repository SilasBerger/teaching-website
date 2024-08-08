import { action, observable } from 'mobx';
import { RootStore } from './rootStore';
import { computedFn } from 'mobx-utils';
import {
    Document as DocumentProps,
    DocumentType,
    find as apiFind,
    update as apiUpdate,
    create as apiCreate,
    Access,
    DocumentTypes,
    TypeModelMapping
} from '../api/document';
import iStore from './iStore';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import iDocument from '../models/iDocument';
import { ChangedDocument } from '../api/IoEventTypes';
import String from '../models/documents/String';
import TaskState from "@site/src/app/models/documents/TaskState";

class DocumentStore extends iStore {
    readonly root: RootStore;
    documents = observable.array<DocumentTypes>([]);

    constructor(root: RootStore) {
        super();
        this.root = root;
    }

    createModel<T extends DocumentType>(data: DocumentProps<T>): TypeModelMapping[T];
    createModel(data: DocumentProps<DocumentType>): DocumentTypes {
        switch (data.type) {
            case DocumentType.TaskState:
                return new TaskState(data as DocumentProps<DocumentType.TaskState>, this);
            case DocumentType.String:
                return new String(data as DocumentProps<DocumentType.String>, this);
        }
    }

    @action
    addDocument(document: DocumentTypes) {
        this.documents.push(document);
    }

    find = computedFn(
        function (this: DocumentStore, id?: string) {
            if (!id) {
                return;
            }
            return this.documents.find((d) => d.id === id);
        },
        { keepAlive: true }
    );

    findByDocumentRoot = computedFn(
        function (this: DocumentStore, documentRootId?: string) {
            if (!documentRootId) {
                return [];
            }
            return this.documents.filter((d) => d.documentRootId === documentRootId);
        },
        { keepAlive: true }
    );

    @action
    addToStore<Type extends DocumentType>(
        data: DocumentProps<Type> | undefined | null
    ): TypeModelMapping[Type] | undefined {
        /**
         * Adds a new model to the store. Existing models with the same id are replaced.
         */
        if (!data) {
            return;
        }
        const model = this.createModel(data);

        this.removeFromStore(model.id);
        this.documents.push(model);
        return model as TypeModelMapping[Type];
    }

    @action
    removeFromStore(id: string): DocumentTypes | undefined {
        /**
         * Removes the model to the store
         */
        const old = this.find(id);
        if (old) {
            this.documents.remove(old);
            old.cleanup();
        }
        return old;
    }

    @action
    loadModel<Type extends DocumentType>(id: string) {
        if (!id) {
            return Promise.resolve(undefined);
        }
        return this.withAbortController(`load-${id}`, (sig) => {
            return apiFind<Type>(id, sig.signal);
        })
            .then(
                action(({ data }) => {
                    if (data && Object.keys(data).length > 0) {
                        return this.addToStore(data);
                    } else {
                        /** apparently the model is not present anymore - remove it from the store */
                        return this.removeFromStore(id);
                    }
                })
            )
            .catch((err) => {
                if (axios.isCancel(err)) {
                    return;
                } else if (err.response) {
                    /**
                     * https://github.com/axios/axios#handling-errors
                     * the api responded with a non-2xx status code - apparently the model is not present anymore
                     * and can/should be removed from the store
                     */
                    this.removeFromStore(id);
                    return;
                }
            });
    }

    @action
    save<Type extends DocumentType>(
        model: iDocument<Type>,
        replaceStoreModel: boolean = false
    ): Promise<TypeModelMapping[Type] | undefined> {
        if (model.isDirty && !model.root?.isDummy) {
            const { id } = model;
            if (model.root?.access !== Access.RW) {
                return Promise.resolve(undefined);
            }
            return this.withAbortController(`save-${id}`, (sig) => {
                return apiUpdate(model.id, model.data, sig.signal);
            })
                .then(
                    action(({ data }) => {
                        if (data) {
                            if (replaceStoreModel) {
                                return this.addToStore(data);
                            }
                            return this.createModel(data);
                        }
                        return undefined;
                    })
                )
                .catch((err) => {
                    if (!axios.isCancel(err)) {
                        console.warn('Error saving document', err);
                    }
                    return undefined;
                });
        }
        return Promise.resolve(undefined);
    }

    @action
    create<Type extends DocumentType>(
        model: { documentRootId: string; type: Type } & Partial<DocumentProps<Type>>
    ) {
        return this.withAbortController(`create-${model.id || uuidv4()}`, (sig) => {
            return apiCreate<Type>(model, sig.signal);
        })
            .then(
                action(({ data }) => {
                    return this.addToStore(data);
                })
            )
            .catch((err) => {
                if (!axios.isCancel(err)) {
                    console.warn('Error saving document', err);
                }
                return undefined;
            });
    }

    @action
    handleUpdate(change: ChangedDocument) {
        const model = this.find(change.id);
        if (model) {
            model.setData(change.data as any, false, new Date(change.updatedAt));
        }
    }
}

export default DocumentStore;
