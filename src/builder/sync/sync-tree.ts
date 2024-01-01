import * as fs from "fs";
import * as osPath from "path";
import {Optional} from "../../../src/types/optional";
import {SOURCE_SEGMENT_IGNORE_PATTERN} from "../../../src/builder/builder-config";

export abstract class SyncNode {

  protected constructor(private _path: string) {
  }

  protected abstract get parent(): SyncNode;

  protected abstract get children(): Map<string, SyncNode>;

  abstract appendChild(path: string, parent?: SyncNode): SyncNode;

  get path() {
    return this._path;
  }

  get absPath(): string {
    if (!this.parent) {
      return this.path;
    }
    return osPath.join(this.parent.absPath, this.path);
  }

  getNode(childName: string): Optional<SyncNode> {
    if (this.children.has(childName)) {
      return Optional.of(this.children.get(childName));
    }
    return Optional.empty();
  }

  findNode(pathSegments: string[]): Optional<SyncNode> {
    const childName = pathSegments[0];
    const child = this.getNode(childName);

    if (child.isEmpty()) {
      return child;
    }

    if (pathSegments.length == 1) {
      return child;
    }
    return child.get().findNode(pathSegments.slice(1));
  }

  collect(predicate: (node: SyncNode) => any) {
    const myMatches: SyncNode[] = [];
    if (predicate(this)) {
      myMatches.push(this);
    }

    const childMatches = Array.from(this.children.keys())
      .flatMap(childPath => this.children.get(childPath).collect(predicate));

    return myMatches.concat(childMatches);
  }

  isLeaf() {
    return this.children.size == 0;
  }
}

export class SourceNode extends SyncNode {

  private readonly _children = new Map<string, SourceNode>();

  constructor(path: string, private _parent?: SourceNode) {
    super(path);
  }

  protected get parent(): SourceNode {
    return this._parent;
  }

  protected get children(): Map<string, SourceNode> {
    return this._children;
  }

  appendChild(path: string, parent?: SourceNode) {
    const childNode = new SourceNode(path, parent);
    this._children.set(childNode.path, childNode);
    return childNode;
  }

  propagateAsSourceFor(destNode: DestNode, ignorePaths: string[][]) {
    this._propagateAsSourceCandidateToRoot(destNode);
    this._propagateSourceCandidacyToChildren(destNode, true);

    ignorePaths.forEach(ignorePath => {
      this
        .findNode(ignorePath)
        .ifPresent(sourceIgnoreRoot => {
          const destIgnoreRoot = destNode.ensureNode(ignorePath);
          (sourceIgnoreRoot as SourceNode)._propagateSourceCandidacyToChildren(destIgnoreRoot, false);
        });
    })
  }

  private _propagateAsSourceCandidateToRoot(destNode: DestNode) {
    if (this.parent && destNode.parent) {
      this.parent._setSourceCandidacyFor(destNode.parent, true);
      this._parent._propagateAsSourceCandidateToRoot(destNode.parent);
    }
  }

  private _propagateSourceCandidacyToChildren(destNode: DestNode, isSourceCandidate: boolean) {
    this._setSourceCandidacyFor(destNode, isSourceCandidate);
    Array.from(this._children.keys())
      .filter(childPath => !childPath.match(SOURCE_SEGMENT_IGNORE_PATTERN))
      .forEach(childPath => {
        const sourceChild = this._children.get(childPath);
        const destChild = destNode.ensureNode([childPath]);
        sourceChild._propagateSourceCandidacyToChildren(destChild, isSourceCandidate);
      });
  }

  private _setSourceCandidacyFor(destNode: DestNode, isSourceCandidate: boolean) {
    if (isSourceCandidate) {
      destNode._addSourceCandidate(this);
    } else {
      destNode._removeSourceCandidate(this);
    }
  }
}

export class DestNode extends SyncNode {

  private readonly _children = new Map<string, DestNode>();
  private _sourceCandidates = new Map<string, SourceNode>();

  constructor(path: string, private _parent?: DestNode) {
    super(path);
  }

  get parent(): DestNode {
    return this._parent;
  }

  protected get children(): Map<string, DestNode> {
    return this._children;
  }

  appendChild(path: string, parent?: DestNode) {
    const childNode = new DestNode(path, parent);
    this._children.set(childNode.path, childNode);
    return childNode;
  }

  ensureNode(pathSegments: string[]): DestNode {
    const childName = pathSegments[0];
    const child = this
      .getNode(childName)
      .orElse(() => {
        const newChild = new DestNode(childName, this);
        this._children.set(childName, newChild);
        return newChild;
      }) as DestNode;

    if (pathSegments.length == 1) {
      return child;
    }
    return child.ensureNode(pathSegments.slice(1));
  }

  _addSourceCandidate(sourceNode: SourceNode) {
    const sourcePath = sourceNode.path;
    if (!this._sourceCandidates.has(sourcePath)) {
      this._sourceCandidates.set(sourcePath, sourceNode);
    }
  }

  _removeSourceCandidate(sourceNode: SourceNode) {
    const sourcePath = sourceNode.path;
    if (this._sourceCandidates.has(sourcePath)) {
      this._sourceCandidates.delete(sourcePath);
    }
  }

  determineUniqueSource(): SourceNode {
    if (!this.isLeaf()) {
      throw `${this.absPath} is a non-leaf node, and only leaf nodes may have a unique source`;
    }

    const candidates = Array.from(this._sourceCandidates.values());
    if (candidates.length == 1) {
      return candidates[0];
    }

    if (candidates.length == 0) {
      throw `Dest node ${this.absPath} has no source candidates`;
    }

    let candidatePaths = candidates.map(candidate => candidate.absPath).join(', ');
    throw `Source for dest node ${this.absPath} is arbitrary, with candidates [${candidatePaths}]`;
  }

  hasSourceCandidates() {
    return this._sourceCandidates.size > 0;
  }
}

export function createSourceTree(rootPath: string): SourceNode {
  const sourceRoot = new SourceNode(rootPath);
  _createDirTree(sourceRoot, rootPath);
  return sourceRoot;
}

export function createDestTree(rootPath: string): DestNode {
  const destRoot = new DestNode(rootPath);
  _createDirTree(destRoot, rootPath);
  return destRoot;
}

function _createDirTree(currentNode: SyncNode, currentAbsPath: string): void {
  if (!fs.existsSync(currentAbsPath)) {
    return;
  }
  fs.readdirSync(currentAbsPath).forEach(childPath => {
    const childAbsPath = osPath.join(currentAbsPath, childPath);
    if (fs.statSync(childAbsPath).isFile()) {
      currentNode.appendChild(childPath, currentNode);
    } else {
      const childNode = currentNode.appendChild(childPath, currentNode);
      _createDirTree(childNode, childAbsPath);
    }
  });
}
