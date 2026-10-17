"use client";

import React, { useState } from "react";
import { CourseData, StudentData, CourseClassData } from "@/lib/mock-data";
import { GitBranch, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurriculumViewProps {
  courses: CourseData[];
  student: StudentData | null;
  registeredClasses: CourseClassData[];
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  courses,
  student,
  registeredClasses,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number | "all">(5);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const getCourseStatus = (courseCode: string) => {
    if (!student) return { status: "NOT_TAKEN", label: "Chưa học", color: "text-slate-500 bg-slate-100" };

    // Check currently registered
    const isEnrolledNow = registeredClasses.some((c) => c.courseCode === courseCode);
    if (isEnrolledNow) {
      return {
        status: "ENROLLED",
        label: "Đang học kỳ này",
        color: "text-blue-700 bg-blue-50 border-blue-200",
      };
    }

    // Check completed courses history
    const history = student.completedCourses.find((c) => c.courseCode === courseCode);
    if (history) {
      if (history.isPassed) {
        return {
          status: "PASSED",
          label: `Đã đạt (${history.grade})`,
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        };
      } else {
        return {
          status: "FAILED",
          label: `Chưa đạt (${history.grade})`,
          color: "text-rose-700 bg-rose-50 border-rose-200",
        };
      }
    }

    return {
      status: "NOT_TAKEN",
      label: "Chưa học",
      color: "text-slate-600 bg-slate-100 border-slate-200",
    };
  };

  const filteredCourses =
    selectedSemester === "all"
      ? courses
      : courses.filter((c) => c.semesterProposal === selectedSemester);

  const totalCreditsEarned = student?.accumulatedCredits || 0;
  const currentEnrolledCredits = registeredClasses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-blue-600" />
            <span>Chương Trình Đào Tạo Ngành: {student?.major || "Công nghệ Thông tin"}</span>
          </h2>
          <p className="text-xs text-slate-500">
            Khóa: K{student?.academicYear ? student.academicYear % 100 : "21"} • Khung chương trình chuẩn 145 Tín chỉ
          </p>
        </div>

        {/* Quick progress stats */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
            <span className="text-slate-500">Đã tích lũy:</span>{" "}
            <strong className="text-emerald-700 font-bold">{totalCreditsEarned} TC</strong>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
            <span className="text-slate-500">Đang học:</span>{" "}
            <strong className="text-blue-700 font-bold">{currentEnrolledCredits} TC</strong>
          </div>
        </div>
      </div>

      {/* Semester Filter Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-3 mb-4 border-b border-slate-100 no-scrollbar">
        <button
          onClick={() => setSelectedSemester("all")}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition",
            selectedSemester === "all"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          )}
        >
          Tất cả các kỳ
        </button>
        {semesters.map((sem) => (
          <button
            key={sem}
            onClick={() => setSelectedSemester(sem)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition",
              selectedSemester === sem
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            Học kỳ {sem} {sem === 5 && <span className="text-blue-300 font-bold ml-1">(Hiện tại)</span>}
          </button>
        ))}
      </div>

      {/* Course List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <th className="py-2.5 px-3 font-semibold w-12 text-center">STT</th>
              <th className="py-2.5 px-3 font-semibold w-28">Mã môn</th>
              <th className="py-2.5 px-3 font-semibold">Tên học phần</th>
              <th className="py-2.5 px-2 font-semibold text-center w-16">Số TC</th>
              <th className="py-2.5 px-3 font-semibold">Học phần tiên quyết</th>
              <th className="py-2.5 px-3 font-semibold">Khoa / Bộ môn</th>
              <th className="py-2.5 px-3 font-semibold text-center w-36">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-slate-400">
                  Không có học phần nào được cấu hình cho kỳ này.
                </td>
              </tr>
            ) : (
              filteredCourses.map((c, idx) => {
                const statusInfo = getCourseStatus(c.code);

                return (
                  <tr key={c.code} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{c.code}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {c.name}
                      <span className="text-[10px] text-slate-400 block">Kỳ đề xuất: Kỳ {c.semesterProposal}</span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-800">{c.credits}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono">
                      {c.prerequisites.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {c.prerequisites.map((p) => (
                            <span key={p} className="bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                              {p}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Không có</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{c.department}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={cn(
                          "inline-block text-[11px] font-semibold px-2 py-0.5 rounded border",
                          statusInfo.color
                        )}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
