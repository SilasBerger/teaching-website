import { action, computed } from 'mobx';
import { User as UserProps } from '@tdev-api/user';
import { UserStore } from '@tdev-stores/UserStore';
import siteConfig from '@generated/docusaurus.config';
const { STUDENT_USERNAME_PATTERN } = siteConfig.customFields as { STUDENT_USERNAME_PATTERN?: string };

export default class User {
    readonly store: UserStore;

    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;

    readonly isAdmin: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(props: UserProps, store: UserStore) {
        this.store = store;
        this.id = props.id;
        this.email = props.email;
        this.isAdmin = props.isAdmin;
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);
    }

    @computed
    get isStudent() {
        return STUDENT_USERNAME_PATTERN
            ? new RegExp(STUDENT_USERNAME_PATTERN, 'i').test(this.email)
            : !this.isAdmin;
    }

    get isTeacher() {
        return !this.isStudent;
    }

    @computed
    get name() {
        return `${this.firstName} ${this.lastName}`;
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
            isAdmin: this.isAdmin,
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
    setAdmin(isAdmin: boolean) {
        const updatedUser = new User({ ...this.props, isAdmin }, this.store);
        this.store.update(updatedUser);
    }

    @computed
    get connectedClients() {
        return this.store.root.socketStore.connectedClients.get(this.id) || 0;
    }
}
