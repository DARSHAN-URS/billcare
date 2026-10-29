"use client";

import React from "react";
import Image from "next/image";

interface BillCareLogoProps {
  className?: string;
  variant?: "full" | "icon" | "horizontal" | "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
}

export function BillCareLogo({
  className = "",
  variant = "full",
  size = "md",
  showSubtitle = true,
}: BillCareLogoProps) {
  const sizeMap = {
    sm: { icon: "w-7 h-7", text: "text-sm", sub: "text-[9px]" },
    md: { icon: "w-9 h-9", text: "text-base", sub: "text-[10px]" },
    lg: { icon: "w-12 h-12", text: "text-xl", sub: "text-xs" },
    xl: { icon: "w-16 h-16", text: "text-2xl", sub: "text-sm" },
  };

  const currentSize = sizeMap[size];

  if (variant === "icon") {
    return (
      <div
        className={`relative flex items-center justify-center rounded-xl bg-slate-950 text-white font-black overflow-hidden shadow-sm border border-slate-800 ${currentSize.icon} ${className}`}
      >
        {/* Stylized 'B' monogram */}
        <svg
          viewBox="0 0 100 100"
          className="w-4/5 h-4/5 fill-current text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized sharp B shape */}
          <path
            d="M22 15 L55 15 C72 15 82 23 82 36 C82 44 76 50 67 53 C78 56 86 63 86 75 C86 89 74 97 53 97 L22 97 L22 15 Z M42 32 L42 47 L53 47 C60 47 65 44 65 39 C65 34 60 32 53 32 L42 32 Z M42 63 L42 81 L55 81 C63 81 68 77 68 72 C68 66 63 63 55 63 L42 63 Z"
            fillRule="evenodd"
          />
          <polygon points="18,85 52,20 40,20 12,85" fill="#000" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Badge */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-slate-950 text-white font-black overflow-hidden shadow-sm border border-slate-800 ${currentSize.icon} shrink-0`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-4/5 h-4/5 fill-current text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 15 L55 15 C72 15 82 23 82 36 C82 44 76 50 67 53 C78 56 86 63 86 75 C86 89 74 97 53 97 L22 97 L22 15 Z M42 32 L42 47 L53 47 C60 47 65 44 65 39 C65 34 60 32 53 32 L42 32 Z M42 63 L42 81 L55 81 C63 81 68 77 68 72 C68 66 63 63 55 63 L42 63 Z"
            fillRule="evenodd"
          />
          <polygon points="18,85 52,20 40,20 12,85" fill="#000" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight uppercase ${
              variant === "light" ? "text-white" : "text-slate-950"
            } ${currentSize.text}`}
          >
            BILL CARE
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`font-semibold tracking-widest uppercase ${
              variant === "light" ? "text-amber-400/90" : "text-slate-500"
            } ${currentSize.sub}`}
          >
            SOLUTION
          </span>
        )}
      </div>
    </div>
  );
}
