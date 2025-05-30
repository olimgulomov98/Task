import { Task } from "@/types/task";

const TASK_EXPIRATION_DAYS = 7;

export const cleanupOldTasks = (tasks: Task[]): Task[] => {
  const now = Date.now();
  return tasks.filter(
    (task) => now - task.createdAt < TASK_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
  );
};
