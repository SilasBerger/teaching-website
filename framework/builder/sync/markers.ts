import { MarkersDefinition } from '../types/scriptConfig';
import { MarkerWithSpecificity } from '../types/markers';
import { SourceNode } from './sync-nodes';
import _ from 'lodash';
import { Optional } from '../../../website/utils/optional';

const MARKER_PATTERN =
    /(?<prefix>.*)\.\s*\[\s*(?<markers>([a-zA-Z0-9_.-]+(\s*,\s*[a-zA-Z0-9_-]+)*)?)\s*](?<suffix>.*)/;

export function markersFrom(name: string): string[] {
    const match = name.match(MARKER_PATTERN);
    if (!match) {
        return [];
    }

    return match.groups['markers']
        .split(',')
        .map((match) => match.trim())
        .filter((marker) => !!marker);
}

export function canonicalNameFrom(markedName: string): string {
    const match = markedName.match(MARKER_PATTERN);
    if (!match) {
        return markedName;
    }
    return `${match.groups['prefix']}${match.groups['suffix']}`;
}

export function hasApplicableMarkers(node: SourceNode, markersDefinition: MarkersDefinition): boolean {
    return getSortedApplicableMarkers(node, markersDefinition).length > 0;
}

function getSortedApplicableMarkers(
    node: SourceNode,
    markersDefinition: MarkersDefinition
): MarkerWithSpecificity[] {
    return mapMarkersDefinitionToMarkersWithSpecificity(markersDefinition)
        .filter((marker) => node.markers.includes(marker.label))
        .sort((a, b) => a.specificity - b.specificity);
}

export function calculateSpecificity(node: SourceNode, markersDefinition: MarkersDefinition): number {
    const sortedApplicableMarkers = getSortedApplicableMarkers(node, markersDefinition);
    verifyNoMultipleMarkersWithSameSpecificity(sortedApplicableMarkers, node);
    if (sortedApplicableMarkers.length == 0) {
        throw `Invalid query: Node ${node.absPath} has no applicable markers in the given definition`;
    }
    return sortedApplicableMarkers[0].specificity;
}

function verifyNoMultipleMarkersWithSameSpecificity(markers: MarkerWithSpecificity[], node: SourceNode) {
    const markersBySpecificity = _.groupBy(markers, (marker: MarkerWithSpecificity) => marker.specificity);
    Optional.of(Object.entries(markersBySpecificity).find(([_, matches]) => matches.length > 1)).ifPresent(
        ([specificity, matches]) => {
            const labels = matches.map((match) => match.label);
            throw `Source node ${node.absPath} has multiple markers with specificity ${specificity}: [${labels}]`;
        }
    );
}

function mapMarkersDefinitionToMarkersWithSpecificity(
    markersDefinition: MarkersDefinition
): MarkerWithSpecificity[] {
    return Object.entries(markersDefinition).map(([label, specificity]) => {
        if (typeof specificity != 'number') {
            throw `Specificity for marker ${label} is not a number: ${specificity}`;
        }

        return {
            label,
            specificity
        };
    });
}
