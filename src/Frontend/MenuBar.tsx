// src/Frontend/components/Navbar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const MenuBar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkClasses = (path: string) =>
    `px-4 py-2 rounded-md text-white hover:bg-blue-500 transition ${
      isActive(path) ? "bg-blue-800" : ""
    }`;

  return (
    <nav className="w-full bg-blue-600 shadow-lg">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">Worklog</div>

        {/* Menu Links */}
        <div className="flex space-x-6">
          <Link to="/" className={linkClasses("/")}>
            Work Entries
          </Link>
          <Link to="/users" className={linkClasses("/users")}>
            Users
          </Link>
          <Link to="/casestoapprove" className={linkClasses("/casestoapprove")}>
            Cases To Approve
          </Link>
          <Link to="/approvals" className={linkClasses("/approvals")}>
            Approvals
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
