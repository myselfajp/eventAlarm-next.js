"use client";

import React, { useState } from "react";
import LoginForm from "./auth/LoginForm";
import RegistrationForm from "./auth/RegistrationForm";
import ProfileSidebar from "./profile/ProfileSidebar";

interface LeftSidebarProps {
  isOpen: boolean;
}

// Fake user credentials for testing
const FAKE_USER = {
  email: "demo@example.com",
  password: "password123",
  facilities: [
    "a3f8c9d2-1e4b-4c7d-9a2f-8b5e3c1d6a4e",
    "b7e2d4f1-3a9c-4e8d-b5f2-9c6a1d8e4b7f",
  ],
  companies: ["c1d3e5f7-2a4b-4d8e-9f1a-3c5b7d9e1f2a"],
};

const DUMMY_FACILITIES = [
  {
    id: "a3f8c9d2-1e4b-4c7d-9a2f-8b5e3c1d6a4e",
    name: "Downtown Sports Complex",
    address:
      "123 Main Street, Building A\nDowntown District, City Center\nFloor 2, Suite 205",
    phone: "+1 (555) 123-4567",
    email: "info@downtownsports.com",
    photo: "",
    mainSport: "Basketball",
    isPrivate: false,
  },
  {
    id: "b7e2d4f1-3a9c-4e8d-b5f2-9c6a1d8e4b7f",
    name: "Elite Fitness Academy",
    address: "456 Oak Avenue\nWestside, Metro Area\nBuilding 3",
    phone: "+1 (555) 987-6543",
    email: "contact@elitefitness.com",
    photo: "",
    mainSport: "CrossFit",
    isPrivate: true,
  },
];

const DUMMY_COMPANIES = [
  {
    id: "c1d3e5f7-2a4b-4d8e-9f1a-3c5b7d9e1f2a",
    name: "Tech Solutions Inc.",
    address: "789 Innovation Drive\nTech Park, Silicon Valley\nSuite 400",
    phone: "+1 (555) 456-7890",
    email: "info@techsolutions.com",
    photo: "",
  },
];

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  const handleLogin = (email: string, password: string) => {
    setLoginError("");

    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      setIsLoggedIn(true);
    } else {
      setLoginError("Invalid email or password");
    }
  };

  const handleRegistration = (formData: any) => {
    setRegistrationError("");

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phoneNumber ||
      !formData.birthday ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setRegistrationError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setRegistrationError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setRegistrationError("Password must be at least 8 characters long");
      return;
    }

    if (!formData.agreeTerms) {
      setRegistrationError("Please agree to the terms and conditions");
      return;
    }

    // Simulate successful registration
    setIsLoggedIn(true);
    setShowRegistration(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowRegistration(false);
    setLoginError("");
    setRegistrationError("");
  };

  const toggleForm = () => {
    setShowRegistration(!showRegistration);
    setLoginError("");
    setRegistrationError("");
  };

  return (
    <div
      className={`${isOpen ? "w-80" : "w-0"} lg:${
        isOpen ? "w-80" : "w-0"
      } h-screen bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0`}
    >
      {isLoggedIn ? (
        <ProfileSidebar
          onLogout={handleLogout}
          initialFacilities={DUMMY_FACILITIES}
          initialCompanies={DUMMY_COMPANIES}
        />
      ) : showRegistration ? (
        <RegistrationForm
          onToggleForm={toggleForm}
          onRegister={handleRegistration}
          registrationError={registrationError}
        />
      ) : (
        <LoginForm
          onToggleForm={toggleForm}
          onLogin={handleLogin}
          loginError={loginError}
        />
      )}
    </div>
  );
};

export default LeftSidebar;
