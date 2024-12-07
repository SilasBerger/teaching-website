import { action, computed, observable } from 'mobx';
import iDocument, { Source } from '@tdev-models/iDocument';
import { DocumentType, Document as DocumentProps, TypeDataMapping, Access } from '@site/src/api/document';
import DocumentStore from '@site/src/stores/DocumentStore';
import { TypeMeta } from '@tdev-models/DocumentRoot';
import type { BinaryFiles } from '@excalidraw/excalidraw/types/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { default as ExcalidrawLib } from '@excalidraw/excalidraw';

export interface MetaInit {
    readonly?: boolean;
    defaultFiles?: BinaryFiles;
    defaultElements?: readonly ExcalidrawElement[];
    defaultImage?: string;
}

export class ModelMeta extends TypeMeta<DocumentType.Excalidoc> {
    readonly type = DocumentType.Excalidoc;
    readonly defaultElements: readonly ExcalidrawElement[];
    readonly defaultFiles: BinaryFiles;
    readonly defaultImage: string;

    constructor(props: Partial<MetaInit>) {
        super(DocumentType.Excalidoc, props.readonly ? Access.RO_User : undefined);
        this.defaultElements = props.defaultElements || [];
        this.defaultFiles = props.defaultFiles || {};
        this.defaultImage = props.defaultImage || '';
    }

    get defaultData(): TypeDataMapping[DocumentType.Excalidoc] {
        return {
            elements: this.defaultElements,
            files: this.defaultFiles,
            image: this.defaultImage
        };
    }
}

const blobToBase64 = (blob: Blob): Promise<string | null | ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
};

class Excalidoc extends iDocument<DocumentType.Excalidoc> {
    @observable.ref accessor elements: readonly ExcalidrawElement[];
    @observable.ref accessor files: BinaryFiles;
    @observable.ref accessor image: string;
    constructor(props: DocumentProps<DocumentType.Excalidoc>, store: DocumentStore) {
        super(props, store);
        this.elements = props.data.elements || [];
        this.files = props.data.files || {};
        this.image = props.data.image || '';
    }

    @action
    setData(
        data: TypeDataMapping[DocumentType.Excalidoc],
        from: Source,
        updatedAt?: Date,
        lib?: typeof ExcalidrawLib | null
    ): void {
        if (from === Source.LOCAL) {
            /**
             * Assumption:
             *  - local changes are commited only when the scene version is updated!
             *  - only non-deleted elements are commited
             */
            const updatedElements = data.elements;
            const presentFileIds = new Set(
                updatedElements.map((element) => (element.type === 'image' ? element.fileId : null))
            );
            const updatedFiles: BinaryFiles = { ...data.files };
            Object.entries(data.files).forEach(([fileId, file]) => {
                if (!presentFileIds.has(file.id)) {
                    delete updatedFiles[fileId];
                }
            });
            this.elements = updatedElements;
            this.files = updatedFiles;
            this.save(async () => {
                if (!lib) {
                    return;
                }
                return lib
                    .exportToBlob({
                        elements: updatedElements,
                        files: updatedFiles,
                        mimeType: 'image/webp',
                        quality: 0.92
                    })
                    .then((blob) => {
                        return blobToBase64(blob);
                    })
                    .then(
                        action((base64String) => {
                            if (typeof base64String === 'string') {
                                this.image = base64String;
                            }
                        })
                    )
                    .catch((e) => {
                        console.warn('Failed to export excalidraw to blob', e);
                    });
            });
        } else {
            this.elements = data.elements;
            this.files = data.files;
            this.image = data.image;
        }
        if (updatedAt) {
            this.updatedAt = new Date(updatedAt);
        }
    }

    get data(): TypeDataMapping[DocumentType.Excalidoc] {
        return {
            elements: this.elements,
            files: this.files,
            image: this.image
        };
    }

    @computed
    get meta(): ModelMeta {
        if (this.root?.type === DocumentType.Excalidoc) {
            return this.root.meta as ModelMeta;
        }
        return new ModelMeta({});
    }
}

export default Excalidoc;
