import { DocumentType, TypeDataMapping } from '@tdev-api/document';

abstract class iSideEffect<Type extends DocumentType> {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }
    abstract transformer: (document: TypeDataMapping[Type]) => TypeDataMapping[Type];
    get canEdit() {
        return true;
    }
}

export default iSideEffect;
