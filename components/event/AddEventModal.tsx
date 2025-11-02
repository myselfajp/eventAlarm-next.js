"use client";

import React, { useState } from "react";
import { X, Upload, ImageIcon } from "lucide-react";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: EventFormData) => void;
}

interface EventFormData {
  banner: string;
  image: string;
  eventName: string;
  club: string;
  group: string;
  eventStyle: string;
  sportGroup: string;
  sportName: string;
  facility: string;
  salon: string;
  eventLocation: string;
  eventStartDate: string;
  eventStartTime: string;
  eventEndDate: string;
  eventEndTime: string;
  capacity: string;
  level: string;
  type: string;
  priceType: string;
  participantFee: string;
  equipment: string;
  isPrivate: boolean;
  isRecurring: boolean;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    banner: "",
    image: "",
    eventName: "",
    club: "",
    group: "",
    eventStyle: "",
    sportGroup: "",
    sportName: "",
    facility: "",
    salon: "",
    eventLocation: "",
    eventStartDate: "",
    eventStartTime: "",
    eventEndDate: "",
    eventEndTime: "",
    capacity: "",
    level: "",
    type: "",
    priceType: "",
    participantFee: "",
    equipment: "",
    isPrivate: false,
    isRecurring: false,
  });

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleInputChange = (
    field: keyof EventFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");

    // Reset participant fee if price type is free
    if (field === "priceType" && value === "free") {
      setFormData((prev) => ({
        ...prev,
        participantFee: "",
      }));
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
        setError("Allowed file types: png, jpg");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setBannerPreview(result);
        handleInputChange("banner", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBanner = () => {
    setBannerPreview(null);
    handleInputChange("banner", "");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
        setError("Allowed file types: png, jpg");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        handleInputChange("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    handleInputChange("image", "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Required fields validation
    if (
      !formData.image ||
      !formData.banner ||
      !formData.eventName ||
      !formData.eventStyle ||
      !formData.sportGroup ||
      !formData.sportName ||
      !formData.eventLocation ||
      !formData.eventStartDate ||
      !formData.eventStartTime ||
      !formData.capacity ||
      !formData.level ||
      !formData.type ||
      !formData.priceType
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate that at least one of Facility, Salon, or Location is provided
    if (!formData.facility && !formData.salon && !formData.eventLocation) {
      setError("Exactly one of Facility, Salon, or Location must be provided.");
      return;
    }

    // Participant Fee validation
    if (formData.priceType !== "free" && !formData.participantFee) {
      setError("Participant Fee is required when Price Type is not 'free'");
      return;
    }

    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setError("");
    setFormData({
      banner: "",
      image: "",
      eventName: "",
      club: "",
      group: "",
      eventStyle: "",
      sportGroup: "",
      sportName: "",
      facility: "",
      salon: "",
      eventLocation: "",
      eventStartDate: "",
      eventStartTime: "",
      eventEndDate: "",
      eventEndTime: "",
      capacity: "",
      level: "",
      type: "",
      priceType: "",
      participantFee: "",
      equipment: "",
      isPrivate: false,
      isRecurring: false,
    });
    setBannerPreview(null);
    setImagePreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            Add a New Event
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Event Banner and Image Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Event Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image <span className="text-red-500">*</span>
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-cyan-400 transition-colors">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Event"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 space-y-2 p-4">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                      <Upload className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-500 text-center">
                        Upload Image
                      </p>
                      <input
                        type="file"
                        accept="image/png,image/jpg,image/jpeg"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">png, jpg</p>
              </div>

              {/* Event Banner */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Banner <span className="text-red-500">*</span>
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-cyan-400 transition-colors">
                  {bannerPreview ? (
                    <div className="relative">
                      <img
                        src={bannerPreview}
                        alt="Event banner"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeBanner}
                        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 space-y-2 p-4">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                      <Upload className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-500 text-center">
                        Upload Banner
                      </p>
                      <input
                        type="file"
                        accept="image/png,image/jpg,image/jpeg"
                        onChange={handleBannerUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">png, jpg</p>
              </div>
            </div>

            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => handleInputChange("eventName", e.target.value)}
                placeholder="What's Your Event's Name"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            {/* Club, Group, Event Style Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Club (optional)
                </label>
                <input
                  type="text"
                  value={formData.club}
                  onChange={(e) => handleInputChange("club", e.target.value)}
                  placeholder="Find a club"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group (optional)
                </label>
                <input
                  type="text"
                  value={formData.group}
                  onChange={(e) => handleInputChange("group", e.target.value)}
                  placeholder="Find a group"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Style <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.eventStyle}
                  onChange={(e) =>
                    handleInputChange("eventStyle", e.target.value)
                  }
                  placeholder="Find event style"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Sport Group and Sport Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sport Group <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sportGroup}
                  onChange={(e) =>
                    handleInputChange("sportGroup", e.target.value)
                  }
                  placeholder="Find sport group"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sport Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sportName}
                  onChange={(e) =>
                    handleInputChange("sportName", e.target.value)
                  }
                  placeholder="Find sport"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
              Exactly one of Facility, Salon, or Location must be provided.
            </p>

            {/* Facility and Salon Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.facility}
                  onChange={(e) =>
                    handleInputChange("facility", e.target.value)
                  }
                  placeholder="Find facility"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salon
                </label>
                <input
                  type="text"
                  value={formData.salon}
                  onChange={(e) => handleInputChange("salon", e.target.value)}
                  placeholder="Find salon"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Event Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Location <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.eventLocation}
                onChange={(e) =>
                  handleInputChange("eventLocation", e.target.value)
                }
                placeholder="If there are no Facility/Salon"
                rows={3}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors resize-none"
                required
              />
            </div>

            {/* Event Start Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.eventStartDate}
                  onChange={(e) =>
                    handleInputChange("eventStartDate", e.target.value)
                  }
                  placeholder="Pick a start date"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.eventStartTime}
                  onChange={(e) =>
                    handleInputChange("eventStartTime", e.target.value)
                  }
                  placeholder="Pick a start time"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Event End Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event End Date
                </label>
                <input
                  type="date"
                  value={formData.eventEndDate}
                  onChange={(e) =>
                    handleInputChange("eventEndDate", e.target.value)
                  }
                  placeholder="Pick a end date"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event End Time
                </label>
                <input
                  type="time"
                  value={formData.eventEndTime}
                  onChange={(e) =>
                    handleInputChange("eventEndTime", e.target.value)
                  }
                  placeholder="Pick a end time"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Capacity, Level, Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    handleInputChange("capacity", e.target.value)
                  }
                  placeholder="Capacity"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => handleInputChange("level", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors bg-white"
                  required
                >
                  <option value="">Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors bg-white"
                  required
                >
                  <option value="">Type</option>
                  <option value="training">Training</option>
                  <option value="competition">Competition</option>
                  <option value="tournament">Tournament</option>
                  <option value="workshop">Workshop</option>
                  <option value="social">Social</option>
                </select>
              </div>
            </div>

            {/* Price Type and Participant Fee Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.priceType}
                  onChange={(e) =>
                    handleInputChange("priceType", e.target.value)
                  }
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors bg-white"
                  required
                >
                  <option value="">Price Type</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                  <option value="donation">Donation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participant Fee <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.participantFee}
                  onChange={(e) =>
                    handleInputChange("participantFee", e.target.value)
                  }
                  placeholder="Participant Fee"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={formData.priceType === "free"}
                  min="0"
                />
                {formData.priceType === "free" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Disabled if Price Type is "free".
                  </p>
                )}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment
              </label>
              <textarea
                value={formData.equipment}
                onChange={(e) => handleInputChange("equipment", e.target.value)}
                placeholder="Equipment"
                rows={3}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors resize-none"
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onChange={(e) =>
                    handleInputChange("isPrivate", e.target.checked)
                  }
                  className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                />
                <label
                  htmlFor="isPrivate"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Is Private?
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) =>
                    handleInputChange("isRecurring", e.target.checked)
                  }
                  className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                />
                <label
                  htmlFor="isRecurring"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Is Recurring?
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex gap-3 pt-6 mt-6 pb-6 px-6 -mx-6 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
