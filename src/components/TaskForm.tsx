import React, { useState, useEffect } from "react";
import { Task, Subtask } from "@/types/task";
import { v4 as uuidv4 } from "uuid";

interface Props {
  onAddTask: (task: Task) => void;
  taskToEdit?: Task | null;
  onUpdateTask?: (task: Task) => void;
}

const TaskForm: React.FC<Props> = ({ onAddTask, taskToEdit, onUpdateTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState<Task["status"]>("backlog");
  const [assignee, setAssignee] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setType(taskToEdit.type);
      setStatus(taskToEdit.status);
      setAssignee(taskToEdit.assignee);
      setSubtasks(taskToEdit.subtasks);
    }
  }, [taskToEdit]);

  // Subtask qo'shish
  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: uuidv4(), title: "", isCompleted: false }]);
  };

  // Subtaskni yangilash
  const handleSubtaskChange = (id: string, value: string) => {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, title: value } : st))
    );
  };

  // Subtaskni o'chirish
  const handleSubtaskRemove = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title bo'sh bo'lishi mumkin emas!");
      return;
    }

    const filteredSubtasks = subtasks.filter((st) => st.title.trim() !== "");

    const taskData: Task = {
      id: taskToEdit?.id || uuidv4(),
      title,
      description,
      type,
      status,
      assignee,
      subtasks: filteredSubtasks,
      createdAt: taskToEdit?.createdAt || Date.now(),
    };

    if (taskToEdit && onUpdateTask) {
      onUpdateTask(taskData);
    } else {
      onAddTask(taskData);
    }

    // Reset forma
    setTitle("");
    setDescription("");
    setType("");
    setStatus("backlog");
    setAssignee("");
    setSubtasks([]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md space-y-5"
      >
        <h2 className="text-xl font-bold text-sky-600">
          Yangi vazifa qo‘shish
        </h2>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Title *
          </label>
          <input
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black"
          />
        </div>

        {/* Type */}
        <div>
          <label
            htmlFor="type"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Type
          </label>
          <input
            type="text"
            placeholder="Type..."
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Task["status"])}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="backlog">Backlog</option>
            <option value="inprogress">In Progress</option>
            <option value="ready-to-check">Ready to Check</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Assignee */}
        <div>
          <label
            htmlFor="assignee"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Assignee
          </label>

          <input
            type="text"
            placeholder="Assignee..."
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>

        {/* Subtasks */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Subtasks
          </label>
          {subtasks.map((st, idx) => (
            <div key={st.id} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={st.title}
                onChange={(e) => handleSubtaskChange(st.id, e.target.value)}
                placeholder={`Subtask #${idx + 1}`}
                className="flex-grow border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <button
                type="button"
                onClick={() => handleSubtaskRemove(st.id)}
                className="text-red-500 font-bold px-2"
                aria-label="Remove subtask"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSubtask}
            className="text-blue-600 underline"
          >
            + Add Subtask
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
