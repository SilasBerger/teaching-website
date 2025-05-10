import { DocumentType, TypeModelMapping } from '@tdev-api/document';
import { useStore } from '@tdev-hooks/useStore';

export const useDocument = <Type extends DocumentType>(documentId: string | undefined) => {
    const documentStore = useStore('documentStore');
    return documentStore.find(documentId) as TypeModelMapping[Type];
};
