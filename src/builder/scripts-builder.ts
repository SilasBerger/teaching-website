import * as fs from "fs";
import {ScriptConfig } from "./models/script-config";
import {createDestTree, createSourceTree, SourceNode} from "./sync/sync-tree";
import * as osPath from "path";
import {MATERIAL_ROOT, SCRIPTS_ROOT} from "../../config/builder-config";
import {synchronizeToScript} from "./sync/sync";
import {Logger} from "./logger";

export function buildScripts(scriptsConfigsFile: string) {
  const scriptsConfigs = loadScriptsConfigs(scriptsConfigsFile);

  const materialTree = createMaterialTree();
  Object.entries(scriptsConfigs).forEach(([scriptRoot, scriptConfig]: [string, ScriptConfig]) => {
    buildScript(scriptRoot, scriptConfig, materialTree);
  });
  return Object.keys(scriptsConfigs);
}

function createMaterialTree(): SourceNode {
  const materialRootPath = osPath.resolve(MATERIAL_ROOT);
  return createSourceTree(materialRootPath);
}

function loadScriptsConfigs(scriptsConfigsName: string) {
  const scriptsConfigsPath = `config/scriptsConfigs/${scriptsConfigsName}`;
  if (!fs.existsSync(scriptsConfigsPath)) {
    throw `No such scriptsConfigs file: ${scriptsConfigsPath}`;
  }
  return JSON.parse(fs.readFileSync(scriptsConfigsPath).toString());
}

function buildScript(scriptRoot: string, scriptConfig: ScriptConfig, materialTree: SourceNode) {
  Logger.instance.info(`📝 Building script '${scriptRoot}'`);
  const scriptRootPath = osPath.resolve(osPath.join(SCRIPTS_ROOT, scriptRoot));
  const scriptTree = createDestTree(scriptRootPath);
  synchronizeToScript(materialTree, scriptTree, scriptConfig);
}
