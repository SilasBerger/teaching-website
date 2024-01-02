import {DestNode, SourceCandidate, SourceCandidateType, SourceNode, SyncNode} from "./sync-tree";
import {MarkersDefinition, ScriptConfig, SectionMapping} from "../models/script-config";
import * as osPath from 'path';
import * as fs from "fs-extra";
import {calculateSpecificity, canonicalNameFrom, hasApplicableMarkers} from "./markers";
import {Logger} from "../logger";

export function synchronizeToScript(materialTree: SourceNode, scriptTree: DestNode, scriptConfig: ScriptConfig): void {
  applySectionMappings(scriptConfig, scriptTree, materialTree);
  applyMarkers(materialTree, scriptTree, scriptConfig.markers);
  const syncPairs = collectSyncPairs(scriptTree, scriptConfig.markers);
  copyFilesToScriptDir(syncPairs);
  removeObsoleteScriptFiles(scriptTree);
}

function applySectionMappings(scriptConfig: ScriptConfig, scriptTree: DestNode, materialTree: SourceNode): void {
  scriptConfig.mappings.forEach(sectionMapping => {
    Logger.instance.debug(`Applying section mapping '${sectionMapping.material} -> ${sectionMapping.section}', ignore=[${sectionMapping.ignore}]`)
    const sourceNode = applySectionMapping(sectionMapping, scriptTree, materialTree);
    applyIgnorePaths(sectionMapping, sourceNode);
  });
}

function applySectionMapping(sectionMapping: SectionMapping, scriptTree: DestNode, materialTree: SourceNode): SourceNode {
  const sourceSegments = splitPathSegments(sectionMapping.material);
  const destSegments = splitPathSegments(sectionMapping.section);

  const sourceNode = materialTree
    .findNode(sourceSegments)
    .expect(`Material tree does not have a node '${sectionMapping.material}'`) as SourceNode;
  const destNode = scriptTree.ensureNode(destSegments);

  sourceNode.propagateAsSourceCandidateFor(destNode, (node => {
    return {
      type: SourceCandidateType.EXPLICIT, // TODO: Only for the first one...
      node,
    }
  }));

  return sourceNode;
}

function applyIgnorePaths(sectionMapping: SectionMapping, sourceNode: SourceNode) {
  if (!sectionMapping.ignore) {
    return;
  }

  sectionMapping.ignore.forEach(ignorePath => {
    sourceNode
      .findNode(splitPathSegments(ignorePath))
      .ifPresent((sourceIgnoreRoot: SourceNode) => {
        sourceIgnoreRoot.propagateAsIgnored();
      });
  });
}

function applyMarkers(sourceTree: SourceNode, destTree: DestNode, markersDefinition: MarkersDefinition) {
  sourceTree
    .collect((sourceNode: SourceNode) => sourceNode.isMarked)
    .filter((markedNode: SourceNode) => hasApplicableMarkers(markedNode, markersDefinition))
    .forEach((markedNode: SourceNode) => {
      const specificity = calculateSpecificity(markedNode, markersDefinition);
      const canonicalPathSegments = splitPathSegments(markedNode.rootPath, canonicalNameFrom(markedNode.path));
      const destNode = destTree.ensureNode(canonicalPathSegments);
      markedNode.propagateAsSourceCandidateFor(destNode, (sourceNode: SourceNode) => {
        return {
          type: SourceCandidateType.MARKED, // TODO: Only for the first one...
          node: sourceNode,
          markerSpecificity: specificity
        }
      });
    });
}

function collectSyncPairs(scriptTree: DestNode, markersDefinition: MarkersDefinition): [SyncNode, SyncNode][] {
  return (scriptTree
    .collect(node => node.isLeaf()) as DestNode[])
    .filter(leaf => leaf.hasUsableSourceCandidates())
    .map(destNode => {
      console.log(`=== for dest node ${destNode.absPath} ===`)
      return [determineBestSourceCandidate(destNode.sourceCandidates), destNode];
    });
}

function determineBestSourceCandidate(candidates: SourceCandidate[]): SourceNode {
  candidates.forEach(candidate => {
    if (candidate.type == SourceCandidateType.EXPLICIT || candidate.type == SourceCandidateType.IMPLIED_FROM_EXPLICIT) {
      console.log(`Explicit candidate '${candidate.node.absPath}'`);
    } else if (candidate.type == SourceCandidateType.MARKED || candidate.type == SourceCandidateType.IMPLIED_FROM_MARKED) {
      console.log(`Marked candidate '${candidate.node.absPath}' with specificity ${candidate.markerSpecificity}`);
    }
  });
  // TODO: Implement.
  return candidates[0].node;
}

function copyFilesToScriptDir(syncPairs: [SyncNode, SyncNode][]): void {
  Logger.instance.info('🖨 Copying resources to script...')
  syncPairs.forEach(([sourceNode, destNode]) => {
    copyFileIfChanged(sourceNode.absPath, destNode.absPath);
  })
}

function copyFileIfChanged(sourcePath: string, destPath: string): void {
  if (!fileHasChanged(sourcePath, destPath)) {
    return;
  }

  const destDir = osPath.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  Logger.instance.info(`[COPY] '${sourcePath}' -> '${destPath}'`);
  fs.copySync(sourcePath, destPath, { preserveTimestamps: true });
}

function fileHasChanged(sourcePath: string, destPath: string): boolean {
  if (!fs.existsSync(destPath)) {
    return true;
  }

  const sourceStats = fs.statSync(sourcePath);
  const destStats = fs.statSync(destPath);
  return sourceStats.mtime.toUTCString() != destStats.mtime.toUTCString();
}

function removeObsoleteScriptFiles(scriptTree: DestNode): void {
  const deletionCandidates = scriptTree
    .collect((node: DestNode) => !node.hasUsableSourceCandidates());
  if (deletionCandidates.length > 0) {
    Logger.instance.info('🗑️ Deleting obsolete script files...');
    deletionCandidates.forEach(candidate => {
      deleteFile(candidate.absPath);
    });
  }
}

function deleteFile(path: string): void {
  if (fs.existsSync(path)) {
    Logger.instance.info(`[DELETE] '${path}'`);
    fs.rmSync(path, {recursive: true})
  }
}

function splitPathSegments(path: string, replaceLastSegment?: string): string[] {
  const segments = path.split(osPath.sep).filter(segment => !!segment && segment != '.');
  if (replaceLastSegment) {
    segments[segments.length - 1] = replaceLastSegment;
  }
  return segments;
}
