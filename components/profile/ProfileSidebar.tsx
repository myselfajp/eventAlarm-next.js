"use client";

import React, { useState } from "react";
import {
  Search,
  Activity,
  Users,
  Settings,
  User,
  Home,
  Building,
  LogOut,
  ChevronRight,
  X,
  Trash2,
  Edit,
  Check,
} from "lucide-react";
import { useMe } from "@/app/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import ParticipantModal from "./ParticipantModal";
import CoachModal from "./CoachModal";
import FacilityModal from "./FacilityModal";
import CompanyModal from "./CompanyModal";
import FindModal from "./FindModal";

interface ProfileSidebarProps {
  onLogout: () => void;
  initialFacilities?: any[];
  initialCompanies?: any[];
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  onLogout,
  initialFacilities = [],
  initialCompanies = [],
}) => {
  const { data: user } = useMe();
  const queryClient = useQueryClient();
  const hasParticipantProfile = !!user?.participant;
  const hasCoachProfile = !!user?.coach;

  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [isFacilitiesListOpen, setIsFacilitiesListOpen] = useState(false);
  const [facilities, setFacilities] = useState<any[]>(initialFacilities);
  const [editingFacility, setEditingFacility] = useState<any | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isCompaniesListOpen, setIsCompaniesListOpen] = useState(false);
  const [companies, setCompanies] = useState<any[]>(initialCompanies);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);

  const handleCreateParticipant = async (formData: any) => {
    console.log("Participant profile saved:", formData);
    await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    setIsParticipantModalOpen(false);
  };

  const handleOpenParticipantModal = () => {
    setIsParticipantModalOpen(true);
  };

  const handleCloseParticipantModal = () => {
    setIsParticipantModalOpen(false);
  };

  const handleCreateCoach = (formData: any) => {
    console.log("Creating coach:", formData);
    // Here you can add logic to save the coach data
    // For now, we'll just log it
  };

  const handleOpenCoachModal = () => {
    setIsCoachModalOpen(true);
  };

  const handleCloseCoachModal = () => {
    setIsCoachModalOpen(false);
  };

  const handleCreateFacility = (formData: any) => {
    if (editingFacility) {
      setFacilities((prev) =>
        prev.map((facility) =>
          facility.id === editingFacility.id
            ? { ...facility, ...formData }
            : facility
        )
      );
      setEditingFacility(null);
    } else {
      setFacilities((prev) => [
        ...prev,
        { id: Date.now().toString(), ...formData },
      ]);
    }
  };

  const handleOpenFacilityModal = () => {
    setIsFacilityModalOpen(true);
  };

  const handleCloseFacilityModal = () => {
    setIsFacilityModalOpen(false);
    setEditingFacility(null);
  };

  const handleFacilityAdd = () => {
    setEditingFacility(null);
    handleOpenFacilityModal();
  };

  const handleEditFacility = (facility: any) => {
    setEditingFacility(facility);
    setIsFacilityModalOpen(true);
  };

  const handleDeleteFacility = (facilityId: string) => {
    setFacilities((prev) =>
      prev.filter((facility) => facility.id !== facilityId)
    );
  };

  const handleCreateCompany = (formData: any) => {
    if (editingCompany) {
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === editingCompany.id
            ? { ...company, ...formData }
            : company
        )
      );
      setEditingCompany(null);
    } else {
      setCompanies((prev) => [
        ...prev,
        { id: Date.now().toString(), ...formData },
      ]);
    }
  };

  const handleOpenCompanyModal = () => {
    setIsCompanyModalOpen(true);
  };

  const handleCloseCompanyModal = () => {
    setIsCompanyModalOpen(false);
    setEditingCompany(null);
  };

  const handleCompanyAdd = () => {
    setEditingCompany(null);
    handleOpenCompanyModal();
  };

  const handleEditCompany = (company: any) => {
    setEditingCompany(company);
    setIsCompanyModalOpen(true);
  };

  const handleDeleteCompany = (companyId: string) => {
    setCompanies((prev) => prev.filter((company) => company.id !== companyId));
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-lg sm:text-xl font-bold text-cyan-500">
          Events Dashboard
        </h1>
      </div>

      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500 rounded-2xl flex items-center justify-center mb-3">
          <div className="text-white text-3xl sm:text-4xl">😊</div>
        </div>
        <h2 className="font-semibold text-gray-800">
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : "User"}
        </h2>
        <p className="text-sm text-gray-500">{user?.email || ""}</p>
      </div>

      <div className="flex justify-around mb-6 sm:mb-8 text-center">
        <div>
          <div className="font-bold text-gray-800 text-sm sm:text-base">0</div>
          <div className="text-xs text-gray-500">Total Earnings</div>
        </div>
        <div>
          <div className="font-bold text-gray-800 text-sm sm:text-base">0</div>
          <div className="text-xs text-gray-500">New Referrals</div>
        </div>
        <div>
          <div className="font-bold text-gray-800 text-sm sm:text-base">0</div>
          <div className="text-xs text-gray-500">New Deals</div>
        </div>
      </div>

      <nav className="space-y-1">
        <button
          onClick={() => setIsFindModalOpen(true)}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Search className="w-4 h-4 mr-3 text-gray-500" />
          <div className="text-left flex-1">
            <div>Find</div>
            <div className="text-xs text-gray-400">
              Search coaches, facilities...
            </div>
          </div>
        </button>

        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Activity className="w-4 h-4 mr-3 text-gray-500" />
          Activity
        </a>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Users className="w-4 h-4 mr-3 text-gray-500" />
          Followers
        </a>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4 mr-3 text-gray-500" />
          Settings
        </a>
      </nav>

      {/* Divider */}
      <div className="my-4 border-t border-gray-200"></div>

      <div className="space-y-2">
        {/* Participant Profile */}
        <button
          onClick={handleOpenParticipantModal}
          className={`w-full bg-white border rounded-lg p-3 transition-all group ${
            hasParticipantProfile
              ? "border-green-300 bg-green-50"
              : "border-blue-200 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-1.5 rounded-md ${
                hasParticipantProfile ? "bg-green-100" : "bg-blue-100"
              }`}
            >
              <User
                className={`w-4 h-4 ${
                  hasParticipantProfile ? "text-green-600" : "text-blue-600"
                }`}
              />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-gray-800 text-sm">
                I'm a Participant
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1.5">
                {hasParticipantProfile ? (
                  <>
                    <span className="inline-flex items-center text-green-600">
                      <Check className="w-3 h-3 mr-0.5" />
                      Added
                    </span>
                    <span className="text-gray-400">·</span>
                    <span>Edit your information</span>
                  </>
                ) : (
                  "Enter your participant information"
                )}
              </div>
            </div>
            <ChevronRight
              className={`w-4 h-4 text-gray-400 ${
                hasParticipantProfile
                  ? "group-hover:text-green-600"
                  : "group-hover:text-blue-600"
              }`}
            />
          </div>
        </button>

        {/* Coach Profile */}
        <button
          onClick={handleOpenCoachModal}
          className={`w-full bg-white border rounded-lg p-3 transition-all group ${
            hasCoachProfile
              ? "border-green-300 bg-green-50"
              : "border-purple-200 hover:border-purple-400 hover:bg-purple-50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-1.5 rounded-md ${
                hasCoachProfile ? "bg-green-100" : "bg-purple-100"
              }`}
            >
              <Users
                className={`w-4 h-4 ${
                  hasCoachProfile ? "text-green-600" : "text-purple-600"
                }`}
              />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-gray-800 text-sm">
                I'm a Coach
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1.5">
                {hasCoachProfile ? (
                  <>
                    <span className="inline-flex items-center text-green-600">
                      <Check className="w-3 h-3 mr-0.5" />
                      Added
                    </span>
                    <span className="text-gray-400">·</span>
                    <span>Edit your credentials</span>
                  </>
                ) : (
                  "Enter your coaching credentials"
                )}
              </div>
            </div>
            <ChevronRight
              className={`w-4 h-4 text-gray-400 ${
                hasCoachProfile
                  ? "group-hover:text-green-600"
                  : "group-hover:text-purple-600"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-200"></div>

      {/* My Resources Section */}
      <div className="space-y-2 pb-4">
        <div className="px-1 mb-1">
          <h4 className="text-xs font-medium text-gray-400 uppercase">
            My Resources
          </h4>
        </div>

        {/* My Facilities */}
        <button
          onClick={() => setIsFacilitiesListOpen(true)}
          className="w-full bg-white border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 rounded-lg p-3 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="bg-cyan-50 p-1.5 rounded-md group-hover:bg-cyan-100">
              <Home className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-800 text-sm">
                My Facilities
              </div>
              <div className="text-xs text-gray-500">
                {facilities.length}{" "}
                {facilities.length === 1 ? "facility" : "facilities"}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-600" />
        </button>

        {/* My Companies */}
        <button
          onClick={() => setIsCompaniesListOpen(true)}
          className="w-full bg-white border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 rounded-lg p-3 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="bg-cyan-50 p-1.5 rounded-md group-hover:bg-cyan-100">
              <Building className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-800 text-sm">
                My Companies
              </div>
              <div className="text-xs text-gray-500">
                {companies.length}{" "}
                {companies.length === 1 ? "company" : "companies"}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-600" />
        </button>
      </div>

      {/* Participant Modal */}
      <ParticipantModal
        isOpen={isParticipantModalOpen}
        onClose={handleCloseParticipantModal}
        onSubmit={handleCreateParticipant}
      />

      {/* Coach Modal */}
      <CoachModal
        isOpen={isCoachModalOpen}
        onClose={handleCloseCoachModal}
        onSubmit={handleCreateCoach}
      />

      {/* Facility Modal */}
      <FacilityModal
        isOpen={isFacilityModalOpen}
        onClose={handleCloseFacilityModal}
        onSubmit={handleCreateFacility}
        initialData={editingFacility}
      />

      {/* Facilities List Modal */}
      {isFacilitiesListOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                My Facilities
              </h2>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setIsFacilitiesListOpen(false);
                    handleFacilityAdd();
                  }}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
                >
                  <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Add Facility</span>
                  <span className="sm:hidden">Add</span>
                </button>
                <button
                  onClick={() => setIsFacilitiesListOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              {facilities.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Home className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm mb-2">No facilities yet</p>
                  <p className="text-xs text-gray-400">
                    Click "Add Facility" to create your first facility
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {facilities.map((facility) => (
                    <div
                      key={facility.id}
                      className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow relative"
                    >
                      {/* Edit and Delete Buttons */}
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1.5 sm:gap-2">
                        <button
                          onClick={() => {
                            handleEditFacility(facility);
                            setIsFacilitiesListOpen(false);
                          }}
                          className="p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFacility(facility.id)}
                          className="p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      {facility.photo && (
                        <img
                          src={facility.photo}
                          alt={facility.name}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-2 pr-16 sm:pr-20">
                        {facility.name}
                        {facility.isPrivate && (
                          <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Private
                          </span>
                        )}
                      </h3>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex items-start">
                          <span className="font-medium text-gray-600 w-20 sm:w-24">
                            Address:
                          </span>
                          <span className="text-gray-800 flex-1">
                            {facility.address}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 w-20 sm:w-24">
                            Phone:
                          </span>
                          <span className="text-gray-800">
                            {facility.phone}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 w-20 sm:w-24">
                            Email:
                          </span>
                          <span className="text-gray-800 break-all">
                            {facility.email}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 w-20 sm:w-24">
                            Main Sport:
                          </span>
                          <span className="text-cyan-600 font-medium">
                            {facility.mainSport}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setIsFacilitiesListOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Modal */}
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={handleCloseCompanyModal}
        onSubmit={handleCreateCompany}
        initialData={editingCompany}
      />

      {/* Companies List Modal */}
      {isCompaniesListOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                My Companies
              </h2>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setIsCompaniesListOpen(false);
                    handleCompanyAdd();
                  }}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
                >
                  <Building className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Add Company</span>
                  <span className="sm:hidden">Add</span>
                </button>
                <button
                  onClick={() => setIsCompaniesListOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              {companies.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm mb-2">No companies yet</p>
                  <p className="text-xs text-gray-400">
                    Click "Add Company" to create your first company
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {companies.map((company) => (
                    <div
                      key={company.id}
                      className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow relative"
                    >
                      {/* Edit and Delete Buttons */}
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1.5 sm:gap-2">
                        <button
                          onClick={() => {
                            handleEditCompany(company);
                            setIsCompaniesListOpen(false);
                          }}
                          className="p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company.id)}
                          className="p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      {company.photo && (
                        <img
                          src={company.photo}
                          alt={company.name}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-2 pr-16 sm:pr-20">
                        {company.name}
                      </h3>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex items-start">
                          <span className="font-medium text-gray-600 w-20 sm:w-24">
                            Address:
                          </span>
                          <span className="text-gray-800 flex-1">
                            {company.address}
                          </span>
                        </div>
                        {company.phone && (
                          <div className="flex items-center">
                            <span className="font-medium text-gray-600 w-20 sm:w-24">
                              Phone:
                            </span>
                            <span className="text-gray-800">
                              {company.phone}
                            </span>
                          </div>
                        )}
                        {company.email && (
                          <div className="flex items-center">
                            <span className="font-medium text-gray-600 w-20 sm:w-24">
                              Email:
                            </span>
                            <span className="text-gray-800 break-all">
                              {company.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setIsCompaniesListOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button at Bottom */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Find Modal */}
      <FindModal
        isOpen={isFindModalOpen}
        onClose={() => setIsFindModalOpen(false)}
      />
    </div>
  );
};

export default ProfileSidebar;
