import { describe, expect, it } from 'vitest';
import { ScriptConfig } from '../types/scriptConfig';
import { DestNode, SourceNode } from './sync-nodes';
import { MappedSourceCandidate, MarkedSourceCandidate, SourceCandidateType } from '../types/sync';
import { applyMarkers, applySectionMappings, collectSyncPairs } from './sync-tree-processing';
import { Optional } from '../../../website/utils/optional';

describe('applySectionMappings', () => {
    it('correctly propagates each mapping as mapped candidate', () => {
        const scriptConfig: ScriptConfig = {
            markers: {},
            mappings: [
                { material: 'index.md', section: 'index.md' },
                { material: 'Foo/Bar', section: '01-Foo/01-Bar' }
            ]
        };
        const materialRoot = new SourceNode('', []);
        const materialFooBarNode = materialRoot.appendChild('Foo').appendChild('Bar');
        const materialIndexNode = materialRoot.appendChild('index.md');
        const materialFooBarIndexNode = materialFooBarNode.appendChild('index.md');
        const scriptRoot = new DestNode('');

        applySectionMappings(scriptConfig, scriptRoot, materialRoot);

        // assert for index.md
        const scriptIndexNode = scriptRoot.findNode(['index.md']) as Optional<DestNode>;
        expect(scriptIndexNode.isPresent()).toBeTruthy();
        expect(scriptIndexNode.get().sourceCandidates).toHaveLength(1);
        const scriptIndexCandidate = scriptIndexNode.get().sourceCandidates[0];
        expect(scriptIndexCandidate.type).toBe(SourceCandidateType.MAPPED);
        expect(scriptIndexCandidate.implicit).toBeFalsy();
        expect(scriptIndexCandidate.node).toBe(materialIndexNode);

        // assert for 01-Foo/01-Bar/index.md
        const scriptFooBarIndexNode = scriptRoot.findNode([
            '01-Foo',
            '01-Bar',
            'index.md'
        ]) as Optional<DestNode>;
        expect(scriptFooBarIndexNode.isPresent()).toBeTruthy();
        expect(scriptFooBarIndexNode.get().sourceCandidates).toHaveLength(1);
        const scriptFooBarIndexCandidate = scriptFooBarIndexNode.get().sourceCandidates[0];
        expect(scriptFooBarIndexCandidate.type).toBe(SourceCandidateType.MAPPED);
        expect(scriptFooBarIndexCandidate.implicit).toBeTruthy();
        expect(scriptFooBarIndexCandidate.node).toBe(materialFooBarIndexNode);
    });

    it('correctly applies all ignore paths', () => {
        const scriptConfig: ScriptConfig = {
            markers: {},
            mappings: [
                {
                    material: 'Foo',
                    section: '01-Foo',
                    ignore: ['Bar', 'Baz/file.md']
                }
            ]
        };
        const materialRoot = new SourceNode('', []);
        const foo = materialRoot.appendChild('Foo');
        const fooFile = foo.appendChild('file.md');
        const bar = foo.appendChild('Bar');
        const barFile = bar.appendChild('file.md');
        const baz = foo.appendChild('Baz');
        const bazFile = baz.appendChild('file.md');
        const scriptRoot = new DestNode('');

        applySectionMappings(scriptConfig, scriptRoot, materialRoot);

        expect(materialRoot.isIgnored).toBeFalsy();
        expect(foo.isIgnored).toBeFalsy();
        expect(fooFile.isIgnored).toBeFalsy();
        expect(bar.isIgnored).toBeTruthy();
        expect(barFile.isIgnored).toBeTruthy();
        expect(baz.isIgnored).toBeFalsy();
        expect(bazFile.isIgnored).toBeTruthy();
    });

    it('fails if the mapped source path does not exist', () => {
        const scriptConfig: ScriptConfig = {
            markers: {},
            mappings: [{ material: 'doesNotExist.md', section: 'index.md' }]
        };
        const materialRoot = new SourceNode('', []);
        const scriptRoot = new DestNode('');

        expect(() => applySectionMappings(scriptConfig, scriptRoot, materialRoot)).toThrow(
            /.*doesNotExist.md.*/
        );
    });
});

describe('applyMarkers', () => {
    it('correctly discovers marked path in unmarked dir and propagates children with canonical path', () => {
        const markersDefinition = {
            marker1: 0,
            marker2: 1,
            marker3: 2
        };
        const materialRoot = new SourceNode('', []);
        const unmarkedParentDir = materialRoot.appendChild('Hello');
        const markedParentDir = unmarkedParentDir.appendChild('Foo.[marker1,marker2]');
        const unmarkedFile = markedParentDir.appendChild('bar.md');
        const scriptRoot = new DestNode('');
        applyMarkers(materialRoot, scriptRoot, markersDefinition);

        // assert for marked parent dir
        const markedParentDirScriptNode = scriptRoot.findNode(['Hello', 'Foo']);
        expect(markedParentDirScriptNode.isPresent()).toBeTruthy();
        expect((markedParentDirScriptNode.get() as DestNode).sourceCandidates).toHaveLength(1);
        const markedParentSourceCandidate = (markedParentDirScriptNode.get() as DestNode).sourceCandidates[0];
        expect(markedParentSourceCandidate.node).toBe(markedParentDir);
        expect(markedParentSourceCandidate.type).toBe(SourceCandidateType.MARKED);
        expect(markedParentSourceCandidate.implicit).toBeFalsy();

        // assert for unmarked leaf
        const unmarkedFileScriptNode = scriptRoot.findNode(['Hello', 'Foo', 'bar.md']);
        expect(unmarkedFileScriptNode.isPresent()).toBeTruthy();
        expect((unmarkedFileScriptNode.get() as DestNode).sourceCandidates).toHaveLength(1);
        const unmarkedFileSourceCandidate = (unmarkedFileScriptNode.get() as DestNode).sourceCandidates[0];
        expect(unmarkedFileSourceCandidate.node).toBe(unmarkedFile);
        expect(unmarkedFileSourceCandidate.type).toBe(SourceCandidateType.MARKED);
        expect(unmarkedFileSourceCandidate.implicit).toBeTruthy();
    });

    it('correctly discovers and propagates marked node when when parent has mismatched markers', () => {
        const markersDefinition = {
            marker1: 0
        };
        const materialRoot = new SourceNode('', []);
        const unmarkedParentDir = materialRoot.appendChild('Hello');
        const markedDir = unmarkedParentDir.appendChild('Foo.[marker2,marker3]');
        const markedFile = markedDir.appendChild('bar.[marker1].md');
        const scriptRoot = new DestNode('');
        const expectedCanonicalPathToMarkedFileScriptNode = ['Hello', 'Foo', 'bar.md'];

        applyMarkers(materialRoot, scriptRoot, markersDefinition);

        const markedFileScriptNode = scriptRoot.findNode(expectedCanonicalPathToMarkedFileScriptNode);
        expect(markedFileScriptNode.isPresent()).toBeTruthy();
        expect((markedFileScriptNode.get() as DestNode).sourceCandidates).toHaveLength(1);
        expect((markedFileScriptNode.get() as DestNode).sourceCandidates[0].node).toBe(markedFile);
    });

    it('attaches source candidate to the correct dest node when a parent is renamed by a mapping', () => {
        const markersDefinition = {
            marker1: 0
        };
        const materialRoot = new SourceNode('', []);
        const materialFoo = materialRoot.appendChild('Foo');
        const materialBar = materialFoo.appendChild('bar.[marker1].md');
        const scriptRoot = new DestNode('');
        const scriptFooMapped = scriptRoot.appendChild('01-Foo');
        materialFoo.propagateAsSourceCandidateFor(scriptFooMapped, (node: SourceNode) => {
            return {
                type: SourceCandidateType.MAPPED,
                node: node
            } as MappedSourceCandidate;
        });
        const expectedDestPath = ['01-Foo', 'bar.md'];

        applyMarkers(materialRoot, scriptRoot, markersDefinition);
        const actualNode = scriptRoot.findNode(expectedDestPath);

        expect(actualNode.isPresent()).toBeTruthy();
        expect((actualNode.get() as DestNode).sourceCandidates).toHaveLength(1);
        expect((actualNode.get() as DestNode).sourceCandidates[0].node).toBe(materialBar);
    });

    it('ignores marked node if no markers match', () => {
        const markersDefinition = {
            marker3: 2
        };
        const materialRoot = new SourceNode('', []);
        const unmarkedParentDir = materialRoot.appendChild('Hello');
        const markedDir = unmarkedParentDir.appendChild('Foo.[marker1,marker2]');
        const markedFile = markedDir.appendChild('bar.[marker2].md');
        const scriptRoot = new DestNode('');
        const expectedCanonicalPathToMarkedFileScriptNode = ['Hello', 'Foo', 'bar.md'];

        applyMarkers(materialRoot, scriptRoot, markersDefinition);

        const markedFileScriptNode = scriptRoot.findNode(expectedCanonicalPathToMarkedFileScriptNode);
        expect(markedFileScriptNode.isPresent()).toBeFalsy();
    });
});

describe('collectSyncPairs', () => {
    it('returns empty list if dest node has no source candidates', () => {
        const testee = new DestNode('');

        const actual = collectSyncPairs(testee);

        expect(actual).toHaveLength(0);
    });

    it('uses explicitly mapped candidate before marked candidate', () => {
        const testee = new DestNode('');
        const expectedSourceNode = new SourceNode('expected', []);
        testee.addSourceCandidate({
            type: SourceCandidateType.MARKED,
            implicit: false,
            node: new SourceNode('marked', []),
            markerSpecificity: 0
        } as MarkedSourceCandidate);
        testee.addSourceCandidate({
            type: SourceCandidateType.MAPPED,
            implicit: false,
            node: expectedSourceNode
        } as MappedSourceCandidate);

        const actual = collectSyncPairs(testee);

        expect(actual).toHaveLength(1);
        expect(actual[0][0]).toBe(expectedSourceNode);
    });

    it('uses highest-specificity explicitly marked candidate before implicitly mapped candidate', () => {
        const testee = new DestNode('');
        const expectedSourceNode = new SourceNode('expected', []);
        testee.addSourceCandidate({
            type: SourceCandidateType.MAPPED,
            implicit: true,
            node: new SourceNode('implicitly mapped', [])
        } as MappedSourceCandidate);
        testee.addSourceCandidate({
            type: SourceCandidateType.MARKED,
            implicit: false,
            markerSpecificity: 2,
            node: expectedSourceNode
        } as MarkedSourceCandidate);
        testee.addSourceCandidate({
            type: SourceCandidateType.MARKED,
            implicit: false,
            markerSpecificity: 4,
            node: new SourceNode('explicitly marked, lower specificity', [])
        } as MarkedSourceCandidate);

        const actual = collectSyncPairs(testee);

        expect(actual).toHaveLength(1);
        expect(actual[0][0]).toBe(expectedSourceNode);
    });

    it('uses implicitly mapped candidate before implicitly marked candidate', () => {
        const testee = new DestNode('');
        const expectedSourceNode = new SourceNode('expected', []);
        testee.addSourceCandidate({
            type: SourceCandidateType.MARKED,
            implicit: true,
            node: new SourceNode('implicitly marked', []),
            markerSpecificity: 0
        } as MarkedSourceCandidate);
        testee.addSourceCandidate({
            type: SourceCandidateType.MAPPED,
            implicit: true,
            node: expectedSourceNode
        } as MappedSourceCandidate);

        const actual = collectSyncPairs(testee);

        expect(actual).toHaveLength(1);
        expect(actual[0][0]).toBe(expectedSourceNode);
    });

    it('uses highest-specificity implicitly mapped candidate if no others are available', () => {
        const testee = new DestNode('');
        const expectedSourceNode = new SourceNode('expected', []);
        testee.addSourceCandidate({
            type: SourceCandidateType.MARKED,
            implicit: true,
            markerSpecificity: 1,
            node: new SourceNode('specificity 1', [])
        } as MarkedSourceCandidate);
        testee.addSourceCandidate({
            type: SourceCandidateType.MARKED,
            implicit: true,
            markerSpecificity: 3,
            node: new SourceNode('specificity 3', [])
        } as MarkedSourceCandidate);
        testee.addSourceCandidate({
            type: SourceCandidateType.MARKED,
            implicit: true,
            markerSpecificity: 0,
            node: expectedSourceNode
        } as MarkedSourceCandidate);

        const actual = collectSyncPairs(testee);

        expect(actual).toHaveLength(1);
        expect(actual[0][0]).toBe(expectedSourceNode);
    });
});
