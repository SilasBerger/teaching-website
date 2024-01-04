import {ScriptConfig} from "../models/script-config";
import {DestNode, SourceNode} from "../sync/sync-nodes";
import {SourceCandidateType} from "../models/sync";
import {applyMarkers, applySectionMappings} from "../sync/sync-tree-processing";
import {Optional} from "../../shared/util/optional";

describe('applySectionMappings', () => {
  it('correctly propagates each mapping as mapped candidate', () => {
    const scriptConfig: ScriptConfig = {
      markers: {},
      mappings: [
        {material: 'index.md', section: 'index.md'},
        {material: 'Foo/Bar', section: '01-Foo/01-Bar'},
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
    const scriptFooBarIndexNode = scriptRoot.findNode(['01-Foo', '01-Bar', 'index.md']) as Optional<DestNode>;
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
      mappings: [{
        material: 'Foo',
        section: '01-Foo',
        ignore: [
          'Bar',
          'Baz/file.md'
        ],
      }]
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
      mappings: [
        {material: 'doesNotExist.md', section: 'index.md'},
      ]
    };
    const materialRoot = new SourceNode('', []);
    const scriptRoot = new DestNode('');

    expect(() => applySectionMappings(scriptConfig, scriptRoot, materialRoot))
      .toThrow(/.*doesNotExist.md.*/);
  });
});

describe('applyMarkers', () => {
  it('correctly discovers marked path in unmarked dir and propagates children with canonical path', () => {
    const markersDefinition = {
      marker1: 0,
      marker2: 1,
      marker3: 2,
    }
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
      marker1: 0,
    }
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

  it('ignores marked node if no markers match', () => {
    const markersDefinition = {
      marker3: 2,
    }
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

  });

  it('uses explicitly mapped candidate before marked candidate', () => {

  });

  it('uses highest-specificity explicitly marked candidate before implicitly mapped candidate', () => {

  });

  it('uses implicitly mapped candidate before implicitly marked candidate', () => {

  });

  it('uses highest-specificity implicitly mapped candidate if no others are available', () => {

  });
});
