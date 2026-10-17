"use client";

import React, { useState } from "react";
import { CourseData, CourseClassData, StudentData } from "@/lib/mock-data";
import { DAY_NAMES, cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Users, CheckCircle2, XCircle, AlertCircle, BookmarkCheck } from "lucide-react";
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
    <div className="bg-white border border-slate-200 rounded-md overflow-hidden mb-3 shadow-xs transition-shadow hover:shadow-sm">
      {/* Course Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2 cursor-pointer hover:bg-slate-100/70 transition"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900 text-white font-mono font-bold text-xs px-2.5 py-1 rounded">
            {course.code}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <span>{course.name}</span>
              {registeredClassOfCourse && (
                <span className="text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.2 rounded font-semibold flex items-center space-x-1">
                  <BookmarkCheck className="w-3 h-3 text-emerald-600" />
                  <span>Đã đăng ký ({registeredClassOfCourse.classCode})</span>
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              {course.department} • {course.credits} Tín chỉ (LT: {course.theoryCredits}, TH:{" "}
              {course.practiceCredits})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end md:self-auto">
          {/* Prerequisites preview */}
          {course.prerequisites.length > 0 && (
            <div className="text-[11px] flex items-center space-x-1">
              <span className="text-slate-500">Tiên quyết:</span>
              {course.prerequisites.map((pCode) => {
                const passed = checkPrereqPassed(pCode);
                return (
                  <span
                    key={pCode}
                    className={cn(
                      "px-1.5 py-0.5 rounded border font-mono font-medium flex items-center space-x-1",
                      passed
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200 font-bold"
                    )}
                  >
                    <span>{pCode}</span>
                    {passed ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-600" />
                    )}
                  </span>
                );
              })}
            </div>
          )}

          <div className="text-slate-400">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Class list under this course */}
      {isOpen && (
        <div className="p-3 bg-white">
          {classes.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2 px-1">
              Chưa có lớp học phần nào mở cho môn này trong học kỳ hiện tại.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {classes.map((cls) => {
                const isEnrolledInThis = registeredClassOfCourse?.classCode === cls.classCode;
                const isFull = cls.currentSlots >= cls.maxSlots;
                const isEnrolling = isRegistering === cls.classCode;

                // Check conflict with other registered courses
                const hasConflict = registeredClasses.some(
                  (reg) =>
                    reg.classCode !== cls.classCode && checkScheduleOverlap(reg, cls)
                );

                const slotPercentage = Math.round((cls.currentSlots / cls.maxSlots) * 100);

                return (
                  <div
                    key={cls.classCode}
                    onMouseEnter={() => onHoverClass(cls)}
                    onMouseLeave={onLeaveClass}
                    className={cn(
                      "p-3 rounded-md border text-xs transition-all duration-150 flex flex-col justify-between",
                      isEnrolledInThis
                        ? "bg-emerald-50/60 border-emerald-300"
                        : hasConflict
                        ? "bg-rose-50/40 border-rose-200"
                        : isFull
                        ? "bg-slate-50 border-slate-200 opacity-75"
                        : "bg-slate-50/70 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30"
                    )}
                  >
                    <div>
                      {/* Class code & Status */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {cls.classCode}
                        </span>

                        {isEnrolledInThis ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                            ✓ Đang học
                          </span>
                        ) : hasConflict ? (
                          <span className="text-[10px] font-medium text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-300 flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Trùng lịch</span>
                          </span>
                        ) : isFull ? (
                          <span className="text-[10px] font-medium text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                            Hết chỗ
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Còn chỗ
                          </span>
                        )}
                      </div>

                      {/* Schedule info */}
                      <div className="space-y-1 text-slate-700 mb-2.5">
                        <div className="flex items-center justify-between">
                          <span>
                            Lịch học: <strong>{DAY_NAMES[cls.dayOfWeek]}</strong> (Tiết {cls.startPeriod} -{" "}
                            {cls.startPeriod + cls.periodCount - 1})
                          </span>
                          <span className="font-medium text-slate-900 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                            Phòng: {cls.room}
                          </span>
                        </div>
                        <div className="text-slate-500">
                          Giảng viên: <span className="text-slate-800">{cls.lecturer}</span>
                        </div>
                      </div>

                      {/* Quota Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>Sĩ số:</span>
                          </span>
                          <span className="font-medium text-slate-800">
                            {cls.currentSlots} / {cls.maxSlots} ({slotPercentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-300",
                              isFull
                                ? "bg-rose-500"
                                : slotPercentage > 85
                                ? "bg-amber-500"
                                : "bg-emerald-600"
                            )}
                            style={{ width: `${Math.min(100, slotPercentage)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isEnrolledInThis ? (
                        <div className="text-center py-1 text-emerald-700 font-semibold text-xs bg-emerald-100 rounded border border-emerald-300">
                          Đã lưu trong danh sách đăng ký
                        </div>
                      ) : (
                        <button
                          onClick={() => onRegisterClass(cls.classCode)}
                          disabled={isFull || isEnrolling || hasUnmetPrereq}
                          className={cn(
                            "w-full py-1.5 px-3 rounded-md font-medium transition text-xs flex items-center justify-center space-x-1",
                            hasUnmetPrereq
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                              : isFull
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                              : hasConflict
                              ? "bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                          )}
                        >
                          <span>
                            {isEnrolling
                              ? "Đang lưu..."
                              : hasUnmetPrereq
                              ? "Chưa đủ điều kiện tiên quyết"
                              : isFull
                              ? "Lớp đã hết chỗ"
                              : hasConflict
                              ? "Đăng ký (Cảnh báo trùng lịch)"
                              : "Đăng ký vào lớp này"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
