"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type CourseCategoryType = "proposal" | "retake" | "improve" | "all";

interface CourseFilterProps {
  activeCategory: CourseCategoryType;
  onChangeCategory: (cat: CourseCategoryType) => void;
  selectedSemester?: number | "all";
  onChangeSemester?: (sem: number | "all") => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  retakeCount: number;
  improveCount: number;
  totalCoursesCount: number;
}

export const CourseFilter: React.FC<CourseFilterProps> = ({
  activeCategory,
  onChangeCategory,
  selectedSemester = "all",
  onChangeSemester,
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
    },
    {
      id: "retake" as CourseCategoryType,
      label: "Học lại",
      badge: retakeCount > 0 ? `${retakeCount} môn F` : undefined,
    },
    {
      id: "improve" as CourseCategoryType,
      label: "Học cải thiện",
      badge: improveCount > 0 ? `${improveCount} môn` : undefined,
    },
    {
      id: "all" as CourseCategoryType,
      label: "Tất cả môn CTĐT",
      badge: `${totalCoursesCount} môn`,
    },
  ];

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const hasActiveFilter =
    searchTerm.trim() !== "" ||
    activeCategory !== "proposal" ||
    selectedSemester !== "all";

  const handleResetFilters = () => {
    onSearchChange("");
    onChangeCategory("proposal");
    if (onChangeSemester) {
      onChangeSemester("all");
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-4 mb-5 space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onChangeCategory(cat.id);
                  if (cat.id !== "all" && onChangeSemester) {
                    onChangeSemester("all");
                  }
                }}
                className={cn(
                  "flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-150 cursor-pointer",
                  isActive
                    ? "bg-[#7F1D2D] text-white border-[#7F1D2D]"
                    : "bg-[#F8F9FB] text-[#4B5563] border-[#E5E7EB] hover:bg-[#FFF5F5] hover:text-[#7F1D2D] hover:border-[#7F1D2D]/30"
                )}
              >
                <span>{cat.label}</span>
                {cat.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded font-semibold",
                      isActive
                        ? "bg-[#651525] text-white"
                        : "bg-white text-[#4B5563] border border-[#E5E7EB]"
                    )}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input & Reset Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:min-w-[260px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm tên hoặc mã học phần (VD: INT1306)..."
              aria-label="Tìm kiếm học phần"
              className="w-full h-9 pl-8 pr-8 text-xs bg-[#F8F9FB] border border-[#E5E7EB] rounded-md text-[#1F2937] focus:bg-[#FFFFFF] focus:border-[#7F1D2D] focus:ring-2 focus:ring-[#7F1D2D]/15 placeholder:text-[#6B7280]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Xóa từ khóa tìm kiếm"
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#6B7280] hover:text-[#1F2937] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="h-9 px-3 text-xs font-medium text-[#4B5563] bg-[#FFFFFF] hover:bg-[#F8F9FB] border border-[#E5E7EB] rounded-md transition-colors duration-150 whitespace-nowrap cursor-pointer"
            >
              Mặc định
            </button>
          )}
        </div>
      </div>

      {/* Semester Quick Filter Bar (Học kỳ 1 -> Học kỳ 9) */}
      {onChangeSemester && (
        <div className="pt-3 border-t border-[#E5E7EB] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs font-medium text-[#4B5563] shrink-0 mr-1">
            Học kỳ CTĐT:
          </span>
          <button
            type="button"
            onClick={() => {
              onChangeCategory("all");
              onChangeSemester("all");
            }}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-md border transition-colors duration-150 whitespace-nowrap cursor-pointer",
              activeCategory === "all" && selectedSemester === "all"
                ? "bg-[#7F1D2D] text-white border-[#7F1D2D]"
                : "bg-[#FFFFFF] text-[#4B5563] border-[#E5E7EB] hover:border-[#7F1D2D] hover:text-[#7F1D2D]"
            )}
          >
            Tất cả (9 kỳ)
          </button>
          {semesters.map((sem) => {
            const isSelected =
              activeCategory === "all" && selectedSemester === sem;
            return (
              <button
                key={sem}
                type="button"
                onClick={() => {
                  onChangeCategory("all");
                  onChangeSemester(sem);
                }}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-md border transition-colors duration-150 whitespace-nowrap cursor-pointer",
                  isSelected
                    ? "bg-[#7F1D2D] text-white border-[#7F1D2D]"
                    : "bg-[#FFFFFF] text-[#4B5563] border-[#E5E7EB] hover:border-[#7F1D2D] hover:text-[#7F1D2D]"
                )}
              >
                Học kỳ {sem}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
