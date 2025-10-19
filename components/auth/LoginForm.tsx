"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onToggleForm: () => void;
  onLogin: (email: string, password: string) => void;
  loginError: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onToggleForm,
  onLogin,
  loginError,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="p-4 h-full flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white">
      {/* Logo/Brand Section */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <div className="text-white text-xl font-bold">G</div>
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Sign In to Good
        </h1>
        <p className="text-sm text-gray-600">
          New Here?{" "}
          <span
            onClick={onToggleForm}
            className="text-cyan-500 cursor-pointer hover:text-cyan-600 transition-colors font-medium"
          >
            Create an Account
          </span>
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <span className="text-cyan-500 text-sm cursor-pointer hover:text-cyan-600 transition-colors font-medium">
                Forgot Password?
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 px-4 rounded-lg transition-colors font-medium shadow-sm hover:shadow-md text-sm"
          >
            Continue
          </button>
        </form>
      </div>

      {/* Demo Credentials */}
      <div className="mt-5 p-3 bg-gradient-to-r from-orange-50 to-blue-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-700 font-medium mb-2">
          Demo Credentials:
        </p>
        <div className="space-y-1">
          <p className="text-xs text-gray-600">
            <span className="font-medium">Email:</span> demo@example.com
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-medium">Password:</span> password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
