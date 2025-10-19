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
};

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
      } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0`}
    >
      {isLoggedIn ? (
        <ProfileSidebar onLogout={handleLogout} />
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
