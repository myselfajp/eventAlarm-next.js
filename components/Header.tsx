"use client";

import React from "react";
import { Menu, Search, Calendar } from "lucide-react";

interface HeaderProps {
  onLeftSidebarToggle: () => void;
  onRightSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onLeftSidebarToggle,
  onRightSidebarToggle,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-start md:justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onLeftSidebarToggle}
          className="p-2 hover:bg-gray-100 rounded hidden md:block"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-semibold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500">You've got 24 New Sales</p>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden w-full mt-4 mb-4 md:mb-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 w-full"
          />
        </div>
      </div>

      {/* Desktop search bar and calendar button */}
      <div className="hidden md:flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>
        <button
          onClick={onRightSidebarToggle}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Header;
