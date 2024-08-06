import {action, computed, observable} from 'mobx';
import {Access, Document as DocumentProps, DocumentType, TypeDataMapping} from '../api/document';
import DocumentStore from '../stores/DocumentStore';
import {debounce} from 'lodash';

/**
 * normally, save only once all 1000ms
 */
const SAVE_DEBOUNCE_TIME = 1000;
abstract class iDocument<Type extends DocumentType> {
    readonly store: DocumentStore;
    readonly id: string;
    readonly authorId: string;
    readonly parentId: string | null | undefined;
    readonly documentRootId: string;
    readonly type: Type;
    readonly _pristine: TypeDataMapping[Type];

    readonly createdAt: Date;
    /**
     * save the model only after 1 second of "silence" (=no edits during this period)
     * or after 5s of permanent editing...
     *
     * Save     :                  v                                                v
     * Time [s] :    0        1        2        3        4        5        6        7
     * Edits    :    |||  |            |||   ||  |  |     ||  ||||  |||    ||  ||| |||||
     */
    save = debounce(action(this._save), SAVE_DEBOUNCE_TIME, {
        leading: false,
        trailing: true,
        maxWait: 5 * SAVE_DEBOUNCE_TIME
    });

    @observable.ref accessor updatedAt: Date;
    constructor(props: DocumentProps<Type>, store: DocumentStore) {
        this.store = store;
        this.id = props.id;
        this.authorId = props.authorId;
        this.parentId = props.parentId;
        this.documentRootId = props.documentRootId;
        this.type = props.type;
        this._pristine = props.data;

        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);
    }

    @computed
    get props(): DocumentProps<Type> {
        return {
            id: this.id,
            authorId: this.authorId,
            parentId: this.parentId,
            documentRootId: this.documentRootId,
            type: this.type,
            data: this.data,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    }

    @action
    reset() {
        this.setData({ ...this._pristine }, true);
    }

    abstract get data(): TypeDataMapping[Type];

    abstract setData(data: TypeDataMapping[Type], persist: boolean, updatedAt?: Date): void;

    @computed
    get isDirty() {
        return this._pristine !== this.data;
    }

    @computed
    get isMain() {
        return !this.parentId && this.root?.type === this.type;
    }

    @computed
    get root() {
        return this.store.root.documentRootStore.find(this.documentRootId);
    }

    @computed
    get canEdit() {
        return this.root?.access === Access.RW;
    }

    @action
    cleanup() {
        /**
         * cancel pending actions and cleanup if needed...
         */
    }

    @action
    saveNow() {
        this.save();
        return this.save.flush();
    }

    @action
    _save() {
        /**
         * call the api to save the code...
         */
        return this.store.save(this);
    }
}

export default iDocument;
