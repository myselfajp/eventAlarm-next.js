import React, { useEffect, useState } from "react";
import {
  X,
  Mail,
  Phone,
  Award,
  CheckCircle,
  Calendar,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";
import { fetchJSON } from "@/app/lib/api";
import { EP } from "@/app/lib/endpoints";

interface CoachDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  coachId: string | null;
}

interface Event {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  photo?: {
    path: string;
  };
  banner?: {
    path: string;
  };
  sport?: {
    name: string;
  };
}

interface CoachResponseData {
  coach: {
    _id: string;
    isVerified: boolean;
    createdAt: string;
  };
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    age?: string; // ISO date string
    photo?: {
      path: string;
    };
  };
  branch: {
    _id: string;
    sport: {
      _id: string;
      name: string;
      groupName: string;
    };
    branchOrder: number;
    level: number;
    certificate?: {
      path: string;
      originalName: string;
    };
  }[];
  event: Event[];
}

const CoachDetailModal: React.FC<CoachDetailModalProps> = ({
  isOpen,
  onClose,
  coachId,
}) => {
  const [data, setData] = useState<CoachResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && coachId) {
      fetchCoachDetails(coachId);
    } else {
      setData(null);
      setError(null);
    }
  }, [isOpen, coachId]);

  const fetchCoachDetails = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = EP.COACH.getCoachById(id);
      const response = await fetchJSON(url, {
        method: "GET",
      });

      if (response?.success && response?.data) {
        setData(response.data);
      } else {
        setError(response?.message || "Failed to load coach details");
      }
    } catch (err) {
      setError("An error occurred while fetching coach details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (path?: string) => {
    if (!path) return null;
    return `${EP.API_ASSETS_BASE}/${path}`.replace(/\\/g, "/");
  };

  const calculateAge = (dateString?: string) => {
    if (!dateString) return null;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(isoString));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Coach Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
              <p className="text-gray-500">Loading coach information...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-red-50 text-red-500 p-4 rounded-lg inline-block mb-4">
                {error}
              </div>
              <button
                onClick={() => coachId && fetchCoachDetails(coachId)}
                className="block mx-auto text-cyan-600 hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : data ? (
            <div className="p-6 space-y-8">
              {/* Profile Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden border-4 border-white shadow-md relative">
                    {data.user.photo?.path ? (
                      <img
                        src={getImageUrl(data.user.photo.path)!}
                        alt={data.user.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-cyan-100 text-cyan-600 text-3xl font-bold">
                        {data.user.firstName.charAt(0)}
                        {data.user.lastName.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900 truncate">
                        {data.user.firstName} {data.user.lastName}
                      </h3>
                      {data.coach.isVerified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-600 mb-4">
                      {data.user.age && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{calculateAge(data.user.age)} years old</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          Joined {formatDate(data.coach.createdAt)}
                        </span>
                      </div>
                      {data.user.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a
                            href={`mailto:${data.user.email}`}
                            className="hover:text-cyan-600 transition-colors"
                          >
                            {data.user.email}
                          </a>
                        </div>
                      )}
                      {data.user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a
                            href={`tel:${data.user.phone}`}
                            className="hover:text-cyan-600 transition-colors"
                          >
                            {data.user.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Branches Section */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-cyan-500" />
                  Sports & Certifications
                </h4>
                {data.branch && data.branch.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {data.branch.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-gray-900">
                            {item.sport.name}
                          </span>
                          <span className="px-2.5 py-1 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-full border border-cyan-100">
                            Level {item.level}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          {item.sport.groupName}
                        </div>
                        {item.certificate?.path && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs font-medium text-gray-500 mb-2">
                              Certificate
                            </p>
                            <a
                              href={getImageUrl(item.certificate.path)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block group relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100"
                            >
                              <img
                                src={getImageUrl(item.certificate.path)!}
                                alt="Certificate"
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-gray-500 italic">
                    No sports branches assigned.
                  </div>
                )}
              </div>

              {/* Events Section */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-500" />
                  Active Events
                </h4>
                {data.event && data.event.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {data.event.map((event) => (
                      <div
                        key={event._id}
                        className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="h-32 bg-gray-200 relative overflow-hidden">
                          {event.banner?.path || event.photo?.path ? (
                            <img
                              src={
                                getImageUrl(event.banner?.path) ||
                                getImageUrl(event.photo?.path)!
                              }
                              alt={event.name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                              <Calendar className="w-8 h-8" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700 shadow-sm">
                            {event.sport?.name}
                          </div>
                        </div>
                        <div className="p-4">
                          <h5 className="font-bold text-gray-900 mb-1 truncate">
                            {event.name}
                          </h5>
                          <div className="text-sm text-gray-500 mb-3">
                            {formatDate(event.startTime)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-gray-500 italic">
                    No active events found.
                  </div>
                )}
              </div>
            </div>
          ) : null}
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

export default CoachDetailModal;
