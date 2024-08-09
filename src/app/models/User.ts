import { computed } from 'mobx';
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
}
