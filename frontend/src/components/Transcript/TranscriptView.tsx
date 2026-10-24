"use client";

import React, { useState } from "react";
import { StudentData, CompletedCourseData } from "@/lib/mock-data";
import { Award, FileText, CalendarRange, CheckCircle2, XCircle } from "lucide-react";
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

  // Academic standing classification
  let academicRanking = "Khá";
  let rankingColor = "text-blue-700 bg-blue-50 border-blue-200";

  if (cpa >= 3.6) {
    academicRanking = "Xuất sắc";
    rankingColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  } else if (cpa >= 3.2) {
    academicRanking = "Giỏi";
    rankingColor = "text-blue-700 bg-blue-50 border-blue-200";
  } else if (cpa >= 2.5) {
    academicRanking = "Khá";
    rankingColor = "text-slate-700 bg-slate-100 border-slate-300";
  } else if (cpa >= 2.0) {
    academicRanking = "Trung bình";
    rankingColor = "text-amber-700 bg-amber-50 border-amber-200";
  } else {
    academicRanking = "Cảnh báo học tập";
    rankingColor = "text-rose-700 bg-rose-50 border-rose-200";
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
    <div className="space-y-5">
      {/* Top Summary Card */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-red-700" />
              <span>Kết Quả Học Tập & Bảng Điểm Theo Từng Học Kỳ</span>
            </h2>
            <p className="text-xs text-slate-500">
              Sinh viên: <strong className="text-slate-800">{student.fullName}</strong> ({student.studentCode}) • Lớp: {student.administrativeClass}
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md border border-slate-300 font-medium transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>In bảng điểm</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
            <span className="text-xs text-slate-500 font-medium">Điểm tích lũy toàn khóa (CPA)</span>
            <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline space-x-1">
              <span>{cpa.toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-normal">/ 4.0</span>
            </div>
            <span className="text-[11px] text-slate-400">Thang điểm 4 hệ thống tín chỉ</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
            <span className="text-xs text-slate-500 font-medium">Tín chỉ tích lũy</span>
            <div className="text-2xl font-bold text-red-700 mt-1 flex items-baseline space-x-1">
              <span>{totalEarned}</span>
              <span className="text-xs text-slate-400 font-normal">/ 150 TC</span>
            </div>
            <span className="text-[11px] text-slate-400">Đạt {Math.round((totalEarned / 150) * 100)}% toàn khóa</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
            <span className="text-xs text-slate-500 font-medium">Xếp loại học lực</span>
            <div className="mt-1">
              <span className={cn("text-sm font-bold px-2 py-0.5 rounded border inline-block", rankingColor)}>
                {academicRanking}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">Cập nhật theo kỳ gần nhất</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
            <span className="text-xs text-slate-500 font-medium">Cố vấn học tập</span>
            <div className="text-xs font-bold text-slate-800 mt-1 truncate">
              {student.advisorName}
            </div>
            <span className="text-[11px] text-slate-400">Khoa Công nghệ Thông tin 1</span>
          </div>
        </div>

        {/* Semester Filter Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-600 flex items-center space-x-1 shrink-0 mr-1">
            <CalendarRange className="w-3.5 h-3.5 text-red-700" />
            <span>Chọn học kỳ:</span>
          </span>
          <button
            onClick={() => setSelectedSemFilter("all")}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded border transition whitespace-nowrap cursor-pointer",
              selectedSemFilter === "all"
                ? "bg-red-800 text-white border-red-900"
                : "bg-white text-slate-700 border-slate-200 hover:border-red-800 hover:text-red-700"
            )}
          >
            Tất cả các kỳ ({semesterGroups.length} học kỳ)
          </button>
          {semesterGroups.map((group, index) => (
            <button
              key={group.semesterKey}
              onClick={() => setSelectedSemFilter(group.semesterKey)}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded border transition whitespace-nowrap cursor-pointer",
                selectedSemFilter === group.semesterKey
                  ? "bg-red-800 text-white border-red-900"
                  : "bg-white text-slate-700 border-slate-200 hover:border-red-800 hover:text-red-700"
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
            className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-xs"
          >
            {/* Semester Table Header Banner */}
            <div className="bg-red-50/70 border-b border-red-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="bg-red-800 text-white text-xs font-bold px-2.5 py-1 rounded">
                  {group.semesterKey}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-red-950">{group.title}</h3>
                  <p className="text-[11px] text-slate-600">
                    Số môn học trong kỳ: <strong>{group.courses.length} môn</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded font-medium text-slate-700">
                  Tín chỉ đăng ký: <strong className="text-slate-900">{group.totalCreditsInSem} TC</strong>
                </span>
                <span className="bg-white border border-emerald-200 px-2.5 py-1 rounded font-medium text-emerald-800">
                  Tín chỉ đạt: <strong>{group.passedCreditsInSem} TC</strong>
                </span>
                <span className="bg-white border border-red-300 px-2.5 py-1 rounded font-semibold text-red-800">
                  GPA học kỳ: <strong>{group.gpa.toFixed(2)} / 4.0</strong>
                </span>
              </div>
            </div>

            {/* Courses Table for this Semester */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="py-2.5 px-3 font-semibold w-12 text-center">STT</th>
                    <th className="py-2.5 px-3 font-semibold w-28">Mã học phần</th>
                    <th className="py-2.5 px-3 font-semibold">Tên học phần</th>
                    <th className="py-2.5 px-2 font-semibold text-center w-20">Số TC</th>
                    <th className="py-2.5 px-2 font-semibold text-center w-24">Điểm chữ</th>
                    <th className="py-2.5 px-2 font-semibold text-center w-24">Điểm hệ 4</th>
                    <th className="py-2.5 px-3 font-semibold text-center w-32">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {group.courses.map((c, idx) => (
                    <tr key={`${group.semesterKey}-${c.courseCode}`} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{c.courseCode}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{c.courseName}</td>
                      <td className="py-2.5 px-2 text-center text-slate-800 font-bold">{c.credits}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span
                          className={cn(
                            "font-bold font-mono px-2 py-0.5 rounded border",
                            c.grade === "A" || c.grade === "A+"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : c.grade === "B+" || c.grade === "B"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : c.grade === "F"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          )}
                        >
                          {c.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-800 font-mono font-semibold">
                        {c.gradePoint.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {c.isPassed ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Đạt</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Học lại (F)</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 border-t border-slate-200 font-semibold text-slate-800">
                    <td colSpan={3} className="py-2 px-3 text-right">
                      Tổng kết {group.title}:
                    </td>
                    <td className="py-2 px-2 text-center text-red-700 font-bold">
                      {group.passedCreditsInSem} / {group.totalCreditsInSem} TC
                    </td>
                    <td colSpan={2} className="py-2 px-2 text-center text-slate-700">
                      GPA kỳ: <strong className="text-red-800">{group.gpa.toFixed(2)}</strong>
                    </td>
                    <td className="py-2 px-3 text-center text-emerald-700">
                      Hoàn thành {group.courses.filter((x) => x.isPassed).length}/{group.courses.length} môn
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
