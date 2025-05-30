export interface IUser {
  id: string;
  username: string;
  isAdmin?: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  status: "backlog" | "inprogress" | "ready-to-check" | "done";
  assignee: string;
  subtasks: Subtask[];
  createdAt: number;
  updatedAt?: string;
}
