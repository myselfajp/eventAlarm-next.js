"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Trophy,
  Target,
  Award,
  Building,
  Users,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  MapPin,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import { fetchJSON } from "@/app/lib/api";
import { EP } from "@/app/lib/endpoints";
import {
  User as UserType,
  UserDetailsResponse,
  SportGoal,
  SportGoalResponse,
  CoachDetails,
  CoachDetailsResponse,
} from "@/app/lib/types";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  context?: "coach" | "participant" | "facility" | "company";
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userId,
  context,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [mainSport, setMainSport] = useState<string>("");
  const [sportGoal, setSportGoal] = useState<SportGoal | null>(null);
  const [coachDetails, setCoachDetails] = useState<CoachDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExtras, setIsLoadingExtras] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails(userId);
    } else if (!isOpen) {
      // Reset state when modal closes
      setUser(null);
      setMainSport("");
      setSportGoal(null);
      setCoachDetails(null);
      setIsFullyLoaded(false);
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (user) {
      fetchExtraData();
    }
  }, [user]);

  const fetchUserDetails = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: UserDetailsResponse = await fetchJSON(
        EP.AUTH.getUserById(id)
      );

      if (response?.success && response?.data) {
        setUser(response.data);
      } else {
        setError(response?.message || "Failed to load user details");
      }
    } catch (err) {
      setError("An error occurred while loading user details");
      console.error("Error loading user details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExtraData = async () => {
    if (!user) return;

    setIsLoadingExtras(true);

    // Check if we need to load any extra data
    const needsSportData = user.participant?.mainSport || user.participant?.sportGoal;
    const needsCoachData = user.coach?._id;

    if (!needsSportData && !needsCoachData) {
      // No extra data to load, mark as fully loaded
      setIsLoadingExtras(false);
      setIsFullyLoaded(true);
      return;
    }

    try {
      // Fetch main sport name if participant exists and context allows it
      if (user.participant?.mainSport && (!context || context === "participant")) {
        const sportResponse = await fetchJSON(EP.REFERENCE.sportGroup, {
          method: "POST",
          body: { sport: user.participant.mainSport },
        });

        if (sportResponse?.success && sportResponse?.data?.length > 0) {
          setMainSport(sportResponse.data[0].name);
        }
      }

      // Fetch sport goal details if participant exists and context allows it
      if (user.participant?.sportGoal && (!context || context === "participant")) {
        const sportGoalResponse: SportGoalResponse = await fetchJSON(
          EP.REFERENCE.sportGoal,
          {
            method: "POST",
            body: { sportGoal: user.participant.sportGoal },
          }
        );

        if (
          sportGoalResponse?.success &&
          sportGoalResponse?.data &&
          Array.isArray(sportGoalResponse.data) &&
          sportGoalResponse.data.length > 0
        ) {
          setSportGoal(sportGoalResponse.data[0]);
        }
      }

      // Fetch coach details if coach exists and context allows it
      if (user.coach?._id && (!context || context === "coach")) {
        const coachResponse: CoachDetailsResponse = await fetchJSON(
          EP.COACH.getCoachById(user.coach._id)
        );

        if (coachResponse?.success && coachResponse?.data) {
          setCoachDetails(coachResponse.data);
        }
      }
    } catch (err) {
      console.error("Error loading extra data:", err);
    } finally {
      setIsLoadingExtras(false);
      setIsFullyLoaded(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const getRoleName = (role: number) => {
    switch (role) {
      case 1:
        return "Regular User";
      case 2:
        return "Coach";
      case 3:
        return "Admin";
      default:
        return "Unknown";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-800">
                User Profile
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isFullyLoaded ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : user ? (
            <div className="space-y-6">
              {/* User Avatar and Basic Info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center">
                  {user.photo ? (
                    <img
                      src={`${EP.API_ASSETS_BASE}${user.photo}`}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-cyan-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-600">{getRoleName(user.role)}</p>
                  <p className="text-sm text-gray-500">
                    Member since {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                    {user.isEmailVerified && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                    {user.isPhoneVerified && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{formatDate(user.age)}</p>
                  </div>
                </div>
              </div>

              {/* Participant Details */}
              {user.participant && (!context || context === "participant") && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-cyan-600" />
                    Participant Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg">
                      <Target className="w-5 h-5 text-cyan-600" />
                      <div>
                        <p className="text-sm text-gray-600">Main Sport</p>
                        <p className="font-medium">
                          {mainSport || user.participant.mainSport}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg">
                      <Award className="w-5 h-5 text-cyan-600" />
                      <div>
                        <p className="text-sm text-gray-600">Skill Level</p>
                        <p className="font-medium">
                          {user.participant.skillLevel}
                        </p>
                      </div>
                    </div>
                    {user.participant.point !== null && (
                      <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg">
                        <Trophy className="w-5 h-5 text-cyan-600" />
                        <div>
                          <p className="text-sm text-gray-600">Points</p>
                          <p className="font-medium">
                            {user.participant.point}
                          </p>
                        </div>
                      </div>
                    )}
                    {user.participant.membershipLevel !== null && (
                      <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg">
                        <Award className="w-5 h-5 text-cyan-600" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Membership Level
                          </p>
                          <p className="font-medium">
                            {user.participant.membershipLevel}
                          </p>
                        </div>
                      </div>
                    )}
                    {sportGoal && (
                      <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg">
                        <Target className="w-5 h-5 text-cyan-600" />
                        <div>
                          <p className="text-sm text-gray-600">Sport Goal</p>
                          <p className="font-medium">{sportGoal.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Coach Information */}
              {(user.coach || coachDetails) && (!context || context === "coach") && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Coach Information
                  </h4>

                  {/* Basic Coach Info */}
                  {user.coach && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Verification Status
                          </p>
                          <p className="font-medium">
                            {user.coach.isVerified
                              ? "Verified"
                              : "Pending Verification"}
                          </p>
                        </div>
                      </div>
                      {user.coach.membershipLevel !== null && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <Award className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Membership Level
                            </p>
                            <p className="font-medium">
                              {user.coach.membershipLevel}
                            </p>
                          </div>
                        </div>
                      )}
                      {user.coach.point !== null && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <Trophy className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">Points</p>
                            <p className="font-medium">{user.coach.point}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Coach Branches */}
                  {coachDetails?.branch && coachDetails.branch.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-md font-medium text-gray-800 mb-2">
                        Coach Branches ({coachDetails.branch.length})
                      </h5>
                      <div className="space-y-2">
                        {coachDetails.branch.map((branch) => (
                          <div
                            key={branch._id}
                            className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                          >
                            {branch.certificate ? (
                              <img
                                src={`${EP.API_ASSETS_BASE}${branch.certificate.path}`}
                                alt="Branch Certificate"
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                            ) : (
                              <Target className="w-5 h-5 text-green-600" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">
                                {branch.sport.name} - {branch.sport.groupName}
                              </p>
                              <p className="text-sm text-gray-600">
                                Level: {branch.level}
                              </p>
                              <div className="mt-1">
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full ${
                                    branch.isApproved
                                      ? "bg-green-100 text-green-800"
                                      : branch.status === "Pending"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {branch.isApproved
                                    ? "Approved"
                                    : branch.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coach Events */}
                  {coachDetails?.event && coachDetails.event.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-md font-medium text-gray-800 mb-2">
                        Coach Events ({coachDetails.event.length})
                      </h5>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {coachDetails.event.map((event) => (
                          <div
                            key={event._id}
                            className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                          >
                            {event.photo ? (
                              <img
                                src={`${EP.API_ASSETS_BASE}${event.photo.path}`}
                                alt={event.name}
                                className="w-12 h-12 object-cover rounded-lg border"
                              />
                            ) : (
                              <CalendarIcon className="w-5 h-5 text-green-600" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{event.name}</p>
                              <p className="text-sm text-gray-600">
                                {event.sportGroup.name} - {event.sport.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(event.startTime)} • {event.capacity}{" "}
                                participants
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Price</p>
                              <p className="text-xs font-medium">
                                {event.priceType === "Free"
                                  ? "Free"
                                  : `$${event.participationFee}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coach Club Groups */}
                  {coachDetails?.clubGroup &&
                    coachDetails.clubGroup.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-md font-medium text-gray-800 mb-2">
                          Club Groups ({coachDetails.clubGroup.length})
                        </h5>
                        <div className="space-y-2">
                          {coachDetails.clubGroup.map((group) => (
                            <div
                              key={group._id}
                              className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                            >
                              {group.photo ? (
                                <img
                                  src={`${EP.API_ASSETS_BASE}${group.photo.path}`}
                                  alt={group.name}
                                  className="w-12 h-12 object-cover rounded-lg border"
                                />
                              ) : (
                                <Users className="w-5 h-5 text-green-600" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{group.name}</p>
                                <p className="text-sm text-gray-600">
                                  {group.clubName}
                                </p>
                                <div className="mt-1">
                                  <span
                                    className={`px-2 py-0.5 text-xs rounded-full ${
                                      group.isApproved
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {group.isApproved ? "Approved" : "Pending"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Facilities and Companies */}
              {((user.facility.length > 0 && context !== "participant") || (user.company.length > 0 && context !== "coach" && context !== "participant")) && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Associated with
                  </h4>
                  {user.facility.length > 0 && context !== "participant" && (
                    <div className="mb-4">
                      <h5 className="text-md font-medium text-gray-800 mb-2">
                        Sports Facilities ({user.facility.length})
                      </h5>
                      <div className="space-y-2">
                        {user.facility.map((facility) => (
                          <div
                            key={facility._id}
                            className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                          >
                            <Building className="w-5 h-5 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-medium">{facility.name}</p>
                              <p className="text-sm text-gray-600">
                                Sport Group: {facility.sportGroup}
                              </p>
                              <p className="text-sm text-gray-600">
                                Sport: {facility.sport}
                              </p>
                              {facility.priceInfo && (
                                <p className="text-xs text-gray-500">
                                  {facility.priceInfo}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {user.company.length > 0 && context !== "coach" && context !== "participant" && (
                    <div>
                      <h5 className="text-md font-medium text-gray-800 mb-2">
                        Companies ({user.company.length})
                      </h5>
                      <div className="space-y-2">
                        {user.company.map((company) => (
                          <div
                            key={company._id}
                            className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                          >
                            {company.photo ? (
                              <img
                                src={`${EP.API_ASSETS_BASE}${company.photo.path}`}
                                alt={company.name}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                            ) : (
                              <Building className="w-5 h-5 text-green-600" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{company.name}</p>
                              <p className="text-sm text-gray-600">
                                <MapPin className="w-4 h-4 inline mr-1" />
                                {company.address}
                              </p>
                              {company.phone && (
                                <p className="text-sm text-gray-600">
                                  <Phone className="w-4 h-4 inline mr-1" />
                                  {company.phone}
                                </p>
                              )}
                              {company.email && (
                                <p className="text-sm text-gray-600">
                                  <Mail className="w-4 h-4 inline mr-1" />
                                  {company.email}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
