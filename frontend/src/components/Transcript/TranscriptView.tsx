"use client";

import React, { useState } from "react";
import { StudentData, CompletedCourseData } from "@/lib/mock-data";
import {
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TranscriptViewProps {
  student: StudentData | null;
}

const SEMESTER_LABELS: Record<string, { title: string; order: number }> = {
  "2021-2022-HK1": { title: "Học kỳ 1 - Năm học 2021 - 2022", order: 1 },
  "2021-2022-HK2": { title: "Học kỳ 2 - Năm học 2021 - 2022", order: 2 },
  "2022-2023-HK1": { title: "Học kỳ 3 (HK1 Năm học 2022 - 2023)", order: 3 },
  "2022-2023-HK2": { title: "Học kỳ 4 (HK2 Năm học 2022 - 2023)", order: 4 },
  "2023-2024-HK1": { title: "Học kỳ 5 (HK1 Năm học 2023 - 2024)", order: 5 },
  "2023-2024-HK2": { title: "Học kỳ 6 (HK2 Năm học 2023 - 2024)", order: 6 },
  "2024-2025-HK1": { title: "Học kỳ 7 (HK1 Năm học 2024 - 2025)", order: 7 },
  "2024-2025-HK2": { title: "Học kỳ 8 (HK2 Năm học 2024 - 2025)", order: 8 },
};

export const TranscriptView: React.FC<TranscriptViewProps> = ({ student }) => {
  const [selectedSemFilter, setSelectedSemFilter] = useState<string>("all");

  if (!student) return null;

  const cpa = student.cpa || 0;
  const totalEarned = student.accumulatedCredits || 0;

  let academicRanking = "Khá";
  let rankingColor = "text-[#2563EB] bg-blue-50 border-blue-200";

  if (cpa >= 3.6) {
    academicRanking = "Xuất sắc";
    rankingColor = "text-[#15803D] bg-emerald-50 border-emerald-200";
  } else if (cpa >= 3.2) {
    academicRanking = "Giỏi";
    rankingColor = "text-[#2563EB] bg-blue-50 border-blue-200";
  } else if (cpa >= 2.5) {
    academicRanking = "Khá";
    rankingColor = "text-[#1F2937] bg-[#F8F9FB] border-[#E5E7EB]";
  } else if (cpa >= 2.0) {
    academicRanking = "Trung bình";
    rankingColor = "text-[#D97706] bg-amber-50 border-amber-200";
  } else {
    academicRanking = "Cảnh báo học tập";
    rankingColor = "text-[#DC2626] bg-red-50 border-red-200";
  }

  // Group completed courses by semester
  const groupedMap = new Map<string, CompletedCourseData[]>();
  student.completedCourses.forEach((course) => {
    const semKey = course.semester || "Khác";
    if (!groupedMap.has(semKey)) {
      groupedMap.set(semKey, []);
    }
    groupedMap.get(semKey)!.push(course);
  });

  const semesterGroups = Array.from(groupedMap.entries())
    .map(([semesterKey, courses]) => {
      const meta = SEMESTER_LABELS[semesterKey] || {
        title: `Học kỳ ${semesterKey}`,
        order: 99,
      };
      const totalCreditsInSem = courses.reduce((sum, c) => sum + c.credits, 0);
      const passedCreditsInSem = courses
        .filter((c) => c.isPassed)
        .reduce((sum, c) => sum + c.credits, 0);
      const weightedPoints = courses.reduce(
        (sum, c) => sum + c.gradePoint * c.credits,
        0
      );
      const gpa =
        totalCreditsInSem > 0 ? weightedPoints / totalCreditsInSem : 0;

      return {
        semesterKey,
        title: meta.title,
        order: meta.order,
        courses,
        totalCreditsInSem,
        passedCreditsInSem,
        gpa,
      };
    })
    .sort((a, b) => a.order - b.order);

  const visibleSemesterGroups =
    selectedSemFilter === "all"
      ? semesterGroups
      : semesterGroups.filter((g) => g.semesterKey === selectedSemFilter);

  return (
    <div className="space-y-6">
      {/* Top Summary Card */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB] gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#1F2937]">
              Kết quả học tập & Bảng điểm theo từng học kỳ
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Sinh viên:{" "}
              <strong className="text-[#1F2937]">{student.fullName}</strong> (
              {student.studentCode}) • Lớp: {student.administrativeClass}
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 text-xs bg-[#FFFFFF] hover:bg-[#F8F9FB] text-[#1F2937] px-3 py-1.5 rounded-md border border-[#E5E7EB] font-medium transition-colors duration-150 cursor-pointer self-start sm:self-auto"
          >
            <FileText className="w-3.5 h-3.5 text-[#4B5563]" />
            <span>In bảng điểm</span>
          </button>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
          <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-4">
            <span className="text-xs text-[#6B7280]">
              Điểm trung bình tích lũy (CPA)
            </span>
            <div className="text-xl font-bold text-[#1F2937] mt-1 flex items-baseline space-x-1">
              <span>{cpa.toFixed(2)}</span>
              <span className="text-xs text-[#6B7280] font-normal">/ 4.0</span>
            </div>
            <span className="text-[11px] text-[#6B7280]">
              Thang điểm 4 chuẩn tín chỉ
            </span>
          </div>

          <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-4">
            <span className="text-xs text-[#6B7280]">Tín chỉ tích lũy</span>
            <div className="text-xl font-bold text-[#7F1D2D] mt-1 flex items-baseline space-x-1">
              <span>{totalEarned}</span>
              <span className="text-xs text-[#6B7280] font-normal">
                / 150 TC
              </span>
            </div>
            <span className="text-[11px] text-[#6B7280]">
              Hoàn thành {Math.round((totalEarned / 150) * 100)}% chương trình
            </span>
          </div>

          <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-4">
            <span className="text-xs text-[#6B7280]">Xếp loại học lực</span>
            <div className="mt-1.5">
              <span
                className={cn(
                  "text-xs font-semibold px-2.5 py-0.5 rounded border inline-block",
                  rankingColor
                )}
              >
                {academicRanking}
              </span>
            </div>
            <span className="text-[11px] text-[#6B7280] block mt-1.5">
              Xét theo CPA tích lũy hiện hành
            </span>
          </div>

          <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-4">
            <span className="text-xs text-[#6B7280]">Cố vấn học tập</span>
            <div className="text-sm font-semibold text-[#1F2937] mt-1 truncate">
              {student.advisorName}
            </div>
            <span className="text-[11px] text-[#6B7280]">
              Khoa Công nghệ Thông tin 1
            </span>
          </div>
        </div>

        {/* Semester Filter Bar */}
        <div className="pt-3.5 border-t border-[#E5E7EB] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs font-medium text-[#4B5563] shrink-0 mr-1">
            Chọn học kỳ:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSemFilter("all")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md border transition-colors duration-150 whitespace-nowrap cursor-pointer",
              selectedSemFilter === "all"
                ? "bg-[#7F1D2D] text-white border-[#7F1D2D]"
                : "bg-[#FFFFFF] text-[#4B5563] border-[#E5E7EB] hover:border-[#7F1D2D] hover:text-[#7F1D2D]"
            )}
          >
            Tất cả ({semesterGroups.length} học kỳ)
          </button>
          {semesterGroups.map((group, index) => (
            <button
              key={group.semesterKey}
              type="button"
              onClick={() => setSelectedSemFilter(group.semesterKey)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md border transition-colors duration-150 whitespace-nowrap cursor-pointer",
                selectedSemFilter === group.semesterKey
                  ? "bg-[#7F1D2D] text-white border-[#7F1D2D]"
                  : "bg-[#FFFFFF] text-[#4B5563] border-[#E5E7EB] hover:border-[#7F1D2D] hover:text-[#7F1D2D]"
              )}
            >
              Học kỳ {index + 1} ({group.semesterKey})
            </button>
          ))}
        </div>
      </div>

      {/* Individual Semester Tables */}
      <div className="space-y-5">
        {visibleSemesterGroups.map((group) => (
          <div
            key={group.semesterKey}
            className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg overflow-hidden"
          >
            {/* Semester Table Header Banner */}
            <div className="bg-[#FFF5F5] border-b border-[#E5E7EB] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="bg-[#7F1D2D] text-white text-xs font-semibold px-2.5 py-1 rounded-md font-mono">
                  {group.semesterKey}
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[#1F2937]">
                    {group.title}
                  </h2>
                  <p className="text-[11px] text-[#6B7280]">
                    Số học phần trong kỳ:{" "}
                    <strong className="text-[#1F2937]">
                      {group.courses.length} môn
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-[#FFFFFF] border border-[#E5E7EB] px-2.5 py-1 rounded-md text-[#4B5563]">
                  Tín chỉ ĐK:{" "}
                  <strong className="text-[#1F2937]">
                    {group.totalCreditsInSem} TC
                  </strong>
                </span>
                <span className="bg-[#FFFFFF] border border-[#E5E7EB] px-2.5 py-1 rounded-md text-[#15803D]">
                  Tín chỉ đạt: <strong>{group.passedCreditsInSem} TC</strong>
                </span>
                <span className="bg-[#FFFFFF] border border-[#7F1D2D]/30 px-2.5 py-1 rounded-md font-semibold text-[#7F1D2D]">
                  GPA học kỳ: <strong>{group.gpa.toFixed(2)} / 4.0</strong>
                </span>
              </div>
            </div>

            {/* Courses Table for this Semester */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FB] text-[#4B5563] border-b border-[#E5E7EB]">
                    <th className="py-2.5 px-3 font-semibold w-12 text-center">
                      STT
                    </th>
                    <th className="py-2.5 px-3 font-semibold w-28">
                      Mã học phần
                    </th>
                    <th className="py-2.5 px-3 font-semibold">Tên học phần</th>
                    <th className="py-2.5 px-2 font-semibold text-center w-20">
                      Số TC
                    </th>
                    <th className="py-2.5 px-2 font-semibold text-center w-24">
                      Điểm chữ
                    </th>
                    <th className="py-2.5 px-2 font-semibold text-center w-24">
                      Điểm hệ 4
                    </th>
                    <th className="py-2.5 px-3 font-semibold text-center w-32">
                      Kết quả
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {group.courses.map((c, idx) => (
                    <tr
                      key={`${group.semesterKey}-${c.courseCode}`}
                      className="hover:bg-[#F8F9FB] transition-colors duration-150"
                    >
                      <td className="py-3 px-3 text-center text-[#6B7280]">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-[#1F2937]">
                        {c.courseCode}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#1F2937]">
                        {c.courseName}
                      </td>
                      <td className="py-3 px-2 text-center text-[#1F2937] font-semibold">
                        {c.credits}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span
                          className={cn(
                            "font-semibold font-mono px-2 py-0.5 rounded border",
                            c.grade === "A" || c.grade === "A+"
                              ? "bg-emerald-50 text-[#15803D] border-emerald-200"
                              : c.grade === "B+" || c.grade === "B"
                              ? "bg-blue-50 text-[#2563EB] border-blue-200"
                              : c.grade === "F"
                              ? "bg-red-50 text-[#DC2626] border-red-200"
                              : "bg-amber-50 text-[#D97706] border-amber-200"
                          )}
                        >
                          {c.grade}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center text-[#1F2937] font-mono font-semibold">
                        {c.gradePoint.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {c.isPassed ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-[#15803D] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                            <span>Đạt</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-[#DC2626] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                            <XCircle className="w-3 h-3 text-[#DC2626]" />
                            <span>Học lại (F)</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#F8F9FB] border-t border-[#E5E7EB] font-semibold text-[#1F2937]">
                    <td colSpan={3} className="py-2.5 px-3 text-right">
                      Tổng kết {group.title}:
                    </td>
                    <td className="py-2.5 px-2 text-center text-[#7F1D2D] font-bold">
                      {group.passedCreditsInSem} / {group.totalCreditsInSem} TC
                    </td>
                    <td
                      colSpan={2}
                      className="py-2.5 px-2 text-center text-[#4B5563]"
                    >
                      GPA kỳ:{" "}
                      <strong className="text-[#7F1D2D]">
                        {group.gpa.toFixed(2)}
                      </strong>
                    </td>
                    <td className="py-2.5 px-3 text-center text-[#15803D]">
                      Đạt {group.courses.filter((x) => x.isPassed).length}/
                      {group.courses.length} môn
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
