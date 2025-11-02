"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomDropdown from "../CustomDropdown";
import ViewEventModal from "./ViewEventModal";

interface Event {
  id: number;
  name: string;
  image: string;
  group: string;
  sport: string;
  start: string;
  end: string;
  created: string;
}

interface EventsTableProps {
  events: Event[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
  sortFilter: string;
  setSortFilter: (filter: string) => void;
}

const EventsTable: React.FC<EventsTableProps> = ({
  events,
  activeTab,
  setActiveTab,
  typeFilter,
  setTypeFilter,
  sortFilter,
  setSortFilter,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedEvent(null);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
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
            All Campaigns (47)
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-2 font-medium ${
              activeTab === "pending"
                ? "text-gray-800 border-b-2 border-gray-800"
                : "text-gray-500"
            }`}
          >
            Pending (8)
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-2 font-medium ${
              activeTab === "completed"
                ? "text-gray-800 border-b-2 border-gray-800"
                : "text-gray-500"
            }`}
          >
            Completed (39)
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="sm:w-48">
            <CustomDropdown
              label="Type"
              options={["Show All", "Fitness", "Yoga", "CrossFit", "Sports"]}
              value={typeFilter}
              onChange={setTypeFilter}
              placeholder="Select type"
            />
          </div>
          <div className="sm:w-48">
            <CustomDropdown
              label="Sort"
              options={["Show All", "Date", "Name", "Group", "Sport"]}
              value={sortFilter}
              onChange={setSortFilter}
              placeholder="Select sort"
            />
          </div>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="pb-3 text-sm font-medium text-gray-600">
              Event-Name
            </th>
            <th className="pb-3 text-sm font-medium text-gray-600">Group</th>
            <th className="pb-3 text-sm font-medium text-gray-600">Sport</th>
            <th className="pb-3 text-sm font-medium text-gray-600">Start</th>
            <th className="pb-3 text-sm font-medium text-gray-600">End</th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map((event) => (
            <tr
              key={event.id}
              onClick={() => handleEventClick(event)}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-800">
                      {event.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Create on {event.created}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 text-gray-700">{event.group}</td>
              <td className="py-4 text-gray-700">{event.sport}</td>
              <td className="py-4 text-gray-700">{event.start}</td>
              <td className="py-4 text-gray-700">{event.end}</td>
              <td className="py-4">
                <button className="text-gray-400 hover:text-gray-600">→</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {events.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, events.length)} of{" "}
            {events.length} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
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
                        currentPage === page
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
              Page {currentPage} of {totalPages}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
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
