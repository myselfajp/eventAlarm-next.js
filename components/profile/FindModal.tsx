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
  UserSearchFilters,
  UserSearchResponse,
  Facility,
  FacilitySearchResponse,
  Company,
  CompanySearchResponse,
  SportGroup,
  Sport,
  SportResponse,
} from "@/app/lib/types";
import UserProfileModal from "../UserProfileModal";
import FacilityDetailsModal from "./FacilityDetailsModal";
import CompanyDetailsModal from "./CompanyDetailsModal";

interface FindModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchType = "coach" | "participant" | "facility" | "company";

const FindModal: React.FC<FindModalProps> = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState<SearchType>("coach");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    UserType[] | Facility[] | Company[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 5,
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserContext, setSelectedUserContext] = useState<
    "coach" | "participant"
  >("coach");
  const [showProfile, setShowProfile] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );
  const [showFacilityDetails, setShowFacilityDetails] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [sportGroupFilter, setSportGroupFilter] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [sportGroups, setSportGroups] = useState<SportGroup[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [isLoadingSportGroups, setIsLoadingSportGroups] = useState(false);
  const [isLoadingSports, setIsLoadingSports] = useState(false);

  const fetchSportsAndGroups = async () => {
    setIsLoadingSports(true);
    setIsLoadingSportGroups(true);
    try {
      const response: SportResponse = await fetchJSON(EP.REFERENCE.sport, {
        method: "POST",
        body: {},
      });

      if (response?.success && response?.data) {
        // Extract unique sport groups from sports data
        const uniqueGroups = response.data.reduce(
          (groups: SportGroup[], sport) => {
            if (!groups.find((g) => g._id === sport.group)) {
              groups.push({
                _id: sport.group,
                name: sport.groupName,
              });
            }
            return groups;
          },
          []
        );

        setSportGroups(uniqueGroups);
        setSports(response.data);
      }
    } catch (err) {
      console.error("Error fetching sports and groups:", err);
    } finally {
      setIsLoadingSports(false);
      setIsLoadingSportGroups(false);
    }
  };

  const searchCoaches = async (filters: {
    search?: string;
    sport?: string;
    pageNumber?: number;
    perPage?: number;
    isVerified?: boolean;
  }) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(!!filters.search);

    try {
      const payload: any = {
        perPage: filters.perPage || 5,
        pageNumber: filters.pageNumber || 1,
      };

      if (filters.search && filters.search.trim().length >= 2) {
        payload.search = filters.search.trim();
      }

      if (filters.sport) {
        payload.sport = filters.sport;
      }

      if (filters.isVerified !== undefined) {
        payload.isVerified = filters.isVerified;
      }

      const response = await fetchJSON(EP.COACH.getCoachList, {
        method: "POST",
        body: payload,
      });

      if (response?.success && response?.data) {
        setSearchResults(response.data);
        setPagination({
          currentPage: response.pagination?.page || response.pageNumber || 1,
          totalPages:
            response.pagination?.totalPages || response.totalPages || 1,
          total: response.pagination?.total || response.total || 0,
          perPage: response.pagination?.perPage || response.perPage || 5,
        });
      } else {
        setError(response?.message || "Failed to search coaches");
        setSearchResults([]);
      }
    } catch (err) {
      setError("An error occurred while searching coaches");
      setSearchResults([]);
      console.error("Error searching coaches:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const searchParticipants = async (filters: {
    search?: string;
    sport?: string;
    pageNumber?: number;
    perPage?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(!!filters.search);

    try {
      const payload: any = {
        perPage: filters.perPage || 5,
        pageNumber: filters.pageNumber || 1,
      };

      if (filters.search && filters.search.trim().length >= 2) {
        payload.search = filters.search.trim();
      }

      if (filters.sport) {
        payload.sport = filters.sport;
      }

      const response = await fetchJSON(EP.PARTICIPANT_LIST.getParticipantList, {
        method: "POST",
        body: payload,
      });

      if (response?.success && response?.data) {
        setSearchResults(response.data);
        setPagination({
          currentPage: response.pagination?.page || response.pageNumber || 1,
          totalPages:
            response.pagination?.totalPages || response.totalPages || 1,
          total: response.pagination?.total || response.total || 0,
          perPage: response.pagination?.perPage || response.perPage || 5,
        });
      } else {
        setError(response?.message || "Failed to search participants");
        setSearchResults([]);
      }
    } catch (err) {
      setError("An error occurred while searching participants");
      setSearchResults([]);
      console.error("Error searching participants:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const searchFacilities = async (filters: {
    search?: string;
    pageNumber?: number;
    perPage?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const payload: any = {
        perPage: filters.perPage || 5,
        pageNumber: filters.pageNumber || 1,
      };

      if (filters.search && filters.search.trim().length >= 2) {
        payload.search = filters.search.trim();
      }

      const response: FacilitySearchResponse = await fetchJSON(
        EP.FACILITY.getFacility,
        {
          method: "POST",
          body: payload,
        }
      );

      if (response?.success && response?.data) {
        setSearchResults(response.data);
        setPagination({
          currentPage: response.pageNumber || 1,
          totalPages: response.totalPages || 1,
          total: response.total || 0,
          perPage: response.perPage || 5,
        });
      } else {
        setError(response?.message || "Failed to search facilities");
        setSearchResults([]);
      }
    } catch (err) {
      setError("An error occurred while searching facilities");
      setSearchResults([]);
      console.error("Error searching facilities:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const searchCompanies = async (filters: {
    search?: string;
    pageNumber?: number;
    perPage?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const payload: any = {
        perPage: filters.perPage || 5,
        pageNumber: filters.pageNumber || 1,
      };

      if (filters.search && filters.search.trim().length >= 2) {
        payload.search = filters.search.trim();
      }

      const response: CompanySearchResponse = await fetchJSON(
        EP.COMPANY.getCompany,
        {
          method: "POST",
          body: payload,
        }
      );

      if (response?.success && response?.data) {
        setSearchResults(response.data);
        setPagination({
          currentPage: response.pageNumber || 1,
          totalPages: response.totalPages || 1,
          total: response.total || 0,
          perPage: response.perPage || 5,
        });
      } else {
        setError(response?.message || "Failed to search companies");
        setSearchResults([]);
      }
    } catch (err) {
      setError("An error occurred while searching companies");
      setSearchResults([]);
      console.error("Error searching companies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2 && searchQuery.trim().length > 0) {
      setError("Please enter at least 2 characters to search");
      return;
    }

    setError(null);
    setHasSearched(searchQuery.trim().length >= 2);

    if (selectedType === "coach") {
      searchCoaches({
        search: searchQuery.trim().length >= 2 ? searchQuery : "",
        sport: sportFilter || undefined,
        pageNumber: 1,
        perPage: pagination.perPage,
        isVerified: true,
      });
    } else if (selectedType === "participant") {
      searchParticipants({
        search: searchQuery.trim().length >= 2 ? searchQuery : "",
        sport: sportFilter || undefined,
        pageNumber: 1,
        perPage: pagination.perPage,
      });
    } else if (selectedType === "facility") {
      searchFacilities({
        search: searchQuery.trim().length >= 2 ? searchQuery : "",
        pageNumber: 1,
        perPage: pagination.perPage,
      });
    } else if (selectedType === "company") {
      searchCompanies({
        search: searchQuery.trim().length >= 2 ? searchQuery : "",
        pageNumber: 1,
        perPage: pagination.perPage,
      });
    }
  };

  const handlePageChange = (page: number) => {
    if (selectedType === "coach") {
      searchCoaches({
        search: hasSearched ? searchQuery : "",
        sport: sportFilter || undefined,
        pageNumber: page,
        perPage: pagination.perPage,
        isVerified: true,
      });
    } else if (selectedType === "participant") {
      searchParticipants({
        search: hasSearched ? searchQuery : "",
        sport: sportFilter || undefined,
        pageNumber: page,
        perPage: pagination.perPage,
      });
    } else if (selectedType === "facility") {
      searchFacilities({
        search: hasSearched ? searchQuery : "",
        pageNumber: page,
        perPage: pagination.perPage,
      });
    } else if (selectedType === "company") {
      searchCompanies({
        search: hasSearched ? searchQuery : "",
        pageNumber: page,
        perPage: pagination.perPage,
      });
    }
  };

  // Load initial data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (selectedType === "coach") {
        fetchSportsAndGroups();
        // Load initial coaches - only verified ones
        searchCoaches({
          pageNumber: 1,
          perPage: pagination.perPage,
          isVerified: true,
        });
      } else if (selectedType === "participant") {
        fetchSportsAndGroups();
        // Load initial participants
        searchParticipants({
          pageNumber: 1,
          perPage: pagination.perPage,
        });
      } else if (selectedType === "facility") {
        searchFacilities({
          pageNumber: 1,
          perPage: pagination.perPage,
        });
      } else if (selectedType === "company") {
        searchCompanies({
          pageNumber: 1,
          perPage: pagination.perPage,
        });
      }
    }
  }, [isOpen, selectedType]);

  // Filter sports based on selected sport group
  useEffect(() => {
    if (sportGroupFilter) {
      setSportFilter("");
    } else {
      setSportFilter("");
    }
  }, [sportGroupFilter]);

  // Handle sport filter changes - make API call
  useEffect(() => {
    if (sportFilter) {
      if (selectedType === "coach") {
        searchCoaches({
          search: hasSearched ? searchQuery : "",
          sport: sportFilter,
          pageNumber: 1,
          perPage: pagination.perPage,
          isVerified: true,
        });
      } else if (selectedType === "participant") {
        searchParticipants({
          search: hasSearched ? searchQuery : "",
          sport: sportFilter,
          pageNumber: 1,
          perPage: pagination.perPage,
        });
      }
    }
  }, [sportFilter]);

  // Clear results when type changes to ensure proper filtering
  useEffect(() => {
    setSearchResults([]);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      total: 0,
      perPage: 5,
    });
    setError(null);
    setHasSearched(false);
    // Clear sport filters when changing type
    if (selectedType === "facility" || selectedType === "company") {
      setSportGroupFilter("");
      setSportFilter("");
    }
  }, [selectedType]);

  const handleUserSelect = (
    userId: string,
    context?: "coach" | "participant"
  ) => {
    setSelectedUserId(userId);
    setSelectedUserContext(context || "coach");
    setShowProfile(true);
  };

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility);
    setShowFacilityDetails(true);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setShowCompanyDetails(true);
  };

  const handleCloseUserProfile = () => {
    setShowProfile(false);
    setSelectedUserId(null);
    setSelectedUserContext("coach");
  };

  const handleCloseFacilityDetails = () => {
    setShowFacilityDetails(false);
    setSelectedFacility(null);
  };

  const handleCloseCompanyDetails = () => {
    setShowCompanyDetails(false);
    setSelectedCompany(null);
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
      perPage: 5,
    });
    setShowProfile(false);
    setSelectedUserId(null);
    setSelectedUserContext("coach");
    setHasSearched(false);
    setSportGroupFilter("");
    setSportFilter("");
    setShowFacilityDetails(false);
    setSelectedFacility(null);
    setShowCompanyDetails(false);
    setSelectedCompany(null);
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

          {/* Filters - Only show for coach and participant */}
          {(selectedType === "coach" || selectedType === "participant") && (
            <div className="mb-6">
              <div className="flex gap-3">
                <select
                  value={sportGroupFilter}
                  onChange={(e) => {
                    setSportGroupFilter(e.target.value);
                    setSportFilter("");
                  }}
                  disabled={isLoadingSportGroups}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 disabled:opacity-50 text-base"
                >
                  <option value="">
                    {isLoadingSportGroups ? "Loading..." : "All sport groups"}
                  </option>
                  {sportGroups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <select
                  value={sportFilter}
                  onChange={(e) => setSportFilter(e.target.value)}
                  disabled={!sportGroupFilter || isLoadingSports}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 disabled:opacity-50 text-base"
                >
                  <option value="">
                    {!sportGroupFilter
                      ? "Select sport group first"
                      : isLoadingSports
                      ? "Loading..."
                      : "Select sport"}
                  </option>
                  {sports
                    .filter(
                      (sport) =>
                        !sportGroupFilter || sport.group === sportGroupFilter
                    )
                    .map((sport) => (
                      <option key={sport._id} value={sport._id}>
                        {sport.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="flex-1 overflow-auto max-h-96">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : searchResults.length === 0 && hasSearched && !isLoading ? (
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
                  {hasSearched
                    ? `No ${selectedType}s found for your search`
                    : `Loading ${selectedType}s...`}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {searchResults.map((result, index) => {
                  if (selectedType === "coach") {
                    const coach = result as any;
                    return (
                      <div
                        key={coach._id}
                        onClick={() =>
                          handleUserSelect(coach.coach._id, "coach")
                        }
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-cyan-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {coach.firstName} {coach.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Coach •{" "}
                              {coach.coach?.membershipLevel || "Standard"}
                            </div>
                            <div className="flex gap-1 mt-1">
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                Coach
                              </span>
                              {coach.coach?.isVerified && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (selectedType === "participant") {
                    const participant = result as any;
                    return (
                      <div
                        key={participant._id}
                        onClick={() =>
                          handleUserSelect(participant._id, "participant")
                        }
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-cyan-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {participant.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {participant.mainSport?.name} • Level{" "}
                              {participant.skillLevel}
                            </div>
                            <div className="flex gap-1 mt-1">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Participant
                              </span>
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                                {participant.membershipLevel}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (selectedType === "facility") {
                    const facility = result as Facility;
                    return (
                      <div
                        key={facility._id}
                        onClick={() => handleFacilitySelect(facility)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            {facility.photo ? (
                              <img
                                src={
                                  typeof facility.photo === "string"
                                    ? facility.photo
                                    : `${EP.API_ASSETS_BASE}${
                                        (facility.photo as any).path
                                      }`
                                }
                                alt={facility.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <Home className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {facility.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {facility.address}
                            </div>
                            {facility.membershipLevel && (
                              <div className="flex gap-1 mt-1">
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                                  {facility.membershipLevel}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  } else if (selectedType === "company") {
                    const company = result as Company;
                    return (
                      <div
                        key={company._id}
                        onClick={() => handleCompanySelect(company)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            {company.photo ? (
                              <img
                                src={
                                  typeof company.photo === "string"
                                    ? company.photo
                                    : `${EP.API_ASSETS_BASE}${
                                        (company.photo as any).path
                                      }`
                                }
                                alt={company.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <Building className="w-5 h-5 text-orange-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {company.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {company.address}
                            </div>
                            {company.email && (
                              <div className="text-xs text-gray-400 mt-1">
                                {company.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.total > pagination.perPage && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {(pagination.currentPage - 1) * pagination.perPage + 1}{" "}
                to{" "}
                {Math.min(
                  pagination.currentPage * pagination.perPage,
                  pagination.total
                )}{" "}
                of {pagination.total} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
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

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfile}
        onClose={handleCloseUserProfile}
        userId={selectedUserId}
        context={selectedUserContext}
      />

      {/* Facility Details Modal */}
      <FacilityDetailsModal
        isOpen={showFacilityDetails}
        onClose={handleCloseFacilityDetails}
        facility={selectedFacility}
      />

      {/* Company Details Modal */}
      <CompanyDetailsModal
        isOpen={showCompanyDetails}
        onClose={handleCloseCompanyDetails}
        company={selectedCompany}
      />
    </div>
  );
};

export default FindModal;
