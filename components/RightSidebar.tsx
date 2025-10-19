"use client";

import React from "react";
import { Plus, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface CalendarEvent {
  day: number;
  label: string;
  color: string;
}

interface RightSidebarProps {
  isOpen: boolean;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  calendarView: string;
  setCalendarView: (view: string) => void;
  calendarEvents: CalendarEvent[];
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  currentDate,
  setCurrentDate,
  calendarView,
  setCalendarView,
  calendarEvents,
}) => {
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
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const prevMonthDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(
        <div
          key={`prev-${i}`}
          className="text-center py-3 text-gray-300 text-sm"
        >
          {prevMonthDays - i}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const event = calendarEvents.find((e) => e.day === day);
      days.push(
        <div
          key={day}
          className="relative text-center py-3 hover:bg-gray-50 rounded cursor-pointer transition-colors"
        >
          <div className="text-sm font-medium text-gray-700">{day}</div>
          {event && (
            <div
              className={`${event.color} text-white text-xs rounded px-1 py-0.5 mt-1 mx-auto w-fit`}
            >
              {event.label}
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
          className="text-center py-3 text-gray-300 text-sm"
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

  return (
    <div
      className={`${isOpen ? "w-80" : "w-0"} lg:${
        isOpen ? "w-80" : "w-0"
      } bg-white border-l border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-800">Dashboard</h3>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-4">You've got 24 New Sales</p>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCurrentDate(newDate);
                }}
                className="p-1 hover:bg-white rounded"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h4 className="font-semibold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h4>
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCurrentDate(newDate);
                }}
                className="p-1 hover:bg-white rounded"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setCalendarView("month")}
                className={`px-3 py-1 rounded text-sm ${
                  calendarView === "month" ? "bg-white font-medium" : ""
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCalendarView("week")}
                className={`px-3 py-1 rounded text-sm ${
                  calendarView === "week" ? "bg-white font-medium" : ""
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setCalendarView("day")}
                className={`px-3 py-1 rounded text-sm ${
                  calendarView === "day" ? "bg-white font-medium" : ""
                }`}
              >
                Day
              </button>
              <button className="ml-auto px-3 py-1 rounded text-sm hover:bg-white">
                Today
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
