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
  private _isIgnored: boolean;

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

  propagateAsSourceFor(otherNode: DestNode, ignorePaths: string[][]) {
    this._setAsSourceFor(otherNode);
    this._propagateConnectionToRoot(otherNode);
    this._propagateConnectionToChildren(otherNode, ignorePaths);

    ignorePaths.forEach(ignorePath => {
      this
        .findNode(ignorePath)
        .ifPresent(node => (node as SourceNode)._propagateAsIgnored());
    })
  }

  private _propagateConnectionToRoot(destNode: DestNode) {
    if (this.parent && destNode.parent) {
      this.parent._setAsSourceFor(destNode.parent)
      this._parent._propagateConnectionToRoot(destNode.parent);
    }
  }

  private _propagateConnectionToChildren(destNode: DestNode, ignoreSegments: string[][]) {
    Array.from(this._children.keys())
      .filter(childPath => !childPath.match(SOURCE_SEGMENT_IGNORE_PATTERN))
      .forEach(childPath => {
        const childNode = this._children.get(childPath);
        const otherChildNode = destNode.ensureNode([childPath]);
        childNode._setAsSourceFor(otherChildNode);
        childNode._propagateConnectionToChildren(otherChildNode, []);
      });
  }

  private _propagateAsIgnored() {
    this._isIgnored = true;
    this._children.forEach(child => child._propagateAsIgnored());
  }

  private _setAsSourceFor(destNode: DestNode) {
    destNode._setSourceTo(this);
  }


  get isIgnored(): boolean {
    return this._isIgnored;
  }
}

export class DestNode extends SyncNode {

  private readonly _children = new Map<string, DestNode>();
  private _source?: SourceNode;

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

  _setSourceTo(sourceNode: SourceNode) {
    if (!this._source) {
      this._source = sourceNode;
    }
  }

  get source(): SourceNode {
    return this._source;
  }

  hasSource() {
    return !!this._source;
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
