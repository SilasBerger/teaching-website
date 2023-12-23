import * as osPath from "path";
import {SCRIPTS_ROOT} from "../../../config/builder-config";


export class SyncNode {

  protected _children = new Map<string, SyncNode>();
  protected _sourcePath?: string;

  section(section: string) {
    if (this._sourcePath) {
      // TODO: This could technically be user error (or even expected behavior) if the same mapping exists twice.
      throw `Consistency error: trying to add section '${section}' to leaf node set to sync '${this._sourcePath}'`;
    }

    if (!this._children.has(section)) {
      this._children.set(section, new SyncNode());
    }
    return this._children.get(section);
  }

  renameChild(from: string, to: string) {
    this._children.set(to, this._children.get(from));
    this._children.delete(from);
  }

  _build(myPath: string) {
    if (this._sourcePath) {
      console.log(`${this._sourcePath} -> ${myPath}`);
      return;
    }

    this._children.forEach((childNode, section) => {
      childNode._build(osPath.join(myPath, section));
    });
  }

  createLeaf(segments: string[], source: string) {
    if (segments.length > 0) {
      this.section(segments[0]).createLeaf(segments.slice(1), source);
    } else {
      this._sourcePath = source;
    }
  }
}

export class SyncTree extends SyncNode {

  constructor (private _scriptRoot: string) {
    super();
  }

  build() {
    const myPath = osPath.resolve(osPath.join(SCRIPTS_ROOT, this._scriptRoot));
    this._build(myPath);
  }
}
