import {DirNode} from "./dir-tree";
import {ScriptConfig} from "../models/script-config";
import * as osPath from 'path';
import * as fs from "fs-extra";

export function syncTrees(materialTree: DirNode, scriptTree: DirNode, scriptConfig: ScriptConfig) {
  scriptConfig.forEach(sectionMapping => {
    const sectionSegments = segments(sectionMapping.section);
    const sectionNode = scriptTree.ensureNode(sectionSegments);

    if (sectionMapping.material) {
      const materialSegments = segments(sectionMapping.material);
      const materialNode = materialTree
        .findNode(materialSegments)
        .expect(`Material tree does not have a node '${sectionMapping.material}'`);

      const ignorePaths = (sectionMapping.ignore ?? []).map(segments);

      materialNode.propagateAsSourceFor(sectionNode, ignorePaths);
    }
  });

  const syncDestinations = scriptTree
    .collect((node: DirNode) => node.isLeaf())
    .filter((leaf: DirNode) => leaf.hasSource())
    .filter((leaf: DirNode) => !leaf.source.isIgnored);
  const deletionCandidates = scriptTree
    .collect(node => !node.hasSource() || node.source.isIgnored);

  console.log('🖨 Copying resources to script...')
  syncDestinations.forEach(dst => {
    copyFileIfChanged(dst.source.absPath, dst.absPath);
  });

  console.log('❌ Deleting obsolete script files...')
  deletionCandidates.forEach(candidate => {
    deleteFile(candidate.absPath);
  });
}

function copyFileIfChanged(srcPath: string, dstPath: string): void {
  if (fs.existsSync(dstPath)) {
    const srcStats = fs.statSync(srcPath);
    const dstStats = fs.statSync(dstPath);
    if (srcStats.mtime.toUTCString() == dstStats.mtime.toUTCString()) {
      return;
    }
  }

  const dstDir = osPath.dirname(dstPath);
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
  }

  console.log(`[COPY] '${srcPath}' -> '${dstPath}'`);
  fs.copySync(srcPath, dstPath, { preserveTimestamps: true });
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
