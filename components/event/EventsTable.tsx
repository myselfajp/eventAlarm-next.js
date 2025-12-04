"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import ViewEventModal from "./ViewEventModal";
import CoachDetailModal from "../CoachDetailModal";
import { EP } from "@/app/lib/endpoints";
import { fetchJSON } from "@/app/lib/api";

interface Event {
  _id: string;
  name: string;
  photo?: {
    path?: string;
  };
  sportGroup?: {
    _id: string;
    name: string;
  };
  sport?: {
    _id: string;
    name: string;
  };
  eventStyle?: {
    name: string;
    color: string;
  };
  owner?: {
    _id: string;
    firstName: string;
    lastName: string;
    coach: string;
  };
  backupCoach?: {
    _id: string;
    firstName: string;
    lastName: string;
    coach: string;
  };
  backuoCoach?: { // Handling potential typo from backend
    _id: string;
    firstName: string;
    lastName: string;
    coach: string;
  };
  startTime: string;
  endTime: string;
  createdAt: string;
  [key: string]: any;
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

interface EventsTableProps {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    perPage: number;
  };
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sortBy: string, sortType: "asc" | "desc") => void;
  onFilterChange: (sportGroup?: string, sport?: string) => void;
  onPrivateToggle: (isPrivate: boolean) => void;
  isPrivateFilter: boolean;
}

const EventsTable: React.FC<EventsTableProps> = ({
  events,
  isLoading,
  error,
  activeTab,
  setActiveTab,
  pagination,
  onPageChange,
  onSearchChange,
  onSortChange,
  onFilterChange,
  onPrivateToggle,
  isPrivateFilter,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);

  const [sportGroups, setSportGroups] = useState<SportGroup[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSportGroup, setSelectedSportGroup] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [showSportGroupDropdown, setShowSportGroupDropdown] = useState(false);
  const [showSportDropdown, setShowSportDropdown] = useState(false);

  const [sortState, setSortState] = useState<{
    field: string | null;
    direction: "asc" | "desc";
  }>({
    field: null,
    direction: "asc",
  });

  const sortableFields: Record<string, string> = {
    name: "name",
    sportGroup: "sportGroup.name",
    sport: "sport.name",
    startTime: "startTime",
    endTime: "endTime",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setShowSportGroupDropdown(false);
        setShowSportDropdown(false);
      }
    };

    if (showSportGroupDropdown || showSportDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSportGroupDropdown, showSportDropdown]);

  useEffect(() => {
    if (showSportGroupDropdown && sportGroups.length === 0) {
      fetchSportGroups();
    }
  }, [showSportGroupDropdown]);

  useEffect(() => {
    if (selectedSportGroup) {
      fetchSportsInGroup(selectedSportGroup);
      setSelectedSport("");
      onFilterChange(selectedSportGroup, undefined);
    } else {
      setSports([]);
      setSelectedSport("");
      onFilterChange(undefined, undefined);
    }
  }, [selectedSportGroup]);

  useEffect(() => {
    if (selectedSport) {
      onFilterChange(selectedSportGroup, selectedSport);
    }
  }, [selectedSport]);

  const fetchSportGroups = async () => {
    try {
      const res = await fetchJSON(EP.REFERENCE.sportGroup, {
        method: "POST",
        body: { perPage: 50, pageNumber: 1 },
      });

      if (res.success && res.data) {
        setSportGroups(res.data);
      }
    } catch (err) {
      console.error("Error fetching sport groups:", err);
    }
  };

  const fetchSportsInGroup = async (groupId: string) => {
    try {
      const res = await fetchJSON(EP.REFERENCE.sport, {
        method: "POST",
        body: {
          perPage: 100,
          pageNumber: 1,
          groupId: groupId,
        },
      });

      if (res.success && res.data) {
        setSports(res.data);
      }
    } catch (err) {
      console.error("Error fetching sports for group:", err);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCoachClick = (e: React.MouseEvent, coachId: string) => {
    e.stopPropagation(); // Prevent row click
    setSelectedCoachId(coachId);
    setIsCoachModalOpen(true);
  };

  const handleCloseCoachModal = () => {
    setIsCoachModalOpen(false);
    setSelectedCoachId(null);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      onPageChange(page);
    }
  };

  const handleSearchInput = (value: string) => {
    setSearchValue(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      onSearchChange(value);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleSort = (field: string) => {
    const apiField = sortableFields[field];
    if (!apiField) return;

    let newDirection: "asc" | "desc" = "asc";

    if (sortState.field === field) {
      newDirection = sortState.direction === "asc" ? "desc" : "asc";
    }

    setSortState({ field, direction: newDirection });
    onSortChange(apiField, newDirection);
  };

  const getSortIcon = (field: string) => {
    if (sortState.field !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    }
    return sortState.direction === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1" />
    );
  };

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }).format(date);
  };

  const getImageUrl = (photo?: { path?: string }) => {
    if (photo?.path) {
      return `${EP.API_ASSETS_BASE}/${photo.path}`.replace(/\\/g, "/");
    }
    return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop";
  };

  const getPageNumbers = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (showEllipsisStart) {
        pages.push(1);
        pages.push("...");
      } else {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
      }

      const start = showEllipsisStart ? currentPage - 1 : 4;
      const end = showEllipsisEnd ? currentPage + 1 : totalPages - 2;

      for (let i = start; i <= end; i++) {
        if (i > 0 && i <= totalPages && !pages.includes(i)) {
          pages.push(i);
        }
      }

      if (showEllipsisEnd) {
        pages.push("...");
        pages.push(totalPages);
      } else {
        for (let i = totalPages - 2; i <= totalPages; i++) {
          if (!pages.includes(i)) {
            pages.push(i);
          }
        }
      }
    }

    return pages;
  };

  const startIndex = (pagination.currentPage - 1) * pagination.perPage;
  const endIndex = Math.min(startIndex + pagination.perPage, pagination.total);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-lg border border-gray-100 dark:border-slate-700 p-6 transition-colors">
      {/* Tab Header */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-slate-700 pb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-2 font-semibold transition-colors ${
              activeTab === "all"
                ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-600 dark:border-cyan-400"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            }`}
          >
            All Events ({pagination.total})
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchValue}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg 
                         bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100
                         placeholder:text-gray-400 dark:placeholder:text-slate-500
                         focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 dark:focus:border-cyan-400
                         transition-colors"
            />
          </div>

          {/* Sport Group Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={() => setShowSportGroupDropdown(!showSportGroupDropdown)}
              className="w-full sm:w-48 px-4 py-2 text-sm text-left 
                         bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg 
                         text-gray-700 dark:text-slate-300
                         hover:bg-gray-50 dark:hover:bg-slate-800 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 dark:focus:border-cyan-400 
                         flex items-center justify-between transition-colors"
            >
              <span className="truncate">
                {selectedSportGroup
                  ? sportGroups.find((g) => g._id === selectedSportGroup)?.name
                  : "Sport Group"}
              </span>
              <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
            </button>
            {showSportGroupDropdown && (
              <div className="absolute z-10 w-full sm:w-48 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedSportGroup("");
                    setShowSportGroupDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 transition-colors"
                >
                  All Groups
                </button>
                {sportGroups.map((group) => (
                  <button
                    key={group._id}
                    onClick={() => {
                      setSelectedSportGroup(group._id);
                      setShowSportGroupDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                      selectedSportGroup === group._id
                        ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
                        : "text-gray-700 dark:text-slate-300"
                    }`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sport Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                if (selectedSportGroup) {
                  setShowSportDropdown(!showSportDropdown);
                }
              }}
              disabled={!selectedSportGroup}
              className={`w-full sm:w-48 px-4 py-2 text-sm text-left 
                         bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 dark:focus:border-cyan-400 
                         flex items-center justify-between transition-colors ${
                selectedSportGroup
                  ? "hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer text-gray-700 dark:text-slate-300"
                  : "opacity-50 cursor-not-allowed text-gray-400 dark:text-slate-500"
              }`}
            >
              <span className="truncate">
                {selectedSport
                  ? sports.find((s) => s._id === selectedSport)?.name
                  : "Sport"}
              </span>
              <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
            </button>
            {showSportDropdown && selectedSportGroup && (
              <div className="absolute z-10 w-full sm:w-48 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedSport("");
                    setShowSportDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 transition-colors"
                >
                  All Sports
                </button>
                {sports.map((sport) => (
                  <button
                    key={sport._id}
                    onClick={() => {
                      setSelectedSport(sport._id);
                      setShowSportDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                      selectedSport === sport._id
                        ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
                        : "text-gray-700 dark:text-slate-300"
                    }`}
                  >
                    {sport.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Private Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-700 dark:text-slate-300 font-medium">
              Private Event
            </span>
            <button
              onClick={() => onPrivateToggle(!isPrivateFilter)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPrivateFilter 
                  ? "bg-cyan-500 dark:bg-cyan-600" 
                  : "bg-gray-300 dark:bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPrivateFilter ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-slate-400">No events found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 text-left">
                  <th className="pb-4 pt-4 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      Event Name
                      {getSortIcon("name")}
                    </button>
                  </th>
                  <th className="pb-4 pt-4 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    <button
                      onClick={() => handleSort("sportGroup")}
                      className="flex items-center hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      Group
                      {getSortIcon("sportGroup")}
                    </button>
                  </th>
                  <th className="pb-4 pt-4 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    <button
                      onClick={() => handleSort("sport")}
                      className="flex items-center hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      Sport
                      {getSortIcon("sport")}
                    </button>
                  </th>
                  <th className="pb-4 pt-4 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    <button
                      onClick={() => handleSort("startTime")}
                      className="flex items-center hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      Start Time
                      {getSortIcon("startTime")}
                    </button>
                  </th>
                  <th className="pb-4 pt-4 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    <button
                      onClick={() => handleSort("endTime")}
                      className="flex items-center hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      End Time
                      {getSortIcon("endTime")}
                    </button>
                  </th>
                  <th className="pb-4 pt-4 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr
                    key={event._id}
                    onClick={() => handleEventClick(event)}
                    className={`border-b border-gray-100 dark:border-slate-700/50 
                               hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 
                               cursor-pointer transition-all duration-200 relative group ${
                      index % 2 === 0 
                        ? "bg-white dark:bg-slate-800" 
                        : "bg-gray-50/50 dark:bg-slate-800/50"
                    }`}
                    style={{
                      borderLeft: event.eventStyle?.color ? `4px solid ${event.eventStyle.color}` : "4px solid transparent"
                    }}
                  >
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={getImageUrl(event.photo)}
                          alt={event.name}
                          className="w-14 h-14 rounded-xl object-cover shadow-sm border border-gray-200 dark:border-slate-600"
                        />
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-slate-100 mb-1">
                            {event.name || "NO-NAME"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-slate-400">
                            Created {formatDate(event.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                        {event.sportGroup?.name || "Unknown"}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <span className="inline-block px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
                        {event.sport?.name || "Unknown"}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-gray-700 dark:text-slate-300 font-medium">
                      {formatDate(event.startTime)}
                    </td>
                    <td className="py-5 px-4 text-gray-700 dark:text-slate-300 font-medium">
                      {formatDate(event.endTime)}
                    </td>
                    <td className="py-5 px-4">
                      <button className="text-gray-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-lg font-bold">
                        →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 dark:border-slate-700 pt-5">
              <div className="text-sm text-gray-600 dark:text-slate-400 font-medium">
                Showing <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{startIndex + 1}</span> to <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{endIndex}</span> of <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{pagination.total}</span> entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2.5 rounded-lg border border-gray-300 dark:border-slate-600 
                             hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:border-cyan-300 dark:hover:border-cyan-700
                             disabled:opacity-50 disabled:cursor-not-allowed 
                             text-gray-700 dark:text-slate-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="hidden sm:flex items-center gap-1.5">
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-1.5 text-gray-500 dark:text-slate-400">...</span>
                      ) : (
                        <button
                          onClick={() => goToPage(page as number)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            pagination.currentPage === page
                              ? "bg-cyan-500 dark:bg-cyan-600 text-white shadow-md"
                              : "border border-gray-300 dark:border-slate-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:border-cyan-300 dark:hover:border-cyan-700 text-gray-700 dark:text-slate-300"
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="sm:hidden flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>

                <button
                  onClick={() => goToPage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2.5 rounded-lg border border-gray-300 dark:border-slate-600 
                             hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:border-cyan-300 dark:hover:border-cyan-700
                             disabled:opacity-50 disabled:cursor-not-allowed 
                             text-gray-700 dark:text-slate-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ViewEventModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        event={selectedEvent}
        onCoachClick={(coachId) => {
          setSelectedCoachId(coachId);
          setIsCoachModalOpen(true);
        }}
      />

      <CoachDetailModal
        isOpen={isCoachModalOpen}
        onClose={handleCloseCoachModal}
        coachId={selectedCoachId}
      />
    </div>
  );
};

export default EventsTable;
