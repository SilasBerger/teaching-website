import * as fs from "fs";
import {ScriptConfig, SectionMapping } from "./models/script-config";
import { Tasks } from "./models/tasks";
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

function buildScript(scriptId: string, scriptConfig: ScriptConfig) {
  console.log(`📝 Building script '${scriptId}'`);

  const tasks: Tasks = {
    materialSync: [],
    pathRename: [],
    setLabel: [],
  }
  scriptConfig.forEach(sectionMapping => {
    validateSectionMapping(sectionMapping);
    collectTasksFrom(sectionMapping, tasks);
  });

  executeMaterialSyncTasks(tasks.materialSync);
  // TODO: Section for label change is no longer valid after path rename, but user probably wants to specify correct (new) section.
  executePathRenameTasks(tasks.pathRename);
  executeSetLabelTasks(tasks.setLabel);
}

function validateSectionMapping(sectionMapping: SectionMapping) {
  if (!sectionMapping.section) {
    throw `Section mapping is missing required property 'section': ${JSON.stringify(sectionMapping)}`;
  }
}

function collectTasksFrom(sectionMapping: SectionMapping, tasks: Tasks) {
  if (sectionMapping.material) {
    tasks.materialSync.push({
      section: sectionMapping.section,
      material: sectionMapping.material,
      ignore: sectionMapping.ignore ?? [],
    });
  }

  if (sectionMapping.rename) {
    tasks.pathRename.push({
      section: sectionMapping.section,
      newLastPathSegment: sectionMapping.rename,
    });
  }

  if (sectionMapping.setLabel) {
    tasks.setLabel.push({
      section: sectionMapping.section,
      newLabel: sectionMapping.setLabel,
    })
  }
}
