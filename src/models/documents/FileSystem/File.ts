import { computed } from 'mobx';
import { DocumentType, Document as DocumentProps } from '@tdev-api/document';
import DocumentStore from '@tdev-stores/DocumentStore';
import _ from 'lodash';
import iFileSystem, { iFSMeta, MetaInit } from './iFileSystem';

export class ModelMeta extends iFSMeta<DocumentType.File> {
    constructor(props: Partial<MetaInit>) {
        super(DocumentType.File, props);
    }
}

class File extends iFileSystem<DocumentType.File> {
    constructor(props: DocumentProps<DocumentType.File>, store: DocumentStore) {
        super(props, store);
    }

    @computed
    get meta(): ModelMeta {
        if (this.root?.type === DocumentType.File) {
            return this.root.meta as ModelMeta;
        }
        return new ModelMeta({});
    }

    @computed
    get document() {
        return this.children[0];
    }
}

export default File;
