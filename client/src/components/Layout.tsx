import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // For unauthenticated users (login/register), don't show sidebar
  if (!isAuthenticated) {
    return <div className="min-h-full">{children}</div>;
  }

  return (
    <div className="h-full">
      {/* Mobile sidebar */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-10 bg-white min-h-screen">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
