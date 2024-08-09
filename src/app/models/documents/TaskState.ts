import { action, computed, observable } from 'mobx';
import iDocument from '../iDocument';
import {
    DocumentType,
    Document as DocumentProps,
    StateType,
    TypeDataMapping,
    Access
} from '../../api/document';
import DocumentStore from '../../stores/DocumentStore';
import { TypeMeta } from '../DocumentRoot';

export interface MetaInit {
    readonly?: boolean;
    states?: StateType[];
}

export class TaskMeta extends TypeMeta<DocumentType.TaskState> {
    readonly type = DocumentType.TaskState;
    readonly readonly: boolean;
    readonly states: StateType[];

    constructor(props: Partial<MetaInit>) {
        super(DocumentType.TaskState, props.readonly ? Access.RO : undefined);
        this.states =
            props.states && props.states.length > 0 ? props.states : ['unset', 'checked', 'question'];
        this.readonly = !!props.readonly;
    }

    get defaultData(): TypeDataMapping[DocumentType.TaskState] {
        return {
            state: this.states[0]
        };
    }
}

class TaskState extends iDocument<DocumentType.TaskState> {
    @observable accessor state: StateType;

    /**
     * used to sort the tasks in the task list
     */
    @observable accessor windowPositionY: number = -1;

    constructor(props: DocumentProps<DocumentType.TaskState>, store: DocumentStore) {
        super(props, store);
        this.state = props.data.state;
    }

    @action
    setData(data: TypeDataMapping[DocumentType.TaskState], persist: boolean, updatedAt?: Date): void {
        if (this.root?.access !== Access.RW) {
            return;
        }
        this.state = data.state;

        if (persist) {
            this.saveNow();
        }
        if (updatedAt) {
            this.updatedAt = new Date(updatedAt);
        }
    }

    get data(): TypeDataMapping[DocumentType.TaskState] {
        return {
            state: this.state
        };
    }

    @computed
    get meta(): TaskMeta {
        if (this.root?.type === DocumentType.TaskState) {
            return this.root.meta as TaskMeta;
        }
        return new TaskMeta({});
    }

    @action
    nextState() {
        const idx = this.meta.states.indexOf(this.state);
        this.setData(
            {
                state: this.meta.states[(idx + 1) % this.meta.states.length]
            },
            true,
            new Date()
        );
    }

    @action
    setWindowPositionY(y: number) {
        this.windowPositionY = y;
    }
}

export default TaskState;
