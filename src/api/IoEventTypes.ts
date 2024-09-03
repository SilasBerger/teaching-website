import { User } from '../api/user';
import { Document, DocumentType } from '../api/document';
import { rootStore } from '../stores/rootStore';
import { GroupPermission, UserPermission } from '../api/permission';
import { DocumentRootUpdate } from '../api/documentRoot';

export enum IoEvent {
    NEW_RECORD = 'NEW_RECORD',
    CHANGED_RECORD = 'CHANGED_RECORD',
    CHANGED_DOCUMENT = 'CHANGED_DOCUMENT',
    DELETED_RECORD = 'DELETED_RECORD',
    CONNECTED_CLIENTS = 'CONNECTED_CLIENTS'
}

export enum RecordType {
    Document = 'Document',
    User = 'User',
    UserPermission = 'UserPermission',
    GroupPermission = 'GroupPermission',
    DocumentRoot = 'DocumentRoot'
}

type TypeRecordMap = {
    [RecordType.Document]: Document<DocumentType>;
    [RecordType.User]: User;
    [RecordType.UserPermission]: UserPermission;
    [RecordType.GroupPermission]: GroupPermission;
    [RecordType.DocumentRoot]: DocumentRootUpdate;
};

export interface NewRecord<T extends RecordType> {
    type: T;
    record: TypeRecordMap[T];
}

export interface ChangedRecord<T extends RecordType> {
    type: T;
    record: TypeRecordMap[T];
}

export interface ChangedDocument {
    id: string;
    data: Object;
    updatedAt: string;
}

export interface ConnectedClients {
    room: string;
    count: number;
}

export interface DeletedRecord {
    type: RecordType;
    id: string;
}

interface NotificationBase {
    to: string | string[];
    toSelf?: true | boolean;
}

interface NotificationNewRecord extends NotificationBase {
    event: IoEvent.NEW_RECORD;
    message: NewRecord<RecordType>;
}

interface NotificationChangedRecord extends NotificationBase {
    event: IoEvent.CHANGED_RECORD;
    message: ChangedRecord<RecordType>;
}

interface NotificationDeletedRecord extends NotificationBase {
    event: IoEvent.DELETED_RECORD;
    message: DeletedRecord;
}
interface NotificationChangedDocument extends NotificationBase {
    event: IoEvent.CHANGED_DOCUMENT;
    message: ChangedDocument;
}

export type Notification =
    | NotificationNewRecord
    | NotificationChangedRecord
    | NotificationDeletedRecord
    | NotificationChangedDocument;

/**
 * client side initiated events
 */

export enum IoClientEvent {
    JOIN_ROOM = 'JOIN_ROOM',
    LEAVE_ROOM = 'LEAVE_ROOM'
}

export type ServerToClientEvents = {
    [IoEvent.NEW_RECORD]: (message: NewRecord<RecordType>) => void;
    [IoEvent.CHANGED_RECORD]: (message: ChangedRecord<RecordType>) => void;
    [IoEvent.DELETED_RECORD]: (message: DeletedRecord) => void;
    [IoEvent.CHANGED_DOCUMENT]: (message: ChangedDocument) => void;
    [IoEvent.CONNECTED_CLIENTS]: (message: ConnectedClients) => void;
};

export interface ClientToServerEvents {
    [IoClientEvent.JOIN_ROOM]: (roomId: string, callback: () => void) => void;
    [IoClientEvent.LEAVE_ROOM]: (roomId: string, callback: () => void) => void;
}

export const RecordStoreMap: { [key in RecordType]: keyof typeof rootStore } = {
    User: 'userStore',
    Document: 'documentRootStore',
    UserPermission: 'permissionStore',
    GroupPermission: 'permissionStore',
    DocumentRoot: 'documentRootStore'
} as const;
