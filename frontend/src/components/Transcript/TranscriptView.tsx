"use client";

import React from "react";
import { StudentData } from "@/lib/mock-data";
import { Award, BookCheck, TrendingUp, AlertCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TranscriptViewProps {
  student: StudentData | null;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ student }) => {
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

  return (
    <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Kết Quả Học Tập & Bảng Điểm Tích Lũy</span>
          </h2>
          <p className="text-xs text-slate-500">
            Sinh viên: <strong className="text-slate-800">{student.fullName}</strong> ({student.studentCode}) • Lớp: {student.administrativeClass}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md border border-slate-300 font-medium transition"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>In bảng điểm</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
          <span className="text-xs text-slate-500 font-medium">Điểm tích lũy (CPA)</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline space-x-1">
            <span>{cpa.toFixed(2)}</span>
            <span className="text-xs text-slate-400 font-normal">/ 4.0</span>
          </div>
          <span className="text-[11px] text-slate-400">Thang điểm 4 hệ thống tín chỉ</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
          <span className="text-xs text-slate-500 font-medium">Tín chỉ tích lũy</span>
          <div className="text-2xl font-bold text-blue-700 mt-1 flex items-baseline space-x-1">
            <span>{totalEarned}</span>
            <span className="text-xs text-slate-400 font-normal">/ 145 TC</span>
          </div>
          <span className="text-[11px] text-slate-400">Đạt {Math.round((totalEarned / 145) * 100)}% toàn khóa</span>
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

      {/* Grade Details Table */}
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
        Chi tiết các học phần đã hoàn thành
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <th className="py-2 px-3 font-semibold w-10 text-center">STT</th>
              <th className="py-2 px-3 font-semibold w-24">Học kỳ</th>
              <th className="py-2 px-3 font-semibold w-24">Mã môn</th>
              <th className="py-2 px-3 font-semibold">Tên học phần</th>
              <th className="py-2 px-2 font-semibold text-center w-16">Số TC</th>
              <th className="py-2 px-2 font-semibold text-center w-20">Điểm chữ</th>
              <th className="py-2 px-2 font-semibold text-center w-20">Thang 4</th>
              <th className="py-2 px-3 font-semibold text-center w-28">Kết quả</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {student.completedCourses.map((c, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-2 px-3 text-center text-slate-400">{idx + 1}</td>
                <td className="py-2 px-3 text-slate-500">{c.semester}</td>
                <td className="py-2 px-3 font-mono font-medium text-slate-900">{c.courseCode}</td>
                <td className="py-2 px-3 font-medium text-slate-900">{c.courseName}</td>
                <td className="py-2 px-2 text-center text-slate-800 font-semibold">{c.credits}</td>
                <td className="py-2 px-2 text-center">
                  <span
                    className={cn(
                      "font-bold font-mono px-1.5 py-0.5 rounded",
                      c.grade === "A"
                        ? "bg-emerald-100 text-emerald-800"
                        : c.grade === "F"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-slate-100 text-slate-800"
                    )}
                  >
                    {c.grade}
                  </span>
                </td>
                <td className="py-2 px-2 text-center text-slate-700 font-mono">
                  {c.gradePoint.toFixed(1)}
                </td>
                <td className="py-2 px-3 text-center">
                  {c.isPassed ? (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Đạt
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      Chưa đạt (F)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
