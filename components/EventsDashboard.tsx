"use client";

import React, { useState } from "react";
import { X, Menu, Calendar } from "lucide-react";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Header from "./Header";
import EventsTable from "./EventsTable";

const EventsDashboard = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1));
  const [activeTab, setActiveTab] = useState("all");
  const [calendarView, setCalendarView] = useState("month");
  const [typeFilter, setTypeFilter] = useState("Show All");
  const [sortFilter, setSortFilter] = useState("Show All");

  const events = [
    {
      id: 1,
      name: "Evening CrossFit Training",
      image: "/api/placeholder/60/60",
      group: "hop",
      sport: "bubu",
      start: "01 Nov 25",
      end: "01 Nov 25",
      created: "25 Sept 25",
    },
    {
      id: 2,
      name: "Morning Yoga Class",
      image: "/api/placeholder/60/60",
      group: "hope group",
      sport: "paning",
      start: "01 Oct 25",
      end: "01 Oct 25",
      created: "25 Sept 25",
    },
    {
      id: 3,
      name: "Morning Yoga Session",
      image: "/api/placeholder/60/60",
      group: "hop",
      sport: "paning",
      start: "10 Sept 25",
      end: "10 Sept 25",
      created: "09 Sept 25",
    },
    {
      id: 4,
      name: "koose bazi",
      image: "/api/placeholder/60/60",
      group: "hop",
      sport: "bubu",
      start: "11 Oct 25",
      end: "12 Dec 25",
      created: "27 Aug 25",
    },
  ];

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
      <LeftSidebar isOpen={leftSidebarOpen} />

      {/* Main Content */}
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

          <EventsTable
            events={events}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            sortFilter={sortFilter}
            setSortFilter={setSortFilter}
          />
        </div>
      </div>

      <RightSidebar
        isOpen={rightSidebarOpen}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        calendarView={calendarView}
        setCalendarView={setCalendarView}
        calendarEvents={calendarEvents}
      />

      {/* Mobile Menu Toggle */}
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
