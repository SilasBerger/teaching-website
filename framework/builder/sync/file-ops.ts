import { DestNode } from './sync-nodes';
import { Log } from '../../util/log';
import osPath from 'path';
import * as fs from 'fs-extra';
import { SyncPair } from '../types/sync';

export function copyFilesToScriptDir(syncPairs: SyncPair[]): void {
    Log.instance.debug('🖨 Copying resources to script...');
    syncPairs.forEach(([sourceNode, destNode]) => {
        _copyFileIfChanged(sourceNode.absPath, destNode.absPath);
    });
}

function _copyFileIfChanged(sourcePath: string, destPath: string): void {
    if (!_fileHasChanged(sourcePath, destPath)) {
        return;
    }

    const destDir = osPath.dirname(destPath);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    Log.instance.debug(`[COPY] '${sourcePath}' -> '${destPath}'`);
    fs.copySync(sourcePath, destPath, { preserveTimestamps: true });
}

function _fileHasChanged(sourcePath: string, destPath: string): boolean {
    if (!fs.existsSync(destPath)) {
        return true;
    }

    const sourceStats = fs.statSync(sourcePath);
    const destStats = fs.statSync(destPath);
    return sourceStats.mtime.toUTCString() != destStats.mtime.toUTCString();
}

export function removeObsoleteScriptFiles(scriptTree: DestNode): void {
    const deletionCandidates = scriptTree.collect((node: DestNode) => !node.hasUsableSourceCandidates());
    if (deletionCandidates.length > 0) {
        Log.instance.debug('🗑️ Deleting obsolete script files...');
        deletionCandidates.forEach((candidate) => {
            _deleteFile(candidate.absPath);
        });
    }
}

function _deleteFile(path: string): void {
    if (fs.existsSync(path)) {
        Log.instance.debug(`[DELETE] '${path}'`);
        fs.rmSync(path, { recursive: true });
    }
}
