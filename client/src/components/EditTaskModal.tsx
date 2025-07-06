import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import TaskForm from "./TaskForm";
import type { Task } from "../types/types";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (taskData: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: "low" | "medium" | "high";
  }) => void;
}

export default function EditTaskModal({
  isOpen,
  onClose,
  task,
  onSave,
}: EditTaskModalProps) {
  if (!isOpen || !task) return null;

  const handleSave = async (taskData: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: "low" | "medium" | "high";
  }) => {
    await onSave(taskData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Transparent background */}
      <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Edit Task</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <TaskForm
              onCreateTask={handleSave}
              editMode={true}
              initialData={{
                title: task.title,
                description: task.description || "",
                due_date: task.due_date || "",
                priority: task.priority || "",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
