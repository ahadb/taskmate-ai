import { useEffect, type JSX, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TaskManager from "./components/TaskManager";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Login from "./components/Login";
import Layout from "./components/Layout";
import { useAuthStore } from "./store/authStore";
import { NotificationProvider } from "./contexts/NotificationContext";
import type { Task } from "./types/types";
import api from "./api";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = () => {
    // Navigate to task manager with create task focus
    window.location.href = "/tasks";
  };

  const handleViewOverdue = () => {
    // Navigate to task manager with overdue filter
    window.location.href = "/tasks";
  };

  if (isLoading) {
    return (
      <Router>
        <Layout>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-sm leading-5 text-gray-500">
              Loading...
            </span>
          </div>
        </Layout>
      </Router>
    );
  }

  return (
    <Router>
      <NotificationProvider>
        <Layout>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TaskManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard
                    tasks={tasks}
                    onCreateTask={handleCreateTask}
                    onViewOverdue={handleViewOverdue}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <div className="text-center py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      Settings
                    </h1>
                    <p className="text-gray-600">
                      Settings content coming soon...
                    </p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <Navigate
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  replace
                />
              }
            />
          </Routes>
        </Layout>
      </NotificationProvider>
    </Router>
  );
}
