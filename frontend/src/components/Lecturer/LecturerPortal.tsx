"use client";

import React, { useState } from "react";
import { LecturerData, CourseClassData, SAMPLE_STUDENTS_LIST, StudentRosterItem } from "@/lib/mock-data";
import { DAY_NAMES, PERIOD_TIMES, cn } from "@/lib/utils";
import { Calendar, Users, FileSpreadsheet, Printer, Search, BookOpen, Clock, ChevronRight } from "lucide-react";

interface LecturerPortalProps {
  lecturer: LecturerData;
  classes: CourseClassData[];
}

export const LecturerPortal: React.FC<LecturerPortalProps> = ({
  lecturer,
  classes,
}) => {
  // Find classes taught by this lecturer
  const myClasses = classes.filter(
    (c) =>
      c.lecturer.includes(lecturer.fullName) ||
      lecturer.teachingClassCodes.includes(c.classCode)
  );

  const [selectedClassCode, setSelectedClassCode] = useState<string>(
    myClasses[0]?.classCode || ""
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const selectedClass = myClasses.find((c) => c.classCode === selectedClassCode) || myClasses[0];

  const filteredStudents = SAMPLE_STUDENTS_LIST.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.administrativeClass.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrintRoster = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Lecturer Profile Summary */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-red-100 text-red-800 border border-red-300 font-bold px-2 py-0.5 rounded">
                GIẢNG VIÊN
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {lecturer.fullName} ({lecturer.lecturerCode})
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {lecturer.title} • {lecturer.department}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
              <span>Email: <strong className="text-slate-800">{lecturer.email}</strong></span>
              <span>•</span>
              <span>Điện thoại: <strong className="text-slate-800">{lecturer.phone}</strong></span>
              <span>•</span>
              <span>Số lớp phụ trách: <strong className="text-red-800 font-bold">{myClasses.length} lớp học phần</strong></span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-right">
            <span className="text-xs text-slate-500">Học kỳ giảng dạy</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              Học kỳ 1 • Năm học 2024 - 2025
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: My Classes on Left, Class Roster on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 cols: Classes assigned */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-red-800" />
            <span>Các lớp học phần phụ trách</span>
          </h3>

          {myClasses.length === 0 ? (
            <div className="p-4 bg-white border border-slate-200 rounded text-center text-xs text-slate-400">
              Chưa có lớp học phần nào được phân công.
            </div>
          ) : (
            myClasses.map((cls) => {
              const isSelected = cls.classCode === selectedClassCode;
              return (
                <div
                  key={cls.classCode}
                  onClick={() => setSelectedClassCode(cls.classCode)}
                  className={cn(
                    "p-4 rounded-md border cursor-pointer transition-all duration-150 bg-white",
                    isSelected
                      ? "border-red-800 shadow-xs ring-1 ring-red-800"
                      : "border-slate-200 hover:border-slate-400"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-900 px-2 py-0.5 rounded border border-slate-200">
                      {cls.classCode}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      {cls.currentSlots} / {cls.maxSlots} SV
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 mb-1">
                    {cls.courseName}
                  </h4>

                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {DAY_NAMES[cls.dayOfWeek]} (Tiết {cls.startPeriod} -{" "}
                        {cls.startPeriod + cls.periodCount - 1})
                      </span>
                    </div>
                    <div>Phòng học: <strong className="text-slate-800">{cls.room}</strong></div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-red-800 font-semibold">
                    <span>Xem danh sách sinh viên</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 8 cols: Students Roster for the Selected Class */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-200 gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-red-800" />
                  <span>
                    Danh sách sinh viên lớp: {selectedClass?.classCode} - {selectedClass?.courseName}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Phòng: {selectedClass?.room} • {DAY_NAMES[selectedClass?.dayOfWeek || 2]} (Tiết {selectedClass?.startPeriod} - {(selectedClass?.startPeriod || 1) + (selectedClass?.periodCount || 3) - 1})
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrintRoster}
                  className="inline-flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md border border-slate-300 font-medium transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In danh sách</span>
                </button>
              </div>
            </div>

            {/* Search within class */}
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm sinh viên theo mã SV, tên hoặc lớp hành chính..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-800 focus:border-red-800"
              />
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="py-2.5 px-3 font-semibold w-10 text-center">STT</th>
                    <th className="py-2.5 px-3 font-semibold w-28">Mã sinh viên</th>
                    <th className="py-2.5 px-3 font-semibold">Họ và tên</th>
                    <th className="py-2.5 px-3 font-semibold">Lớp hành chính</th>
                    <th className="py-2.5 px-3 font-semibold">Email</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Thời gian ĐK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-400">
                        Không tìm thấy sinh viên nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, idx) => (
                      <tr key={s.studentCode} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{s.studentCode}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{s.fullName}</td>
                        <td className="py-2.5 px-3 text-slate-600">{s.administrativeClass}</td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{s.email}</td>
                        <td className="py-2.5 px-3 text-center text-slate-400 text-[11px]">
                          {s.registeredDate}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Đang hiển thị {filteredStudents.length} sinh viên</span>
              <span>Tổng sĩ số đăng ký hiện tại: <strong className="text-slate-800">{selectedClass?.currentSlots} SV</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
