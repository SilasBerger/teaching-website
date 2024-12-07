import type Script from '@tdev-models/documents/Script';
import type ScriptVersion from '@tdev-models/documents/ScriptVersion';
import type TaskState from '@tdev-models/documents/TaskState';
import type String from '@tdev-models/documents/String';
import api from './base';
import { AxiosPromise } from 'axios';
import QuillV2 from '@tdev-models/documents/QuillV2';
import { Delta } from 'quill/core';
import Solution from '@tdev-models/documents/Solution';
import Directory from '@tdev-models/documents/FileSystem/Directory';
import File from '@tdev-models/documents/FileSystem/File';
import Restricted from '@tdev-models/documents/Restricted';
import MdxComment from '@tdev-models/documents/MdxComment';
import { Color } from '@tdev-components/shared/Colors';
import CmsText from '@tdev-models/documents/CmsText';
import TextMessage from '@tdev-models/documents/TextMessage';
import DynamicDocumentRoots from '@tdev-models/documents/DynamicDocumentRoots';
import { DynamicDocumentRootModel } from '@tdev-models/documents/DynamicDocumentRoot';
import Excalidoc from '@tdev-models/documents/Excalidoc';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { BinaryFiles } from '@excalidraw/excalidraw/types/types';

export enum Access {
    RO_DocumentRoot = 'RO_DocumentRoot',
    RW_DocumentRoot = 'RW_DocumentRoot',
    None_DocumentRoot = 'None_DocumentRoot',
    RO_StudentGroup = 'RO_StudentGroup',
    RW_StudentGroup = 'RW_StudentGroup',
    None_StudentGroup = 'None_StudentGroup',
    RO_User = 'RO_User',
    RW_User = 'RW_User',
    None_User = 'None_User'
}

export enum DocumentType {
    Script = 'script',
    ScriptVersion = 'script_version',
    TaskState = 'task_state',
    String = 'string',
    QuillV2 = 'quill_v2',
    Solution = 'solution',
    Dir = 'dir',
    File = 'file',
    MdxComment = 'mdx_comment',
    Restricted = 'restricted',
    CmsText = 'cms_text',
    Excalidoc = 'excalidoc',
    TextMessage = 'text_message',
    DynamicDocumentRoot = 'dynamic_document_root',
    DynamicDocumentRoots = 'dynamic_document_roots'
}

export interface ScriptData {
    code: string;
}

export interface ScriptVersionData {
    code: string;
    version: number;
    pasted?: boolean;
}

export interface StringData {
    text: string;
}

export interface QuillV2Data {
    delta: Delta;
}

export interface SolutionData {
    /** no content needed */
}

export interface RestrictedData {
    /** no content needed */
}

export interface CmsTextData {
    text: string;
}

export interface DirData {
    name: string;
    isOpen: boolean;
}

export interface FileData {
    name: string;
    isOpen: boolean;
}

export interface ExcaliData {
    files: BinaryFiles;
    elements: readonly ExcalidrawElement[];
    image: string;
}

export type StateType =
    | 'checked'
    | 'question'
    | 'unset'
    | 'star'
    | 'star-half'
    | 'star-empty'
    | 'clock-check'
    | 'progress-check';

export interface TaskStateData {
    state: StateType;
}

export interface MdxCommentData {
    type: string;
    nr: number;
    commentNr: number;
    isOpen: boolean;
    color: Color;
}

export interface TextMessageData {
    text: string;
}

export interface DynamicDocumentRootData {
    /** such a document is never created - it's only the document root that is needed */
}

export enum RoomType {
    Messages = 'text_messages'
}
export interface DynamicDocumentRoot {
    id: string;
    name: string;
    type: RoomType;
}

export interface DynamicDocumentRootsData {
    documentRoots: DynamicDocumentRoot[];
}

export interface TypeDataMapping {
    [DocumentType.Script]: ScriptData;
    [DocumentType.TaskState]: TaskStateData;
    [DocumentType.ScriptVersion]: ScriptVersionData;
    [DocumentType.String]: StringData;
    [DocumentType.QuillV2]: QuillV2Data;
    [DocumentType.Solution]: SolutionData;
    [DocumentType.Dir]: DirData;
    [DocumentType.File]: FileData;
    [DocumentType.MdxComment]: MdxCommentData;
    [DocumentType.Restricted]: RestrictedData;
    [DocumentType.CmsText]: CmsTextData;
    [DocumentType.Excalidoc]: ExcaliData;
    [DocumentType.TextMessage]: TextMessageData;
    [DocumentType.DynamicDocumentRoot]: DynamicDocumentRootData;
    [DocumentType.DynamicDocumentRoots]: DynamicDocumentRootsData;
    // Add more mappings as needed
}

export interface TypeModelMapping {
    [DocumentType.Script]: Script;
    [DocumentType.TaskState]: TaskState;
    [DocumentType.ScriptVersion]: ScriptVersion;
    [DocumentType.String]: String;
    [DocumentType.QuillV2]: QuillV2;
    [DocumentType.Solution]: Solution;
    [DocumentType.Dir]: Directory;
    [DocumentType.File]: File;
    [DocumentType.MdxComment]: MdxComment;
    [DocumentType.Restricted]: Restricted;
    [DocumentType.CmsText]: CmsText;
    [DocumentType.Excalidoc]: Excalidoc;
    [DocumentType.TextMessage]: TextMessage;
    [DocumentType.DynamicDocumentRoot]: DynamicDocumentRootModel;
    [DocumentType.DynamicDocumentRoots]: DynamicDocumentRoots;
    /**
     * Add more mappings as needed
     * TODO: implement the mapping in DocumentRoot.ts
     * @see DocumentRoot
     * @link file://../../src/stores/DocumentStore.ts#CreateDocumentModel
     */
}

export type DocumentTypes =
    | Script
    | TaskState
    | ScriptVersion
    | String
    | QuillV2
    | Solution
    | Directory
    | File
    | MdxComment
    | Restricted
    | CmsText
    | Excalidoc
    | TextMessage
    | DynamicDocumentRootModel
    | DynamicDocumentRoots;

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

export function remove(id: string, signal: AbortSignal): AxiosPromise<void> {
    return api.delete(`/documents/${id}`, { signal });
}

export function update<Type extends DocumentType>(
    id: string,
    data: TypeDataMapping[Type],
    signal: AbortSignal
): AxiosPromise<Document<Type>> {
    return api.put(`/documents/${id}`, { data }, { signal });
}

/**
 * TODO: would it be better to only grab documents from a specific student group?
 */
export function allDocuments(documentRootIds: string[], signal: AbortSignal): AxiosPromise<Document<any>[]> {
    return api.get(`/documents?${documentRootIds.map((id) => `rids=${id}`).join('&')}`, {
        signal
    });
}
