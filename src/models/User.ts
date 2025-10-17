import { action, computed, observable } from 'mobx';
import { AuthProvider, Role, RoleAccessLevel, User as UserProps } from '@tdev-api/user';
import { UserStore } from '@tdev-stores/UserStore';
import siteConfig from '@generated/docusaurus.config';

export default class User {
    readonly store: UserStore;

    readonly id: string;
    readonly email: string;
    readonly authProviders: AuthProvider[];
    readonly name: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly banned?: boolean;
    @observable accessor banReason: string | undefined;
    @observable accessor banExpires: Date | undefined;

    readonly role: Role;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(props: UserProps, store: UserStore) {
        this.store = store;
        this.id = props.id;
        this.email = props.email;
        this.role = props.role || Role.STUDENT;
        this.authProviders = props.authProviders || [];
        this.name = props.name;
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.banned = props.banned;
        this.banReason = props.banReason;
        this.banExpires = props.banExpires ? new Date(props.banExpires) : undefined;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);
    }

    @computed
    get accessLevel() {
        return RoleAccessLevel[this.role] || 0;
    }

    @computed
    get hasDefaultName() {
        return this.name === this.defaultName;
    }

    @computed
    get defaultName() {
        return `${this.firstName} ${this.lastName}`;
    }

    @computed
    get hasElevatedAccess() {
        return this.accessLevel > 0;
    }
    @computed
    get isAdmin() {
        return this.role === Role.ADMIN;
    }

    @computed
    get isStudent() {
        return this.role === Role.STUDENT;
    }

    get isTeacher() {
        return this.role === Role.TEACHER;
    }

    @computed
    get nameShort() {
        if (this.isStudent) {
            return `${this.firstName} ${this.lastName.slice(0, 1)}.`;
        }
        return `${this.firstName.slice(0, 1)}. ${this.lastName}`;
    }

    @computed
    get props(): UserProps {
        return {
            id: this.id,
            email: this.email,
            role: this.role,
            name: this.name,
            authProviders: this.authProviders,
            firstName: this.firstName,
            lastName: this.lastName,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    }

    @computed
    get searchTerm(): string {
        return `${this.firstName} ${this.lastName} ${this.email}`;
    }

    @computed
    get searchRegex() {
        return new RegExp(
            `(?:\\s+|^)(?:(${this.firstName}\\s+${this.lastName})|(${this.lastName}\\s+${this.firstName})|(${this.email}))(?:\\s+|$)`,
            'i'
        );
    }

    @computed
    get studentGroups() {
        return this.store.root.studentGroupStore.studentGroups.filter((group) => group.userIds.has(this.id));
    }

    @action
    setRole(role: Role) {
        const updatedUser = new User({ ...this.props, role }, this.store);
        this.store.update(updatedUser);
    }

    @computed
    get connectedClients() {
        return this.store.root.socketStore.connectedClients.get(this.id) || 0;
    }

    @computed
    get hasEmailPasswordAuth() {
        return this.authProviders.includes(AuthProvider.CREDENTIAL);
    }
}
