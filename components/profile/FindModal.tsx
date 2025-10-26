"use client";

import React, { useState } from "react";
import { X, Search, User, Users, Home, Building } from "lucide-react";

interface FindModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchType = "coach" | "participant" | "facility" | "company";

const FindModal: React.FC<FindModalProps> = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState<SearchType>("coach");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Searching for ${selectedType}: ${searchQuery}`);
    setSearchResults([]);
  };

  const handleClose = () => {
    onClose();
    setSearchQuery("");
    setSearchResults([]);
    setSelectedType("coach");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Find
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6">
          {/* Search Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What are you looking for?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setSelectedType("coach")}
                className={`flex flex-col items-center p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  selectedType === "coach"
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Users
                  className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 ${
                    selectedType === "coach" ? "text-cyan-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    selectedType === "coach" ? "text-cyan-700" : "text-gray-600"
                  }`}
                >
                  Coach
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType("participant")}
                className={`flex flex-col items-center p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  selectedType === "participant"
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <User
                  className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 ${
                    selectedType === "participant"
                      ? "text-cyan-500"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    selectedType === "participant"
                      ? "text-cyan-700"
                      : "text-gray-600"
                  }`}
                >
                  Participant
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType("facility")}
                className={`flex flex-col items-center p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  selectedType === "facility"
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Home
                  className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 ${
                    selectedType === "facility"
                      ? "text-cyan-500"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    selectedType === "facility"
                      ? "text-cyan-700"
                      : "text-gray-600"
                  }`}
                >
                  Facility
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType("company")}
                className={`flex flex-col items-center p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  selectedType === "company"
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Building
                  className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 ${
                    selectedType === "company"
                      ? "text-cyan-500"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    selectedType === "company"
                      ? "text-cyan-700"
                      : "text-gray-600"
                  }`}
                >
                  Company
                </span>
              </button>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search{" "}
              {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Enter ${selectedType} name...`}
                className="w-full px-4 py-3 pr-12 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Search Results */}
          <div>
            {searchResults.length === 0 && searchQuery === "" ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">Enter a search term to find results</p>
              </div>
            ) : searchResults.length === 0 && searchQuery !== "" ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">No results found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h3 className="font-semibold text-gray-800">
                      {result.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {result.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindModal;
