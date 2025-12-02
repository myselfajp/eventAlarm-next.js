"use client";

import React from "react";
import { X, Users, Calendar, FileText } from "lucide-react";
import { EP } from "@/app/lib/endpoints";

interface GroupViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: {
    _id: string;
    name: string;
    description?: string;
    clubId: string;
    clubName: string;
    photo?: {
      path: string;
    };
    isApproved: boolean;
    createdAt: string;
  } | null;
}

const GroupViewModal: React.FC<GroupViewModalProps> = ({
  isOpen,
  onClose,
  group,
}) => {
  if (!isOpen || !group) return null;

  const getImageUrl = (path?: string) => {
    if (!path) return null;
    return `${EP.API_ASSETS_BASE}/${path}`.replace(/\\/g, "/");
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(isoString));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">Group Details</h2>
            {group.isApproved && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                <Users className="w-3.5 h-3.5" />
                Approved
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Group Photo */}
          {group.photo?.path && (
            <div className="flex justify-center">
              <img
                src={getImageUrl(group.photo.path)!}
                alt={group.name}
                className="h-48 w-full max-w-md object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Group Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {group.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Club
              </label>
              <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {group.clubName}
              </div>
            </div>

            {group.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 whitespace-pre-wrap">
                  {group.description}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created Date
              </label>
              <div className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {formatDate(group.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupViewModal;
