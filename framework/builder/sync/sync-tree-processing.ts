import { DestNode, SourceNode } from './sync-nodes';
import { MarkersDefinition, ScriptConfig, SectionMapping } from '../types/scriptConfig';
import * as osPath from 'path';
import { calculateSpecificity, canonicalNameFrom, hasApplicableMarkers } from './markers';
import { MarkedSourceCandidate, SourceCandidate, SourceCandidateType, SyncPair } from '../types/sync';

export function applySectionMappings(
    scriptConfig: ScriptConfig,
    scriptTree: DestNode,
    materialTree: SourceNode
): void {
    scriptConfig.mappings.forEach((sectionMapping) => {
        const sourceNode = _applySectionMapping(sectionMapping, scriptTree, materialTree);
        _applyIgnorePaths(sectionMapping, sourceNode);
    });
}

function _applySectionMapping(
    sectionMapping: SectionMapping,
    scriptTree: DestNode,
    materialTree: SourceNode
): SourceNode {
    const sourceSegments = _splitPathSegments(sectionMapping.material);
    const destSegments = _splitPathSegments(sectionMapping.section);

    const sourceNode = materialTree
        .findNode(sourceSegments)
        .expect(`Material tree does not have a node '${sectionMapping.material}'`) as SourceNode;
    const destNode = scriptTree.ensureNode(destSegments);

    sourceNode.propagateAsSourceCandidateFor(destNode, (node) => {
        return {
            type: SourceCandidateType.MAPPED,
            node
        };
    });

    return sourceNode;
}

function _applyIgnorePaths(sectionMapping: SectionMapping, sourceNode: SourceNode) {
    if (!sectionMapping.ignore) {
        return;
    }

    sectionMapping.ignore.forEach((ignorePath) => {
        sourceNode.findNode(_splitPathSegments(ignorePath)).ifPresent((ignoredRootNode: SourceNode) => {
            ignoredRootNode.propagateAsIgnored();
        });
    });
}

export function applyMarkers(
    sourceTree: SourceNode,
    destTree: DestNode,
    markersDefinition: MarkersDefinition
) {
    sourceTree
        .collect((sourceNode: SourceNode) => sourceNode.isMarked)
        .filter((markedNode: SourceNode) => hasApplicableMarkers(markedNode, markersDefinition))
        .forEach((markedNode: SourceNode) => {
            const specificity = calculateSpecificity(markedNode, markersDefinition);
            const canonicalPathSegments = _splitPathSegments(markedNode.destTreePath).map((segment) =>
                canonicalNameFrom(segment)
            );
            const destNode = destTree.ensureNode(canonicalPathSegments);

            markedNode.propagateAsSourceCandidateFor(destNode, (sourceNode: SourceNode) => {
                return {
                    type: SourceCandidateType.MARKED,
                    node: sourceNode,
                    markerSpecificity: specificity
                };
            });
        });
}

export function collectSyncPairs(processedScriptTree: DestNode): SyncPair[] {
    return (processedScriptTree.collect((node) => node.isLeaf()) as DestNode[])
        .filter((leaf) => leaf.hasUsableSourceCandidates())
        .map((destNode) => {
            return [_determineBestSourceCandidate(destNode.sourceCandidates), destNode];
        });
}

function _determineBestSourceCandidate(candidates: SourceCandidate[]): SourceNode {
    const sortMarkedCandidatesBySpecificity = (a: MarkedSourceCandidate, b: MarkedSourceCandidate) => {
        return a.markerSpecificity - b.markerSpecificity;
    };

    const mapped = candidates.filter((candidate) => candidate.type == SourceCandidateType.MAPPED);
    const mappedExplicit = mapped.filter((candidate) => !candidate.implicit);
    const mappedImplicit = mapped.filter((candidate) => candidate.implicit);

    const marked = candidates.filter((candidate) => candidate.type == SourceCandidateType.MARKED);
    const markedExplicit = marked
        .filter((candidate) => !candidate.implicit)
        .sort(sortMarkedCandidatesBySpecificity);
    const markedImplicit = marked
        .filter((candidate) => candidate.implicit)
        .sort(sortMarkedCandidatesBySpecificity);

    const sortedCandidates = [...mappedExplicit, ...markedExplicit, ...mappedImplicit, ...markedImplicit];

    return sortedCandidates[0].node;
}

function _splitPathSegments(path: string): string[] {
    return path.split(osPath.sep).filter((segment) => !!segment && segment != '.');
}
