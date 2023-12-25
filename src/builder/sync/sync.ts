import {DirNode} from "./dir-tree";
import {ScriptConfig} from "../models/script-config";
import * as osPath from 'path';
import * as fs from "fs";

export function syncTrees(materialTree: DirNode, scriptTree: DirNode, scriptConfig: ScriptConfig) {
  scriptConfig.forEach(sectionMapping => {
    const sectionSegments = segments(sectionMapping.section);
    const sectionNode = scriptTree.ensureNode(sectionSegments);

    if (sectionMapping.material) {
      const materialSegments = segments(sectionMapping.material);
      const materialNode = materialTree.findNode(materialSegments);

      const ignoreSegments = (sectionMapping.ignore ?? []).map(segments);
      const segmentIgnorePattern = /.*\.version-\.*/; // TODO: This should come from a config file. Ideally per-script.

      materialNode.propagateAsSourceFor(sectionNode, ignoreSegments, segmentIgnorePattern);
    }
  });

  const syncDestinations = scriptTree
    .collect(node => node.isLeaf())
    .filter(leaf => leaf.hasSource());
  const deletionCandidates = scriptTree
    .collect(node => !node.hasSource());

  console.log('🖨 Copying resources to script...')
  syncDestinations.forEach(dst => {
    copyFile(dst.source.absPath, dst.absPath);
  });

  console.log('❌ Deleting obsolete script files...')
  deletionCandidates.forEach(candidate => {
    deleteFile(candidate.absPath);
  });
}

function copyFile(srcPath: string, dstPath: string): void {
  const dstDir = osPath.dirname(dstPath);
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
  }

  // TODO: Copy only if src timestamp > dst timestamp.
  console.log(`[COPY] '${srcPath}' -> '${dstPath}'`);
  fs.copyFileSync(srcPath, dstPath);
}

function deleteFile(path: string) {
  if (fs.existsSync(path)) {
    console.log(`[DELETE] '${path}'`);
    fs.rmSync(path, {recursive: true})
  }
}

function segments(path: string) {
  return path.split(osPath.sep).filter(segment => !!segment && segment != '.');
}
