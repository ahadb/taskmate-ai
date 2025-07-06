import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import {
  BellIcon,
  Bars3Icon,
  HomeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  // Check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-white px-4 shadow-sm border-b border-gray-200 sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      {/* Logo/Brand */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1">
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            Task Manager
          </h1>
        </div>
      </div>

      {/* Right side - Notifications and Profile */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-x-1">
          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/dashboard")
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <HomeIcon className="h-4 w-4 inline mr-1" />
            About TaskMate AI
          </Link>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 flex items-center justify-center">
              <span className="sr-only">3 new notifications</span>
            </span>
          </button>

          {/* Notifications dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 z-10 mt-2.5 w-80 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-medium leading-5 text-gray-900">
                  Notifications
                </h3>
              </div>
              <div className="px-4 py-3">
                <div className="text-sm leading-4 text-gray-500">
                  <p>No new notifications</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            className="-m-1.5 flex items-center p-1.5"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <span className="sr-only">Open user menu</span>
            <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center">
              <span className="text-sm font-medium leading-5 text-white">
                {getUserInitials()}
              </span>
            </div>
            <span className="hidden lg:flex lg:items-center">
              <span
                className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                aria-hidden="true"
              >
                {user?.email}
              </span>
            </span>
          </button>

          {/* Profile dropdown menu */}
          {profileOpen && (
            <div className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setProfileOpen(false);
                }}
                className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
