"use client";

import React, { useState } from "react";
import { CourseData, StudentData, CourseClassData } from "@/lib/mock-data";
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
  const [selectedSemester, setSelectedSemester] = useState<number | "all">(
    "all"
  );

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const getCourseStatus = (courseCode: string) => {
    if (!student) {
      return {
        status: "NOT_TAKEN",
        label: "Chưa học",
        color: "text-[#6B7280] bg-[#F8F9FB] border-[#E5E7EB]",
      };
    }

    const isEnrolledNow = registeredClasses.some(
      (c) => c.courseCode === courseCode
    );
    if (isEnrolledNow) {
      return {
        status: "ENROLLED",
        label: "Đang học kỳ này",
        color: "text-[#2563EB] bg-blue-50 border-blue-200",
      };
    }

    const history = student.completedCourses.find(
      (c) => c.courseCode === courseCode
    );
    if (history) {
      if (history.isPassed) {
        return {
          status: "PASSED",
          label: `Đã đạt (${history.grade})`,
          color: "text-[#15803D] bg-emerald-50 border-emerald-200",
        };
      } else {
        return {
          status: "FAILED",
          label: `Chưa đạt (${history.grade})`,
          color: "text-[#DC2626] bg-red-50 border-red-200",
        };
      }
    }

    return {
      status: "NOT_TAKEN",
      label: "Chưa học",
      color: "text-[#6B7280] bg-[#F8F9FB] border-[#E5E7EB]",
    };
  };

  const filteredCourses =
    selectedSemester === "all"
      ? courses
      : courses.filter((c) => c.semesterProposal === selectedSemester);

  const totalCreditsEarned = student?.accumulatedCredits || 0;
  const currentEnrolledCredits = registeredClasses.reduce(
    (sum, c) => sum + c.credits,
    0
  );

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB] gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#1F2937] flex items-center">
            <span>
              Chương trình đào tạo ngành:{" "}
              {student?.major || "Công nghệ Thông tin"}
            </span>
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Khóa K{student?.academicYear ? student.academicYear % 100 : "21"} •
            Khung chương trình đào tạo chuẩn 9 học kỳ ({courses.length} học phần)
          </p>
        </div>

        {/* Progress stats */}
        <div className="flex items-center space-x-2.5 text-xs">
          <div className="bg-[#F8F9FB] border border-[#E5E7EB] px-3 py-1.5 rounded-md">
            <span className="text-[#6B7280]">Đã tích lũy:</span>{" "}
            <strong className="text-[#15803D] font-bold">
              {totalCreditsEarned} TC
            </strong>
          </div>
          <div className="bg-[#F8F9FB] border border-[#E5E7EB] px-3 py-1.5 rounded-md">
            <span className="text-[#6B7280]">Đang đăng ký:</span>{" "}
            <strong className="text-[#7F1D2D] font-bold">
              {currentEnrolledCredits} TC
            </strong>
          </div>
        </div>
      </div>

      {/* Semester Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-[#E5E7EB] no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedSemester("all")}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md border whitespace-nowrap transition-colors duration-150 cursor-pointer",
            selectedSemester === "all"
              ? "bg-[#7F1D2D] text-white border-[#7F1D2D]"
              : "bg-[#F8F9FB] text-[#4B5563] border-[#E5E7EB] hover:border-[#7F1D2D] hover:text-[#7F1D2D]"
          )}
        >
          Tất cả các kỳ
        </button>
        {semesters.map((sem) => (
          <button
            key={sem}
            type="button"
            onClick={() => setSelectedSemester(sem)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md border whitespace-nowrap transition-colors duration-150 cursor-pointer",
              selectedSemester === sem
                ? "bg-[#7F1D2D] text-white border-[#7F1D2D]"
                : "bg-[#F8F9FB] text-[#4B5563] border-[#E5E7EB] hover:border-[#7F1D2D] hover:text-[#7F1D2D]"
            )}
          >
            Học kỳ {sem}
            {sem === 5 && (
              <span
                className={cn(
                  "ml-1 text-[10px] font-semibold",
                  selectedSemester === sem ? "text-white/90" : "text-[#7F1D2D]"
                )}
              >
                (Kỳ hiện tại)
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Course List Table */}
      <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FB] text-[#4B5563] border-b border-[#E5E7EB]">
              <th className="py-2.5 px-3 font-semibold w-12 text-center">
                STT
              </th>
              <th className="py-2.5 px-3 font-semibold w-28">Mã học phần</th>
              <th className="py-2.5 px-3 font-semibold">Tên học phần</th>
              <th className="py-2.5 px-2 font-semibold text-center w-16">
                Số TC
              </th>
              <th className="py-2.5 px-3 font-semibold">Học phần tiên quyết</th>
              <th className="py-2.5 px-3 font-semibold">Khoa / Bộ môn</th>
              <th className="py-2.5 px-3 font-semibold text-center w-36">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[#6B7280]">
                  Không có học phần nào được cấu hình cho học kỳ này.
                </td>
              </tr>
            ) : (
              filteredCourses.map((c, idx) => {
                const statusInfo = getCourseStatus(c.code);

                return (
                  <tr
                    key={c.code}
                    className="hover:bg-[#F8F9FB] transition-colors duration-150"
                  >
                    <td className="py-3 px-3 text-center text-[#6B7280]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-[#1F2937]">
                      {c.code}
                    </td>
                    <td className="py-3 px-3 font-medium text-[#1F2937]">
                      {c.name}
                      <span className="text-[11px] text-[#6B7280] block">
                        Kỳ kế hoạch: Học kỳ {c.semesterProposal}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-[#1F2937]">
                      {c.credits}
                    </td>
                    <td className="py-3 px-3 text-[#4B5563] font-mono">
                      {c.prerequisites.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {c.prerequisites.map((p) => (
                            <span
                              key={p}
                              className="bg-[#F8F9FB] px-2 py-0.5 rounded border border-[#E5E7EB] text-[11px]"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[#6B7280]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#4B5563]">
                      {c.department}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={cn(
                          "inline-block text-[11px] font-medium px-2.5 py-0.5 rounded border",
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
