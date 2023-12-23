import { MaterialSyncTask } from "../models/tasks";

export function executeMaterialSyncTasks(tasks: MaterialSyncTask[]) {
  // TODO: Implement.
  console.log('=== Executing material sync tasks ===');
  tasks.forEach(task => console.log(task));
}
