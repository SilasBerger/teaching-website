import React, { useId } from 'react';
import { Access, DocumentType } from '../api/document';
import DocumentRoot, { TypeMeta } from '../models/DocumentRoot';
import { useStore } from './useStore';

/**
 * 1. create a dummy documentRoot with default (meta) data
 * 2. create a dummy document with default (meta) data
 * 2. when component mounts, check if the documentRoot is already in the store
 * 3. if not
 *  3.1. add the dummy document to the store
 *  3.2. add the dummy documentRoot to the store
 *  3.3. if an id was provided, load or create the documentRoot and it's documents from the api
 *  3.4. cleanup the dummy document
 */
export const useDocumentRoot = <Type extends DocumentType>(
    id: string | undefined,
    meta: TypeMeta<Type>,
    createFirstDocument: boolean = true
) => {
    const defaultRootDocId = useId();
    const userStore = useStore('userStore');
    const documentRootStore = useStore('documentRootStore');
    const [dummyDocumentRoot] = React.useState<DocumentRoot<Type>>(
        new DocumentRoot(
            {
                id: id || defaultRootDocId,
                access: Access.RW_DocumentRoot,
                sharedAccess: Access.None_DocumentRoot
            },
            meta,
            documentRootStore,
            true
        )
    );

    /** initial load */
    React.useEffect(() => {
        const rootDoc = documentRootStore.find(dummyDocumentRoot.id);
        if (rootDoc) {
            return;
        }
        if (createFirstDocument) {
            documentRootStore.addDocumentRoot(dummyDocumentRoot);
        }
        if (!id) {
            dummyDocumentRoot.setLoaded();
            return;
        }

        /**
         * load the documentRoot and it's documents from the api.
         */
        documentRootStore.loadInNextBatch(id, meta);
        return () => {
            documentRootStore.removeFromStore(defaultRootDocId, false);
        };
    }, []);

    React.useEffect(() => {
        if (!userStore.isUserSwitched || !id) {
            return;
        }
        documentRootStore.loadInNextBatch(id, meta, {
            documents: true,
            userPermissions: true,
            groupPermissions: true
        });
    }, [userStore.viewedUser]);

    return documentRootStore.find<Type>(dummyDocumentRoot.id) || dummyDocumentRoot;
};
