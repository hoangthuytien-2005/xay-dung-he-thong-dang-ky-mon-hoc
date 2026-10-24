"use client";

import React from "react";
import { StudentData, LecturerData, AdminData } from "@/lib/mock-data";
import { UserRole } from "@/components/Navbar";
import { X, User } from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    role: UserRole;
    student?: StudentData | null;
    lecturer?: LecturerData | null;
    admin?: AdminData | null;
  };
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  if (!isOpen) return null;

  const isStudent = currentUser.role === "student";
  const isLecturer = currentUser.role === "lecturer";
  const student = currentUser.student;
  const lecturer = currentUser.lecturer;
  const admin = currentUser.admin;

  const fullName = isStudent
    ? student?.fullName
    : isLecturer
    ? lecturer?.fullName
    : admin?.fullName;
  const code = isStudent
    ? student?.studentCode
    : isLecturer
    ? lecturer?.lecturerCode
    : admin?.adminCode;
  const department = isStudent
    ? student?.major
    : isLecturer
    ? lecturer?.department
    : admin?.department;
  const titleOrClass = isStudent
    ? student?.administrativeClass
    : isLecturer
    ? lecturer?.title
    : admin?.title;
  const email = isStudent
    ? student?.email
    : isLecturer
    ? lecturer?.email
    : admin?.email;
  const contact = isStudent
    ? student?.advisorName
    : isLecturer
    ? lecturer?.phone
    : admin?.phone;

  const academicStatusLabel =
    student?.academicStatus === "RESERVED"
      ? "Bảo lưu kết quả học tập"
      : student?.academicStatus === "DROPPED_OUT"
      ? "Đã thôi học"
      : "Đang theo học";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-md border border-slate-300 shadow-xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-red-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-red-950 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Hồ Sơ Cá Nhân</h3>
              <p className="text-[11px] text-red-200">
                {isStudent
                  ? "Thông tin sinh viên chính quy"
                  : isLecturer
                  ? "Thông tin cán bộ giảng viên"
                  : "Thông tin cán bộ quản trị đào tạo"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-red-200 hover:text-white p-1 rounded hover:bg-red-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Avatar and Main Info Banner */}
          <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-red-800 flex items-center justify-center text-red-800 font-bold text-lg shrink-0 font-mono">
              {isStudent ? student?.studentCode.slice(-2) : code?.slice(0, 4)}
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">
                {fullName}
              </h4>
              <p className="text-slate-500 font-mono text-[11px]">
                Mã định danh: <strong className="text-slate-800">{code}</strong>
              </p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300 px-2 py-0.2 rounded">
                {isStudent ? `Sinh viên Chính quy (${academicStatusLabel})` : titleOrClass}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-slate-700">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-[11px] text-slate-400 block mb-0.5">Khoa / Đơn vị quản lý</span>
              <strong className="text-slate-800">{department}</strong>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-[11px] text-slate-400 block mb-0.5">{isStudent ? "Lớp hành chính" : "Học vị / Chức danh"}</span>
              <strong className="text-slate-800">{titleOrClass}</strong>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-[11px] text-slate-400 block mb-0.5">Hộp thư điện tử (Email)</span>
              <strong className="text-slate-800 font-mono text-[11px]">{email}</strong>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-[11px] text-slate-400 block mb-0.5">{isStudent ? "Cố vấn học tập" : "Điện thoại liên hệ"}</span>
              <strong className="text-slate-800">{contact}</strong>
            </div>

            {isStudent && (
              <>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Điểm tích lũy (CPA)</span>
                  <strong className="text-emerald-700 text-sm">{student?.cpa.toFixed(2)} / 4.0</strong>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Tín chỉ tích lũy</span>
                  <strong className="text-red-800 text-sm">{student?.accumulatedCredits} / 145 TC</strong>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md text-xs transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
