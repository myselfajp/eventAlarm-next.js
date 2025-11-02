"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { EP } from "@/app/lib/endpoints";
import { fetchJSON } from "@/app/lib/api";
import { useMe } from "@/app/hooks/useAuth";

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ParticipantFormData) => void;
}

interface ParticipantFormData {
  sportGroup: string;
  mainSport: string;
  skillLevel: number;
  sportGoal: string;
}

interface SportGroup {
  _id: string;
  name: string;
}

interface Sport {
  _id: string;
  name: string;
  group: string;
  groupName: string;
}

interface SportGoal {
  _id: string;
  name: string;
}

const ParticipantModal: React.FC<ParticipantModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { data: user, isLoading: userLoading } = useMe();
  const participantId = user?.participant;

  const [formData, setFormData] = useState<ParticipantFormData>({
    sportGroup: "",
    mainSport: "",
    skillLevel: 5,
    sportGoal: "",
  });

  const [sportGroups, setSportGroups] = useState<SportGroup[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [sportGoals, setSportGoals] = useState<SportGoal[]>([]);

  const [showSportGroupDropdown, setShowSportGroupDropdown] = useState(false);
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const [showGoalDropdown, setShowGoalDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const skillLevels = [
    { value: 1, label: "Beginner (1-2)", range: [1, 2] },
    { value: 3, label: "Beginner+ (3-4)", range: [3, 4] },
    { value: 5, label: "Intermediate (5-6)", range: [5, 6] },
    { value: 7, label: "Advanced (7-8)", range: [7, 8] },
    { value: 9, label: "Professional (9-10)", range: [9, 10] },
  ];

  useEffect(() => {
    if (isOpen && !userLoading) {
      loadData();
    }
  }, [isOpen, participantId, userLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setShowSportGroupDropdown(false);
        setShowSportDropdown(false);
        setShowGoalDropdown(false);
      }
    };

    if (showSportGroupDropdown || showSportDropdown || showGoalDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSportGroupDropdown, showSportDropdown, showGoalDropdown]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (participantId) {
        setIsEditMode(true);
      } else {
        resetForm();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSportGroups = async () => {
    setLoading(true);
    try {
      const res = await fetchJSON(EP.REFERENCE.sportGroup, {
        method: "POST",
        body: { perPage: 20, pageNumber: 1 },
      });

      if (res.success && res.data) {
        setSportGroups(res.data);
      }
    } catch (err) {
      console.error("Error fetching sport groups:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSportsInGroup = async (groupId: string) => {
    setLoading(true);
    try {
      const res = await fetchJSON(EP.REFERENCE.sport, {
        method: "POST",
        body: {
          perPage: 50,
          pageNumber: 1,
          groupId: groupId,
        },
      });

      if (res.success && res.data) {
        setSports(res.data);
      }
    } catch (err) {
      console.error("Error fetching sports for group:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSportGoals = async () => {
    setLoading(true);
    try {
      const res = await fetchJSON(EP.REFERENCE.sportGoal, {
        method: "POST",
        body: { perPage: 20, pageNumber: 1 },
      });

      if (res.success && res.data) {
        setSportGoals(res.data);
      }
    } catch (err) {
      console.error("Error fetching sport goals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSportGroupDropdown && sportGroups.length === 0) {
      fetchSportGroups();
    }
  }, [showSportGroupDropdown]);

  useEffect(() => {
    if (formData.sportGroup) {
      fetchSportsInGroup(formData.sportGroup);
    } else {
      setSports([]);
    }
  }, [formData.sportGroup]);

  useEffect(() => {
    if (showGoalDropdown && sportGoals.length === 0) {
      fetchSportGoals();
    }
  }, [showGoalDropdown]);

  const handleInputChange = (
    field: keyof ParticipantFormData,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      if (field === "sportGroup") {
        updated.mainSport = "";
      }

      return updated;
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.sportGroup ||
      !formData.mainSport ||
      !formData.sportGoal ||
      !formData.skillLevel
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isEditMode
        ? EP.PARTICIPANT.editProfile
        : EP.PARTICIPANT.createProfile;

      const payload = {
        mainSport: formData.mainSport,
        skillLevel: formData.skillLevel,
        sportGoal: formData.sportGoal,
      };

      const res = await fetchJSON(endpoint, {
        method: "POST",
        body: payload,
      });

      if (res.success) {
        onSubmit(formData);
        handleClose();
      } else {
        setError(res.message || "Failed to save participant profile");
      }
    } catch (err) {
      console.error("Error saving participant profile:", err);
      setError("Failed to save participant profile");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      sportGroup: "",
      mainSport: "",
      skillLevel: 5,
      sportGoal: "",
    });
    setIsEditMode(false);
  };

  const handleClose = () => {
    onClose();
    setError("");
    resetForm();
  };

  const getSelectedSportGroupName = () => {
    const group = sportGroups.find((g) => g._id === formData.sportGroup);
    return group ? group.name : "Select Sport Group";
  };

  const getSelectedSportName = () => {
    const sport = sports.find((s) => s._id === formData.mainSport);
    return sport ? sport.name : "Select Sport";
  };

  const getSelectedGoalName = () => {
    const goal = sportGoals.find((g) => g._id === formData.sportGoal);
    return goal ? goal.name : "Select Goal";
  };

  const getSkillLevelLabel = () => {
    const level = skillLevels.find(
      (l) =>
        formData.skillLevel >= l.range[0] && formData.skillLevel <= l.range[1]
    );
    return level ? level.label : `Level ${formData.skillLevel}`;
  };

  if (!isOpen) return null;

  if (userLoading || !user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode
              ? "Edit Participant Profile"
              : "Create Participant Profile"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Sport Group Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sport Group <span className="text-red-500">*</span>
            </label>
            <div className="relative dropdown-container">
              <button
                type="button"
                onClick={() =>
                  setShowSportGroupDropdown(!showSportGroupDropdown)
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-left flex items-center justify-between bg-white"
                disabled={loading}
              >
                <span
                  className={
                    formData.sportGroup ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {getSelectedSportGroupName()}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showSportGroupDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="px-3 py-4 text-sm text-gray-500 text-center">
                      Loading...
                    </div>
                  ) : sportGroups.length > 0 ? (
                    sportGroups.map((group) => (
                      <button
                        key={group._id}
                        type="button"
                        onClick={() => {
                          handleInputChange("sportGroup", group._id);
                          setShowSportGroupDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {group.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-sm text-gray-500 text-center">
                      No sport groups available
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Sport Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Sport <span className="text-red-500">*</span>
            </label>
            <div className="relative dropdown-container">
              <button
                type="button"
                onClick={() => {
                  if (formData.sportGroup) {
                    setShowSportDropdown(!showSportDropdown);
                  }
                }}
                className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-left flex items-center justify-between bg-white ${
                  !formData.sportGroup ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading || !formData.sportGroup}
              >
                <span
                  className={
                    formData.mainSport ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {getSelectedSportName()}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showSportDropdown && formData.sportGroup && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="px-3 py-4 text-sm text-gray-500 text-center">
                      Loading...
                    </div>
                  ) : sports.length > 0 ? (
                    sports.map((sport) => (
                      <button
                        key={sport._id}
                        type="button"
                        onClick={() => {
                          handleInputChange("mainSport", sport._id);
                          setShowSportDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {sport.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-sm text-gray-500 text-center">
                      No sports in this group
                    </div>
                  )}
                </div>
              )}
            </div>
            {!formData.sportGroup && (
              <p className="text-xs text-gray-500 mt-1">
                Please select a sport group first
              </p>
            )}
          </div>

          {/* Skill Level Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill Level <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                value={formData.skillLevel}
                onChange={(e) =>
                  handleInputChange("skillLevel", Number(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>Beginner (1)</span>
                <span className="font-medium text-cyan-600">
                  {getSkillLevelLabel()}
                </span>
                <span>Pro (10)</span>
              </div>
            </div>
          </div>

          {/* Sport Goal Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sport Goal <span className="text-red-500">*</span>
            </label>
            <div className="relative dropdown-container">
              <button
                type="button"
                onClick={() => setShowGoalDropdown(!showGoalDropdown)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-left flex items-center justify-between bg-white"
                disabled={loading}
              >
                <span
                  className={
                    formData.sportGoal ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {getSelectedGoalName()}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showGoalDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="px-3 py-4 text-sm text-gray-500 text-center">
                      Loading...
                    </div>
                  ) : sportGoals.length > 0 ? (
                    sportGoals.map((goal) => (
                      <button
                        key={goal._id}
                        type="button"
                        onClick={() => {
                          handleInputChange("sportGoal", goal._id);
                          setShowGoalDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {goal.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-sm text-gray-500 text-center">
                      No goals available
                    </div>
                  )}
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
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParticipantModal;
