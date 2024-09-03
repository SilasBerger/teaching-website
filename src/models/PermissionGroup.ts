import { computed, observable } from 'mobx';
import { Access } from '../api/document';
import PermissionStore from '../stores/PermissionStore';
import { GroupPermission } from '../api/permission';
import User from './User';

class PermissionGroup {
    readonly store: PermissionStore;

    readonly id: string;
    readonly documentRootId: string;
    readonly groupId: string;

    @observable accessor access: Access;

    constructor(props: GroupPermission, store: PermissionStore) {
        this.store = store;
        this.id = props.id;
        this.groupId = props.groupId;
    }

    @computed
    get groups() {
        return this.store.studentGroups.filter((g) => g.id === this.groupId);
    }

    @computed
    get userIds() {
        return new Set(this.groups.flatMap((g) => [...g.userIds]));
    }

    @computed
    get users() {
        return this.store.root.userStore.users.filter((u) => this.userIds.has(u.id));
    }

    isAffectingUser(user: User) {
        return this.userIds.has(user.id);
    }
}

export default PermissionGroup;
