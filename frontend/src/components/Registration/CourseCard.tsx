"use client";

import React, { useState } from "react";
import { CourseData, CourseClassData, StudentData } from "@/lib/mock-data";
import { DAY_NAMES, cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookmarkCheck,
} from "lucide-react";
import { checkScheduleOverlap } from "@/lib/validation";

interface CourseCardProps {
  course: CourseData;
  classes: CourseClassData[];
  student: StudentData | null;
  registeredClasses: CourseClassData[];
  onHoverClass: (cls: CourseClassData) => void;
  onLeaveClass: () => void;
  onRegisterClass: (classCode: string) => Promise<void>;
  isRegistering: string | null;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  classes,
  student,
  registeredClasses,
  onHoverClass,
  onLeaveClass,
  onRegisterClass,
  isRegistering,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Check if student has already registered ANY class of this course
  const registeredClassOfCourse = registeredClasses.find(
    (c) => c.courseCode === course.code
  );

  // Check prerequisite completion
  const checkPrereqPassed = (prereqCode: string) => {
    if (!student) return false;
    return student.completedCourses.some(
      (c) => c.courseCode === prereqCode && c.isPassed
    );
  };

  const hasUnmetPrereq = course.prerequisites.some(
    (pCode) => !checkPrereqPassed(pCode)
  );

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg overflow-hidden mb-3.5">
      {/* Course Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full text-left px-4 py-3 bg-[#F8F9FB] border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-2 cursor-pointer hover:bg-[#FFF5F5]/50 transition-colors duration-150"
      >
        <div className="flex items-center space-x-3 min-w-0">
          <span className="bg-[#7F1D2D] text-white font-mono font-semibold text-xs px-2.5 py-1 rounded-md shrink-0">
            {course.code}
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-[#1F2937] flex flex-wrap items-center gap-2">
              <span>{course.name}</span>
              {registeredClassOfCourse && (
                <span className="text-[11px] bg-emerald-50 text-[#15803D] border border-emerald-200 px-2 py-0.5 rounded font-medium inline-flex items-center space-x-1">
                  <BookmarkCheck className="w-3 h-3 text-[#15803D]" />
                  <span>Đã đăng ký ({registeredClassOfCourse.classCode})</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {course.department} • {course.credits} tín chỉ (Lý thuyết:{" "}
              {course.theoryCredits}, Thực hành: {course.practiceCredits}) • Kỳ{" "}
              {course.semesterProposal}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end md:self-auto shrink-0">
          {course.prerequisites.length > 0 && (
            <div className="text-[11px] flex items-center space-x-1.5">
              <span className="text-[#6B7280]">Tiên quyết:</span>
              {course.prerequisites.map((pCode) => {
                const passed = checkPrereqPassed(pCode);
                return (
                  <span
                    key={pCode}
                    className={cn(
                      "px-2 py-0.5 rounded border font-mono font-medium inline-flex items-center space-x-1",
                      passed
                        ? "bg-emerald-50 text-[#15803D] border-emerald-200"
                        : "bg-red-50 text-[#DC2626] border-red-200"
                    )}
                  >
                    <span>{pCode}</span>
                    {passed ? (
                      <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                    ) : (
                      <XCircle className="w-3 h-3 text-[#DC2626]" />
                    )}
                  </span>
                );
              })}
            </div>
          )}

          <div className="text-[#6B7280]">
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </button>

      {/* Class Selection Table */}
      {isOpen && (
        <div className="bg-[#FFFFFF]">
          {classes.length === 0 ? (
            <p className="text-xs text-[#6B7280] py-4 px-4">
              Chưa có lớp học phần nào mở cho môn này trong học kỳ hiện tại.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFFFFF] text-[#4B5563] border-b border-[#E5E7EB]">
                    <th className="py-2.5 px-4 font-semibold w-28">Mã LHP</th>
                    <th className="py-2.5 px-3 font-semibold">Thời gian học</th>
                    <th className="py-2.5 px-3 font-semibold w-24">Phòng</th>
                    <th className="py-2.5 px-3 font-semibold">Giảng viên</th>
                    <th className="py-2.5 px-3 font-semibold text-center w-28">
                      Sĩ số
                    </th>
                    <th className="py-2.5 px-3 font-semibold text-center w-28">
                      Trạng thái
                    </th>
                    <th className="py-2.5 px-4 font-semibold text-right w-40">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {classes.map((cls) => {
                    const isEnrolledInThis =
                      registeredClassOfCourse?.classCode === cls.classCode;
                    const isFull = cls.currentSlots >= cls.maxSlots;
                    const isEnrolling = isRegistering === cls.classCode;

                    const hasConflict = registeredClasses.some(
                      (reg) =>
                        reg.classCode !== cls.classCode &&
                        checkScheduleOverlap(reg, cls)
                    );

                    const slotPercentage = Math.round(
                      (cls.currentSlots / cls.maxSlots) * 100
                    );

                    return (
                      <tr
                        key={cls.classCode}
                        onMouseEnter={() => onHoverClass(cls)}
                        onMouseLeave={onLeaveClass}
                        className={cn(
                          "transition-colors duration-150",
                          isEnrolledInThis
                            ? "bg-emerald-50/40"
                            : hasConflict
                            ? "bg-red-50/30"
                            : "hover:bg-[#F8F9FB]"
                        )}
                      >
                        <td className="py-3 px-4 font-mono font-semibold text-[#1F2937]">
                          {cls.classCode}
                        </td>

                        <td className="py-3 px-3 text-[#1F2937]">
                          <span className="font-medium">
                            {DAY_NAMES[cls.dayOfWeek]}
                          </span>{" "}
                          <span className="text-[#4B5563]">
                            (Tiết {cls.startPeriod} –{" "}
                            {cls.startPeriod + cls.periodCount - 1})
                          </span>
                        </td>

                        <td className="py-3 px-3 font-medium text-[#1F2937]">
                          {cls.room}
                        </td>

                        <td className="py-3 px-3 text-[#4B5563]">
                          {cls.lecturer}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="font-medium text-[#1F2937]">
                            {cls.currentSlots} / {cls.maxSlots}
                          </div>
                          <div className="w-16 mx-auto bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className={cn(
                                "h-full",
                                isFull
                                  ? "bg-[#DC2626]"
                                  : slotPercentage > 85
                                  ? "bg-[#D97706]"
                                  : "bg-[#15803D]"
                              )}
                              style={{
                                width: `${Math.min(100, slotPercentage)}%`,
                              }}
                            />
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          {isEnrolledInThis ? (
                            <span className="inline-block text-[11px] font-medium text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Đã đăng ký
                            </span>
                          ) : hasConflict ? (
                            <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-[#DC2626] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                              <AlertCircle className="w-3 h-3" />
                              <span>Trùng lịch</span>
                            </span>
                          ) : isFull ? (
                            <span className="inline-block text-[11px] font-medium text-[#6B7280] bg-[#F8F9FB] px-2 py-0.5 rounded border border-[#E5E7EB]">
                              Hết chỗ
                            </span>
                          ) : (
                            <span className="inline-block text-[11px] font-medium text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Còn chỗ
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {isEnrolledInThis ? (
                            <span className="inline-block py-1.5 px-3 text-[#15803D] font-medium text-xs bg-emerald-50 rounded-md border border-emerald-200">
                              Đã lưu
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onRegisterClass(cls.classCode)}
                              disabled={isFull || isEnrolling || hasUnmetPrereq}
                              className={cn(
                                "py-1.5 px-3 rounded-md font-medium transition-colors duration-150 text-xs inline-flex items-center justify-center",
                                hasUnmetPrereq || isFull
                                  ? "bg-[#F8F9FB] text-[#6B7280] cursor-not-allowed border border-[#E5E7EB]"
                                  : hasConflict
                                  ? "bg-[#DC2626] hover:bg-red-700 text-white cursor-pointer"
                                  : "bg-[#7F1D2D] hover:bg-[#651525] text-white cursor-pointer"
                              )}
                            >
                              {isEnrolling
                                ? "Đang xử lý..."
                                : hasUnmetPrereq
                                ? "Thiếu tiên quyết"
                                : isFull
                                ? "Hết chỉ tiêu"
                                : hasConflict
                                ? "Đăng ký (Trùng lịch)"
                                : "Đăng ký lớp"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
