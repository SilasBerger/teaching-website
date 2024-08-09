import api from './base';
import {AxiosPromise} from 'axios';

export interface StudentGroup {
    id: string;
    name: string;
    description: string;
    userIds: string[];

    parentId?: string;

    createdAt: string;
    updatedAt: string;
}

export function all(signal: AbortSignal): AxiosPromise<StudentGroup[]> {
    return api.get(`/studentGroups`, { signal });
}

export function create(data: Partial<StudentGroup> = {}, signal: AbortSignal): AxiosPromise<StudentGroup> {
    return api.post(`/studentGroups`, data, { signal });
}

export function update(
    id: string,
    data: Partial<StudentGroup> = {},
    signal: AbortSignal
): AxiosPromise<StudentGroup> {
    return api.put(`/studentGroups/${id}`, { data }, { signal });
}
