import { action, computed } from 'mobx';
import iDocument, { Source } from '@tdev-models/iDocument';
import { DocumentType, Document as DocumentProps, TypeDataMapping, Access } from '@tdev-api/document';
import DocumentStore from '@tdev-stores/DocumentStore';
import { TypeMeta } from '@tdev-models/DocumentRoot';

export interface MetaInit {
    readonly?: boolean;
}

export class ModelMeta extends TypeMeta<DocumentType.Restricted> {
    readonly type = DocumentType.Restricted;

    constructor(props: Partial<MetaInit>) {
        super(DocumentType.Restricted, props.readonly ? Access.RO_User : undefined);
    }

    get defaultData(): TypeDataMapping[DocumentType.Restricted] {
        return {};
    }
}

class Restricted extends iDocument<DocumentType.Restricted> {
    constructor(props: DocumentProps<DocumentType.Restricted>, store: DocumentStore) {
        super(props, store);
    }

    @action
    setData(_: TypeDataMapping[DocumentType.Restricted], from: Source, updatedAt?: Date): void {
        if (from === Source.LOCAL) {
            this.save();
        }
        if (updatedAt) {
            this.updatedAt = new Date(updatedAt);
        }
    }

    get data(): TypeDataMapping[DocumentType.Restricted] {
        return {};
    }

    @computed
    get meta(): ModelMeta {
        if (this.root?.type === DocumentType.Restricted) {
            return this.root.meta as ModelMeta;
        }
        return new ModelMeta({});
    }
}

export default Restricted;
