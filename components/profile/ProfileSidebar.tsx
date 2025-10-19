"use client";

import React, { useState } from "react";
import {
  Search,
  Activity,
  Users,
  Settings,
  User,
  Home,
  Building,
  LogOut,
} from "lucide-react";
import ParticipantModal from "./ParticipantModal";

interface ProfileSidebarProps {
  onLogout: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ onLogout }) => {
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);

  const handleCreateParticipant = (formData: any) => {
    console.log("Creating participant:", formData);
    // Here you can add logic to save the participant data
    // For now, we'll just log it
  };

  const handleOpenParticipantModal = () => {
    setIsParticipantModalOpen(true);
  };

  const handleCloseParticipantModal = () => {
    setIsParticipantModalOpen(false);
  };

  const handleCoachEdit = () => {
    console.log("Coach edit clicked");
    // Add coach edit logic here
  };

  const handleFacilityAdd = () => {
    console.log("Facility add clicked");
    // Add facility add logic here
  };

  const handleCompanyAdd = () => {
    console.log("Company add clicked");
    // Add company add logic here
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-cyan-500">Events Dashboard</h1>
        <button
          onClick={onLogout}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-green-500 rounded-2xl flex items-center justify-center mb-3">
          <div className="text-white text-4xl">😊</div>
        </div>
        <h2 className="font-semibold text-gray-800">bozer surati</h2>
        <p className="text-sm text-gray-500">Author</p>
      </div>

      <div className="flex justify-around mb-8 text-center">
        <div>
          <div className="font-bold text-gray-800">0</div>
          <div className="text-xs text-gray-500">Total Earnings</div>
        </div>
        <div>
          <div className="font-bold text-gray-800">0</div>
          <div className="text-xs text-gray-500">New Referrals</div>
        </div>
        <div>
          <div className="font-bold text-gray-800">0</div>
          <div className="text-xs text-gray-500">New Deals</div>
        </div>
      </div>

      <nav className="space-y-2">
        <a
          href="#"
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          <Search className="w-4 h-4 mr-3" />
          Find Coach
        </a>
        <a
          href="#"
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          <Activity className="w-4 h-4 mr-3" />
          Activity
        </a>
        <a
          href="#"
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          <Users className="w-4 h-4 mr-3" />
          Followers
        </a>
        <a
          href="#"
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </a>
      </nav>

      <div className="mt-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-4 text-white">
        <h3 className="font-semibold mb-4">Profiles</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <User className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xs">Participant</div>
            <button
              onClick={handleOpenParticipantModal}
              className="bg-cyan-500 text-white text-xs px-3 py-1 rounded mt-2 w-full hover:bg-cyan-600 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <Users className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xs">Coach</div>
            <button
              onClick={handleCoachEdit}
              className="bg-cyan-500 text-white text-xs px-3 py-1 rounded mt-2 w-full hover:bg-cyan-600 transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <Home className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xs">Facility</div>
            <button
              onClick={handleFacilityAdd}
              className="bg-cyan-500 text-white text-xs px-3 py-1 rounded mt-2 w-full hover:bg-cyan-600 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <Building className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xs">Company</div>
            <button
              onClick={handleCompanyAdd}
              className="bg-cyan-500 text-white text-xs px-3 py-1 rounded mt-2 w-full hover:bg-cyan-600 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Participant Modal */}
      <ParticipantModal
        isOpen={isParticipantModalOpen}
        onClose={handleCloseParticipantModal}
        onSubmit={handleCreateParticipant}
      />
    </div>
  );
};

export default ProfileSidebar;
