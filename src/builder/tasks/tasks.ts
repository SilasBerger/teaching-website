import {MATERIAL_ROOT, SCRIPTS_ROOT} from "../../../config/builder-config";
import * as osPath from "path";
import * as fs from "fs";

export class SyncTask {

  private readonly _mappings: Mapping[] = [];

  constructor(private _scriptRoot: string) {
  }

  addMapping(mapping: Mapping) {
    this._mappings.push(mapping);
  }

  printMappings() {
    const filePairs = [];
    this._collectFilePairs(filePairs, this._mappings);
    console.log('Found file pairs:');
    filePairs.forEach(pair => console.log(pair));
  }

  private _dstAbs(mapping: Mapping) {
    return osPath.resolve(osPath.join(SCRIPTS_ROOT, this._scriptRoot, mapping.dstRelToScriptRoot));
  }

  private _scriptRootPathAbs() {
    return osPath.join(SCRIPTS_ROOT, this._scriptRoot);
  }

  /*
  TODO: Next steps
  - extend FilePairs: introduce preliminaryDst / dst; where dst is changed based on path renames.
  - try adding label change info to this object (since we should now have everything to identify the correct file or dir)
  - take explicit and implicit ignore into account
  - recurse script root as-is, compare to final list of destinations, delete everything extraneous
   */
  private _collectFilePairs(filePairs: FilePair[], mappings: Mapping[]) {
    mappings.forEach(mapping => {
      const source = mapping.srcAbs;
      if (!fs.existsSync(source)) {
        console.log(`⚠️ Ignoring mapping for source file '${source}' (doesn't exist)`)
      } else if (fs.statSync(source).isFile()) {
        filePairs.push({
          src: source,
          dst: this._dstAbs(mapping),
        });
      } else {
        const childMappings = fs.readdirSync(source).map(child => {
          const childSrc = osPath.join(source, child);
          const childDst = osPath.join(mapping.dstRelToScriptRoot, child);
          return new TransparentMapping(childSrc, childDst);
        });
        this._collectFilePairs(filePairs, childMappings);
      }
    });
  }
}

interface FilePair {
  src: string;
  dst: string;
}

export abstract class Mapping {
  abstract get srcAbs();

  abstract get dstRelToScriptRoot();
}

class TransparentMapping extends Mapping {
  constructor(private _src: string, private _dst: string) {
    super();
  }

  get srcAbs() {
    return this._src;
  }

  get dstRelToScriptRoot() {
    return this._dst;
  }
}

export class MaterialMapping extends Mapping {

  constructor(private _section: string, private _material: string) {
    super();
  }

  get srcAbs() {
    return osPath.join(this._materialRootAbsPath(), this._material);
  }

  get dstRelToScriptRoot() {
    return this._section;
  }

  private _materialRootAbsPath() {
    return osPath.resolve(osPath.join(MATERIAL_ROOT));
  }
}


// TODO: Everything below here should be obsolete now.
export interface Tasks {
  materialSync: MaterialSyncTask[];
  pathRename: PathRenameTask[];
  setLabel: SetLabelTask[];
}

export class Task {

  constructor(private _scriptRoot: string, private _section: string) {
  }

  get scriptRootAbsPath() {
    return osPath.resolve(osPath.join(SCRIPTS_ROOT, this._scriptRoot));
  }

  get sectionAbsPath() {
    return osPath.join(this.scriptRootAbsPath, this._section);
  }
}

export class MaterialSyncTask extends Task {

  constructor(_scriptRoot: string, _section: string, private _material: string, private _ignore: string[]) {
    super(_scriptRoot, _section);
  }

  get materialAbsPath() {
    return osPath.resolve(osPath.join(MATERIAL_ROOT, this._material));
  }
}

export class PathRenameTask extends Task {

  constructor(_scriptRoot: string, _section: string, private _newLastPathSegment: string) {
    super(_scriptRoot, _section);
  }
}

export class SetLabelTask extends Task {

  constructor(_scriptRoot: string, _section: string, private _newLabel: string) {
    super(_scriptRoot, _section);
  }
}
