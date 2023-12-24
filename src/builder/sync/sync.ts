import {DirNode} from "./dir-tree";
import {ScriptConfig} from "../models/script-config";
import * as osPath from 'path';

export function syncTrees(materialTree: DirNode, scriptTree: DirNode, scriptConfig: ScriptConfig) {
  // console.log('\n=== Material tree===')
  // materialTree.printAllNodes();

  // console.log('\n=== Script tree===')
  //scriptTree.printAllNodes();

  scriptConfig.forEach(sectionMapping => {
    const sectionSegments = segments(sectionMapping.section);
    const sectionNode = scriptTree.ensureNode(sectionSegments);

    if (sectionMapping.material) {
      const materialSegments = segments(sectionMapping.material);
      const materialNode = materialTree.findNode(materialSegments);
      materialNode.propagateAsSourceFor(sectionNode);
    }
  });

  scriptTree.printAllNodes();
}

function segments(path: string) {
  return path.split(osPath.sep).filter(segment => !!segment);
}
