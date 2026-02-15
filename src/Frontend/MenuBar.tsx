// src/Frontend/components/Navbar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const MenuBar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full bg-blue-600 shadow-lg">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">Worklog</div>

        {/* Menu Links */}
        <div className="flex space-x-6">
          <Link
            to="/"
            className={`px-4 py-2 rounded-md text-white hover:bg-blue-500 transition ${
              isActive("/") ? "bg-blue-800" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/entries"
            className={`px-4 py-2 rounded-md text-white hover:bg-blue-500 transition ${
              isActive("/entries") ? "bg-blue-800" : ""
            }`}
          >
            Work Entries
          </Link>
          <Link
            to="/approvals"
            className={`px-4 py-2 rounded-md text-white hover:bg-blue-500 transition ${
              isActive("/approvals") ? "bg-blue-800" : ""
            }`}
          >
            Approvals
          </Link>
          <Link
            to="/settings"
            className={`px-4 py-2 rounded-md text-white hover:bg-blue-500 transition ${
              isActive("/settings") ? "bg-blue-800" : ""
            }`}
          >
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
