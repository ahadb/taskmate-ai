import React, { useState } from "react";
import { XMarkIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import type { UserSettings } from "../types/types";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export default function Settings({
  isOpen,
  onClose,
  settings,
  onSave,
}: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings); // Reset to original settings
    onClose();
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateSortSetting = (
    key: keyof UserSettings["defaultSort"],
    value: any
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      defaultSort: {
        ...prev.defaultSort,
        [key]: value,
      },
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Transparent background */}
      <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-900">
                User Settings
              </h2>
            </div>
            <button
              onClick={handleCancel}
              className="rounded-md p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Default Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Default Sort
                </label>
                <div className="grid max-w-4xl grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-12">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Sort by:
                    </label>
                    <select
                      value={localSettings.defaultSort.field}
                      onChange={(e) =>
                        updateSortSetting("field", e.target.value)
                      }
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm bg-white"
                    >
                      <option value="dueDate">Due Date</option>
                      <option value="priority">Priority</option>
                      <option value="createdAt">Creation Date</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Direction:
                    </label>
                    <select
                      value={localSettings.defaultSort.direction}
                      onChange={(e) =>
                        updateSortSetting("direction", e.target.value)
                      }
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm bg-white"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Default Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Default Filter
                </label>
                <div className="grid max-w-4xl grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-12">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Show tasks:
                    </label>
                    <select
                      value={localSettings.defaultFilter}
                      onChange={(e) =>
                        updateSetting("defaultFilter", e.target.value)
                      }
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm bg-white"
                    >
                      <option value="all">All Tasks</option>
                      <option value="active">Active Tasks Only</option>
                      <option value="completed">Completed Tasks Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
