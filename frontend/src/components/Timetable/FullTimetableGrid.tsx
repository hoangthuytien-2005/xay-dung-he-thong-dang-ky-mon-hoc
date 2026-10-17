"use client";

import React, { useState } from "react";
import { CourseClassData } from "@/lib/mock-data";
import { DAY_NAMES, PERIOD_TIMES, cn } from "@/lib/utils";
import { Calendar, Printer, Download, Eye, ListFilter } from "lucide-react";

interface FullTimetableGridProps {
  registeredClasses: CourseClassData[];
}

export const FullTimetableGrid: React.FC<FullTimetableGridProps> = ({
  registeredClasses,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const days = [2, 3, 4, 5, 6, 7]; // Thứ 2 đến Thứ 7
  const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Colors for different classes (solid subtle colors, not harsh gradients)
  const classColorMap: Record<string, string> = {
    INT1434: "bg-blue-800 text-white border-blue-900",
    INT1339: "bg-slate-800 text-white border-slate-900",
    INT1405: "bg-emerald-800 text-white border-emerald-900",
    INT1412: "bg-purple-800 text-white border-purple-900",
    INT1416: "bg-amber-800 text-white border-amber-900",
    INT1340: "bg-indigo-800 text-white border-indigo-900",
    INT14115: "bg-cyan-800 text-white border-cyan-900",
    SKI1014: "bg-teal-800 text-white border-teal-900",
    ELE1433: "bg-rose-800 text-white border-rose-900",
  };

  const getClassStyle = (courseCode: string) => {
    return classColorMap[courseCode] || "bg-slate-800 text-white border-slate-900";
  };

  // Helper to find if a class STARTS at this period
  const getStartingClass = (day: number, period: number) => {
    return registeredClasses.find(
      (c) => c.dayOfWeek === day && c.startPeriod === period
    );
  };

  // Helper to check if a slot is covered by a multi-period class that started earlier
  const isSlotCovered = (day: number, period: number) => {
    return registeredClasses.some(
      (c) =>
        c.dayOfWeek === day &&
        period > c.startPeriod &&
        period < c.startPeriod + c.periodCount
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportICS = () => {
    // Generate simple iCalendar string
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//UniCredit Portal//SIS Timetable//VI\n";
    registeredClasses.forEach((c) => {
      icsContent += `BEGIN:VEVENT\nSUMMARY:${c.courseName} (${c.classCode})\nLOCATION:${c.room}\nDESCRIPTION:Giảng viên: ${c.lecturer} - Tiết ${c.startPeriod}-${c.startPeriod + c.periodCount - 1}\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "ThoiKhoaBieu_UniCredit.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Thời Khóa Biểu Học Kỳ (Chính Thức)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Xem lịch học chi tiết của các môn đã đăng ký thành công.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Toggle View Mode */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded transition",
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Lưới tuần
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded transition",
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Danh sách
            </button>
          </div>

          <button
            onClick={handleExportICS}
            className="inline-flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md border border-slate-300 font-medium transition"
            title="Đồng bộ vào Google Calendar hoặc Apple Calendar"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất .ICS</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md font-medium transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In lịch</span>
          </button>
        </div>
      </div>

      {registeredClasses.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium">Chưa có môn học nào trong thời khóa biểu.</p>
          <p className="text-xs text-slate-500 mt-1">
            Hãy sang tab "Đăng ký tín chỉ" để chọn lớp học phần.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse border border-slate-200 min-w-[700px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="border border-slate-200 py-2 px-3 text-center w-24 font-semibold">
                  Tiết / Giờ
                </th>
                {days.map((d) => (
                  <th
                    key={d}
                    className="border border-slate-200 py-2 px-3 text-center font-semibold"
                  >
                    {DAY_NAMES[d]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => {
                const timeInfo = PERIOD_TIMES[period];
                const isShiftHeader = period === 1 || period === 6 || period === 11;

                return (
                  <tr key={period} className="hover:bg-slate-50/40">
                    {/* Period header */}
                    <td className="border border-slate-200 py-1.5 px-2 text-center bg-slate-50 text-slate-600">
                      <div className="font-bold text-slate-800">Tiết {period}</div>
                      <div className="text-[10px] text-slate-400">{timeInfo?.start}</div>
                    </td>

                    {/* Days */}
                    {days.map((day) => {
                      if (isSlotCovered(day, period)) {
                        return null; // Skip because rowSpan covers it
                      }

                      const startingClass = getStartingClass(day, period);

                      if (startingClass) {
                        return (
                          <td
                            key={day}
                            rowSpan={startingClass.periodCount}
                            className="border border-slate-200 p-1.5 align-top"
                          >
                            <div
                              className={cn(
                                "p-2.5 rounded border text-xs shadow-xs h-full flex flex-col justify-between transition hover:opacity-95",
                                getClassStyle(startingClass.courseCode)
                              )}
                            >
                              <div>
                                <div className="font-bold leading-tight mb-1">
                                  {startingClass.courseName}
                                </div>
                                <div className="text-[11px] font-mono opacity-90 mb-1">
                                  [{startingClass.classCode}] • {startingClass.credits} TC
                                </div>
                              </div>
                              <div className="text-[11px] pt-1 border-t border-white/20 mt-1 opacity-90 space-y-0.5">
                                <div>Phòng: <strong>{startingClass.room}</strong></div>
                                <div className="truncate">GV: {startingClass.lecturer}</div>
                              </div>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={day}
                          className="border border-slate-200 p-1 text-center text-slate-200 h-9"
                        >
                          -
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {days.map((day) => {
            const dayClasses = registeredClasses
              .filter((c) => c.dayOfWeek === day)
              .sort((a, b) => a.startPeriod - b.startPeriod);

            if (dayClasses.length === 0) return null;

            return (
              <div key={day} className="border border-slate-200 rounded-md overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 font-bold text-xs text-slate-800 border-b border-slate-200">
                  {DAY_NAMES[day]}
                </div>
                <div className="divide-y divide-slate-100 bg-white">
                  {dayClasses.map((item) => (
                    <div
                      key={item.classCode}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900">
                          {item.courseName}
                        </div>
                        <div className="text-slate-500 space-x-2 mt-0.5">
                          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {item.classCode}
                          </span>
                          <span>•</span>
                          <span>Số tín chỉ: {item.credits} TC</span>
                          <span>•</span>
                          <span>Giảng viên: {item.lecturer}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 self-end sm:self-auto text-right">
                        <div>
                          <div className="font-medium text-slate-800">
                            Tiết {item.startPeriod} - {item.startPeriod + item.periodCount - 1}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            ({PERIOD_TIMES[item.startPeriod]?.start} -{" "}
                            {PERIOD_TIMES[item.startPeriod + item.periodCount - 1]?.end})
                          </div>
                        </div>
                        <div className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded font-bold">
                          {item.room}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
