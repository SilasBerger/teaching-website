import { action, computed, observable } from 'mobx';
import Form from '.';

export interface FormField<T> {
    name: string;
    value?: T;
    description?: string;
    placeholder?: string;
    lang?: string;
    required?: boolean;
    type: React.HTMLInputTypeAttribute | 'expression';
    label?: string;
    resettable?: boolean;
    removable?: boolean;
    options?: string[];
    saveOnChange?: boolean;
    sideEffect?: (fields: Form<T>) => void;
    generateNewValue?: () => T;
}

export default class Field<T = string> {
    readonly form: Form<T>;
    readonly name: string;
    readonly type: React.HTMLInputTypeAttribute | 'expression';
    readonly description?: string;
    readonly placeholder?: string;
    readonly lang?: string;
    readonly required?: boolean;
    readonly label?: string;
    readonly resettable?: boolean;
    readonly _pristine: T | undefined;
    readonly sideEffect?: (fields: Form<T>) => void;
    readonly generateNewValue?: () => T;
    readonly isInitField: boolean;
    readonly isRemovable: boolean;
    readonly options?: string[];
    readonly saveOnChange?: boolean;

    @observable accessor value: T;

    constructor(data: FormField<T>, form: Form<T>, isInit = false) {
        this.form = form;
        this.isInitField = isInit;
        this.name = data.name;
        this.value = data.value ?? form.defaultValue;
        this._pristine = data.value;
        this.description = data.description;
        this.placeholder = data.placeholder;
        this.lang = data.lang;
        this.required = data.required;
        this.type = data.type;
        this.label = data.label;
        this.resettable = data.resettable;
        this.isRemovable = data.removable ?? false;
        this.options = data.options;
        this.saveOnChange = data.saveOnChange;
        this.sideEffect = data.sideEffect;
        this.generateNewValue = data.generateNewValue;
    }

    @action
    resetValue(toDefault?: boolean, skipSideEffects?: boolean) {
        if (toDefault) {
            this.setValue(this.form.defaultValue, skipSideEffects);
        } else {
            this.setValue(this._pristine || this.form.defaultValue, skipSideEffects);
        }
    }

    @action
    setValue(value: T, skipSideEffects?: boolean) {
        if (this.value === value) {
            return;
        }
        this.value = value;
        if (!skipSideEffects) {
            this.form.runSideEffect(this);
        }
    }

    @computed
    get canRegenerateValue() {
        return !!this.generateNewValue;
    }

    @action
    regenerateValue() {
        if (this.generateNewValue) {
            this.setValue(this.generateNewValue());
        }
    }

    @computed
    get isDirty() {
        return this.value !== this._pristine;
    }

    @computed
    get isCheckbox() {
        return this.type === 'checkbox';
    }

    @computed
    get isSelect() {
        return (
            (this.type === 'select' || this.type === 'multi-select') &&
            this.options &&
            this.options.length > 0
        );
    }

    @computed
    get checkboxValue() {
        return this.value === 'true';
    }
}
