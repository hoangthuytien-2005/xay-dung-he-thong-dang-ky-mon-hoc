"use client";

import React, { useEffect } from "react";
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 animate-in fade-in duration-150"
    >
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E5E7EB] shadow-lg max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#7F1D2D] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-[#651525] border border-white/15 flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 id="profile-modal-title" className="font-bold text-sm">
                Hồ sơ cá nhân
              </h3>
              <p className="text-[11px] text-white/80">
                {isStudent
                  ? "Thông tin sinh viên đại học chính quy"
                  : isLecturer
                  ? "Thông tin cán bộ giảng viên"
                  : "Thông tin cán bộ quản trị đào tạo"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hồ sơ"
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-[#651525] transition-colors duration-150 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="flex items-center space-x-4 pb-4 border-b border-[#E5E7EB]">
            <div className="w-14 h-14 rounded-lg bg-[#FFF5F5] border border-[#7F1D2D]/30 flex items-center justify-center text-[#7F1D2D] font-bold text-base shrink-0 font-mono">
              {isStudent ? student?.studentCode.slice(-3) : code?.slice(0, 4)}
            </div>
            <div>
              <h4 className="font-bold text-base text-[#1F2937]">{fullName}</h4>
              <p className="text-[#6B7280] font-mono text-[11px] mt-0.5">
                Mã định danh:{" "}
                <strong className="text-[#1F2937]">{code}</strong>
              </p>
              <span className="inline-block mt-1.5 text-[11px] font-medium bg-[#FFF5F5] text-[#7F1D2D] border border-[#7F1D2D]/25 px-2.5 py-0.5 rounded">
                {isStudent
                  ? `Sinh viên chính quy • ${academicStatusLabel}`
                  : titleOrClass}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#4B5563]">
            <div className="bg-[#F8F9FB] p-3 rounded-md border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] block mb-0.5">
                Khoa / Đơn vị quản lý
              </span>
              <strong className="text-[#1F2937] font-semibold">
                {department}
              </strong>
            </div>

            <div className="bg-[#F8F9FB] p-3 rounded-md border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] block mb-0.5">
                {isStudent ? "Lớp hành chính" : "Học vị / Chức danh"}
              </span>
              <strong className="text-[#1F2937] font-semibold">
                {titleOrClass}
              </strong>
            </div>

            <div className="bg-[#F8F9FB] p-3 rounded-md border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] block mb-0.5">
                Hộp thư điện tử (Email)
              </span>
              <strong className="text-[#1F2937] font-mono text-[11px] break-all">
                {email}
              </strong>
            </div>

            <div className="bg-[#F8F9FB] p-3 rounded-md border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] block mb-0.5">
                {isStudent ? "Cố vấn học tập" : "Điện thoại liên hệ"}
              </span>
              <strong className="text-[#1F2937] font-semibold">
                {contact}
              </strong>
            </div>

            {isStudent && (
              <>
                <div className="bg-[#F8F9FB] p-3 rounded-md border border-[#E5E7EB]">
                  <span className="text-[11px] text-[#6B7280] block mb-0.5">
                    Điểm trung bình tích lũy (CPA)
                  </span>
                  <strong className="text-[#15803D] text-sm font-bold">
                    {student?.cpa.toFixed(2)} / 4.0
                  </strong>
                </div>

                <div className="bg-[#F8F9FB] p-3 rounded-md border border-[#E5E7EB]">
                  <span className="text-[11px] text-[#6B7280] block mb-0.5">
                    Tín chỉ tích lũy
                  </span>
                  <strong className="text-[#7F1D2D] text-sm font-bold">
                    {student?.accumulatedCredits} / 150 TC
                  </strong>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F8F9FB] px-5 py-3 border-t border-[#E5E7EB] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#7F1D2D] hover:bg-[#651525] text-white font-medium rounded-md text-xs transition-colors duration-150 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
