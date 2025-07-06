import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import type { TaskFilters as TaskFiltersType } from "../types/types";

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  totalTasks: number;
  completedTasks: number;
}

export default function TaskFilters({
  filters,
  onFiltersChange,
  totalTasks,
  completedTasks,
}: TaskFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const updateFilter = (key: keyof TaskFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const updateSort = (field: TaskFiltersType["sort"]["field"]) => {
    const currentField = filters.sort.field;
    const currentDirection = filters.sort.direction;

    if (currentField === field) {
      // Toggle direction if same field
      updateFilter("sort", {
        field,
        direction: currentDirection === "asc" ? "desc" : "asc",
      });
    } else {
      // Set new field with default direction
      updateFilter("sort", {
        field,
        direction: "asc",
      });
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: "all",
      priority: undefined,
      dueDate: undefined,
      search: undefined,
      sort: {
        field: "dueDate",
        direction: "asc",
      },
    });
  };

  const hasActiveFilters =
    filters.priority || filters.dueDate || filters.search;

  const getSortButtonClass = (field: TaskFiltersType["sort"]["field"]) => {
    const isActive = filters.sort.field === field;
    const baseClass =
      "px-3 py-1.5 text-sm font-medium rounded-md leading-5 flex items-center gap-1";

    if (isActive) {
      return `${baseClass} bg-indigo-100 text-indigo-700`;
    }
    return `${baseClass} text-gray-500 hover:text-gray-700 hover:bg-gray-100`;
  };

  const getSortDirectionIcon = (field: TaskFiltersType["sort"]["field"]) => {
    if (filters.sort.field !== field) return null;

    return filters.sort.direction === "asc" ? (
      <ChevronUpIcon className="h-3 w-3" />
    ) : (
      <ChevronDownIcon className="h-3 w-3" />
    );
  };

  return (
    <div className="bg-gray-100 shadow-sm ring-1 ring-gray-900/5 border border-gray-300 rounded-lg">
      <div className="px-4 py-4 sm:px-6">
        {/* Search Bar and Status Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search || ""}
                onChange={(e) =>
                  updateFilter("search", e.target.value || undefined)
                }
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex items-center space-x-4">
            <h3 className="text-sm font-medium leading-5 text-gray-900">
              Status:
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateFilter("status", "all")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md leading-5 ${
                  filters.status === "all"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                All ({totalTasks})
              </button>
              <button
                onClick={() => updateFilter("status", "active")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md leading-5 ${
                  filters.status === "active"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                Active ({totalTasks - completedTasks})
              </button>
              <button
                onClick={() => updateFilter("status", "completed")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md leading-5 ${
                  filters.status === "completed"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                Completed ({completedTasks})
              </button>
            </div>
            <div className="text-sm leading-4 text-gray-500">
              {completedTasks > 0 && (
                <span>
                  {Math.round((completedTasks / totalTasks) * 100)}% complete
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-medium leading-5 text-gray-900">
              Sort by:
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateSort("dueDate")}
                className={getSortButtonClass("dueDate")}
              >
                <CalendarIcon className="h-3 w-3" />
                Due Date
                {getSortDirectionIcon("dueDate")}
              </button>
              <button
                onClick={() => updateSort("priority")}
                className={getSortButtonClass("priority")}
              >
                <ExclamationTriangleIcon className="h-3 w-3" />
                Priority
                {getSortDirectionIcon("priority")}
              </button>
              <button
                onClick={() => updateSort("createdAt")}
                className={getSortButtonClass("createdAt")}
              >
                <CalendarIcon className="h-3 w-3" />
                Created
                {getSortDirectionIcon("createdAt")}
              </button>
              <button
                onClick={() => updateSort("title")}
                className={getSortButtonClass("title")}
              >
                <span className="text-xs font-bold">A</span>
                Title
                {getSortDirectionIcon("title")}
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>Advanced Filters</span>
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {/* Priority Filters */}
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">
                Priority:
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter("priority", undefined)}
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    !filters.priority
                      ? "bg-gray-200 text-gray-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Any Priority
                </button>
                <button
                  onClick={() => updateFilter("priority", "high")}
                  className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 ${
                    filters.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600 hover:bg-red-50"
                  }`}
                >
                  <ExclamationTriangleIcon className="h-3 w-3" />
                  High
                </button>
                <button
                  onClick={() => updateFilter("priority", "medium")}
                  className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 ${
                    filters.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600 hover:bg-yellow-50"
                  }`}
                >
                  <ExclamationCircleIcon className="h-3 w-3" />
                  Medium
                </button>
                <button
                  onClick={() => updateFilter("priority", "low")}
                  className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 ${
                    filters.priority === "low"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50"
                  }`}
                >
                  <CheckCircleIcon className="h-3 w-3" />
                  Low
                </button>
                <button
                  onClick={() => updateFilter("priority", "none")}
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    filters.priority === "none"
                      ? "bg-gray-200 text-gray-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  No Priority
                </button>
              </div>
            </div>

            {/* Due Date Filters */}
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">
                Due Date:
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter("dueDate", undefined)}
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    !filters.dueDate
                      ? "bg-gray-200 text-gray-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Any Date
                </button>
                <button
                  onClick={() => updateFilter("dueDate", "today")}
                  className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 ${
                    filters.dueDate === "today"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  <CalendarIcon className="h-3 w-3" />
                  Due Today
                </button>
                <button
                  onClick={() => updateFilter("dueDate", "tomorrow")}
                  className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 ${
                    filters.dueDate === "tomorrow"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  <CalendarIcon className="h-3 w-3" />
                  Due Tomorrow
                </button>
                <button
                  onClick={() => updateFilter("dueDate", "this-week")}
                  className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 ${
                    filters.dueDate === "this-week"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  <CalendarIcon className="h-3 w-3" />
                  Due This Week
                </button>
                <button
                  onClick={() => updateFilter("dueDate", "overdue")}
                  className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 ${
                    filters.dueDate === "overdue"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600 hover:bg-red-50"
                  }`}
                >
                  <ExclamationTriangleIcon className="h-3 w-3" />
                  Overdue
                </button>
                <button
                  onClick={() => updateFilter("dueDate", "none")}
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    filters.dueDate === "none"
                      ? "bg-gray-200 text-gray-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  No Due Date
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
