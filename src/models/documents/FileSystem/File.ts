import { action, computed, observable } from 'mobx';
import iDocument, { Source } from '../../iDocument';
import { DocumentType, Document as DocumentProps, TypeDataMapping, Access } from '@site/src/api/document';
import DocumentStore from '@site/src/stores/DocumentStore';
import { TypeMeta } from '../../DocumentRoot';
import { formatDateTime } from '../../helpers/date';
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
        return this.store.findByParentId(this.id);
    }
}

export default File;
