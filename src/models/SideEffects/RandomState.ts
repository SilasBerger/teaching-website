import { DocumentType, StateType, TypeDataMapping } from '@site/src/api/document';
import iSideEffect from './iSideEffect';
import _ from 'lodash';
import { UserStore } from '@site/src/stores/UserStore';
import { computed } from 'mobx';

const States: StateType[] = ['checked', 'question', 'unset', 'star', 'star-half', 'star-empty'] as const;

class RandomState extends iSideEffect<DocumentType.TaskState> {
    readonly store: UserStore;

    constructor(userStore: UserStore) {
        super('RandomState');
        this.store = userStore;
    }

    @computed
    get transformer() {
        return (docData: TypeDataMapping[DocumentType.TaskState]) => {
            if (!this.store.viewedUser) {
                return docData;
            }
            const idxOf = States.indexOf(docData.state);
            const totalClients = this.store.users.reduce((sum, u) => sum + u.connectedClients, 0);
            return {
                ...docData,
                state: States[(idxOf + totalClients) % States.length]
            };
        };
    }

    @computed
    get canEdit() {
        return true;
    }
}

export default RandomState;
