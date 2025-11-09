"use client";

import React from "react";
import { Menu, Calendar } from "lucide-react";

interface HeaderProps {
  onLeftSidebarToggle: () => void;
  onRightSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onLeftSidebarToggle,
  onRightSidebarToggle,
}) => {

  return (
    <>
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

        {/* Calendar button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onRightSidebarToggle}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

    </>
  );
};

export default Header;
