import { PathRenameTask } from "../models/tasks";

export function executePathRenameTasks(tasks: PathRenameTask[]) {
  console.log('=== Executing path renamings ===');
  tasks.forEach(task => console.log(task));
}
