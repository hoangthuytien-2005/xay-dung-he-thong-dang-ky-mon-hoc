"use client";

import React, { useState } from "react";
import { CourseClassData } from "@/lib/mock-data";
import { DAY_NAMES, PERIOD_TIMES, cn } from "@/lib/utils";
import { Calendar, Printer, Download } from "lucide-react";

interface FullTimetableGridProps {
  registeredClasses: CourseClassData[];
}

export const FullTimetableGrid: React.FC<FullTimetableGridProps> = ({
  registeredClasses,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const days = [2, 3, 4, 5, 6, 7];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const getStartingClass = (day: number, period: number) => {
    return registeredClasses.find(
      (c) => c.dayOfWeek === day && c.startPeriod === period
    );
  };

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
    let icsContent =
      "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//UniCredit Portal//SIS Timetable//VI\n";
    registeredClasses.forEach((c) => {
      icsContent += `BEGIN:VEVENT\nSUMMARY:${c.courseName} (${
        c.classCode
      })\nLOCATION:${c.room}\nDESCRIPTION:Giảng viên: ${c.lecturer} - Tiết ${
        c.startPeriod
      }-${c.startPeriod + c.periodCount - 1}\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "ThoiKhoaBieu_UniCredit.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#E5E7EB] gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#1F2937]">
            Thời khóa biểu học kỳ chính thức
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Lịch học tuần chi tiết của các lớp học phần đã đăng ký thành công.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle View Mode */}
          <div className="flex items-center bg-[#F8F9FB] p-0.5 rounded-md border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded transition-colors duration-150 cursor-pointer",
                viewMode === "grid"
                  ? "bg-[#7F1D2D] text-white"
                  : "text-[#4B5563] hover:text-[#1F2937]"
              )}
            >
              Lưới tuần
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded transition-colors duration-150 cursor-pointer",
                viewMode === "list"
                  ? "bg-[#7F1D2D] text-white"
                  : "text-[#4B5563] hover:text-[#1F2937]"
              )}
            >
              Danh sách
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportICS}
            className="inline-flex items-center space-x-1.5 text-xs bg-[#FFFFFF] hover:bg-[#F8F9FB] text-[#1F2937] px-3 py-1.5 rounded-md border border-[#E5E7EB] font-medium transition-colors duration-150 cursor-pointer"
            title="Đồng bộ vào Google Calendar hoặc Outlook"
          >
            <Download className="w-3.5 h-3.5 text-[#4B5563]" />
            <span>Xuất .ICS</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 text-xs bg-[#7F1D2D] hover:bg-[#651525] text-white px-3.5 py-1.5 rounded-md font-medium transition-colors duration-150 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In lịch học</span>
          </button>
        </div>
      </div>

      {registeredClasses.length === 0 ? (
        <div className="text-center py-12 text-[#6B7280] bg-[#F8F9FB] rounded-lg border border-dashed border-[#E5E7EB]">
          <Calendar className="w-8 h-8 text-[#6B7280]/60 mx-auto mb-2" />
          <p className="text-sm font-medium text-[#1F2937]">
            Chưa có học phần nào trong thời khóa biểu.
          </p>
          <p className="text-xs text-[#6B7280] mt-1">
            Vui lòng chuyển sang mục &quot;Đăng ký tín chỉ&quot; để chọn lớp học phần.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
          <table className="w-full text-xs border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-[#F8F9FB] text-[#4B5563] border-b border-[#E5E7EB]">
                <th className="border-r border-[#E5E7EB] py-2.5 px-3 text-center w-24 font-semibold">
                  Tiết / Giờ
                </th>
                {days.map((d) => (
                  <th
                    key={d}
                    className="border-r last:border-r-0 border-[#E5E7EB] py-2.5 px-3 text-center font-semibold"
                  >
                    {DAY_NAMES[d]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {periods.map((period) => {
                const timeInfo = PERIOD_TIMES[period];

                return (
                  <tr key={period}>
                    <td className="border-r border-[#E5E7EB] py-2 px-2 text-center bg-[#F8F9FB] text-[#4B5563]">
                      <div className="font-semibold text-[#1F2937]">
                        Tiết {period}
                      </div>
                      <div className="text-[10px] text-[#6B7280]">
                        {timeInfo?.start}
                      </div>
                    </td>

                    {days.map((day) => {
                      if (isSlotCovered(day, period)) {
                        return null;
                      }

                      const startingClass = getStartingClass(day, period);

                      if (startingClass) {
                        return (
                          <td
                            key={day}
                            rowSpan={startingClass.periodCount}
                            className="border-r last:border-r-0 border-[#E5E7EB] p-1.5 align-top bg-[#FFFFFF]"
                          >
                            <div className="p-2.5 rounded-md border border-[#7F1D2D]/30 bg-[#FFF5F5] text-[#1F2937] h-full flex flex-col justify-between shadow-[inset_3px_0_0_0_#7F1D2D]">
                              <div>
                                <div className="font-semibold text-[#7F1D2D] leading-snug mb-1">
                                  {startingClass.courseName}
                                </div>
                                <div className="text-[11px] font-mono text-[#4B5563] mb-1">
                                  [{startingClass.classCode}] •{" "}
                                  {startingClass.credits} TC
                                </div>
                              </div>
                              <div className="text-[11px] pt-1.5 border-t border-[#7F1D2D]/15 mt-1 text-[#4B5563] space-y-0.5">
                                <div>
                                  Phòng:{" "}
                                  <strong className="text-[#1F2937]">
                                    {startingClass.room}
                                  </strong>
                                </div>
                                <div className="truncate">
                                  GV: {startingClass.lecturer}
                                </div>
                              </div>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={day}
                          className="border-r last:border-r-0 border-[#E5E7EB] p-1 text-center text-[#E5E7EB] h-10"
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
        <div className="space-y-4">
          {days.map((day) => {
            const dayClasses = registeredClasses
              .filter((c) => c.dayOfWeek === day)
              .sort((a, b) => a.startPeriod - b.startPeriod);

            if (dayClasses.length === 0) return null;

            return (
              <div
                key={day}
                className="border border-[#E5E7EB] rounded-lg overflow-hidden"
              >
                <div className="bg-[#F8F9FB] px-4 py-2.5 font-semibold text-xs text-[#1F2937] border-b border-[#E5E7EB]">
                  {DAY_NAMES[day]}
                </div>
                <div className="divide-y divide-[#E5E7EB] bg-[#FFFFFF]">
                  {dayClasses.map((item) => (
                    <div
                      key={item.classCode}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-[#F8F9FB] transition-colors duration-150"
                    >
                      <div>
                        <div className="font-semibold text-sm text-[#1F2937]">
                          {item.courseName}
                        </div>
                        <div className="text-[#6B7280] space-x-2 mt-1">
                          <span className="font-mono bg-[#F8F9FB] text-[#1F2937] px-2 py-0.5 rounded border border-[#E5E7EB]">
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
                          <div className="font-semibold text-[#1F2937]">
                            Tiết {item.startPeriod} –{" "}
                            {item.startPeriod + item.periodCount - 1}
                          </div>
                          <div className="text-[#6B7280] text-[11px]">
                            ({PERIOD_TIMES[item.startPeriod]?.start} –{" "}
                            {
                              PERIOD_TIMES[
                                item.startPeriod + item.periodCount - 1
                              ]?.end
                            }
                            )
                          </div>
                        </div>
                        <div className="bg-[#FFF5F5] text-[#7F1D2D] border border-[#7F1D2D]/25 px-3 py-1 rounded-md font-semibold">
                          Phòng {item.room}
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
