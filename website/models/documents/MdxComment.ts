import { action, computed, observable } from 'mobx';
import iDocument, { Source } from '@tdev-models/iDocument';
import {
    DocumentType,
    Document as DocumentProps,
    TypeDataMapping,
    Access,
    MdxCommentData,
    DocumentTypes
} from '@tdev-api/document';
import DocumentStore from '@tdev-stores/DocumentStore';
import { TypeMeta } from '@tdev-models/DocumentRoot';
import { Color } from '@tdev-components/shared/Colors';

export interface MetaInit extends MdxCommentData {}

export class ModelMeta extends TypeMeta<DocumentType.MdxComment> {
    readonly type = DocumentType.MdxComment;
    readonly nr: number;
    readonly commentNr: number;
    readonly nodeType: string;

    constructor(props: Partial<MetaInit>) {
        super(DocumentType.MdxComment);
        this.nr = props.nr || 0;
        this.commentNr = props.commentNr || 0;
        this.nodeType = props.type || '';
    }

    get defaultData(): TypeDataMapping[DocumentType.MdxComment] {
        return {
            type: this.nodeType,
            nr: this.nr,
            commentNr: this.commentNr,
            isOpen: true,
            color: 'blue'
        };
    }
}

class MdxComment extends iDocument<DocumentType.MdxComment> {
    @observable accessor nodeType: string;
    @observable accessor nr: number;
    @observable accessor commentNr: number;
    @observable accessor isOpen: boolean;
    @observable accessor color: Color;

    @observable accessor optionsOpen: boolean = false;

    constructor(props: DocumentProps<DocumentType.MdxComment>, store: DocumentStore) {
        super(props, store);
        this.nr = props.data.nr;
        this.commentNr = props.data.commentNr;
        this.nodeType = props.data.type;
        this.isOpen = props.data.isOpen;
        this.color = props.data.color;
    }

    @action
    setData(data: TypeDataMapping[DocumentType.MdxComment], from: Source, updatedAt?: Date): void {
        this.nr = data.nr;
        this.commentNr = data.commentNr;
        this.nodeType = data.type;
        this.color = data.color;
        this.isOpen = data.isOpen;
        if (from === Source.LOCAL) {
            this.save();
        }
        if (updatedAt) {
            this.updatedAt = new Date(updatedAt);
        }
    }

    get data(): TypeDataMapping[DocumentType.MdxComment] {
        return {
            nr: this.nr,
            commentNr: this.commentNr,
            type: this.nodeType,
            isOpen: this.isOpen,
            color: this.color
        };
    }

    @computed
    get meta(): ModelMeta {
        if (this.root?.type === DocumentType.MdxComment) {
            return this.root.meta as ModelMeta;
        }
        return new ModelMeta({});
    }

    @action
    setIsOpen(isOpen: boolean) {
        this.isOpen = isOpen;
        this.save();
    }

    @action
    setColor(color: Color) {
        this.color = color;
        this.save();
    }

    @action
    setOptionsOpen(open: boolean) {
        this.optionsOpen = open;
    }

    @action
    delete() {
        return this.store.apiDelete(this as any as DocumentTypes);
    }
}

export default MdxComment;
