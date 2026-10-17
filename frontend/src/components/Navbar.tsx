"use client";

import React from "react";
import { StudentData, LecturerData, RegistrationPeriodData } from "@/lib/mock-data";
import { GraduationCap, LogOut, Database, UserCheck, BookOpen } from "lucide-react";

export type UserRole = "student" | "lecturer";

interface NavbarProps {
  currentUser: {
    role: UserRole;
    student?: StudentData | null;
    lecturer?: LecturerData | null;
  };
  period: RegistrationPeriodData | null;
  onSeedData: () => void;
  isSeeding: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  period,
  onSeedData,
  isSeeding,
  onLogout,
}) => {
  const isStudent = currentUser.role === "student";
  const student = currentUser.student;
  const lecturer = currentUser.lecturer;

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
                Hệ thống Đăng ký Tín chỉ & Quản trị Học vụ Trực tuyến
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

          {/* Right: Actions & User Info Badge */}
          <div className="flex items-center space-x-3">
            {/* Quick Sync Button */}
            <button
              onClick={onSeedData}
              disabled={isSeeding}
              title="Khôi phục dữ liệu mẫu vào MongoDB"
              className="hidden lg:flex items-center space-x-1.5 text-xs bg-red-900/60 hover:bg-red-900 text-red-100 px-2.5 py-1.5 rounded-md border border-red-700 transition"
            >
              <Database className="w-3.5 h-3.5 text-red-300" />
              <span>{isSeeding ? "Đang nạp..." : "Đồng bộ DB"}</span>
            </button>

            {/* User Profile Badge */}
            {isStudent && student ? (
              <div className="flex items-center space-x-2.5 bg-red-900/80 px-3 py-1.5 rounded-md border border-red-700">
                <div className="w-7 h-7 rounded bg-red-950 flex items-center justify-center text-red-200 font-bold text-xs border border-red-700">
                  {student.studentCode.slice(-3)}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-white flex items-center space-x-1.5">
                    <span>{student.fullName}</span>
                    <span className="text-[10px] bg-white text-red-800 font-bold px-1 rounded">
                      {student.studentCode}
                    </span>
                  </div>
                  <div className="text-[11px] text-red-200 flex items-center space-x-2">
                    <span>Lớp: {student.administrativeClass}</span>
                    <span>•</span>
                    <span className="text-yellow-300 font-bold">CPA: {student.cpa.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : !isStudent && lecturer ? (
              <div className="flex items-center space-x-2.5 bg-red-900/80 px-3 py-1.5 rounded-md border border-red-700">
                <div className="w-7 h-7 rounded bg-red-950 flex items-center justify-center text-red-200 font-bold text-xs border border-red-700">
                  <UserCheck className="w-4 h-4 text-yellow-300" />
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-white flex items-center space-x-1.5">
                    <span>{lecturer.fullName}</span>
                    <span className="text-[10px] bg-white text-red-800 font-bold px-1 rounded">
                      {lecturer.lecturerCode}
                    </span>
                  </div>
                  <div className="text-[11px] text-red-200">
                    {lecturer.title}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 text-xs bg-red-950 hover:bg-black/40 text-red-100 hover:text-white px-2.5 py-1.5 rounded-md border border-red-700 transition font-medium"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
