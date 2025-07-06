import React from "react";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import type { Task } from "../types/types";

interface DashboardProps {
  tasks: Task[];
  onCreateTask: () => void;
  onViewOverdue: () => void;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color?: "blue" | "green" | "red" | "yellow";
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  onClick,
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  return (
    <div
      className={`bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-4 ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

const UrgentTasksWidget: React.FC<{
  tasks: Task[];
  onViewOverdue: () => void;
}> = ({ tasks, onViewOverdue }) => {
  const overdueTasks = tasks.filter(
    (task) =>
      task.due_date && new Date(task.due_date) < new Date() && !task.completed
  );

  const dueTodayTasks = tasks.filter((task) => {
    if (!task.due_date || task.completed) return false;
    const today = new Date();
    const dueDate = new Date(task.due_date);
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  });

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high" && !task.completed
  );

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Urgent Tasks</h3>
        {overdueTasks.length > 0 && (
          <button
            onClick={onViewOverdue}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            View All Overdue
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
              <ExclamationTriangleIcon className="h-4 w-4" />
              Overdue ({overdueTasks.length})
            </h4>
            <div className="space-y-2">
              {overdueTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 bg-red-50 rounded-md"
                >
                  <span className="text-sm text-red-800 font-medium">
                    {task.title}
                  </span>
                  <span className="text-xs text-red-600">
                    Due {new Date(task.due_date!).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {overdueTasks.length > 3 && (
                <p className="text-xs text-red-600">
                  +{overdueTasks.length - 3} more overdue tasks
                </p>
              )}
            </div>
          </div>
        )}

        {/* Due Today */}
        {dueTodayTasks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-yellow-600 mb-2 flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              Due Today ({dueTodayTasks.length})
            </h4>
            <div className="space-y-2">
              {dueTodayTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 bg-yellow-50 rounded-md"
                >
                  <span className="text-sm text-yellow-800 font-medium">
                    {task.title}
                  </span>
                  {task.priority && (
                    <span className="text-xs text-yellow-600 capitalize">
                      {task.priority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* High Priority */}
        {highPriorityTasks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-orange-600 mb-2 flex items-center gap-1">
              <ExclamationTriangleIcon className="h-4 w-4" />
              High Priority ({highPriorityTasks.length})
            </h4>
            <div className="space-y-2">
              {highPriorityTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 bg-orange-50 rounded-md"
                >
                  <span className="text-sm text-orange-800 font-medium">
                    {task.title}
                  </span>
                  {task.due_date && (
                    <span className="text-xs text-orange-600">
                      Due {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No urgent tasks */}
        {overdueTasks.length === 0 &&
          dueTodayTasks.length === 0 &&
          highPriorityTasks.length === 0 && (
            <div className="text-center py-4">
              <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                No urgent tasks! Great job staying on top of things.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default function Dashboard({
  tasks,
  onCreateTask,
  onViewOverdue,
}: DashboardProps) {
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const overdueTasks = tasks.filter(
    (task) =>
      task.due_date && new Date(task.due_date) < new Date() && !task.completed
  ).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold leading-7 text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm leading-5 text-gray-600">
            Overview of your tasks and productivity.
          </p>
        </div>
        <button
          onClick={onCreateTask}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Quick Add Task</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={ClipboardDocumentListIcon}
          color="blue"
        />
        <StatCard
          title="Active Tasks"
          value={activeTasks}
          icon={ClockIcon}
          color="yellow"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon={CheckCircleIcon}
          color="green"
        />
        <StatCard
          title="Overdue"
          value={overdueTasks}
          icon={ExclamationTriangleIcon}
          color="red"
          onClick={overdueTasks > 0 ? onViewOverdue : undefined}
        />
      </div>

      {/* Progress and Urgent Tasks - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Progress</h3>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Completion Rate
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {completionRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Weekly Progress
            </h4>
            <div className="space-y-2">
              {(() => {
                const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const today = new Date();
                const weekData = days.map((day, index) => {
                  const date = new Date(today);
                  date.setDate(today.getDate() - (6 - index));

                  const dayStart = new Date(date);
                  dayStart.setHours(0, 0, 0, 0);
                  const dayEnd = new Date(date);
                  dayEnd.setHours(23, 59, 59, 999);

                  const dayTasks = tasks.filter((task) => {
                    const taskDate = new Date(task.createdAt);
                    return taskDate >= dayStart && taskDate <= dayEnd;
                  });

                  const completedTasks = dayTasks.filter(
                    (task) => task.completed
                  ).length;
                  const totalTasks = dayTasks.length;
                  const percentage =
                    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                  return {
                    day,
                    percentage,
                    completedTasks,
                    totalTasks,
                    isToday: index === 6,
                  };
                });

                return weekData.map((data, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <span
                      className={`w-8 text-xs font-medium ${
                        data.isToday ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {data.day}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right">
                      {data.completedTasks}/{data.totalTasks}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Urgent Tasks Widget */}
        <UrgentTasksWidget tasks={tasks} onViewOverdue={onViewOverdue} />
      </div>
    </div>
  );
}
