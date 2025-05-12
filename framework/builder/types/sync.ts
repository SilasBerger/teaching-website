import { DestNode, SourceNode } from '../sync/sync-nodes';

export type SyncPair = [SourceNode, DestNode];

export enum SourceCandidateType {
    MAPPED,
    MARKED
}

export interface MappedSourceCandidate {
    type: SourceCandidateType.MAPPED;
    implicit?: boolean;
    node: SourceNode;
}

export interface MarkedSourceCandidate {
    type: SourceCandidateType.MARKED;
    implicit?: boolean;
    node: SourceNode;
    markerSpecificity: number;
}

export type SourceCandidate = MappedSourceCandidate | MarkedSourceCandidate;

export type SourceCandidateGenerator = (sourceNode: SourceNode) => SourceCandidate;

export interface SourceCandidacy {
    type: SourceCandidateType;
    implicit?: boolean;
    node: DestNode;
}
