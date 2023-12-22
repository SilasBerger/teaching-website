import * as fs from "fs";
import {ScriptConfig, SectionMapping } from "../models/script-config";

interface MaterialMappingTask {
  section: string;
  material: string;
  ignore: string[];
}

interface PathRenameTask {
  section: string;
  newLastPathSegment: string;
}

interface SetLabelTask {
  section: string;
  newLabel: string;
}

interface Tasks {
  materialMapping: MaterialMappingTask[];
  pathRename: PathRenameTask[];
  setLabel: SetLabelTask[];
}

export function buildScripts(scriptsConfigsFile: string) {
  const scriptsConfigs = loadScriptsConfigs(scriptsConfigsFile);
  Object.entries(scriptsConfigs).forEach(([scriptId, scriptConfig]: [string, ScriptConfig]) => {
    buildScript(scriptId, scriptConfig);
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
    materialMapping: [],
    pathRename: [],
    setLabel: [],
  }
  scriptConfig.forEach(sectionMapping => {
    validateSectionMapping(sectionMapping);
    collectTasksFrom(sectionMapping, tasks);
  });

  // TODO: Implement this next.
  console.log('=== Executing material mappings ===');
  tasks.materialMapping.forEach(task => console.log(task));
  console.log('\n=== Executing path renamings ===');
  tasks.pathRename.forEach(task => console.log(task));
  console.log('\n=== Executing label changes ===');
  tasks.setLabel.forEach(task => console.log(task));
}

function validateSectionMapping(sectionMapping: SectionMapping) {
  if (!sectionMapping.section) {
    throw `Section mapping is missing required property 'section': ${JSON.stringify(sectionMapping)}`;
  }
}

function collectTasksFrom(sectionMapping: SectionMapping, tasks: Tasks) {
  if (sectionMapping.material) {
    tasks.materialMapping.push({
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
