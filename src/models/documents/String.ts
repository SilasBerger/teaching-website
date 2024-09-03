import { action, computed, observable } from 'mobx';
import iDocument from '../iDocument';
import {Access, DocumentType, Document as DocumentProps, TypeDataMapping} from "@site/src/api/document";
import DocumentStore from "@site/src/stores/DocumentStore";
import {TypeMeta} from "@site/src/models/DocumentRoot";

export interface MetaInit {
    readonly?: boolean;
    solution?: string;
    default?: string;
    sanitizer?: (val: string) => string;
    checker?: (val: string | undefined) => boolean;
}

export class ModelMeta extends TypeMeta<DocumentType.String> {
    readonly type = DocumentType.String;
    readonly readonly?: boolean;
    readonly solution?: string;
    readonly default?: string;
    readonly sanitizer: (val: string) => string;
    readonly checker: (val: string | undefined) => boolean;

    constructor(props: Partial<MetaInit>) {
        super(DocumentType.String, props.readonly ? Access.RO : undefined);
        this.readonly = props.readonly;
        this.default = props.default;
        this.solution = props.solution;
        this.sanitizer = props.sanitizer || ((val: string) => val);
        this.checker = props.checker || ((val: string | undefined) => val === this.solution);
    }

    get defaultData(): TypeDataMapping[DocumentType.String] {
        return {
            text: this.default || ''
        };
    }
}

export enum StringAnswer {
    Unchecked = 'unchecked',
    Correct = 'correct',
    Wrong = 'wrong'
}

class String extends iDocument<DocumentType.String> {
    @observable accessor text: string;
    @observable accessor answer: StringAnswer = StringAnswer.Unchecked;
    constructor(props: DocumentProps<DocumentType.String>, store: DocumentStore) {
        super(props, store);
        this.text = props.data.text || '';
    }

    @action
    setData(data: TypeDataMapping[DocumentType.String], persist: boolean, updatedAt?: Date): void {
        this.text = data.text;
        this.answer = StringAnswer.Unchecked;
        if (persist) {
            this.save();
        }
        if (updatedAt) {
            this.updatedAt = new Date(updatedAt);
        }
    }

    get data(): TypeDataMapping[DocumentType.String] {
        return {
            text: this.text
        };
    }

    @computed
    get hasSolution() {
        return this.meta.solution !== undefined;
    }

    @action
    checkAnswer() {
        if (!this.hasSolution) {
            return;
        }
        if (this.text === this.meta.defaultData.text) {
            this.answer = StringAnswer.Unchecked;
        } else if (this.meta.checker(this.meta.sanitizer(this.text))) {
            this.answer = StringAnswer.Correct;
        } else {
            this.answer = StringAnswer.Wrong;
        }
    }

    @computed
    get meta(): ModelMeta {
        if (this.root?.type === DocumentType.String) {
            return this.root.meta as ModelMeta;
        }
        return new ModelMeta({});
    }
}

export default String;
