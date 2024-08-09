import { observable } from 'mobx';
import { Access } from '../api/document';
import PermissionStore from '../stores/PermissionStore';
import { UserPermission } from '../api/permission';
import User from './User';

class PermissionUser {
    readonly store: PermissionStore;

    readonly id: string;
    readonly userId: string;
    readonly documentRootId: string;

    @observable accessor access: Access;

    constructor(props: UserPermission, store: PermissionStore) {
        this.store = store;
        this.id = props.id;
        this.userId = props.userId;
        this.documentRootId = props.documentRootId;
    }

    isAffectingUser(user: User) {
        return this.userId === user.id;
    }
}

export default PermissionUser;
