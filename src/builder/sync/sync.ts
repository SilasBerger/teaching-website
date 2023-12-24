import {DirNode} from "./dir-tree";
import {ScriptConfig} from "../models/script-config";
import * as osPath from 'path';

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

  console.log('\nWill sync:')
  syncDestinations.forEach(dst => {
    console.log(`'${dst.absPath}' -> '${dst.source.absPath}'`);
  });

  console.log('\nWill delete (if exists):')
  deletionCandidates.forEach(candidate => {
    console.log(`'${candidate.absPath}'`);
  });
}

function segments(path: string) {
  return path.split(osPath.sep).filter(segment => !!segment && segment != '.');
}
