import React from "react";
import {
  TrashIcon,
  PencilIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types/types";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50";
    case "medium":
      return "text-yellow-600 bg-yellow-50";
    case "low":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "high":
      return <ExclamationTriangleIcon className="h-3 w-3 text-red-600" />;
    case "medium":
      return <ExclamationCircleIcon className="h-3 w-3 text-yellow-600" />;
    case "low":
      return <CheckCircleIcon className="h-3 w-3 text-green-600" />;
    default:
      return null;
  }
};

export default function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && !task.completed;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-50 rounded"
            >
              <Bars3Icon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 mt-1"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3
                  className={`text-sm font-medium leading-5 text-gray-900 ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </h3>
                {task.priority && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {getPriorityIcon(task.priority)}
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}
                  </span>
                )}
                {isOverdue && (
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-red-600 bg-red-50">
                    <ExclamationTriangleIcon className="h-3 w-3" />
                    Overdue
                  </span>
                )}
                {task.due_date && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs ${
                      isOverdue ? "text-red-600 font-medium" : "text-gray-500"
                    }`}
                  >
                    <CalendarIcon className="h-3 w-3" />
                    Due {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
              </div>
              {task.description && (
                <p
                  className={`mt-1 text-sm leading-4 text-gray-500 ${
                    task.completed ? "line-through" : ""
                  }`}
                >
                  {task.description}
                </p>
              )}
              <div className="mt-2 flex items-center gap-4 text-xs leading-4 text-gray-400">
                <span>
                  Created {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onEdit(task)}
              className="rounded-md p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="rounded-md p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
