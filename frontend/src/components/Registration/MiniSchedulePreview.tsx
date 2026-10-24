"use client";

import React from "react";
import { CourseClassData } from "@/lib/mock-data";
import { DAY_NAMES, cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { checkScheduleOverlap } from "@/lib/validation";

interface MiniSchedulePreviewProps {
  registeredClasses: CourseClassData[];
  hoveredClass: CourseClassData | null;
}

export const MiniSchedulePreview: React.FC<MiniSchedulePreviewProps> = ({
  registeredClasses,
  hoveredClass,
}) => {
  const days = [2, 3, 4, 5, 6, 7];

  const sessions = [
    { label: "Sáng 1 (Tiết 1–3)", start: 1, end: 3 },
    { label: "Sáng 2 (Tiết 4–6)", start: 4, end: 6 },
    { label: "Chiều 1 (Tiết 7–9)", start: 7, end: 9 },
    { label: "Chiều 2 (Tiết 10–12)", start: 10, end: 12 },
  ];

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
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-4 mb-5">
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#E5E7EB]">
        <span className="font-bold text-xs text-[#1F2937]">
          Xem trước thời khóa biểu
        </span>

        {hoveredClass && (
          <div className="flex items-center space-x-1.5 text-[11px]">
            {hasConflictOnHover ? (
              <span className="text-[#DC2626] bg-red-50 border border-red-200 px-2 py-0.5 rounded font-medium flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>Trùng lịch với môn đã chọn</span>
              </span>
            ) : (
              <span className="text-[#15803D] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                Khung giờ hợp lệ
              </span>
            )}
          </div>
        )}
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] border-collapse border border-[#E5E7EB]">
          <thead>
            <tr className="bg-[#F8F9FB] text-[#4B5563]">
              <th className="border border-[#E5E7EB] py-1.5 px-2.5 text-left font-semibold w-28">
                Ca học
              </th>
              {days.map((d) => (
                <th
                  key={d}
                  className="border border-[#E5E7EB] py-1.5 px-2 text-center font-semibold"
                >
                  {DAY_NAMES[d]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, sIdx) => (
              <tr key={sIdx}>
                <td className="border border-[#E5E7EB] py-2 px-2.5 text-[#4B5563] font-medium bg-[#F8F9FB]">
                  {session.label}
                </td>
                {days.map((day) => {
                  const regClass = getClassInSlot(
                    day,
                    session.start,
                    session.end
                  );
                  const isHovered = isHoveredInSlot(
                    day,
                    session.start,
                    session.end
                  );

                  return (
                    <td
                      key={day}
                      className={cn(
                        "border border-[#E5E7EB] p-1 text-center align-middle h-11 transition-colors duration-150",
                        regClass
                          ? "bg-[#7F1D2D] text-white"
                          : isHovered
                          ? hasConflictOnHover
                            ? "bg-red-50 border-2 border-dashed border-[#DC2626] text-[#DC2626]"
                            : "bg-[#FFF5F5] border-2 border-dashed border-[#7F1D2D] text-[#7F1D2D]"
                          : "bg-[#FFFFFF]"
                      )}
                    >
                      {regClass ? (
                        <div className="leading-tight">
                          <p className="font-semibold text-[10px] truncate max-w-[90px] mx-auto text-white">
                            {regClass.courseCode}
                          </p>
                          <p className="text-[9px] text-white/80 truncate max-w-[90px] mx-auto">
                            {regClass.room}
                          </p>
                        </div>
                      ) : isHovered ? (
                        <div className="leading-tight font-semibold text-[10px]">
                          {hasConflictOnHover
                            ? "Trùng lịch"
                            : hoveredClass?.courseCode}
                        </div>
                      ) : (
                        <span className="text-[#E5E7EB]">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-[#6B7280] mt-2">
        Di chuột vào từng lớp học phần để kiểm tra nhanh vị trí tiết học trên lịch tuần.
      </p>
    </div>
  );
};
