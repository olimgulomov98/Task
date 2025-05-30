"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Task } from "@/types/task";

interface KanbanBoardProps {
  initialTasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
}

const statuses: Task["status"][] = [
  "backlog",
  "inprogress",
  "ready-to-check",
  "done",
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  initialTasks,
  onUpdateTasks,
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return; // tashqariga tashlandi

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return; // joyida qoldi

    // taskni topamiz
    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    // taskni yangilaymiz — yangi status beramiz
    const updatedTask = {
      ...task,
      status: destination.droppableId as Task["status"],
    };

    // tasks dan eski taskni olib yangisini joylashtiramiz
    const newTasks = tasks.filter((t) => t.id !== draggableId);
    newTasks.splice(destination.index, 0, updatedTask);

    setTasks(newTasks);
    onUpdateTasks(newTasks);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto">
        {statuses.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`w-64 p-4 rounded-lg ${
                  snapshot.isDraggingOver ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <h3 className="font-bold mb-4 text-center capitalize text-sky-400">
                  {status}
                </h3>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task, index) => (
                    <Draggable
                      draggableId={task.id}
                      index={index}
                      key={task.id}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white p-3 mb-3 rounded shadow cursor-pointer ${
                            snapshot.isDragging ? "bg-blue-200" : ""
                          }`}
                        >
                          <h4 className="font-semibold text-amber-400">
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {task.description}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
