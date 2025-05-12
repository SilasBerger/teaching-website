import { describe, expect, it } from 'vitest';
import { calculateSpecificity, canonicalNameFrom, hasApplicableMarkers, markersFrom } from './markers';
import { SourceNode } from './sync-nodes';
import { MarkersDefinition } from '../types/scriptConfig';

describe('markersFrom', () => {
    it('returns empty marker list for unmarked filename', () => {
        expect(markersFrom('test.md')).toEqual([]);
    });

    it('returns empty marker list if name does not match pattern', () => {
        expect(markersFrom('test.(marker).md')).toEqual([]);
    });

    it('returns empty marker list in case of dangling comma', () => {
        expect(markersFrom('test.[marker1,].md')).toEqual([]);
    });

    it('returns empty marker list for empty marker bracket', () => {
        expect(markersFrom('test.[].md')).toEqual([]);
    });

    it('returns single marker for file', () => {
        expect(markersFrom('test.[marker].md')).toEqual(['marker']);
    });

    it('returns single marker for dir', () => {
        expect(markersFrom('testDir.[marker]')).toEqual(['marker']);
    });

    it('returns single marker with special characters', () => {
        expect(markersFrom('test.[a0_b1-c2.d4, marker2].md')).toEqual(['a0_b1-c2.d4', 'marker2']);
    });

    it('returns multiple markers', () => {
        expect(markersFrom('test.[marker1,marker2,marker3].md')).toEqual(['marker1', 'marker2', 'marker3']);
    });

    it('returns multiple markers with spaces in filename', () => {
        expect(markersFrom('test.   [marker1, marker2,marker3 ] .md')).toEqual([
            'marker1',
            'marker2',
            'marker3'
        ]);
    });
});

describe('canonicalNameFrom', () => {
    it('returns unchanged name for unmarked filename', () => {
        expect(canonicalNameFrom('test.md')).toEqual('test.md');
    });

    it('returns unchanged name if name does not match pattern', () => {
        expect(canonicalNameFrom('test.(marker).md')).toEqual('test.(marker).md');
    });

    it('returns contracted name for filename with empty marker bracket', () => {
        expect(canonicalNameFrom('test.[].md')).toEqual('test.md');
    });

    it('returns contracted name for dirname with empty marker bracket', () => {
        expect(canonicalNameFrom('TestDir.[]')).toEqual('TestDir');
    });

    it('returns contracted name for single marker', () => {
        expect(canonicalNameFrom('test.[marker].md')).toEqual('test.md');
    });

    it('returns contracted dirname for single marker dir', () => {
        expect(canonicalNameFrom('testDir.[marker]')).toEqual('testDir');
    });

    it('returns contracted name with special characters', () => {
        expect(canonicalNameFrom('test.[a0_b1-c2.d4, marker-2].md')).toEqual('test.md');
    });

    it('returns contracted name for multiple markers with spaces in filename', () => {
        expect(canonicalNameFrom('test .   [  marker1, marker2,marker3 ] . md')).toEqual('test  . md');
    });
});

describe('hasApplicableMarkers', () => {
    it('returns true if markers are congruent', () => {
        const sourceNode = new SourceNode('', ['foo']);
        const markersDefinition: MarkersDefinition = {
            foo: 0
        };

        expect(hasApplicableMarkers(sourceNode, markersDefinition)).toBe(true);
    });

    it('returns true if node markers and configured markers intersect', () => {
        const sourceNode = new SourceNode('', ['bar', 'baz']);
        const markersDefinition: MarkersDefinition = {
            foo: 0,
            baz: 1
        };

        expect(hasApplicableMarkers(sourceNode, markersDefinition)).toBe(true);
    });

    it('returns false if node markers and configured markers do not intersect', () => {
        const sourceNode = new SourceNode('', ['bar']);
        const markersDefinition: MarkersDefinition = {
            foo: 0,
            baz: 1
        };

        expect(hasApplicableMarkers(sourceNode, markersDefinition)).toBe(false);
    });

    it('returns false if node has no markers', () => {
        const sourceNode = new SourceNode('', []);
        const markersDefinition: MarkersDefinition = {
            foo: 0,
            bar: 1
        };

        expect(hasApplicableMarkers(sourceNode, markersDefinition)).toBe(false);
    });

    it('returns false if config has no markers', () => {
        const sourceNode = new SourceNode('', ['foo']);
        const markersDefinition: MarkersDefinition = {};

        expect(hasApplicableMarkers(sourceNode, markersDefinition)).toBe(false);
    });

    it('returns false if node and config have no markers', () => {
        const sourceNode = new SourceNode('', []);
        const markersDefinition: MarkersDefinition = {};

        expect(hasApplicableMarkers(sourceNode, markersDefinition)).toBe(false);
    });
});

describe('calculateSpecificity', () => {
    it('returns correct specificity with one matching marker', () => {
        const sourceNode = new SourceNode('', ['alpha', 'charlie']);
        const markersDefinition: MarkersDefinition = {
            bravo: 0,
            charlie: 1,
            delta: 2
        };

        expect(calculateSpecificity(sourceNode, markersDefinition)).toBe(1);
    });

    it('returns highest specificity (=lowest number) for multiple matching unordered markers', () => {
        const sourceNode = new SourceNode('', ['echo', 'alpha', 'charlie', 'foxtrot']);
        const markersDefinition: MarkersDefinition = {
            bravo: 0,
            charlie: 2,
            delta: 4,
            echo: 6,
            foxtrot: 8
        };

        expect(calculateSpecificity(sourceNode, markersDefinition)).toBe(2);
    });

    it('throws exception if no markers match', () => {
        const sourceNode = new SourceNode('', ['echo']);
        const markersDefinition: MarkersDefinition = {
            bravo: 0,
            charlie: 2
        };

        expect(() => calculateSpecificity(sourceNode, markersDefinition)).toThrow();
    });

    it('throws exception if no markers match', () => {
        const sourceNode = new SourceNode('', ['echo']);
        const markersDefinition: MarkersDefinition = {
            bravo: 0,
            charlie: 2
        };

        expect(() => calculateSpecificity(sourceNode, markersDefinition)).toThrow(
            /.*has no applicable markers.*/
        );
    });

    it('throws exception if multiple applicable markers have same specificity', () => {
        const sourceNode = new SourceNode('', ['charlie', 'delta']);
        const markersDefinition: MarkersDefinition = {
            bravo: 0,
            charlie: 2,
            delta: 2
        };

        expect(() => calculateSpecificity(sourceNode, markersDefinition)).toThrow(
            /.*has multiple markers with specificity 2.*/
        );
    });

    it('does not throw if only one of the same-specificity markers is applicable', () => {
        const sourceNode = new SourceNode('', ['delta']);
        const markersDefinition: MarkersDefinition = {
            bravo: 0,
            charlie: 2,
            delta: 2
        };

        expect(() => calculateSpecificity(sourceNode, markersDefinition)).not.toThrow();
    });
});
