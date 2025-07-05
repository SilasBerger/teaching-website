import { action, computed, observable } from 'mobx';
import { EditLevel, JsParents, JsTypes, JsValue, type JsTypeName } from '../../toJsSchema';
import JsNumber from './JsNumber';
import JsBoolean from './JsBoolean';
import JsString from './JsString';
import JsObject from './JsObject';
import JsArray from './JsArray';
import JsNullish from './JsNullish';
import JsFunction from './JsFunction';
import _ from 'lodash';
import { castToType, toModel } from './toModel';
import iParentable from './iParentable';

export type JsModelType = JsObject | JsString | JsNumber | JsArray | JsBoolean | JsNullish | JsFunction;

const nextId = () => {
    let id = 0;
    return () => {
        return `js-${id++}`;
    };
};

const generateId = nextId();

abstract class iJs<T extends JsValue = JsValue> {
    readonly parent: iParentable;
    readonly isParent: boolean = false;
    readonly editLevel: EditLevel;
    abstract readonly type: JsTypeName;
    readonly _pristine: T;
    readonly id = generateId();
    @observable accessor name: string | undefined;

    constructor(js: T, parent: iParentable) {
        this.editLevel = js.editLevel ?? 'all';
        this._pristine = js;
        delete this._pristine.editLevel; // Remove editLevel from pristine object
        this.name = js.name;
        this.parent = parent;
    }

    @computed
    get pristineName(): string | undefined {
        return this._pristine.name;
    }

    @computed
    get canEditName(): boolean {
        return this.editLevel === 'all' || this.editLevel === 'name';
    }

    @computed
    get canEditValue(): boolean {
        return this.editLevel === 'all' || this.editLevel === 'value';
    }

    @action
    setName(name: string) {
        this.name = name;
    }

    @action
    remove(model?: iJs) {
        if (!model) {
            this.parent.remove(this);
        }
    }

    @computed
    get isDirty(): boolean {
        return !_.isEqual(this.serialized, this._pristine);
    }

    abstract get serialized(): T;
    abstract get asJs(): JsTypes | JsTypes[];

    @action
    changeType(type: JsTypeName): void {
        if (type === 'root') {
            throw new Error('Cannot change type to root');
        }
        if (this.type === type) {
            return; // No change needed
        }
        const val = castToType(this.serialized, type);
        this.parent.replaceValue(
            this,
            toModel({ type: type, value: val as any, name: this.name }, this.parent)
        );
    }
}

export default iJs;
