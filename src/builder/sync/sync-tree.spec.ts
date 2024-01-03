import {SourceNode} from "./sync-tree";

describe('SyncNode', () => {
  describe('absPath', () => {
    it('returns correct absPath for root', () => {
      const testee = new SourceNode('/foo/bar', []);

      const actualAbsPath = testee.absPath;

      expect(actualAbsPath).toEqual('/foo/bar');
    });

    it('returns correct absPath for second child', () => {
      const testee = new SourceNode('/foo/bar', [])
        .appendChild('firstChild')
        .appendChild('secondChild');

      const actualAbsPath = testee.absPath;

      expect(actualAbsPath).toEqual('/foo/bar/firstChild/secondChild');
    });
  });

  describe('treePath', () => {
    it('returns empty string as treePath for root', () => {
      const testee = new SourceNode('/foo/bar', []);

      const actualTreePath = testee.treePath;

      expect(actualTreePath).toEqual('');
    });

    it('returns correct treePath for second child', () => {
      const testee = new SourceNode('/foo/bar', [])
        .appendChild('firstChild')
        .appendChild('secondChild');

      const actualTreePath = testee.treePath;

      expect(actualTreePath).toEqual('firstChild/secondChild');
    });
  });

  describe('getNode', () => {
    it('returns node with matching name', () => {
      const testee = new SourceNode('foo', []);
      const expectedNode = testee.appendChild('firstChild');
      testee.appendChild('otherChild');

      const actual = testee.getNode('firstChild');

      expect(actual.get()).toBe(expectedNode);
    });

    it('returns empty optional if node has no child with queried name', () => {
      const testee = new SourceNode('foo', []);
      const expectedNode = testee.appendChild('firstChild');

      const actual = testee.getNode('doesNotExist');

      expect(actual.isEmpty()).toBe(true);
    });
  });

  describe('findNode', () => {
    it('finds correct node for valid path', () => {
      const testee = new SourceNode('foo', []);
      const expectedNode = testee
        .appendChild('firstChild')
        .appendChild('secondChild');

      const actual = testee.findNode(['firstChild', 'secondChild']);

      expect(actual.get()).toBe(expectedNode);
    });

    it('returns empty optional if search root is in path segments', () => {
      const testee = new SourceNode('foo', []);
      const expectedNode = testee
        .appendChild('firstChild')
        .appendChild('secondChild');

      const actual = testee.findNode(['foo', 'firstChild', 'secondChild']);

      expect(actual.isEmpty()).toBe(true);
    });

    it('returns empty optional if search path does not point to an existing node', () => {
      const testee = new SourceNode('foo', []);
      const expectedNode = testee
        .appendChild('firstChild')
        .appendChild('secondChild');

      const actual = testee.findNode(['aChild', 'secondChild']);

      expect(actual.isEmpty()).toBe(true);
    });
  });

  describe('collect', () => {
    it('collects all matches in a multi-branch tree', () => {
      const testee = new SourceNode('', []);
      const alpha = testee.appendChild('alpha');
      const bravoMatches = testee.appendChild('bravo-matches');
      const charlieMatches = alpha.appendChild('charlie-matches');
      const delta = charlieMatches.appendChild('delta');
      const echoMatches = charlieMatches.appendChild('echo-matches');

      const actual = testee.collect(node => node.path.endsWith('-matches'));

      expect(actual.length).toEqual(3);
    });
  });

  describe('isLeaf', () => {
    it('returns true exactly if it has no children', () => {
      const root = new SourceNode('', []);
      const leaf = root.appendChild('aChild');

      expect(root.isLeaf()).toBe(false);
      expect(leaf.isLeaf()).toBe(true);
    });
  });
});

/*
TODO:
- SourceTree
- DestTree
- sync-tree -> functions
 */
