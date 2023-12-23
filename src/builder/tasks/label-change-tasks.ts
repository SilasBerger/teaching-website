import { SetLabelTask } from "../models/tasks";

export function executeSetLabelTasks(tasks: SetLabelTask[]) {
  console.log('=== Executing label changes ===');
  tasks.forEach(task => console.log(task));
}
