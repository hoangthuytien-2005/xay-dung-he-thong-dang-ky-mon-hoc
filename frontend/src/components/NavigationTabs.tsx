"use client";

import React from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "./Navbar";

export type ActiveTabType =
  | "registration"
  | "drop_courses"
  | "timetable"
  | "curriculum"
  | "transcript"
  | "lecturer_attendance"
  | "lecturer_schedule"
  | "admin_period"
  | "admin_students";

interface NavigationTabsProps {
  activeTab: ActiveTabType;
  onChangeTab: (tab: ActiveTabType) => void;
  registeredCount: number;
  totalCredits: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  role?: UserRole;
}

interface SidebarTabItem {
  id: ActiveTabType;
  label: string;
  shortLabel: string;
  subLabel?: string;
  badge?: string;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onChangeTab,
  registeredCount,
  totalCredits,
  isCollapsed,
  onToggleCollapse,
  role = "student",
}) => {
  const studentTabs: SidebarTabItem[] = [
    {
      id: "registration",
      label: "Đăng ký tín chỉ",
      shortLabel: "ĐK",
      subLabel: "Chọn lớp học phần mở",
      badge:
        registeredCount > 0
          ? `${registeredCount} môn (${totalCredits} TC)`
          : undefined,
    },
    {
      id: "drop_courses",
      label: "Hủy môn học đã đăng ký",
      shortLabel: "Hủy",
      subLabel: "Quản lý & rút học phần",
      badge: registeredCount > 0 ? `${registeredCount} lớp` : "0 lớp",
    },
    {
      id: "timetable",
      label: "Thời khóa biểu tuần",
      shortLabel: "TKB",
      subLabel: "Lịch học chính thức",
      badge: registeredCount > 0 ? `${registeredCount} lớp` : undefined,
    },
    {
      id: "curriculum",
      label: "Chương trình đào tạo",
      shortLabel: "CTĐT",
      subLabel: "Khung 9 học kỳ chuẩn",
      badge: "9 kỳ",
    },
    {
      id: "transcript",
      label: "Kết quả học tập",
      shortLabel: "Điểm",
      subLabel: "Bảng điểm theo từng kỳ",
    },
  ];

  const lecturerTabs: SidebarTabItem[] = [
    {
      id: "lecturer_attendance",
      label: "Điểm danh sinh viên",
      shortLabel: "ĐD",
      subLabel: "Cá nhân & Toàn bộ lớp",
    },
    {
      id: "lecturer_schedule",
      label: "Quản lý lịch dạy",
      shortLabel: "Lịch",
      subLabel: "Lịch giảng dạy từng lớp",
    },
  ];

  const adminTabs: SidebarTabItem[] = [
    {
      id: "admin_period",
      label: "Mở / Đóng cổng ĐKTC",
      shortLabel: "Cổng",
      subLabel: "Cấu hình đợt & Sĩ số",
    },
    {
      id: "admin_students",
      label: "Quản lý hồ sơ sinh viên",
      shortLabel: "Hồ sơ",
      subLabel: "Đánh dấu Bảo lưu / Thôi học",
    },
  ];

  const tabs =
    role === "lecturer"
      ? lecturerTabs
      : role === "admin"
      ? adminTabs
      : studentTabs;

  const roleSubtitle =
    role === "lecturer"
      ? "Phân hệ Giảng viên"
      : role === "admin"
      ? "Quản trị Đào tạo"
      : "Phân hệ Sinh viên";

  return (
    <aside
      className={cn(
        "bg-[#FFFFFF] text-[#7F1D2D] border-r border-[#7F1D2D] shrink-0 flex flex-col transition-[width] duration-200 ease-out select-none",
        isCollapsed ? "w-14 sm:w-16" : "w-64 lg:w-72"
      )}
      aria-label="Danh mục chức năng"
    >
      {/* Header Cell with single 3-bar Hamburger Icon */}
      <div
        className={cn(
          "bg-[#FFFFFF] text-[#7F1D2D] border-b border-[#7F1D2D] flex items-center",
          isCollapsed
            ? "justify-center p-2.5 sm:p-3"
            : "justify-between px-4 py-3.5"
        )}
      >
        {!isCollapsed && (
          <div className="min-w-0">
            <h2 className="text-xs font-bold tracking-wide text-[#7F1D2D] truncate">
              Danh mục chức năng
            </h2>
            <p className="text-[11px] text-[#7F1D2D]/80 mt-0.5 truncate">
              {roleSubtitle}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          title={
            isCollapsed ? "Hiển thị cột chức năng" : "Thu gọn cột chức năng"
          }
          aria-label="Thu gọn hoặc hiển thị cột chức năng"
          aria-expanded={!isCollapsed}
          className="w-9 h-9 inline-flex items-center justify-center bg-[#FFFFFF] hover:bg-[#FFF5F5] text-[#7F1D2D] border border-[#7F1D2D] rounded-md transition-colors duration-150 cursor-pointer shrink-0"
        >
          <Menu className="w-4 h-4 text-[#7F1D2D]" />
        </button>
      </div>

      {/* Function Cells separated by dark burgundy borders (No leading icons) */}
      <nav className="flex flex-col divide-y divide-[#7F1D2D] border-b border-[#7F1D2D]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              title={isCollapsed ? tab.label : undefined}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "w-full text-left bg-[#FFFFFF] hover:bg-[#FFF5F5]/80 text-[#7F1D2D] transition-colors duration-150 cursor-pointer flex items-center relative",
                isCollapsed
                  ? "justify-center py-3.5 px-1.5"
                  : "justify-between px-4 py-3.5",
                isActive &&
                  "bg-[#FFF5F5] font-semibold shadow-[inset_3px_0_0_0_#7F1D2D]"
              )}
            >
              {isCollapsed ? (
                <span
                  className={cn(
                    "text-[11px] font-semibold text-[#7F1D2D] text-center leading-tight",
                    isActive && "font-bold text-[#651525]"
                  )}
                >
                  {tab.shortLabel}
                </span>
              ) : (
                <>
                  <div className="min-w-0">
                    <div
                      className={cn(
                        "text-xs text-[#7F1D2D] leading-snug truncate",
                        isActive ? "font-bold text-[#651525]" : "font-medium"
                      )}
                    >
                      {tab.label}
                    </div>
                    {tab.subLabel && (
                      <div className="text-[11px] text-[#7F1D2D]/75 font-normal mt-0.5 truncate">
                        {tab.subLabel}
                      </div>
                    )}
                  </div>

                  {tab.badge && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded border border-[#7F1D2D]/40 font-semibold bg-[#FFFFFF] text-[#7F1D2D] shrink-0 ml-2",
                        isActive && "bg-[#7F1D2D] text-white border-[#7F1D2D]"
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </>
              )}

              {isCollapsed && tab.badge && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7F1D2D]" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
