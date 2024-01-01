import {SourceNode, DestNode} from "./sync-tree";
import {ScriptConfig, SectionMapping} from "../models/script-config";
import * as osPath from 'path';
import * as fs from "fs-extra";

export function synchronizeToScript(materialTree: SourceNode, scriptTree: DestNode, scriptConfig: ScriptConfig): void {
  applySectionMappings(scriptConfig, scriptTree, materialTree);
  applyMarkers();
  copyFilesToScriptDir(scriptTree);
  removeObsoleteScriptFiles(scriptTree);
}

function applySectionMappings(scriptConfig: ScriptConfig, scriptTree: DestNode, materialTree: SourceNode): void {
  scriptConfig.mappings.forEach(sectionMapping => {
    applySectionMapping(sectionMapping, scriptTree, materialTree);
  });
}

function applySectionMapping(sectionMapping: SectionMapping, scriptTree: DestNode, materialTree: SourceNode): void {
  const sourceSegments = splitPathSegments(sectionMapping.material);
  const destSegments = splitPathSegments(sectionMapping.section);

  const sourceNode = materialTree
    .findNode(sourceSegments)
    .expect(`Material tree does not have a node '${sectionMapping.material}'`) as SourceNode;
  const destNode = scriptTree.ensureNode(destSegments);
  const ignorePaths = (sectionMapping.ignore ?? []).map(splitPathSegments);

  sourceNode.propagateAsSourceCandidateFor(destNode, ignorePaths);
}

function applyMarkers() {
  // TODO: Implement.
}

function copyFilesToScriptDir(scriptTree: DestNode): void {
  console.log('🖨 Copying resources to script...')
  const syncDestinations = (scriptTree
    .collect(node => node.isLeaf()) as DestNode[])
    .filter(leaf => leaf.hasSourceCandidates());
  syncDestinations.forEach(dst => {
    copyFileIfChanged(dst.determineUniqueSource().absPath, dst.absPath);
  });
}

function copyFileIfChanged(sourcePath: string, destPath: string): void {
  if (!fileHasChanged(sourcePath, destPath)) {
    return;
  }

  const destDir = osPath.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  console.log(`[COPY] '${sourcePath}' -> '${destPath}'`);
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
    .collect((node: DestNode) => !node.hasSourceCandidates());
  if (deletionCandidates.length > 0) {
    console.log('🗑️ Deleting obsolete script files...');
    deletionCandidates.forEach(candidate => {
      deleteFile(candidate.absPath);
    });
  }
}

function deleteFile(path: string): void {
  if (fs.existsSync(path)) {
    console.log(`[DELETE] '${path}'`);
    fs.rmSync(path, {recursive: true})
  }
}

function splitPathSegments(path: string): string[] {
  return path.split(osPath.sep).filter(segment => !!segment && segment != '.');
}
