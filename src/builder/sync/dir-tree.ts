import * as fs from "fs";
import * as osPath from "path";
import {Optional} from "../../../src/types/optional";

export class DirNode {

  private readonly _children = new Map<string, DirNode>();
  private _source?: DirNode;

  constructor(private _path: string, private _parent?: DirNode) {
  }

  get path(): string {
    return this._path;
  }

  get absPath(): string {
    if (!this.parent) {
      return this.path;
    }
    return osPath.join(this.parent.absPath, this.path);
  }

  get parent(): DirNode {
    return this._parent;
  }

  appendChild(childNode: DirNode) {
    this._children.set(childNode.path, childNode);
  }

  printAllNodes() {
    console.log(`${this.absPath} -> ${this._source ? this._source.absPath : '[]'}`);
    this._children.forEach(child => {
      child.printAllNodes();
    })
  }

  printLeaves() {
    if (this.isLeaf()) {
      console.log(`${this.absPath} -> ${this._source ? this._source.absPath : '[]'}`);
    } else {
      this._children.forEach(child => child.printLeaves());
    }
  }

  ensureNode(pathSegments: string[]): DirNode {
    const childName = pathSegments[0];
    const child = this
      .getNode(childName)
      .orElse(() => {
        const newChild = new DirNode(childName, this);
        this._children.set(childName, newChild);
        return newChild;
      });

    if (pathSegments.length == 1) {
      return child;
    }
    return child.ensureNode(pathSegments.slice(1));
  }

  findNode(pathSegments: string[]): DirNode {
    const childName = pathSegments[0];
    const child = this
      .getNode(childName)
      .expect(`Node '${this.path}' does not have a child '${childName}`);

    if (pathSegments.length == 1) {
      return child;
    }
    return child.findNode(pathSegments.slice(1));
  }

  getNode(childName: string): Optional<DirNode> {
    if (this._children.has(childName)) {
      return Optional.of(this._children.get(childName));
    }
    return Optional.empty();
  }

  propagateAsSourceFor(otherNode: DirNode, ignoreSegments: string[][], segmentIgnorePattern: RegExp) {
    this._setAsSourceFor(otherNode);
    this._propagateConnectionToRoot(otherNode);
    this._propagateConnectionToChildren(otherNode, ignoreSegments, segmentIgnorePattern);
  }

  private _propagateConnectionToRoot(otherNode: DirNode) {
    if (this._parent && otherNode._parent) {
      this._parent._setAsSourceFor(otherNode._parent)
      this._parent._propagateConnectionToRoot(otherNode._parent);
    }
  }

  private _propagateConnectionToChildren(otherNode: DirNode, ignoreSegments: string[][], segmentIgnorePattern: RegExp) {
    Array.from(this._children.keys())
      .filter(childPath => !childPath.match(segmentIgnorePattern))
      //.filter(childPath => !relevantIgnoreSegments.includes(childPath)) // TODO: This is BS.
      .forEach(childPath => {
        const childNode = this._children.get(childPath);
        const otherChildNode = otherNode.ensureNode([childPath]);
        childNode._setAsSourceFor(otherChildNode);
        childNode._propagateConnectionToChildren(otherChildNode, [], segmentIgnorePattern);
      });
  }

  private _setAsSourceFor(otherNode: DirNode) {
    otherNode._setSourceTo(this);
  }

  private _setSourceTo(otherNode: DirNode) {
    if (!this._source) {
      this._source = otherNode;
    }
  }

  hasSource(): boolean {
    return !!this._source;
  }

  collect(predicate: (node: DirNode) => any) {
    const myMatches: DirNode[] = [];
    if (predicate(this)) {
      myMatches.push(this);
    }

    const childMatches = Array.from(this._children.keys())
      .flatMap(childPath => this._children.get(childPath).collect(predicate));

    return myMatches.concat(childMatches);
  }

  isLeaf() {
    return this._children.size == 0;
  }

  get source(): DirNode {
    return this._source;
  }
}

export function createDirTree(rootPath: string): DirNode {
  const rootNode = new DirNode(rootPath);
  // TODO: Assuming root path is dir, not file...
  _createDirTree(rootNode, rootPath);
  return rootNode;
}

function _createDirTree(currentNode: DirNode, currentAbsPath: string): void {
  fs.readdirSync(currentAbsPath).forEach(childPath => {
    const childAbsPath = osPath.join(currentAbsPath, childPath);
    if (fs.statSync(childAbsPath).isFile()) {
      currentNode.appendChild(new DirNode(childPath, currentNode));
    } else {
      const childNode = new DirNode(childPath, currentNode);
      currentNode.appendChild(childNode);
      _createDirTree(childNode, childAbsPath);
    }
  });
}