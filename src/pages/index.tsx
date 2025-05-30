import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Login from "@/components/Login";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import KanbanBoard from "@/components/KanbanBoard";
import { Task } from "@/types/task";
import {
  getTasksFromStorage,
  saveTasksToStorage,
} from "@/utils/jsonStorageApi";
import { cleanupOldTasks } from "@/utils/taskUtils";

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<"list" | "kanban">("list");

  // User kontekstdan username, adminligi va logout funksiyasini olamiz
  const { username, isAdmin, logout } = useUser();

  useEffect(() => {
    async function fetchTasks() {
      const storedTasks = await getTasksFromStorage();
      const cleanedTasks = cleanupOldTasks(storedTasks);
      setTasks(cleanedTasks);
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Vazifa qo‘shish
  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  // Vazifani o‘chirish
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Vazifani yangilash (edit)
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
  };

  // Vazifalarni filterlash: all, active (done bo‘lmagan), completed (done bo‘lgan)
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return task.status !== "done";
    if (filter === "completed") return task.status === "done";
    return true;
  });

  // Agar foydalanuvchi login qilmagan bo‘lsa, login oynasini ko‘rsatamiz
  if (!username) {
    return <Login />;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 space-y-6">
      {/* Header qismi: foydalanuvchi ismi va chiqish tugmasi */}
      <header className="flex justify-between items-center p-4 bg-white shadow rounded">
        <h1 className="text-1xl font-bold text-sky-700">Task Management App</h1>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-800">
            Salom, <span className="text-blue-600">{username}</span>{" "}
            {isAdmin && (
              <span className="text-sm bg-yellow-300 px-2 py-1 rounded">
                Admin
              </span>
            )}
          </span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Chiqish
          </button>
        </div>
      </header>

      {/* Vazifa qo‘shish formasi (edit ham shu orqali) */}
      <TaskForm
        onAddTask={handleAddTask}
        taskToEdit={editingTask}
        onUpdateTask={handleUpdateTask}
      />

      {/* Ko‘rinish tanlash (List yoki Kanban) */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === "list"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setView("kanban")}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === "kanban"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Kanban Board
        </button>
      </div>

      {/* Agar List ko‘rinish tanlangan bo‘lsa, filter tugmalari va vazifalar ro‘yxati */}
      {view === "list" ? (
        <>
          <div className="flex gap-3 justify-center my-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Barchasi
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === "active"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Faollari
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Tugallangan
            </button>
          </div>

          {/* Vazifalar ro‘yxatini ko‘rsatamiz */}
          <TaskList
            tasks={filteredTasks}
            onDeleteTask={handleDeleteTask}
            onEditTask={setEditingTask}
          />
        </>
      ) : (
        // Agar Kanban tanlangan bo‘lsa
        <KanbanBoard initialTasks={tasks} onUpdateTasks={setTasks} />
      )}
    </div>
  );
};

export default HomePage;
