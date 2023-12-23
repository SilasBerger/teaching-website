import * as fs from "fs";
import {ScriptConfig, SectionMapping } from "./models/script-config";
import {MaterialMapping, MaterialSyncTask, PathRenameTask, SetLabelTask, SyncTask, Tasks} from "./tasks/tasks";
import { executeMaterialSyncTasks } from "./tasks/sync-tasks";
import { executePathRenameTasks } from "./tasks/path-rename-tasks";
import { executeSetLabelTasks } from "./tasks/label-change-tasks";

export function buildScripts(scriptsConfigsFile: string) {
  const scriptsConfigs = loadScriptsConfigs(scriptsConfigsFile);
  Object.entries(scriptsConfigs).forEach(([scriptRoot, scriptConfig]: [string, ScriptConfig]) => {
    buildScript(scriptRoot, scriptConfig);
  });
  return Object.keys(scriptsConfigs);
}

function loadScriptsConfigs(scriptsConfigsName: string) {
  const scriptsConfigsPath = `config/scriptsConfigs/${scriptsConfigsName}`;
  if (!fs.existsSync(scriptsConfigsPath)) {
    throw `No such scriptsConfigs file: ${scriptsConfigsPath}`;
  }
  return JSON.parse(fs.readFileSync(scriptsConfigsPath).toString());
}

function buildScript(scriptRoot: string, scriptConfig: ScriptConfig) {
  console.log(`📝 Building script '${scriptRoot}'`);

  const syncTask = new SyncTask(scriptRoot);
  scriptConfig.forEach(sectionMapping => {
    validateSectionMapping(sectionMapping);
    collectTasksFrom(sectionMapping, scriptRoot, syncTask);
  });

  syncTask.printMappings();
  // executeMaterialSyncTasks(tasks.materialSync);
  // TODO: These tasks may have a mutual dependency: section in label change task is no longer valid after path rename...
  // executePathRenameTasks(tasks.pathRename);
  // executeSetLabelTasks(tasks.setLabel);
}

function validateSectionMapping(sectionMapping: SectionMapping) {
  if (!sectionMapping.section) {
    throw `Section mapping is missing required property 'section': ${JSON.stringify(sectionMapping)}`;
  }
}

function collectTasksFrom(sectionMapping: SectionMapping, scriptRoot: string, syncTask: SyncTask) {
  if (sectionMapping.material) {
    syncTask.addMapping(new MaterialMapping(
      sectionMapping.section,
      sectionMapping.material
    ));
  }

  // TODO: Re-implement with new architecture.
  /*
  if (sectionMapping.rename) {
    tasks.pathRename.push(new PathRenameTask(
      scriptRoot,
      sectionMapping.section,
      sectionMapping.rename,
    ));
  }

  if (sectionMapping.setLabel) {
    tasks.setLabel.push(new SetLabelTask(
      scriptRoot,
      sectionMapping.section,
      sectionMapping.setLabel,
    ));
  }
   */
}
