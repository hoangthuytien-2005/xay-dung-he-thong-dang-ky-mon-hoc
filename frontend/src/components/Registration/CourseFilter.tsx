"use client";

import React from "react";
import { Search, Layers, RefreshCw, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export type CourseCategoryType = "proposal" | "retake" | "improve" | "all";

interface CourseFilterProps {
  activeCategory: CourseCategoryType;
  onChangeCategory: (cat: CourseCategoryType) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  retakeCount: number;
  improveCount: number;
  totalCoursesCount: number;
}

export const CourseFilter: React.FC<CourseFilterProps> = ({
  activeCategory,
  onChangeCategory,
  searchTerm,
  onSearchChange,
  retakeCount,
  improveCount,
  totalCoursesCount,
}) => {
  const categories = [
    {
      id: "proposal" as CourseCategoryType,
      label: "Theo kế hoạch (Kỳ 5)",
      icon: BookOpen,
      desc: "Môn theo chuẩn tiến độ CTĐT",
    },
    {
      id: "retake" as CourseCategoryType,
      label: "Học lại",
      icon: RefreshCw,
      badge: retakeCount > 0 ? `${retakeCount} môn F` : undefined,
      desc: "Môn chưa đạt cần học lại",
    },
    {
      id: "improve" as CourseCategoryType,
      label: "Học cải thiện",
      icon: Sparkles,
      badge: improveCount > 0 ? `${improveCount} môn` : undefined,
      desc: "Môn điểm D/D+ muốn nâng điểm",
    },
    {
      id: "all" as CourseCategoryType,
      label: "Tất cả môn mở",
      icon: Layers,
      desc: `Toàn bộ ${totalCoursesCount} môn học`,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 mb-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onChangeCategory(cat.id)}
                className={cn(
                  "flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150",
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-slate-500")} />
                <span>{cat.label}</span>
                {cat.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded font-semibold",
                      isActive ? "bg-blue-800 text-blue-100" : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên hoặc mã môn (VD: INT1306)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 placeholder:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
};
