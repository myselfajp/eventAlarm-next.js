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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-2 font-medium ${
              activeTab === "all"
                ? "text-gray-800 border-b-2 border-gray-800"
                : "text-gray-500"
            }`}
          >
            All Events ({pagination.total})
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchValue}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div className="relative dropdown-container">
            <button
              onClick={() => setShowSportGroupDropdown(!showSportGroupDropdown)}
              className="w-full sm:w-48 px-4 py-2 text-sm text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent flex items-center justify-between"
            >
              <span className="truncate">
                {selectedSportGroup
                  ? sportGroups.find((g) => g._id === selectedSportGroup)?.name
                  : "Sport Group"}
              </span>
              <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
            </button>
            {showSportGroupDropdown && (
              <div className="absolute z-10 w-full sm:w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedSportGroup("");
                    setShowSportGroupDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 text-gray-500"
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
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                      selectedSportGroup === group._id
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-gray-700"
                    }`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative dropdown-container">
            <button
              onClick={() => {
                if (selectedSportGroup) {
                  setShowSportDropdown(!showSportDropdown);
                }
              }}
              disabled={!selectedSportGroup}
              className={`w-full sm:w-48 px-4 py-2 text-sm text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent flex items-center justify-between ${
                selectedSportGroup
                  ? "hover:bg-gray-50 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
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
              <div className="absolute z-10 w-full sm:w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedSport("");
                    setShowSportDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 text-gray-500"
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
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                      selectedSport === sport._id
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-gray-700"
                    }`}
                  >
                    {sport.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-700 font-medium">
              Private Event
            </span>
            <button
              onClick={() => onPrivateToggle(!isPrivateFilter)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPrivateFilter ? "bg-cyan-500" : "bg-gray-300"
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 text-sm font-medium text-gray-600">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center hover:text-gray-900 transition-colors"
                    >
                      Event-Name
                      {getSortIcon("name")}
                    </button>
                  </th>
                  <th className="pb-3 text-sm font-medium text-gray-600">
                    <button
                      onClick={() => handleSort("sportGroup")}
                      className="flex items-center hover:text-gray-900 transition-colors"
                    >
                      Group
                      {getSortIcon("sportGroup")}
                    </button>
                  </th>
                  <th className="pb-3 text-sm font-medium text-gray-600">
                    <button
                      onClick={() => handleSort("sport")}
                      className="flex items-center hover:text-gray-900 transition-colors"
                    >
                      Sport
                      {getSortIcon("sport")}
                    </button>
                  </th>
                  <th className="pb-3 text-sm font-medium text-gray-600">
                    <button
                      onClick={() => handleSort("startTime")}
                      className="flex items-center hover:text-gray-900 transition-colors"
                    >
                      Start
                      {getSortIcon("startTime")}
                    </button>
                  </th>
                  <th className="pb-3 text-sm font-medium text-gray-600">
                    <button
                      onClick={() => handleSort("endTime")}
                      className="flex items-center hover:text-gray-900 transition-colors"
                    >
                      End
                      {getSortIcon("endTime")}
                    </button>
                  </th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr
                    key={event._id}
                    onClick={() => handleEventClick(event)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(event.photo)}
                          alt={event.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-800">
                            {event.name || "NO-NAME"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Create on {formatDate(event.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-gray-700">
                      {event.sportGroup?.name || "Unknown"}
                    </td>
                    <td className="py-4 text-gray-700">
                      {event.sport?.name || "Unknown"}
                    </td>
                    <td className="py-4 text-gray-700">
                      {formatDate(event.startTime)}
                    </td>
                    <td className="py-4 text-gray-700">
                      {formatDate(event.endTime)}
                    </td>
                    <td className="py-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.total > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{endIndex} of {pagination.total}{" "}
                entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-1.5 text-gray-500">...</span>
                      ) : (
                        <button
                          onClick={() => goToPage(page as number)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            pagination.currentPage === page
                              ? "bg-cyan-500 text-white"
                              : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="sm:hidden flex items-center gap-2 text-sm font-medium text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>

                <button
                  onClick={() => goToPage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      />
    </div>
  );
};

export default EventsTable;
