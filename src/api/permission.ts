import {Access} from './document';

export interface GroupPermissionBase {
    id: string;
    groupId: string;
    access: Access;
}

export interface GroupPermission extends GroupPermissionBase {
    documentRootId: string;
}

export interface UserPermissionBase {
    id: string;
    userId: string;
    access: Access;
}

export interface UserPermission extends UserPermissionBase {
    documentRootId: string;
}
