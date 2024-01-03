import {DestNode, SyncNode} from "./sync-nodes";
import {Logger} from "../util/logger";
import osPath from "path";
import * as fs from "fs-extra";

export function copyFilesToScriptDir(syncPairs: [SyncNode, SyncNode][]): void {
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

export function removeObsoleteScriptFiles(scriptTree: DestNode): void {
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
