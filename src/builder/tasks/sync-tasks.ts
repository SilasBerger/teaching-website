import { SCRIPTS_ROOT } from "../../../config/builder-config";
import { MaterialSyncTask } from "./tasks";
import * as fs from "fs";

export function executeMaterialSyncTasks(tasks: MaterialSyncTask[]) {
  // TODO: Implement.
  console.log('=== Executing material sync tasks ===');
  ensureDirectory(SCRIPTS_ROOT);
  tasks.forEach(task => {
    console.log({
      material: task.materialAbsPath,
      scriptRoot: task.scriptRootAbsPath,
      section: task.sectionAbsPath
    });
  });
}

function ensureDirectory(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, {recursive: true});
  }
}
