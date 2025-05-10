import { action, computed, observable } from 'mobx';
import iDocument, { Source } from '@tdev-models/iDocument';
import { DocumentType, Document as DocumentProps, TypeDataMapping, Access } from '@tdev-api/document';
import DocumentStore from '@tdev-stores/DocumentStore';
import { TypeMeta } from '@tdev-models/DocumentRoot';

export interface MetaInit {
    readonly?: boolean;
}

export class ModelMeta extends TypeMeta<DocumentType.TextMessage> {
    readonly type = DocumentType.TextMessage;

    constructor(props: Partial<MetaInit>) {
        super(DocumentType.TextMessage, props.readonly ? Access.RO_User : undefined);
    }

    get defaultData(): TypeDataMapping[DocumentType.TextMessage] {
        return {
            text: ''
        };
    }
}

class TextMessage extends iDocument<DocumentType.TextMessage> {
    @observable accessor text: string;
    constructor(props: DocumentProps<DocumentType.TextMessage>, store: DocumentStore) {
        super(props, store);
        this.text = props.data.text;
    }

    @action
    setData(data: TypeDataMapping[DocumentType.TextMessage], from: Source, updatedAt?: Date): void {
        this.text = data.text;
        if (from === Source.LOCAL) {
            this.save();
        }
        if (updatedAt) {
            this.updatedAt = new Date(updatedAt);
        }
    }

    get data(): TypeDataMapping[DocumentType.TextMessage] {
        return {
            text: this.text
        };
    }

    @computed
    get meta(): ModelMeta {
        if (this.root?.type === DocumentType.TextMessage) {
            return this.root.meta as ModelMeta;
        }
        return new ModelMeta({});
    }

    @computed
    get isAuthor(): boolean {
        return this.authorId === this.store.root.userStore.viewedUserId;
    }

    @computed
    get sentToday(): boolean {
        return this.createdAt.toDateString() === new Date().toDateString();
    }
}

export default TextMessage;
