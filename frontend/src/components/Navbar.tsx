"use client";

import React, { useState, useRef, useEffect } from "react";
import { StudentData, LecturerData, RegistrationPeriodData } from "@/lib/mock-data";
import { GraduationCap, LogOut, User, KeyRound, ChevronDown, UserCheck } from "lucide-react";

export type UserRole = "student" | "lecturer";

interface NavbarProps {
  currentUser: {
    role: UserRole;
    student?: StudentData | null;
    lecturer?: LecturerData | null;
  };
  period: RegistrationPeriodData | null;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenChangePassword: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  period,
  onLogout,
  onOpenProfile,
  onOpenChangePassword,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isStudent = currentUser.role === "student";
  const student = currentUser.student;
  const lecturer = currentUser.lecturer;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-red-800 border-b border-red-900 text-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white text-red-800 rounded-md flex items-center justify-center font-bold text-xl shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white font-sans">
                  UniCredit Portal
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-red-950 text-red-200 px-2 py-0.5 rounded border border-red-700">
                  {isStudent ? "CỔNG SINH VIÊN" : "CỔNG GIẢNG VIÊN"}
                </span>
              </div>
              <p className="text-xs text-red-100">
                Hệ thống Đăng ký Tín chỉ & Quản lý Học vụ Trực tuyến
              </p>
            </div>
          </div>

          {/* Center: Period status indicator */}
          <div className="hidden md:flex items-center space-x-2 bg-red-900/80 px-3 py-1.5 rounded-md border border-red-700 text-xs">
            {period?.isActive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-medium text-red-50">{period.name}</span>
                <span className="text-[11px] bg-emerald-900 text-emerald-200 border border-emerald-700 px-1.5 py-0.2 rounded font-semibold">
                  Đang mở
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                <span className="font-medium text-red-200">Đợt đăng ký hiện đang đóng</span>
              </>
            )}
          </div>

          {/* Right: User Profile Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2.5 bg-red-900/80 hover:bg-red-900 px-3 py-1.5 rounded-md border border-red-700 transition cursor-pointer text-left focus:outline-none"
            >
              {/* Avatar Icon */}
              <div className="w-7 h-7 rounded bg-red-950 flex items-center justify-center text-red-200 font-bold text-xs border border-red-700 shrink-0">
                {isStudent ? (
                  student?.studentCode.slice(-3)
                ) : (
                  <UserCheck className="w-4 h-4 text-yellow-300" />
                )}
              </div>

              {/* User text */}
              <div className="text-xs">
                <div className="font-semibold text-white flex items-center space-x-1.5">
                  <span className="truncate max-w-[140px]">
                    {isStudent ? student?.fullName : lecturer?.fullName}
                  </span>
                  <span className="text-[10px] bg-white text-red-800 font-bold px-1 rounded">
                    {isStudent ? student?.studentCode : lecturer?.lecturerCode}
                  </span>
                </div>
                <div className="text-[11px] text-red-200">
                  {isStudent ? (
                    <>Lớp: {student?.administrativeClass} • CPA: <span className="text-yellow-300 font-bold">{student?.cpa.toFixed(2)}</span></>
                  ) : (
                    lecturer?.title
                  )}
                </div>
              </div>

              {/* Chevron Down */}
              <ChevronDown className="w-4 h-4 text-red-200" />
            </button>

            {/* Dropdown Popover */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-200 text-slate-800 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header in dropdown */}
                <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50">
                  <p className="font-bold text-slate-900 truncate">
                    {isStudent ? student?.fullName : lecturer?.fullName}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {isStudent ? student?.studentCode : lecturer?.lecturerCode}
                  </p>
                </div>

                {/* Option 1: Thông tin cá nhân */}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full text-left px-3.5 py-2 flex items-center space-x-2.5 hover:bg-slate-100 transition text-slate-700"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Thông tin cá nhân</span>
                </button>

                {/* Option 2: Đổi mật khẩu */}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenChangePassword();
                  }}
                  className="w-full text-left px-3.5 py-2 flex items-center space-x-2.5 hover:bg-slate-100 transition text-slate-700"
                >
                  <KeyRound className="w-4 h-4 text-slate-500" />
                  <span>Đổi mật khẩu</span>
                </button>

                <div className="my-1 border-t border-slate-100"></div>

                {/* Option 3: Đăng xuất */}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3.5 py-2 flex items-center space-x-2.5 text-rose-700 hover:bg-rose-50 transition font-semibold"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
