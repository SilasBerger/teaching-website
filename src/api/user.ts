import api from './base';
import { AxiosPromise } from 'axios';

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
};

export function currentUser(signal: AbortSignal): AxiosPromise<User> {
    return api.get('/user', { signal });
}

export function logout(signal: AbortSignal): AxiosPromise<void> {
    return api.post('/logout', {}, { signal });
}

export function all(signal: AbortSignal): AxiosPromise<User[]> {
    return api.get('/users', { signal });
}

export function create(data: Partial<User>, signal: AbortSignal): AxiosPromise<User> {
    return api.post('/users', data, { signal });
}

export function find(id: string, signal: AbortSignal): AxiosPromise<User> {
    return api.get(`/users/${id}`, { signal });
}

export function update(id: string, data: Partial<User>, signal: AbortSignal): AxiosPromise<User> {
    return api.put(`/users/${id}`, { data }, { signal });
}

export function destroy(id: string, signal: AbortSignal): AxiosPromise<any> {
    return api.delete(`/users/${id}`, { signal });
}
