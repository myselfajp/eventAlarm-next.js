"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  User,
  Users,
  Home,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetchJSON } from "@/app/lib/api";
import { EP } from "@/app/lib/endpoints";
import {
  User as UserType,
  UserSearchResponse,
  CoachListResponse,
  FacilityResponse,
} from "@/app/lib/types";
import UserProfileModal from "../UserProfileModal";

interface FindModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchType = "coach" | "participant" | "facility" | "company";

interface SearchResult {
  _id: string;
  name: string;
  description?: string;
  type: SearchType;
  photo?: string;
  email?: string;
  phone?: string;
  address?: string;
  sport?: string;
  user?: UserType;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
}

const FindModal: React.FC<FindModalProps> = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState<SearchType>("coach");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 10,
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const searchUsers = async (
    type: SearchType,
    query: string,
    page: number = 1
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      let response: any;
      const payload: any = {
        perPage: pagination.perPage,
        pageNumber: page,
      };

      if (query && query.trim().length >= 2) {
        payload.search = query.trim();
      }

      switch (type) {
        case "coach":
        case "participant":
        case "company":
          // For coaches, participants and companies, we search users and filter by role
          response = await fetchJSON(EP.AUTH.getUsers, {
            method: "POST",
            body: payload,
          });

          if (response?.success && response?.data) {
            let filteredUsers: UserType[];

            if (type === "coach") {
              filteredUsers = response.data.filter(
                (user: UserType) => user.coach
              );
            } else if (type === "participant") {
              filteredUsers = response.data.filter(
                (user: UserType) => user.participant
              );
            } else if (type === "company") {
              filteredUsers = response.data.filter(
                (user: UserType) => user.company && user.company.length > 0
              );
            } else {
              filteredUsers = response.data;
            }

            const results: SearchResult[] = filteredUsers.map(
              (user: UserType) => {
                let description = "";
                if (type === "coach" && user.coach) {
                  description = "Coach - Sports Specialist";
                } else if (type === "participant" && user.participant) {
                  description = `Participant - ${
                    user.participant.mainSport || "Sports"
                  }`;
                } else if (
                  type === "company" &&
                  user.company &&
                  user.company.length > 0
                ) {
                  description = `Company Owner - ${user.company.length} company(ies)`;
                }

                return {
                  _id: user._id,
                  name: `${user.firstName} ${user.lastName}`,
                  description,
                  type,
                  photo: user.photo,
                  email: user.email,
                  phone: user.phone,
                  user,
                };
              }
            );

            setSearchResults(results);
            setPagination({
              currentPage: response.pageNumber || 1,
              totalPages: response.totalPages || 1,
              total: response.total || 0,
              perPage: response.perPage || 10,
            });
          }
          break;

        case "facility":
          response = await fetchJSON(EP.FACILITY.getFacility, {
            method: "POST",
            body: payload,
          });

          if (response?.success && response?.data) {
            const facilities: SearchResult[] = response.data.map(
              (facility: any) => ({
                _id: facility._id,
                name: facility.name,
                description: `Facility - ${facility.mainSport || "Sports"}`,
                type: "facility",
                photo: facility.photo,
                email: facility.email,
                phone: facility.phone,
                address: facility.address,
              })
            );

            setSearchResults(facilities);
            setPagination({
              currentPage: response.pageNumber || 1,
              totalPages: response.totalPages || 1,
              total: response.total || 0,
              perPage: response.perPage || 10,
            });
          }
          break;

        default:
          setSearchResults([]);
      }

      if (!response?.success) {
        setError(response?.message || `Failed to search ${type}s`);
        setSearchResults([]);
      }
    } catch (err) {
      setError(`An error occurred while searching ${type}s`);
      setSearchResults([]);
      console.error(`Error searching ${type}s:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      isOpen &&
      selectedType &&
      (searchQuery.trim().length >= 2 || searchQuery === "")
    ) {
      const timeoutId = setTimeout(
        () => {
          searchUsers(selectedType, searchQuery, 1);
        },
        searchQuery ? 300 : 0
      ); // No delay for initial load

      return () => clearTimeout(timeoutId);
    } else if (!searchQuery.trim()) {
      setSearchResults([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        perPage: 10,
      });
    }
  }, [selectedType, searchQuery, isOpen]);

  const handleTypeChange = (type: SearchType) => {
    setSelectedType(type);
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  };

  const handlePageChange = (page: number) => {
    searchUsers(selectedType, searchQuery, page);
  };

  const handleUserSelect = (user: UserType) => {
    setSelectedUserId(user._id);
    setShowUserProfile(true);
  };

  const handleBackToSearch = () => {
    setShowUserProfile(false);
    setSelectedUserId(null);
  };

  const handleCloseProfileModal = () => {
    setShowUserProfile(false);
    setSelectedUserId(null);
  };

  const handleClose = () => {
    onClose();
    setSearchQuery("");
    setSearchResults([]);
    setSelectedType("coach");
    setError(null);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      total: 0,
      perPage: 10,
    });
    setSelectedUserId(null);
    setShowUserProfile(false);
  };

  if (!isOpen) return null;

  return (
    <>
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
                  onClick={() => handleTypeChange("coach")}
                  className={`flex flex-col items-center p-3 sm:p-4 rounded-lg border-2 transition-all ${
                    selectedType === "coach"
                      ? "border-cyan-500 bg-cyan-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Users
                    className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 ${
                      selectedType === "coach"
                        ? "text-cyan-500"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      selectedType === "coach"
                        ? "text-cyan-700"
                        : "text-gray-600"
                    }`}
                  >
                    Coach
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange("participant")}
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
                  onClick={() => handleTypeChange("facility")}
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
                  onClick={() => handleTypeChange("company")}
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
            <form onSubmit={(e) => e.preventDefault()} className="mb-6">
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
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                  onClick={() => searchUsers(selectedType, searchQuery, 1)}
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : searchResults.length === 0 &&
                searchQuery.trim().length >= 2 ? (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">
                    No {selectedType}s found for "{searchQuery}"
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">
                    {searchQuery.trim().length < 2
                      ? `Enter at least 2 characters to search for ${selectedType}s`
                      : `No ${selectedType}s found`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <div
                      key={result._id}
                      onClick={() =>
                        result.user && handleUserSelect(result.user)
                      }
                      className={`p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow ${
                        result.user ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                          {result.photo ? (
                            <img
                              src={`${EP.API_ASSETS_BASE}${result.photo}`}
                              alt={result.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : result.type === "coach" ? (
                            <Users className="w-5 h-5 text-cyan-600" />
                          ) : result.type === "participant" ? (
                            <User className="w-5 h-5 text-cyan-600" />
                          ) : result.type === "facility" ? (
                            <Home className="w-5 h-5 text-cyan-600" />
                          ) : (
                            <Building className="w-5 h-5 text-cyan-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {result.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {result.description}
                          </p>
                          {result.email && (
                            <p className="text-xs text-gray-500 mt-1">
                              {result.email}
                            </p>
                          )}
                          {result.address && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {result.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {searchResults.length > 0 && pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  {(pagination.currentPage - 1) * pagination.perPage + 1} to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.perPage,
                    pagination.total
                  )}{" "}
                  of {pagination.total} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || isLoading}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={
                      pagination.currentPage === pagination.totalPages ||
                      isLoading
                    }
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
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

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isOpen && showUserProfile}
        onClose={handleCloseProfileModal}
        onBack={handleBackToSearch}
        userId={selectedUserId}
        context={selectedType === "facility" ? undefined : selectedType}
      />
    </>
  );
};

export default FindModal;
