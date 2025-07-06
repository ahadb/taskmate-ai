import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  ClipboardDocumentListIcon,
  HomeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const navigation = [
    { name: "Tasks", href: "/tasks", icon: ClipboardDocumentListIcon },
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex grow flex-col overflow-y-auto bg-gray-200">
      <div className="flex h-16 shrink-0 items-center gap-2 px-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 22 22"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-indigo-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
            />
          </svg>
        </div>
        <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-xl font-semibold leading-6 text-transparent">
          TaskMate AI
        </h1>
      </div>
      <div className="border-t border-gray-300 mb-4 shadow-sm"></div>
      <div className="px-6 pb-4">
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex gap-x-3 rounded-md px-3 py-2 text-sm font-medium leading-5 transition-colors duration-200 ${
                          isActive
                            ? "bg-gray-300 text-gray-900 shadow-sm"
                            : "text-gray-700 hover:bg-gray-300 hover:text-gray-900"
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                            isActive
                              ? "text-gray-900"
                              : "text-gray-600 group-hover:text-gray-900"
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      <div className="px-6 pb-4 mt-auto">
        <div className="border-t border-gray-300 pt-4">
          <button
            onClick={handleLogout}
            className="group flex w-full gap-x-3 rounded-md px-3 py-2 text-sm font-medium leading-5 text-gray-700 hover:bg-gray-300 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowRightOnRectangleIcon
              className="h-5 w-5 shrink-0 text-gray-600 group-hover:text-gray-900 transition-colors duration-200"
              aria-hidden="true"
            />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
