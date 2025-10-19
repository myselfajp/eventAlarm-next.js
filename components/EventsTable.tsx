"use client";

import React from "react";
import CustomDropdown from "./CustomDropdown";

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
          {events.map((event) => (
            <tr
              key={event.id}
              className="border-b border-gray-100 hover:bg-gray-50"
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
    </div>
  );
};

export default EventsTable;
