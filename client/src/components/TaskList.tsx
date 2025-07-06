import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task, TaskFilters } from "../types/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  filters: TaskFilters;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onReorder: (tasks: Task[]) => void;
  isLoading: boolean;
}

export default function TaskList({
  tasks,
  filters,
  onToggleComplete,
  onDelete,
  onEdit,
  onReorder,
  isLoading,
}: TaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    // Status filter
    if (filters.status === "active") {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    } else if (filters.status === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    }

    // Priority filter
    if (filters.priority) {
      if (filters.priority === "none") {
        filteredTasks = filteredTasks.filter((task) => !task.priority);
      } else {
        filteredTasks = filteredTasks.filter(
          (task) => task.priority === filters.priority
        );
      }
    }

    // Due date filter
    if (filters.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const endOfWeek = new Date(today);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      filteredTasks = filteredTasks.filter((task) => {
        if (!task.due_date) {
          return filters.dueDate === "none";
        }

        const dueDate = new Date(task.due_date);
        dueDate.setHours(0, 0, 0, 0);

        switch (filters.dueDate) {
          case "today":
            return dueDate.getTime() === today.getTime();
          case "tomorrow":
            return dueDate.getTime() === tomorrow.getTime();
          case "this-week":
            return dueDate >= today && dueDate <= endOfWeek;
          case "overdue":
            return dueDate < today && !task.completed;
          case "none":
            return false;
          default:
            return true;
        }
      });
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter((task) => {
        const titleMatch = task.title.toLowerCase().includes(searchTerm);
        const descriptionMatch =
          task.description?.toLowerCase().includes(searchTerm) || false;
        return titleMatch || descriptionMatch;
      });
    }

    // Sort tasks
    filteredTasks.sort((a, b) => {
      const { field, direction } = filters.sort;
      const multiplier = direction === "asc" ? 1 : -1;

      switch (field) {
        case "dueDate":
          return sortByDueDate(a, b) * multiplier;
        case "priority":
          return sortByPriority(a, b) * multiplier;
        case "createdAt":
          return sortByCreatedAt(a, b) * multiplier;
        case "title":
          return sortByTitle(a, b) * multiplier;
        default:
          return 0;
      }
    });

    return filteredTasks;
  };

  // Sort helper functions
  const sortByDueDate = (a: Task, b: Task): number => {
    // Handle tasks without due dates
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return 1; // No due date goes to the end
    if (!b.due_date) return -1;

    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);
    return dateA.getTime() - dateB.getTime();
  };

  const sortByPriority = (a: Task, b: Task): number => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityA = a.priority ? priorityOrder[a.priority] : 0;
    const priorityB = b.priority ? priorityOrder[b.priority] : 0;
    return priorityA - priorityB;
  };

  const sortByCreatedAt = (a: Task, b: Task): number => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateA.getTime() - dateB.getTime();
  };

  const sortByTitle = (a: Task, b: Task): number => {
    return a.title.localeCompare(b.title);
  };

  const filteredTasks = getFilteredTasks();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = filteredTasks.findIndex((task) => task.id === active.id);
      const newIndex = filteredTasks.findIndex((task) => task.id === over?.id);

      const reorderedTasks = arrayMove(filteredTasks, oldIndex, newIndex);

      // Update the original tasks array to maintain the new order
      const newTasks = [...tasks];
      reorderedTasks.forEach((reorderedTask) => {
        const originalIndex = newTasks.findIndex(
          (task) => task.id === reorderedTask.id
        );
        if (originalIndex !== -1) {
          newTasks[originalIndex] = reorderedTask;
        }
      });

      onReorder(newTasks);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 shadow-sm ring-1 ring-gray-900/5 border border-gray-300 rounded-lg">
        <div className="px-4 py-8 sm:px-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-sm leading-5 text-gray-500">
              Loading tasks...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    const hasActiveFilters =
      filters.priority || filters.dueDate || filters.search;

    return (
      <div className="bg-gray-100 shadow-sm ring-1 ring-gray-900/5 border border-gray-300 rounded-lg">
        <div className="px-4 py-12 sm:px-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-sm font-medium leading-5 text-gray-900">
              {hasActiveFilters
                ? "No tasks match your filters"
                : "No tasks found"}
            </h3>
            <p className="mt-2 text-sm leading-4 text-gray-500">
              {hasActiveFilters
                ? "Try adjusting your filters or search terms."
                : filters.status === "all"
                ? "Get started by creating your first task."
                : filters.status === "active"
                ? "No active tasks. Great job!"
                : "No completed tasks yet."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 shadow-sm ring-1 ring-gray-900/5 border border-gray-300 rounded-lg">
      <div className="px-4 py-4 sm:px-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
