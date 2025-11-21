"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Loader, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSports } from "@/app/lib/facility-api";

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void> | void;
  initialData?: FacilityFormData | null;
}

interface FacilityFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  photo: string;
  mainSport: string;
  isPrivate: boolean;
}

const FacilityModal: React.FC<FacilityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [formData, setFormData] = useState<FacilityFormData>({
    name: "",
    address: "",
    phone: "",
    email: "",
    photo: "",
    mainSport: "",
    isPrivate: false,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<FacilityFormData>>({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: sports = [] } = useQuery({
    queryKey: ["reference", "sports"],
    queryFn: () => getSports(1, 100),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.photo) {
        setPhotoPreview(initialData.photo);
      }
      setPhotoFile(null);
    } else {
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        photo: "",
        mainSport: "",
        isPrivate: false,
      });
      setPhotoPreview(null);
      setPhotoFile(null);
    }
  }, [initialData]);

  const handleInputChange = (
    field: keyof FacilityFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setGeneralError("");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotoPreview(result);
        handleInputChange("photo", result);
      };
      reader.readAsDataURL(file);
      setPhotoFile(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    handleInputChange("photo", "");
    setPhotoFile(null);
  };

  const validateForm = () => {
    const newErrors: Partial<FacilityFormData> = {};
    let isValid = true;

    // Strict validation for Create mode, relaxed for Edit mode
    if (!initialData) {
      if (!formData.name) newErrors.name = "Facility Name is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.phone) newErrors.phone = "Phone is required";
      if (!formData.email) newErrors.email = "E-mail is required";
      if (!formData.mainSport) newErrors.mainSport = "Main Sport is required";
      if (!photoFile && !formData.photo) newErrors.photo = "Facility Photo is required";
    }

    // Format validation (always apply if field is present)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation: Allow digits, spaces, dashes, parentheses, and plus sign
    if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setErrors({});

    if (!validateForm()) {
      setGeneralError("Please fix the errors below.");
      return;
    }

    setIsLoading(true);

    const submitData = new FormData();
    
    const facilityData = {
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      mainSport: formData.mainSport,
      private: formData.isPrivate,
    };

    submitData.append("data", JSON.stringify(facilityData));
    
    if (photoFile) {
      submitData.append("facility-photo", photoFile);
    }

    try {
      await onSubmit(submitData);
      setIsSuccess(true);
      
      // Reset form after short delay to show success state
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({
          name: "",
          address: "",
          phone: "",
          email: "",
          photo: "",
          mainSport: "",
          isPrivate: false,
        });
        setPhotoPreview(null);
        setPhotoFile(null);
      }, 1500);
    } catch (err) {
      console.error("Error submitting facility:", err);
      setGeneralError("Failed to save facility. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setGeneralError("");
    setErrors({});
    setIsLoading(false);
    setIsSuccess(false);
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      photo: "",
      mainSport: "",
      isPrivate: false,
    });
    setPhotoPreview(null);
    setPhotoFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? "Edit Facility" : "Add Facility"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Success!
            </h3>
            <p className="text-gray-500">
              Facility {initialData ? "updated" : "created"} successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility Name {!initialData && <span className="text-red-500">*</span>}
                </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter facility name"
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.name
                        ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                        : "border-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address {!initialData && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter address"
                  rows={4}
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                    errors.address
                      ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                      : "border-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                  }`}
                  disabled={isLoading}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone {!initialData && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.phone
                      ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                      : "border-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                  }`}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail {!initialData && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                      : "border-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                  }`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Main Sport */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Sport {!initialData && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={formData.mainSport}
                  onChange={(e) =>
                    handleInputChange("mainSport", e.target.value)
                  }
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                    errors.mainSport
                      ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                      : "border-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Select a sport</option>
                  {sports.map((sport: any) => (
                    <option key={sport._id} value={sport._id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
                {errors.mainSport && (
                  <p className="mt-1 text-xs text-red-500">{errors.mainSport}</p>
                )}
              </div>

              {/* Private Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onChange={(e) =>
                    handleInputChange("isPrivate", e.target.checked)
                  }
                  className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                  disabled={isLoading}
                />
                <label
                  htmlFor="isPrivate"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Private Facility
                </label>
              </div>
            </div>

            {/* Right Column - Photo Upload */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facility Photo
              </label>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full">
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors cursor-pointer">
                    {photoPreview ? (
                      <div className="flex flex-col items-center space-y-3">
                        <img
                          src={photoPreview}
                          alt="Facility preview"
                          className="h-48 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                        >
                          Remove Photo
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="w-12 h-12 mx-auto text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Click to upload photo
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG, JPEG up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpg,image/jpeg"
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.photo && (
                    <p className="mt-2 text-xs text-red-500 text-center">{errors.photo}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {generalError && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {generalError}
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : (
                initialData ? "Update Facility" : "Add Facility"
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default FacilityModal;
