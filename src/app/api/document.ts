import type TaskState from '../models/documents/TaskState';
import type String from '../models/documents/String';
import api from './base';
import { AxiosPromise } from 'axios';

export enum Access {
    RO = 'RO',
    RW = 'RW',
    None = 'None'
}

export enum DocumentType {
    TaskState = 'task_state',
    String = 'string'
}

export interface StringData {
    text: string;
}

export type StateType = 'checked' | 'question' | 'unset' | 'star' | 'star-half' | 'star-empty';

export interface TaskStateData {
    state: StateType;
}

export interface TypeDataMapping {
    [DocumentType.TaskState]: TaskStateData;
    [DocumentType.String]: StringData;
    // Add more mappings as needed
}

export interface TypeModelMapping {
    [DocumentType.TaskState]: TaskState;
    [DocumentType.String]: String;
    /**
     * Add more mappings as needed
     * TODO: implement the mapping in DocumentRoot.ts
     * @see DocumentRoot
     * @link file://../../src/models/DocumentRoot.ts
     */
}

export type DocumentTypes = TaskState | String;

export interface Document<Type extends DocumentType> {
    id: string;
    type: Type;
    authorId: string;

    parentId: string | null | undefined;
    documentRootId: string;

    data: TypeDataMapping[Type];

    createdAt: string;
    updatedAt: string;
}

export function find<Type extends DocumentType>(
    id: string,
    signal: AbortSignal
): AxiosPromise<Document<Type>> {
    return api.get(`/documents/${id}`, { signal });
}

export function create<Type extends DocumentType>(
    data: Partial<Document<Type>>,
    signal: AbortSignal
): AxiosPromise<Document<Type>> {
    return api.post(`/documents`, data, { signal });
}

export function update<Type extends DocumentType>(
    id: string,
    data: TypeDataMapping[Type],
    signal: AbortSignal
): AxiosPromise<Document<Type>> {
    return api.put(`/documents/${id}`, { data }, { signal });
}
