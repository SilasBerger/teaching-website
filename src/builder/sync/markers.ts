import {MarkersDefinition} from "../models/script-config";
import {MarkerWithPrecedence} from "../models/markers";

const MARKER_PATTERN = /.*\.\s*\[\s*(([a-zA-Z0-9_-]+)(\s*,\s*[a-zA-Z0-9_-]+)*)\s*].*/;

export function markersFrom(name: string): string[] {
  const match = name.match(MARKER_PATTERN);
  if (!match) {
    return [];
  }

  return match[1].split(',').map(match => match.trim());
}

export function applicableMarkers(markersInName: string[], markersDefinition: MarkersDefinition): MarkerWithPrecedence[] {
  const activeMarkers: MarkerWithPrecedence[] = Object
    .entries(markersDefinition)
    .map(([label, specificity]) => {
      return {
        label,
        specificity
      };
    });

  return activeMarkers.filter(activeMarker => markersInName.includes(activeMarker.label));
}
