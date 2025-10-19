"use client";

import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ParticipantFormData) => void;
}

interface ParticipantFormData {
  sportGroup: string;
  sportName: string;
  sportGoal: string;
  skillLevel: string;
}

const ParticipantModal: React.FC<ParticipantModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ParticipantFormData>({
    sportGroup: "",
    sportName: "",
    sportGoal: "",
    skillLevel: "",
  });
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [error, setError] = useState("");

  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Professional"];

  const handleInputChange = (
    field: keyof ParticipantFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.sportGroup ||
      !formData.sportName ||
      !formData.sportGoal ||
      !formData.skillLevel
    ) {
      setError("Please fill in all required fields");
      return;
    }

    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      sportGroup: "",
      sportName: "",
      sportGoal: "",
      skillLevel: "",
    });
  };

  const handleClose = () => {
    onClose();
    setError("");
    setFormData({
      sportGroup: "",
      sportName: "",
      sportGoal: "",
      skillLevel: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Create Participant
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Sport Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sport Group <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.sportGroup}
              onChange={(e) => handleInputChange("sportGroup", e.target.value)}
              placeholder="Find sport group"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              required
            />
          </div>

          {/* Sport Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sport Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.sportName}
              onChange={(e) => handleInputChange("sportName", e.target.value)}
              placeholder="Find sport name"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              required
            />
          </div>

          {/* Sport Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sport Goal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.sportGoal}
              onChange={(e) => handleInputChange("sportGoal", e.target.value)}
              placeholder="Find sport goal"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              required
            />
          </div>

          {/* Skill Level Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select your Skill level <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-left flex items-center justify-between bg-white"
              >
                <span
                  className={
                    formData.skillLevel ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {formData.skillLevel || "Level"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showSkillDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {skillLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        handleInputChange("skillLevel", level);
                        setShowSkillDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParticipantModal;
