import React, { useId } from 'react';
import { Access, DocumentType } from '../api/document';
import { TypeMeta } from '../models/DocumentRoot';
import { CreateDocumentModel } from '../stores/DocumentStore';
import { useDocumentRoot } from './useDocumentRoot';
import { useStore } from './useStore';
import { RWAccess } from '../models/helpers/accessPolicy';

/**
 * This hook provides access to the first main document of the rootDocument.
 * This is especially useful, when the DocumentType is expected to have only
 * one main document - like a TaskState.
 */
export const useFirstMainDocument = <Type extends DocumentType>(
    documentRootId: string | undefined,
    meta: TypeMeta<Type>
) => {
    const defaultDocId = useId();
    const documentRoot = useDocumentRoot(documentRootId, meta);
    const userStore = useStore('userStore');
    const documentStore = useStore('documentStore');
    const [dummyDocument] = React.useState(
        CreateDocumentModel(
            {
                id: defaultDocId,
                type: meta.type,
                data: meta.defaultData,
                authorId: 'dummy',
                documentRootId: documentRoot.id,
                parentId: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            documentStore
        )
    );
    React.useEffect(() => {
        if (!userStore.current || userStore.isUserSwitched) {
            return;
        }
        if (documentRoot.isLoaded && !documentRoot.isDummy && !documentRoot.firstMainDocument) {
            /**
             * If the user is viewing another user, we should not create a document
             * and instead try to load the first main document of the viewed user.
             */
            if (RWAccess.has(documentRoot.permission)) {
                documentStore.create({
                    documentRootId: documentRoot.id,
                    authorId: userStore.current.id,
                    type: documentRoot.type,
                    data: meta.defaultData
                });
            }
        }
    }, [documentRoot, userStore.current]);

    return documentRoot?.firstMainDocument || dummyDocument;
};
