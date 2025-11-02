"use client";

import React from "react";
import { X, ImageIcon } from "lucide-react";
import { EP } from "@/app/lib/endpoints";

interface Event {
  _id: string;
  name: string;
  photo?: {
    path?: string;
  };
  banner?: {
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
  club?: {
    _id: string;
    name: string;
  };
  group?: {
    _id: string;
    name: string;
  };
  style?: {
    _id: string;
    name: string;
    color?: string;
  };
  facility?: {
    _id: string;
    name: string;
    address?: string;
  };
  salon?: {
    _id: string;
    name: string;
  };
  location?: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  capacity?: number;
  level?: number;
  type?: string;
  priceType?: string;
  participationFee?: number;
  equipment?: string;
  private?: boolean;
  isRecurring?: boolean;
  [key: string]: any;
}

interface ViewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const ViewEventModal: React.FC<ViewEventModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  if (!isOpen || !event) return null;

  const getImageUrl = (photo?: { path?: string }) => {
    if (photo?.path) {
      return `${EP.API_ASSETS_BASE}/${photo.path}`.replace(/\\/g, "/");
    }
    return null;
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }).format(date);
  };

  const formatDateTime = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const imageUrl = getImageUrl(event.photo);
  const bannerUrl = getImageUrl(event.banner);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">Event Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image
                </label>
                <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Event"
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 bg-gray-50">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                      <p className="text-xs text-gray-400 mt-2">No Image</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Banner
                </label>
                <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                  {bannerUrl ? (
                    <img
                      src={bannerUrl}
                      alt="Event banner"
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 bg-gray-50">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                      <p className="text-xs text-gray-400 mt-2">No Banner</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name
              </label>
              <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {event.name || "-"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Club
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {event.club?.name || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {event.group?.name || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Style
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {event.style?.name || "-"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sport Group
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {event.sportGroup?.name || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sport Name
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {event.sport?.name || "-"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {event.facility?.name || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salon
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {event.salon?.name || "-"}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Location
              </label>
              <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 min-h-[80px]">
                {event.location || "-"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Start
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {formatDateTime(event.startTime)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event End
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {formatDateTime(event.endTime)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {event.capacity || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 capitalize">
                  {event.level || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 capitalize">
                  {event.type || "-"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 capitalize">
                  {event.priceType || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participant Fee
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {event.participationFee ? `$${event.participationFee}` : "-"}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment
              </label>
              <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 min-h-[80px]">
                {event.equipment || "-"}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {event.private && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">Private Event</span>
                </div>
              )}

              {event.isRecurring && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">Recurring Event</span>
                </div>
              )}

              {!event.private && !event.isRecurring && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span className="text-sm font-medium">Public Event</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created On
              </label>
              <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {formatDate(event.createdAt)}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 pb-6 px-6 -mx-6 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;
