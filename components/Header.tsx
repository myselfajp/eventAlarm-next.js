"use client";

import React, { useState } from "react";
import { Menu, Search, Calendar } from "lucide-react";
import UserSearch from "./UserSearch";
import UserProfileModal from "./UserProfileModal";
import { User } from "@/app/lib/types";
import { useMe } from "@/app/hooks/useAuth";

interface HeaderProps {
  onLeftSidebarToggle: () => void;
  onRightSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onLeftSidebarToggle,
  onRightSidebarToggle,
}) => {
  const { data: user } = useMe();
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleSearchClick = () => {
    setIsUserSearchOpen(true);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUserId(user._id);
    setShowProfile(true);
  };

  const handleBackToSearch = () => {
    setShowProfile(false);
    setSelectedUserId(null);
  };

  const handleCloseUserSearch = () => {
    setIsUserSearchOpen(false);
    setShowProfile(false);
    setSelectedUserId(null);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    setShowProfile(false);
    setSelectedUserId(null);
  };

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

        {/* Mobile search bar */}
        {user && (
          <div className="md:hidden w-full mt-4 mb-4 md:mb-0">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                onClick={handleSearchClick}
                readOnly
                className="pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 w-full cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Desktop search bar and calendar button */}
        <div className="hidden md:flex items-center gap-4">
          {user && (
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                onClick={handleSearchClick}
                readOnly
                className="pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer"
              />
            </div>
          )}
          <button
            onClick={onRightSidebarToggle}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* User Search Modal */}
      <UserSearch
        isOpen={isUserSearchOpen && !showProfile}
        onClose={handleCloseUserSearch}
        onUserSelect={handleUserSelect}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isUserSearchOpen && showProfile}
        onClose={handleCloseUserSearch}
        onBack={handleBackToSearch}
        userId={selectedUserId}
        context={undefined}
      />
    </>
  );
};

export default Header;
