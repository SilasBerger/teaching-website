import {DestNode, SourceNode} from "./sync-nodes";
import {MappedSourceCandidate, SourceCandidateType} from "../models/sync";

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

describe('SourceNode', () => {
  describe('appendChild', () => {
    it('sets no markers if child path does not contain markers', () => {
      const testee = new SourceNode('', []);

      const actual = testee.appendChild('foo.md');

      expect(actual.markers.length).toBe(0);
    });

    it('correctly sets markers from child path', () => {
      const testee = new SourceNode('', []);

      const actual = testee.appendChild('foo.[m1,m2].md');

      expect(actual.markers).toEqual(['m1', 'm2']);
    });
  });

  describe('isMarked', () => {
    it('returns false if it has no markers', () => {
      const testee = new SourceNode('', []);
      expect(testee.isMarked).toBe(false);
    });

    it('returns true if it has one marker', () => {
      const testee = new SourceNode('', ['foo']);
      expect(testee.isMarked).toBe(true);
    });
  });

  describe('propagateAsSourceCandidateFor', () => {
    it('correctly propagates source candidate up and down partial dest tree', () => {
      // arrange source tree
      const root = new SourceNode('', []);
      const testee = root.appendChild('testee');
      const sibling = root.appendChild('sibling');
      const leftChild = testee.appendChild('left');
      const rightChild = testee.appendChild('right');
      const secondOrderChild = leftChild.appendChild('secondOrder');

      // arrange partial dest tree
      const destRoot = new DestNode('');
      const destNode = destRoot.appendChild('destNode');
      const destLeftChild = destNode.appendChild('left');
      const destSecondOrderChild = destLeftChild.appendChild('secondOrder');

      // arrange spies on dest tree
      const spyOnDestNodeAddSourceCandidate = jest.spyOn(destNode, 'addSourceCandidate');
      const spyOnDestLeftChildAddSourceCandidate = jest.spyOn(destLeftChild, 'addSourceCandidate');
      const spyOnDestLeftChildEnsureNode = jest
        .spyOn(destLeftChild, 'ensureNode')
        .mockReturnValue(destSecondOrderChild);

      // mock candidate generator
      const candidateGenerator = jest.fn((node: SourceNode) => {
        return {
          type: SourceCandidateType.MAPPED,
          node: node,
        } as MappedSourceCandidate;
      });

      // act
      testee.propagateAsSourceCandidateFor(destNode, candidateGenerator);

      // assert
      expect(candidateGenerator).toHaveBeenCalledWith(root);
      expect(candidateGenerator).toHaveBeenCalledWith(leftChild);
      expect(candidateGenerator).toHaveBeenCalledWith(rightChild);
      expect(candidateGenerator).toHaveBeenCalledWith(secondOrderChild);
      expect(candidateGenerator).not.toHaveBeenCalledWith(sibling);
      expect(spyOnDestNodeAddSourceCandidate).toHaveBeenCalledWith({
        type: SourceCandidateType.MAPPED,
        implicit: false,
        node: testee,
      } as MappedSourceCandidate);
      expect(spyOnDestLeftChildAddSourceCandidate).toHaveBeenCalledWith({
        type: SourceCandidateType.MAPPED,
        implicit: true,
        node: leftChild,
      } as MappedSourceCandidate);
      expect(spyOnDestLeftChildEnsureNode).toHaveBeenCalledWith(['secondOrder']);
    });

  });

  describe('propagateAsIgnored', () => {
    it('marks exactly this node and its (transitive) children as ignored', () => {
      // arrange source tree
      const root = new SourceNode('', []);
      const testee = root.appendChild('testee');
      const sibling = root.appendChild('sibling');
      const leftChild = testee.appendChild('left');
      const rightChild = testee.appendChild('right');
      const secondOrderChild = leftChild.appendChild('secondOrder');

      // assert before
      expect(root.isIgnored).toBeFalsy();
      expect(sibling.isIgnored).toBeFalsy();
      expect(testee.isIgnored).toBeFalsy();
      expect(leftChild.isIgnored).toBeFalsy();
      expect(rightChild.isIgnored).toBeFalsy();
      expect(secondOrderChild.isIgnored).toBeFalsy();

      // act
      testee.propagateAsIgnored();

      // assert before after
      expect(root.isIgnored).toBeFalsy();
      expect(sibling.isIgnored).toBeFalsy();
      expect(testee.isIgnored).toBeTruthy();
      expect(leftChild.isIgnored).toBeTruthy();
      expect(rightChild.isIgnored).toBeTruthy();
      expect(secondOrderChild.isIgnored).toBeTruthy();
    });
  });
});

/*
TODO:
- DestNode
 */
