import fs from 'fs';
import osPath from 'path';
import { DestNode, SourceNode, SyncNode } from './sync-nodes';

export function createSourceTree(rootPath: string): SourceNode {
    const sourceRoot = new SourceNode(rootPath, []);
    _createDirTree(sourceRoot, rootPath);
    return sourceRoot;
}

export function createDestTree(rootPath: string): DestNode {
    const destRoot = new DestNode(rootPath);
    _createDirTree(destRoot, rootPath);
    return destRoot;
}

function _createDirTree(currentNode: SyncNode, currentAbsPath: string): void {
    if (!fs.existsSync(currentAbsPath)) {
        return;
    }
    fs.readdirSync(currentAbsPath).forEach((childPath) => {
        const childAbsPath = osPath.join(currentAbsPath, childPath);
        if (fs.statSync(childAbsPath).isFile()) {
            currentNode.appendChild(childPath);
        } else {
            const childNode = currentNode.appendChild(childPath);
            _createDirTree(childNode, childAbsPath);
        }
    });
}
