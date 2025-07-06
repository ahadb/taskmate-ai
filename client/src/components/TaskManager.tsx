import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskFilters from "./TaskFilters";
import TaskList from "./TaskList";
import Settings from "./Settings";
import EditTaskModal from "./EditTaskModal";
import ToastContainer from "./ToastContainer";
import type {
  Task,
  TaskFilters as TaskFiltersType,
  UserSettings,
} from "../types/types";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import api from "../api";
import { useToast } from "../hooks/useToast";

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFiltersType>({
    status: "all",
    priority: undefined,
    dueDate: undefined,
    search: undefined,
    sort: {
      field: "dueDate",
      direction: "asc",
    },
  });
  const [settings, setSettings] = useState<UserSettings>({
    defaultSort: {
      field: "dueDate",
      direction: "asc",
    },
    defaultFilter: "all",
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toasts, showSuccess, showError, removeToast } = useToast();

  useEffect(() => {
    fetchTasks();
    loadSettings();
  }, []);

  // Load settings from localStorage
  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem("taskManagerSettings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);

        // Apply default settings to filters
        setFilters((prev) => ({
          ...prev,
          status: parsedSettings.defaultFilter,
          sort: parsedSettings.defaultSort,
        }));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  // Save settings to localStorage
  const saveSettings = (newSettings: UserSettings) => {
    try {
      localStorage.setItem("taskManagerSettings", JSON.stringify(newSettings));
      setSettings(newSettings);

      // Apply new default settings to current filters
      setFilters((prev) => ({
        ...prev,
        status: newSettings.defaultFilter,
        sort: newSettings.defaultSort,
      }));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.data);
      setError(null);
    } catch (err) {
      showError("Failed to load tasks", "Please try refreshing the page.");
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: "low" | "medium" | "high";
  }) => {
    try {
      const response = await api.post("/tasks", taskData);
      setTasks([...tasks, response.data]);
      showSuccess(
        "Task created successfully",
        `"${taskData.title}" has been added to your tasks.`
      );
    } catch (err) {
      showError("Failed to create task", "Please try again.");
      console.error("Error creating task:", err);
      throw err;
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const response = await api.put(`/tasks/${id}`, {
        ...task,
        completed: !task.completed,
      });

      setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
      const action = task.completed
        ? "marked as incomplete"
        : "marked as complete";
      showSuccess("Task updated", `"${task.title}" has been ${action}.`);
    } catch (err) {
      showError("Failed to update task", "Please try again.");
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
      showSuccess(
        "Task deleted",
        `"${task.title}" has been removed from your tasks.`
      );
    } catch (err) {
      showError("Failed to delete task", "Please try again.");
      console.error("Error deleting task:", err);
    }
  };

  const handleEditTask = async (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (taskData: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: "low" | "medium" | "high";
  }) => {
    if (!editingTask) return;

    try {
      const response = await api.put(`/tasks/${editingTask.id}`, {
        ...editingTask,
        ...taskData,
      });

      setTasks(tasks.map((t) => (t.id === editingTask.id ? response.data : t)));
      setEditingTask(null);
      setIsEditModalOpen(false);
    } catch (err) {
      setError("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleReorderTasks = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
    // TODO: Save the new order to the backend
    // This would typically involve updating a 'display_order' field in the database
  };

  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold leading-7 text-gray-900">
            Task Manager
          </h1>
          <p className="mt-2 text-sm leading-5 text-gray-600">
            Organize your tasks and boost your productivity.
          </p>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
        >
          <Cog6ToothIcon className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium leading-5 text-red-800">
                Error
              </h3>
              <div className="mt-2 text-sm leading-4 text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <TaskForm onCreateTask={handleCreateTask} />

      <div className="space-y-4">
        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalTasks={tasks.length}
          completedTasks={completedTasks}
        />
        <TaskList
          tasks={tasks}
          filters={filters}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
          onReorder={handleReorderTasks}
          isLoading={isLoading}
        />
      </div>

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={saveSettings}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSave={handleUpdateTask}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
