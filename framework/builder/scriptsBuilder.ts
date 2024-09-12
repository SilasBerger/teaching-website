import * as fs from "fs";
import {ScriptConfig } from "./models/scriptConfig";
import {DestNode, SourceNode} from "./sync/sync-nodes";
import * as osPath from "path";
import {Log} from "../util/log";
import {createDestTree, createSourceTree} from "./sync/sync-tree-builder";
import {copyFilesToScriptDir, removeObsoleteScriptFiles} from "./sync/file-ops";
import {applyMarkers, applySectionMappings, collectSyncPairs} from "./sync/sync-tree-processing";
import {parse} from "yaml";
import {MATERIAL_ROOT, SCRIPTS_ROOT} from "../../config/builderConfig";

export function buildScripts(scriptsConfigsFile: string) {
  const scriptsConfigs = _loadScriptsConfigs(scriptsConfigsFile);

  Object.entries(scriptsConfigs).forEach(([scriptRoot, scriptConfig]: [string, ScriptConfig]) => {
    _buildScript(scriptRoot, scriptConfig);
  });
  return Object.keys(scriptsConfigs);
}

function _loadScriptsConfigs(scriptsConfigsName: string) {
  const scriptsConfigsPath = `config/scriptsConfigs/${scriptsConfigsName}`;
  if (!fs.existsSync(scriptsConfigsPath)) {
    throw `No such scriptsConfigs file: ${scriptsConfigsPath}`;
  }
  return parse(fs.readFileSync(scriptsConfigsPath).toString());
}

function _createMaterialTree(): SourceNode {
  const materialRootPath = osPath.resolve(MATERIAL_ROOT);
  return createSourceTree(materialRootPath);
}

function _buildScript(scriptRoot: string, scriptConfig: ScriptConfig) {
  Log.instance.info(`📝 Building script '${scriptRoot}'`);
  const materialTree = _createMaterialTree();
  const scriptRootPath = osPath.resolve(osPath.join(SCRIPTS_ROOT, scriptRoot));
  const scriptTree = createDestTree(scriptRootPath);
  _synchronizeToScript(materialTree, scriptTree, scriptConfig);
}

function _synchronizeToScript(materialTree: SourceNode, scriptTree: DestNode, scriptConfig: ScriptConfig): void {
  applySectionMappings(scriptConfig, scriptTree, materialTree);
  applyMarkers(materialTree, scriptTree, scriptConfig.markers);
  const syncPairs = collectSyncPairs(scriptTree);
  copyFilesToScriptDir(syncPairs);
  removeObsoleteScriptFiles(scriptTree);
}
