"use client";

import React, { useState } from "react";
import { X, Plus, Upload, FileImage, Trash2, Save } from "lucide-react";

interface CoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CoachFormData) => void;
}

interface Certificate {
  id: string;
  name: string;
  file: File | null;
  preview: string | null;
}

interface Branch {
  id: string;
  sportGroup: string;
  sportName: string;
  level: string;
  certificates: Certificate[];
  isMinimized: boolean;
}

interface CoachFormData {
  branches: Branch[];
}

const CoachModal: React.FC<CoachModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CoachFormData>({
    branches: [],
  });
  const [error, setError] = useState("");

  const addBranch = () => {
    const newBranch: Branch = {
      id: Date.now().toString(),
      sportGroup: "",
      sportName: "",
      level: "",
      certificates: [],
      isMinimized: false,
    };
    setFormData((prev) => ({
      ...prev,
      branches: [...prev.branches, newBranch],
    }));
  };

  const removeBranch = (branchId: string) => {
    setFormData((prev) => ({
      ...prev,
      branches: prev.branches.filter((branch) => branch.id !== branchId),
    }));
  };

  const updateBranchField = (
    branchId: string,
    field: keyof Omit<Branch, "id" | "certificates">,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      branches: prev.branches.map((branch) =>
        branch.id === branchId ? { ...branch, [field]: value } : branch
      ),
    }));
    setError("");
  };

  const toggleBranchMinimize = (branchId: string) => {
    setFormData((prev) => ({
      ...prev,
      branches: prev.branches.map((branch) =>
        branch.id === branchId
          ? { ...branch, isMinimized: !branch.isMinimized }
          : branch
      ),
    }));
  };

  const initializeCertificate = (branchId: string) => {
    const branch = formData.branches.find((b) => b.id === branchId);
    if (!branch || branch.certificates.length > 0) {
      return; // Don't add if already exists
    }

    const newCertificate: Certificate = {
      id: Date.now().toString(),
      name: "",
      file: null,
      preview: null,
    };
    setFormData((prev) => ({
      ...prev,
      branches: prev.branches.map((branch) =>
        branch.id === branchId
          ? {
              ...branch,
              certificates: [newCertificate],
            }
          : branch
      ),
    }));
  };

  const removeCertificate = (branchId: string) => {
    setFormData((prev) => ({
      ...prev,
      branches: prev.branches.map((branch) =>
        branch.id === branchId
          ? {
              ...branch,
              certificates: [],
            }
          : branch
      ),
    }));
  };

  const isBranchComplete = (branch: Branch) => {
    return (
      branch.sportGroup &&
      branch.sportName &&
      branch.level &&
      branch.certificates.length > 0 &&
      branch.certificates[0].file
    );
  };

  const handleFileUpload = (branchId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        branches: prev.branches.map((branch) =>
          branch.id === branchId
            ? {
                ...branch,
                certificates: branch.certificates.map((cert) => ({
                  ...cert,
                  file,
                  preview,
                })),
              }
            : branch
        ),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.branches.length === 0) {
      setError("Please add at least one branch");
      return;
    }

    // Validate each branch
    for (const branch of formData.branches) {
      if (!branch.sportGroup || !branch.sportName || !branch.level) {
        setError("Please fill in all required fields for each branch");
        return;
      }

      if (branch.certificates.length === 0) {
        setError("Please add a certificate for each branch");
        return;
      }

      // Validate certificate in each branch
      const cert = branch.certificates[0];
      if (!cert.file) {
        setError("Please upload a certificate file for each branch");
        return;
      }
    }

    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      branches: [],
    });
  };

  const handleClose = () => {
    onClose();
    setError("");
    setFormData({
      branches: [],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Create/Edit Coach
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">
                Coach Branches
              </h3>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto">
              {formData.branches.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileImage className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No branches added yet</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">
                    Add your first branch to get started
                  </p>
                </div>
              ) : (
                formData.branches.map((branch, branchIndex) => (
                  <div
                    key={branch.id}
                    className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                  >
                    {/* Branch Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-medium text-gray-800">
                          Branch {branchIndex + 1}
                        </h4>
                        {isBranchComplete(branch) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Complete
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => removeBranch(branch.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {!branch.isMinimized && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Column - Form Fields */}
                        <div className="space-y-4">
                          {/* Sport Group */}
                          <div>
                            <input
                              type="text"
                              value={branch.sportGroup}
                              onChange={(e) =>
                                updateBranchField(
                                  branch.id,
                                  "sportGroup",
                                  e.target.value
                                )
                              }
                              placeholder="Enter sport group"
                              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                              required
                            />
                          </div>

                          {/* Sport Name */}
                          <div>
                            <input
                              type="text"
                              value={branch.sportName}
                              onChange={(e) =>
                                updateBranchField(
                                  branch.id,
                                  "sportName",
                                  e.target.value
                                )
                              }
                              placeholder="Enter sport name"
                              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                              required
                            />
                          </div>

                          {/* Level Input */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Level <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={branch.level || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value === "" ||
                                  (parseInt(value) >= 1 &&
                                    parseInt(value) <= 10)
                                ) {
                                  updateBranchField(branch.id, "level", value);
                                }
                              }}
                              placeholder="1-10"
                              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Enter a number between 1 and 10
                            </p>
                          </div>
                        </div>

                        {/* Right Column - Certificate & Save */}
                        <div className="space-y-4">
                          <div className="flex flex-col items-center space-y-4">
                            {/* File Upload Area */}
                            <div className="w-full max-w-xs">
                              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-cyan-400 transition-colors cursor-pointer">
                                {branch.certificates[0]?.preview ? (
                                  <div className="flex flex-col items-center space-y-3">
                                    <img
                                      src={branch.certificates[0].preview}
                                      alt="Certificate preview"
                                      className="h-24 w-32 object-cover rounded-lg"
                                    />
                                    <div className="text-center">
                                      <p className="text-sm text-gray-600 font-medium truncate">
                                        {branch.certificates[0].file?.name}
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeCertificate(branch.id)
                                        }
                                        className="mt-1 text-red-500 hover:text-red-700 transition-colors text-xs"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <Upload className="w-10 h-10 mx-auto text-gray-400" />
                                    <div>
                                      <p className="text-sm text-gray-600 font-medium">
                                        Click to upload certificate
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        PNG, JPG, JPEG up to 10MB
                                      </p>
                                    </div>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  accept="image/png,image/jpg,image/jpeg"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      // Initialize certificate if it doesn't exist
                                      if (branch.certificates.length === 0) {
                                        initializeCertificate(branch.id);
                                      }
                                      // Wait a bit for state to update, then upload
                                      setTimeout(() => {
                                        handleFileUpload(branch.id, file);
                                      }, 100);
                                    }
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* Save Button - Bottom Right */}
                            {isBranchComplete(branch) && (
                              <button
                                type="button"
                                onClick={() => toggleBranchMinimize(branch.id)}
                                className="flex items-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Minimized View */}
                    {branch.isMinimized && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                Sport Group:
                              </span>
                              <span className="ml-2 text-sm text-gray-800">
                                {branch.sportGroup}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                Sport Name:
                              </span>
                              <span className="ml-2 text-sm text-gray-800">
                                {branch.sportName}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                Level:
                              </span>
                              <span className="ml-2 text-sm text-gray-800">
                                {branch.level}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {branch.certificates[0]?.preview && (
                              <img
                                src={branch.certificates[0].preview}
                                alt="Certificate preview"
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Add Branch Button - Always at the bottom */}
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={addBranch}
                  className="flex items-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Branch
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoachModal;
