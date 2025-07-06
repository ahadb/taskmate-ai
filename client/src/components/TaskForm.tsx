import React, { useState } from "react";
import {
  SparklesIcon,
  HandRaisedIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { aiApi } from "../api/index";

interface TaskFormProps {
  onCreateTask: (taskData: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: "low" | "medium" | "high";
  }) => void;
  editMode?: boolean;
  initialData?: {
    title: string;
    description: string;
    due_date: string;
    priority: "low" | "medium" | "high" | "";
  };
}

type TaskMode = "manual" | "ai";

export default function TaskForm({
  onCreateTask,
  editMode,
  initialData,
}: TaskFormProps) {
  const [mode, setMode] = useState<TaskMode>(editMode ? "manual" : "ai");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [dueDate, setDueDate] = useState(initialData?.due_date || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "">(
    initialData?.priority || ""
  );
  const [aiInput, setAiInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const taskData = {
          title: title.trim(),
          description: description.trim() || undefined,
          due_date: dueDate || undefined,
          priority: priority || undefined,
        };
        await onCreateTask(taskData);
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("");
      } catch (error) {
        console.error("Error creating task:", error);
        // Error is already handled by the parent component via toast notifications
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aiInput.trim() && !isGenerating) {
      setIsGenerating(true);
      try {
        setAiError(null);
        // Use real AI service to parse and create task
        const aiTask = await aiApi.createTask(aiInput.trim());
        await onCreateTask(aiTask);
        setAiInput("");
      } catch (error) {
        console.error("AI task creation failed:", error);
        setAiError("AI processing failed. Using basic parsing instead.");
        // Fallback to basic parsing if AI fails
        const generatedTitle =
          aiInput.split(" ").slice(0, 5).join(" ") +
          (aiInput.split(" ").length > 5 ? "..." : "");
        const generatedDescription = aiInput;
        await onCreateTask({
          title: generatedTitle,
          description: generatedDescription,
        });
        setAiInput("");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const clearForm = () => {
    if (mode === "manual") {
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("");
    } else {
      setAiInput("");
    }
    setAiError(null);
  };

  return (
    <div className="bg-gray-100 shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6 border border-gray-300">
      <div className="flex items-center justify-between mb-6">
        {!editMode && (
          <button
            type="button"
            onClick={() => setMode(mode === "manual" ? "ai" : "manual")}
            className="mr-3 p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-orange-600 flex items-center"
            title={
              mode === "manual" ? "Switch to AI Assistant" : "Switch to Manual"
            }
          >
            {mode === "manual" ? (
              <HandRaisedIcon className="h-5 w-5" />
            ) : (
              <SparklesIcon className="h-5 w-5" />
            )}
          </button>
        )}
        <div className="flex-1">
          <h2 className="text-lg font-medium text-gray-900">
            {editMode ? "Edit Task" : "Quick Add Tasks (AI Powered)"}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {editMode
              ? "Update your task details below."
              : "Create a new task to get started."}
          </p>
        </div>
        {!editMode && mode === "ai" && (
          <div className="flex items-center gap-1 text-xs text-orange-600 font-medium">
            <SparklesIcon className="h-3 w-3" />
            AI Powered
          </div>
        )}
      </div>

      {/* Manual Task Form */}
      {mode === "manual" && (
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <div className="grid max-w-4xl grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-12">
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Task Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm bg-white"
                placeholder="Enter task title..."
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="priority"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "low" | "medium" | "high" | "")
                }
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm bg-white"
              >
                <option value="">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="due-date"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Due Date
              </label>
              <input
                type="date"
                name="due-date"
                id="due-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm bg-white"
              />
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="description"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Description (optional)
              </label>
              <input
                type="text"
                name="description"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm bg-white"
                placeholder="Add additional details..."
              />
            </div>
          </div>
        </form>
      )}

      {/* AI Task Form */}
      {mode === "ai" && (
        <form onSubmit={handleAiSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="ai-input"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Describe your task
            </label>
            <textarea
              id="ai-input"
              name="ai-input"
              rows={3}
              required
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm resize-none bg-white"
              placeholder="Describe your task in natural language... (e.g., 'Call dentist tomorrow at 3pm' or 'Buy groceries this weekend')"
            />
            <p className="mt-1 text-xs text-gray-500">
              Use natural language to describe what you need to do.
            </p>
          </div>

          {/* AI Suggestions */}
          <div className="rounded-md bg-orange-50 p-3 border border-orange-100">
            <div className="flex items-start">
              <SparklesIcon
                className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div className="ml-2">
                <h3 className="text-xs font-medium text-orange-800">
                  Try phrases like:
                </h3>
                <ul className="mt-1 text-xs text-orange-700 space-y-0.5">
                  <li>• "Call dentist tomorrow at 3pm"</li>
                  <li>• "Review quarterly report by Friday"</li>
                  <li>• "Buy groceries: milk, bread, eggs"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* AI Error Display */}
          {aiError && (
            <div className="rounded-md bg-yellow-50 p-3 border border-yellow-100">
              <div className="flex">
                <div className="ml-2">
                  <h3 className="text-xs font-medium text-yellow-800">
                    AI Processing Notice
                  </h3>
                  <div className="mt-1 text-xs text-yellow-700">
                    <p>{aiError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-gray-300">
        <div className="flex items-center justify-end gap-x-4">
          <button
            type="button"
            onClick={clearForm}
            className="text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Clear
          </button>
          <button
            type="submit"
            onClick={mode === "manual" ? handleManualSubmit : handleAiSubmit}
            disabled={
              (mode === "manual" ? !title.trim() : !aiInput.trim()) ||
              isSubmitting ||
              isGenerating
            }
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isGenerating ? (
              <div className="flex items-center gap-2">
                {isGenerating && (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                )}
                {mode === "manual"
                  ? editMode
                    ? "Updating..."
                    : "Creating..."
                  : "Processing with AI..."}
              </div>
            ) : mode === "manual" ? (
              editMode ? (
                "Update Task"
              ) : (
                "Create Task"
              )
            ) : (
              "Generate with AI"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
