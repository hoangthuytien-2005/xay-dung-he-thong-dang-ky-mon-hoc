"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  StudentData,
  LecturerData,
  AdminData,
  RegistrationPeriodData,
} from "@/lib/mock-data";
import {
  GraduationCap,
  ChevronDown,
  UserCheck,
  ShieldCheck,
} from "lucide-react";

export type UserRole = "student" | "lecturer" | "admin";

interface NavbarProps {
  currentUser: {
    role: UserRole;
    student?: StudentData | null;
    lecturer?: LecturerData | null;
    admin?: AdminData | null;
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
  const isLecturer = currentUser.role === "lecturer";
  const isAdmin = currentUser.role === "admin";
  const student = currentUser.student;
  const lecturer = currentUser.lecturer;
  const admin = currentUser.admin;

  const displayName = isStudent
    ? student?.fullName
    : isLecturer
    ? lecturer?.fullName
    : admin?.fullName;

  const displayCode = isStudent
    ? student?.studentCode
    : isLecturer
    ? lecturer?.lecturerCode
    : admin?.adminCode;

  const portalLabel = isStudent
    ? "Cổng Sinh viên"
    : isLecturer
    ? "Cổng Giảng viên"
    : "Quản trị Đào tạo";

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="bg-[#7F1D2D] border-b border-[#651525] text-white sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[68px] gap-4">
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 bg-white text-[#7F1D2D] rounded-lg flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2.5">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white truncate">
                  UniCredit Portal
                </span>
                <span className="hidden sm:inline-flex items-center text-[11px] font-medium bg-[#651525] text-white/95 px-2.5 py-0.5 rounded-md border border-white/15">
                  {portalLabel}
                </span>
              </div>
              <p className="text-xs text-white/80 truncate">
                Hệ thống Đăng ký Tín chỉ & Quản lý Học vụ
              </p>
            </div>
          </div>

          {/* Center: Period status indicator */}
          <div className="hidden lg:flex items-center space-x-2.5 bg-[#651525] px-3.5 py-1.5 rounded-lg border border-white/15 text-xs">
            {period?.isActive ? (
              <>
                <span
                  className="w-2 h-2 rounded-full bg-[#4ADE80]"
                  aria-hidden="true"
                />
                <span className="font-medium text-white/95">{period.name}</span>
                <span className="text-[11px] bg-[#15803D] text-white px-2 py-0.5 rounded font-medium">
                  Đang mở
                </span>
              </>
            ) : (
              <>
                <span
                  className="w-2 h-2 rounded-full bg-white/50"
                  aria-hidden="true"
                />
                <span className="font-medium text-white/85">
                  Đợt đăng ký tín chỉ hiện đang đóng
                </span>
              </>
            )}
          </div>

          {/* Right: User Account Menu */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="menu"
              className="flex items-center space-x-2.5 bg-[#651525]/80 hover:bg-[#651525] px-3 py-1.5 rounded-lg border border-white/15 transition-colors duration-150 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-white"
            >
              <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-white font-semibold text-xs border border-white/15 shrink-0">
                {isStudent ? (
                  student?.studentCode.slice(-3)
                ) : isAdmin ? (
                  <ShieldCheck className="w-4 h-4 text-white" />
                ) : (
                  <UserCheck className="w-4 h-4 text-white" />
                )}
              </div>

              <div className="hidden sm:block text-xs">
                <div className="font-semibold text-white flex items-center space-x-1.5">
                  <span className="truncate max-w-[150px]">{displayName}</span>
                  <span className="text-[11px] bg-white text-[#7F1D2D] font-semibold px-1.5 py-0.2 rounded">
                    {displayCode}
                  </span>
                </div>
                <div className="text-[11px] text-white/80 mt-0.5">
                  {isStudent ? (
                    <>
                      Lớp: {student?.administrativeClass} • CPA:{" "}
                      <span className="text-white font-semibold">
                        {student?.cpa.toFixed(2)}
                      </span>
                    </>
                  ) : isAdmin ? (
                    admin?.title
                  ) : (
                    lecturer?.title
                  )}
                </div>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-white/80 transition-transform duration-150 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Popover */}
            {isDropdownOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-60 bg-[#FFFFFF] rounded-lg shadow-lg border border-[#E5E7EB] text-[#1F2937] py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="px-4 py-2.5 border-b border-[#E5E7EB] bg-[#F8F9FB]">
                  <p className="font-semibold text-[#1F2937] truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-[#6B7280] font-mono mt-0.5">
                    Mã số: {displayCode} • {portalLabel}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full text-left px-4 py-2 flex items-center hover:bg-[#F8F9FB] text-[#1F2937] cursor-pointer"
                  >
                    <span>Thông tin cá nhân</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenChangePassword();
                    }}
                    className="w-full text-left px-4 py-2 flex items-center hover:bg-[#F8F9FB] text-[#1F2937] cursor-pointer"
                  >
                    <span>Đổi mật khẩu</span>
                  </button>
                </div>

                <div className="border-t border-[#E5E7EB] pt-1">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 flex items-center text-[#DC2626] hover:bg-[#FFF5F5] font-medium cursor-pointer"
                  >
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
