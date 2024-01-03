import {SourceNode} from "./sync-tree";

describe('SyncNode', () => {
  /*
  // TODO:
  - collect
  - isLeaf
   */
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
});

/*
TODO:
- SourceTree
- DestTree
- sync-tree -> functions
 */
