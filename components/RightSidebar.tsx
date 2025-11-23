"use client";

import React, { useState, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, Calendar, X, Clock } from "lucide-react";
import AddEventModal from "./event/AddEventModal";
import { useMe } from "@/app/hooks/useAuth";

interface RightSidebarProps {
  isOpen: boolean;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  calendarView: string;
  setCalendarView: (view: string) => void;
  events: any[];
  onEventCreated?: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  currentDate,
  setCurrentDate,
  calendarView,
  setCalendarView,
  events,
  onEventCreated,
}) => {
  const { data: user, isLoading: userLoading } = useMe();
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const isCoach = user?.coach != null;
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const upcomingEvents = [
    {
      title: "Basketball Tournament",
      time: "28 min",
      date: "Today, 3:00 PM",
    },
    {
      title: "Yoga Class",
      time: "2 hours",
      date: "Today, 5:30 PM",
    },
    {
      title: "Swimming Practice",
      time: "4 hours",
      date: "Tomorrow, 9:00 AM",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevEvent = () => {
    setCurrentEventIndex(
      (prev) => (prev - 1 + upcomingEvents.length) % upcomingEvents.length
    );
  };

  const handleNextEvent = () => {
    setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    const prevMonthDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(
        <div
          key={`prev-${i}`}
          className="text-center py-1.5 text-gray-300 text-xs"
        >
          {prevMonthDays - i}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.startTime);
        return (
          eventDate.getDate() === day &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      });

      days.push(
        <div
          key={day}
          onClick={() => {
            setSelectedDay(day);
            setShowEventModal(true);
          }}
          className="relative text-center py-1.5 hover:bg-gray-50 rounded cursor-pointer transition-colors"
        >
          <div className="text-xs font-medium text-gray-700">{day}</div>
          {dayEvents.length > 0 && (
            <div className="flex justify-center gap-0.5 mt-0.5">
              {dayEvents.slice(0, 3).map((event, idx) => (
                <div
                  key={idx}
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: event.eventStyle?.color || "#3b82f6" }}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className="text-center py-1.5 text-gray-300 text-xs"
        >
          {i}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const selectedDayEvents = selectedDay 
    ? events.filter((event) => {
        const eventDate = new Date(event.startTime);
        return (
          eventDate.getDate() === selectedDay &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      })
    : [];

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`${
        isOpen ? "w-full sm:w-96 md:w-[400px]" : "w-0"
      } bg-white border-l border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0 h-screen overflow-y-auto`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">Dashboard</h3>
          {userLoading ? (
            <div className="w-28 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : isCoach ? (
            <button
              onClick={() => setIsAddEventModalOpen(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          ) : null}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-3">You've got 24 New Sales</p>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCurrentDate(newDate);
                }}
                className="p-0.5 hover:bg-white rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h4 className="font-semibold text-gray-800 text-sm">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h4>
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCurrentDate(newDate);
                }}
                className="p-0.5 hover:bg-white rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-1.5 mb-3">
              <button
                onClick={() => setCalendarView("month")}
                className={`px-2 py-0.5 rounded text-xs ${
                  calendarView === "month" ? "bg-white font-medium" : ""
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCalendarView("week")}
                className={`px-2 py-0.5 rounded text-xs ${
                  calendarView === "week" ? "bg-white font-medium" : ""
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setCalendarView("day")}
                className={`px-2 py-0.5 rounded text-xs ${
                  calendarView === "day" ? "bg-white font-medium" : ""
                }`}
              >
                Day
              </button>
              <button className="ml-auto px-2 py-0.5 rounded text-xs hover:bg-white">
                Today
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0.5 mb-1.5">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-medium text-gray-600 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">{renderCalendar()}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg mb-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handlePrevEvent}
              className="p-1 hover:bg-blue-400 rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {upcomingEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEventIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentEventIndex
                      ? "w-6 bg-white"
                      : "w-1.5 bg-blue-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNextEvent}
              className="p-1 hover:bg-blue-400 rounded-full transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mb-3">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ease-in-out ${
                  index === currentEventIndex
                    ? "opacity-100 translate-x-0 block"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1.5">{event.title}</h3>
                    <div className="text-sm text-blue-100 mb-2">
                      {event.date}
                    </div>
                    <div className="text-xs text-blue-100 leading-relaxed">
                      Your reservation will be auto checked in if you do not
                      cancel.
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-3 flex-shrink-0">
                    <button className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                      Check In
                    </button>
                    <button className="bg-blue-400 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 mt-3 border-t border-blue-400">
            <button className="w-full text-center text-sm font-medium hover:underline">
              My Events
            </button>
          </div>
        </div>

        {isCoach && (
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-gray-800">
                  $69,700
                </span>
                <span className="text-sm text-lime-400 font-medium">
                  monthly
                </span>
              </div>
              <p className="text-sm text-orange-300">
                Projects Earnings in April
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg
                  className="w-24 h-24 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="20"
                    strokeDasharray="75.4 251.2"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#84cc16"
                    strokeWidth="20"
                    strokeDasharray="50.3 251.2"
                    strokeDashoffset="-75.4"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="20"
                    strokeDasharray="125.5 251.2"
                    strokeDashoffset="-125.7"
                  />
                </svg>
              </div>

              <div className="flex-1 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">-</span>
                    <span className="text-gray-600">Leaf CRM</span>
                  </div>
                  <span className="font-semibold text-gray-800">$7,660</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">-</span>
                    <span className="text-gray-600">Marketing</span>
                  </div>
                  <span className="font-semibold text-gray-800">$16,783</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">-</span>
                    <span className="text-gray-600">Others</span>
                  </div>
                  <span className="font-semibold text-gray-800">$45,257</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onSuccess={() => {
          if (onEventCreated) {
            onEventCreated();
          }
        }}
      />

      {/* Detail View Modal */}
      {showEventModal && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {monthNames[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? "s" : ""} scheduled
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedDay(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-300 mb-4">
                    <Calendar className="w-16 h-16 mx-auto" />
                  </div>
                  <p className="text-gray-500 text-lg">No events scheduled for this day</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayEvents.map((event, idx) => (
                    <div
                      key={event._id || idx}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-4 h-4 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: event.eventStyle?.color || "#3b82f6" }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-800 text-lg mb-1">{event.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                </span>
                              </div>
                            </div>
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              {event.sport?.name || "Event"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
