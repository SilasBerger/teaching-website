import { ReactContextError } from '@docusaurus/theme-common';
import { useContext } from 'react';
import { DocContext } from './DocumentContext';
import { DocumentType, TypeModelMapping } from '@site/src/api/document';

export function useDocument<T extends DocumentType>(): TypeModelMapping[T] {
    const context = useContext(DocContext);
    if (context === null) {
        throw new ReactContextError(
            'DocumentContextProvider',
            'The Component must be a child of the DocumentContextProvider component'
        );
    }
    return context as TypeModelMapping[T];
}
