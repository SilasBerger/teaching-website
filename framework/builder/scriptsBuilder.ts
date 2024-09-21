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
import {SiteConfig} from "./models/siteConfig";
import chokidar from 'chokidar';
import process from "process";

const WATCH_PATHS = [
  osPath.resolve(process.cwd(), 'docs'),
  osPath.resolve(process.cwd(), 'src'),
];

export class ScriptsBuilder {
  constructor(private _siteConfig: SiteConfig, private _scriptConfigs: { [key: string]: ScriptConfig }) {
  }

  static buildOnce(siteConfig: SiteConfig) {
    Log.instance.info(`🚀 Building scripts (build once)'`);
    const scriptConfigs = ScriptsBuilder._loadScriptConfigs(siteConfig.properties.scriptsConfigsFile);
    const builder = new ScriptsBuilder(siteConfig, scriptConfigs);
    builder._build();
    return builder._scriptRoots;
  }

  static watch(siteConfig: SiteConfig) {
    Log.instance.info(`👀 Building scripts (watch)'`);
    const scriptConfigs = ScriptsBuilder._loadScriptConfigs(siteConfig.properties.scriptsConfigsFile);
    const builder = new ScriptsBuilder(siteConfig, scriptConfigs);
    builder._watch();
    return builder._scriptRoots;
  }

  private get _scriptRoots() {
    return Object.keys(this._scriptConfigs);
  }

  private _watch() {
    const watcher = chokidar.watch(WATCH_PATHS, {
      persistent: true,
      ignoreInitial: true
    });
    watcher.on('all', (event, filePath) => {
      Log.instance.info('⚡️ Rebuilding scripts after file change');
      this._build();
    });
    this._build();
  }

  private _build() {
    Log.instance.info(`🔧 Building site '${this._siteConfig.siteId}'`);
    Object.entries(this._scriptConfigs).forEach(([scriptRoot, scriptConfig]: [string, ScriptConfig]) => {
      this._buildScript(scriptRoot, scriptConfig);
    });
  }

  private static _loadScriptConfigs(scriptsConfigsName: string) {
    const scriptsConfigsPath = `config/scriptsConfigs/${scriptsConfigsName}`;
    if (!fs.existsSync(scriptsConfigsPath)) {
      throw `No such scriptsConfigs file: ${scriptsConfigsPath}`;
    }
    return parse(fs.readFileSync(scriptsConfigsPath).toString());
  }

  private _createMaterialTree(): SourceNode {
    const materialRootPath = osPath.resolve(MATERIAL_ROOT);
    return createSourceTree(materialRootPath);
  }

  private _buildScript(scriptRoot: string, scriptConfig: ScriptConfig) {
    Log.instance.info(`📝 Building script '${scriptRoot}'`);
    const materialTree = this._createMaterialTree();
    const scriptRootPath = osPath.resolve(osPath.join(SCRIPTS_ROOT, scriptRoot));
    const scriptTree = createDestTree(scriptRootPath);
    this._synchronizeToScript(materialTree, scriptTree, scriptConfig);
  }

  private _synchronizeToScript(materialTree: SourceNode, scriptTree: DestNode, scriptConfig: ScriptConfig): void {
    applySectionMappings(scriptConfig, scriptTree, materialTree);
    applyMarkers(materialTree, scriptTree, scriptConfig.markers);
    const syncPairs = collectSyncPairs(scriptTree);
    copyFilesToScriptDir(syncPairs);
    removeObsoleteScriptFiles(scriptTree);
  }
}
