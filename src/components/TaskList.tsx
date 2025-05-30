import React from "react";
import { Task } from "@/types/task";
import { Trash, Pencil } from "lucide-react";

interface Props {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<Props> = ({ tasks, onDeleteTask, onEditTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Vazifalar</h2>
        <p className="text-gray-500">Vazifalar mavjud emas</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Vazifalar</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border border-gray-200 p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-blue-600">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm">
                  <span className="px-2 py-1 bg-gray-200 rounded-full text-black">
                    Status: {task.status}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-black">
                    Type: {task.type}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-black">
                    Assignee: {task.assignee || "Belgilanmagan"}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-black">
                    Subtasks: {task.subtasks.length}
                  </span>
                </div>

                {task.subtasks.length > 0 && (
                  <ul className="list-disc list-inside text-sm mt-2 ml-4 text-sky-400">
                    <h5 className="text-sky-400">Subtasks :</h5>
                    {task.subtasks.map((subtask) => (
                      <li
                        key={subtask.id}
                        className={
                          subtask.isCompleted
                            ? "line-through text-amber-400"
                            : ""
                        }
                      >
                        {subtask.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => onEditTask(task)}
                  className="text-blue-500 hover:text-blue-700"
                  aria-label={`Edit task ${task.title}`}
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Delete task ${task.title}`}
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
