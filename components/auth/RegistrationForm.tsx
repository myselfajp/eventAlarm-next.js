"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface RegistrationFormProps {
  onToggleForm: () => void;
  onRegister: (formData: RegistrationData) => void;
  registrationError: string;
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthday: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onToggleForm,
  onRegister,
  registrationError,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: RegistrationData = {
      firstName,
      lastName,
      phoneNumber,
      birthday,
      email,
      password,
      confirmPassword,
      agreeTerms,
    };
    onRegister(formData);
  };

  return (
    <div className="p-4 h-full flex flex-col justify-start bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
      {/* Logo/Brand Section */}
      <div className="text-center mb-6 sticky top-0 bg-gradient-to-br from-gray-50 to-white pt-2 pb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <div className="text-white text-xl font-bold">G</div>
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Create an Account
        </h1>
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={onToggleForm}
            className="text-cyan-500 cursor-pointer hover:text-cyan-600 transition-colors font-medium"
          >
            Sign in here
          </span>
        </p>
      </div>

      {/* Registration Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              required
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birthday <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use 8+ characters with letters, numbers & symbols
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3 py-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-700 leading-relaxed"
            >
              I Agree{" "}
              <span className="text-cyan-500 cursor-pointer hover:text-cyan-600 transition-colors">
                Terms and conditions.
              </span>
            </label>
          </div>

          {registrationError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
              {registrationError}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 px-4 rounded-lg transition-colors font-medium shadow-sm hover:shadow-md text-sm"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
