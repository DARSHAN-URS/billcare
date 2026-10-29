"use client";

import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, id, error, icon, isPassword = false, type = "text", className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const effectiveType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-1.5 w-full text-left">
        <label
          htmlFor={inputId}
          className="block text-[13px] font-medium text-[#A1A1AA] select-none"
        >
          {label}
        </label>

        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            className={`w-full h-11 bg-[#0B0B0B] border rounded-lg text-sm text-[#F8FAFC] placeholder-[#71717A] transition-colors ${
              icon ? "pl-10" : "pl-3.5"
            } ${isPassword ? "pr-11" : "pr-3.5"} ${
              error
                ? "border-[#F87171] focus:border-[#F87171] focus:ring-1 focus:ring-[#F87171]"
                : "border-[#27272A] focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]"
            } focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#F8FAFC] transition-colors p-1 rounded focus:outline-none focus:ring-1 focus:ring-[#FACC15]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>

        {error && (
          <p className="text-xs text-[#F87171] mt-1 flex items-center gap-1 font-normal">
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
