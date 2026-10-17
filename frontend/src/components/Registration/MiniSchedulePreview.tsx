"use client";

import React from "react";
import { CourseClassData } from "@/lib/mock-data";
import { DAY_NAMES, cn } from "@/lib/utils";
import { Calendar, AlertCircle } from "lucide-react";
import { checkScheduleOverlap } from "@/lib/validation";

interface MiniSchedulePreviewProps {
  registeredClasses: CourseClassData[];
  hoveredClass: CourseClassData | null;
}

export const MiniSchedulePreview: React.FC<MiniSchedulePreviewProps> = ({
  registeredClasses,
  hoveredClass,
}) => {
  // Days: Thứ 2 (2) -> Thứ 7 (7) & CN (8)
  const days = [2, 3, 4, 5, 6, 7];

  // Sessions: Kíp 1 (Tiết 1-3), Kíp 2 (Tiết 4-6), Kíp 3 (Tiết 7-9), Kíp 4 (Tiết 10-12)
  const sessions = [
    { label: "Sáng 1 (Tiết 1-3)", start: 1, end: 3 },
    { label: "Sáng 2 (Tiết 4-6)", start: 4, end: 6 },
    { label: "Chiều 1 (Tiết 7-9)", start: 7, end: 9 },
    { label: "Chiều 2 (Tiết 10-12)", start: 10, end: 12 },
  ];

  // Helper to check what class falls into a (day, session)
  const getClassInSlot = (day: number, start: number, end: number) => {
    return registeredClasses.find(
      (c) =>
        c.dayOfWeek === day &&
        checkScheduleOverlap(
          { dayOfWeek: day, startPeriod: start, periodCount: end - start + 1 },
          c
        )
    );
  };

  const isHoveredInSlot = (day: number, start: number, end: number) => {
    if (!hoveredClass) return false;
    return (
      hoveredClass.dayOfWeek === day &&
      checkScheduleOverlap(
        { dayOfWeek: day, startPeriod: start, periodCount: end - start + 1 },
        hoveredClass
      )
    );
  };

  const hasConflictOnHover = hoveredClass
    ? registeredClasses.some((c) => checkScheduleOverlap(c, hoveredClass))
    : false;

  return (
    <div className="bg-white border border-slate-200 rounded-md p-3.5 mb-5 shadow-xs">
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
            Thời khóa biểu thu nhỏ (Live Preview)
          </span>
        </div>

        {hoveredClass && (
          <div className="flex items-center space-x-1.5 text-[11px]">
            {hasConflictOnHover ? (
              <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>Trùng lịch với môn đã chọn!</span>
              </span>
            ) : (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                ✓ Khung giờ học còn trống
              </span>
            )}
          </div>
        )}
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="border border-slate-200 py-1 px-2 text-left font-medium w-28">
                Ca học
              </th>
              {days.map((d) => (
                <th
                  key={d}
                  className="border border-slate-200 py-1 px-2 text-center font-medium"
                >
                  {DAY_NAMES[d]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, sIdx) => (
              <tr key={sIdx} className="hover:bg-slate-50/50">
                <td className="border border-slate-200 py-1.5 px-2 text-slate-500 font-medium bg-slate-50">
                  {session.label}
                </td>
                {days.map((day) => {
                  const regClass = getClassInSlot(day, session.start, session.end);
                  const isHovered = isHoveredInSlot(day, session.start, session.end);

                  return (
                    <td
                      key={day}
                      className={cn(
                        "border border-slate-200 p-1 text-center align-middle h-10 transition-colors duration-150",
                        regClass
                          ? "bg-slate-800 text-white"
                          : isHovered
                          ? hasConflictOnHover
                            ? "bg-rose-100 border-2 border-dashed border-rose-500 text-rose-800"
                            : "bg-blue-100 border-2 border-dashed border-blue-500 text-blue-800"
                          : "bg-white"
                      )}
                    >
                      {regClass ? (
                        <div className="leading-tight">
                          <p className="font-bold text-[10px] truncate max-w-[90px] mx-auto text-blue-200">
                            {regClass.courseCode}
                          </p>
                          <p className="text-[9px] text-slate-300 truncate max-w-[90px] mx-auto">
                            {regClass.room}
                          </p>
                        </div>
                      ) : isHovered ? (
                        <div className="leading-tight animate-pulse font-semibold text-[10px]">
                          {hasConflictOnHover ? "Xung đột!" : "Dự kiến: " + hoveredClass?.courseCode}
                        </div>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-500 mt-2 italic">
        * Mẹo: Rê chuột vào danh sách lớp học phần bên dưới để xem trước vị trí trên thời khóa biểu.
      </p>
    </div>
  );
};
