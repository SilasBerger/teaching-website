import { action, computed } from 'mobx';
import { User as UserProps } from '../api/user';
import { UserStore } from '../stores/UserStore';

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
        return /@edu/i.test(this.email);
    }

    get isTeacher() {
        return !this.isStudent;
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
    get studentGroups() {
        return this.store.root.studentGroupStore.studentGroups.filter((group) => group.userIds.has(this.id));
    }

    @action
    setAdmin(isAdmin: boolean) {
        const updatedUser = new User({ ...this.props, isAdmin }, this.store);
        this.store.update(updatedUser);
    }
}