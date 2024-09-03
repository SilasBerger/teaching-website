import { action, computed, observable } from 'mobx';
import iDocument, { Source } from '../../iDocument';
import { DocumentType, Document as DocumentProps, TypeDataMapping, Access } from '@site/src/api/document';
import DocumentStore from '@site/src/stores/DocumentStore';
import { TypeMeta } from '../../DocumentRoot';
import { formatDateTime } from '../../helpers/date';
import _ from 'lodash';

export interface MetaInit {
    readonly?: boolean;
    name?: string;
}

type SystemType = DocumentType.File | DocumentType.Dir;

const DefaultName = {
    [DocumentType.File]: 'Dokument',
    [DocumentType.Dir]: 'Ordner'
};

export class iFSMeta<T extends SystemType> extends TypeMeta<T> {
    readonly readonly?: boolean;
    readonly name: string;
    constructor(type: T, props: Partial<MetaInit>) {
        super(type, props.readonly ? Access.RO_User : undefined);
        this.readonly = props.readonly;
        this.name = props.name || `${DefaultName[type]} ${formatDateTime(new Date())}`;
    }

    get defaultData(): TypeDataMapping[T] {
        return {
            name: this.name,
            isOpen: true
        };
    }
}

class iFileSystem<T extends SystemType> extends iDocument<T> {
    @observable accessor name: string;
    @observable accessor isOpen: boolean = true;
    @observable accessor isEditing: boolean = false;

    constructor(props: DocumentProps<T>, store: DocumentStore) {
        super(props, store);
        this.name = props.data?.name || this.meta.name;
        this.isOpen = props.data?.isOpen ?? true;
    }

    @action
    setData(
        data: Partial<TypeDataMapping[DocumentType.File] | TypeDataMapping[DocumentType.Dir]>,
        from: Source,
        updatedAt?: Date
    ): void {
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.isOpen !== undefined) {
            this.isOpen = data.isOpen;
        }
        if (from === Source.LOCAL) {
            this.save();
        }
        if (updatedAt) {
            this.updatedAt = new Date(updatedAt);
        }
    }

    get data(): TypeDataMapping[T] {
        return {
            name: this.name,
            isOpen: this.isOpen
        };
    }

    get meta(): iFSMeta<T> {
        throw new Error('Not implemented');
    }

    // @computed
    // get meta(): ModelMeta<T> {
    //     if (this.root?.type === keyof T) {
    //         return this.root.meta as any as ModelMeta<DocumentType.Dir>;
    //     } else if (this.root?.type === DocumentType.File) {
    //         return this.root.meta as any as ModelMeta<DocumentType.File>;
    //     }
    //     return new ModelMeta({});
    // }

    @action
    setIsEditing(isEditing: boolean) {
        this.isEditing = isEditing;
    }

    @action
    setIsOpen(isOpen: boolean) {
        if (this.isOpen === isOpen) {
            return;
        }
        this.setData({ isOpen: isOpen }, Source.LOCAL, new Date());
        this.saveNow();
    }

    @action
    setName(name: string) {
        this.setData({ name: name }, Source.LOCAL, new Date());
    }

    @computed
    get document() {
        return this.store.findByParentId(this.id);
    }

    @action
    delete() {
        return this.store.apiDelete(this);
    }
}

export default iFileSystem;
