"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Menu, Calendar } from "lucide-react";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Header from "./Header";
import EventsTable from "./event/EventsTable";
import CoachCalendar from "./CoachCalendar";
import { fetchJSON } from "@/app/lib/api";
import { EP } from "@/app/lib/endpoints";

const EventsDashboard = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1));
  const [activeTab, setActiveTab] = useState("all");
  const [calendarView, setCalendarView] = useState("month");
  const [showCoachCalendar, setShowCoachCalendar] = useState(false);

  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 10,
  });

  const [filters, setFilters] = useState({
    search: "",
    sortBy: undefined as string | undefined,
    sortType: "asc" as "asc" | "desc",
    sportGroup: undefined as string | undefined,
    sport: undefined as string | undefined,
    private: false,
  });

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: any = {
        perPage: pagination.perPage,
        pageNumber: pagination.currentPage,
      };

      if (filters.search && filters.search.length >= 2) {
        payload.search = filters.search;
      }

      if (filters.sortBy) {
        payload.sortBy = filters.sortBy;
        payload.sortType = filters.sortType;
      }

      if (filters.sportGroup) {
        payload.sportGroup = filters.sportGroup;
      }

      if (filters.sport) {
        payload.sport = filters.sport;
      }

      payload.private = filters.private;

      const response = await fetchJSON(EP.EVENTS.getEvents, {
        method: "POST",
        body: payload,
      });

      if (response?.success && response?.data) {
        setEvents(response.data);
        if (response.pagination) {
          setPagination({
            currentPage: response.pagination.currentPage || 1,
            totalPages: response.pagination.totalPages || 1,
            total: response.pagination.total || 0,
            perPage: response.pagination.perPage || 10,
          });
        }
      } else {
        setError(response?.message || "Failed to load events");
        setEvents([]);
      }
    } catch (err) {
      setError("An error occurred while fetching events");
      setEvents([]);
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    pagination.currentPage,
    pagination.perPage,
    filters.search,
    filters.sortBy,
    filters.sortType,
    filters.sportGroup,
    filters.sport,
    filters.private,
  ]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (sortBy: string, sortType: "asc" | "desc") => {
    setFilters((prev) => ({ ...prev, sortBy, sortType }));
  };

  const handleFilterChange = (sportGroup?: string, sport?: string) => {
    setFilters((prev) => ({ ...prev, sportGroup, sport }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePrivateToggle = (isPrivate: boolean) => {
    setFilters((prev) => ({ ...prev, private: isPrivate }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const calendarEvents = [
    { day: 1, label: "H13", color: "bg-green-400" },
    { day: 2, label: "Con", color: "bg-blue-600" },
    { day: 3, label: "ICT Expo 2", color: "bg-cyan-400" },
    { day: 13, label: "Dim", color: "bg-cyan-400" },
    { day: 14, label: "A1", color: "bg-yellow-400" },
    { day: 16, label: "Conf", color: "bg-teal-500" },
    { day: 29, label: "Sum", color: "bg-cyan-400" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <LeftSidebar 
        isOpen={leftSidebarOpen} 
        onShowCalendar={() => setShowCoachCalendar(true)}
      />

      <div className="flex-1 overflow-auto">
        <Header
          onLeftSidebarToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
          onRightSidebarToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
        />

        <div className="p-6">
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-8 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Good admin theme
              </h2>
              <p className="text-gray-600 mb-4">is a tool of enthusiasm</p>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
                Create App
              </button>
            </div>
            <div className="hidden md:block">
              <img
                src="/api/placeholder/300/150"
                alt="Illustration"
                className="w-80"
              />
            </div>
          </div>

          {showCoachCalendar ? (
            <CoachCalendar onBack={() => setShowCoachCalendar(false)} />
          ) : (
            <EventsTable
              events={events}
              isLoading={isLoading}
              error={error}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              pagination={pagination}
              onPageChange={handlePageChange}
              onSearchChange={handleSearchChange}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              onPrivateToggle={handlePrivateToggle}
              isPrivateFilter={filters.private}
            />
          )}
        </div>
      </div>

      <RightSidebar
        isOpen={rightSidebarOpen}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        calendarView={calendarView}
        setCalendarView={setCalendarView}
        calendarEvents={calendarEvents}
        onEventCreated={fetchEvents}
      />

      <button
        onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
        className="fixed bottom-6 left-6 lg:hidden bg-cyan-500 text-white p-3 rounded-full shadow-lg z-50"
      >
        {leftSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      <button
        onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
        className="fixed bottom-6 right-6 lg:hidden bg-cyan-500 text-white p-3 rounded-full shadow-lg z-50"
      >
        {rightSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Calendar className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default EventsDashboard;
