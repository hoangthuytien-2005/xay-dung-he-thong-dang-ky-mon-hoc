"use client";

import React from "react";
import {
  BookOpen,
  Calendar,
  Award,
  GitBranch,
  Trash2,
  Menu,
  ChevronRight,
  Settings,
  Users,
  ClipboardCheck,
  UserCog,
} from "lucide-react";
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
  subLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
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
      subLabel: "Chọn lớp học phần mở",
      icon: BookOpen,
      badge: registeredCount > 0 ? `${registeredCount} môn (${totalCredits} TC)` : undefined,
    },
    {
      id: "drop_courses",
      label: "Hủy môn học đã đăng ký",
      subLabel: "Quản lý & rút học phần",
      icon: Trash2,
      badge: registeredCount > 0 ? `${registeredCount} lớp` : "0 lớp",
    },
    {
      id: "timetable",
      label: "Thời khóa biểu tuần",
      subLabel: "Lịch học chính thức",
      icon: Calendar,
      badge: registeredCount > 0 ? `${registeredCount} lớp` : undefined,
    },
    {
      id: "curriculum",
      label: "Chương trình đào tạo",
      subLabel: "Khung 9 học kỳ",
      icon: GitBranch,
      badge: "9 kỳ",
    },
    {
      id: "transcript",
      label: "Kết quả học tập",
      subLabel: "Bảng điểm & CPA tích lũy",
      icon: Award,
    },
  ];

  const lecturerTabs: SidebarTabItem[] = [
    {
      id: "lecturer_attendance",
      label: "Điểm danh sinh viên",
      subLabel: "Cá nhân & Toàn bộ lớp",
      icon: ClipboardCheck,
    },
    {
      id: "lecturer_schedule",
      label: "Quản lý lịch dạy",
      subLabel: "Lịch giảng dạy từng lớp",
      icon: Calendar,
    },
  ];

  const adminTabs: SidebarTabItem[] = [
    {
      id: "admin_period",
      label: "Mở / Đóng cổng ĐKTC",
      subLabel: "Cấu hình đợt & Sĩ số",
      icon: Settings,
    },
    {
      id: "admin_students",
      label: "Quản lý hồ sơ sinh viên",
      subLabel: "Đánh dấu Bảo lưu / Thôi học",
      icon: UserCog,
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
        "bg-white text-red-700 border-r-2 border-red-900 shrink-0 flex flex-col transition-all duration-200 select-none shadow-sm",
        isCollapsed ? "w-16" : "w-72"
      )}
      aria-label="Cột chức năng hệ thống"
    >
      {/* Header Cell with 3-bar Hamburger Icon */}
      <div
        className={cn(
          "bg-white text-red-700 border-b-2 border-red-900 flex items-center",
          isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3.5"
        )}
      >
        {!isCollapsed && (
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-red-700">
              Danh mục chức năng
            </h2>
            <p className="text-[11px] text-red-600/80 font-medium">
              {roleSubtitle}
            </p>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? "Hiển thị cột chức năng" : "Thu gọn cột chức năng"}
          aria-label="Thu gọn / Hiển thị cột chức năng"
          className="w-9 h-9 inline-flex items-center justify-center bg-white hover:bg-red-50 text-red-700 border border-red-900 rounded transition cursor-pointer shadow-2xs"
        >
          <Menu className="w-5 h-5 text-red-700" />
        </button>
      </div>

      {/* Main Function Cells divided by dark red borders */}
      <nav className="flex flex-col divide-y-2 divide-red-900 border-b-2 border-red-900">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              title={isCollapsed ? tab.label : undefined}
              className={cn(
                "w-full text-left bg-white hover:bg-red-50/80 text-red-700 transition-all duration-150 cursor-pointer flex items-center relative group",
                isCollapsed ? "justify-center py-4 px-2" : "justify-between px-4 py-3.5",
                isActive && "bg-red-50/90 font-bold shadow-[inset_4px_0_0_0_#7f1d1d]"
              )}
            >
              <div className={cn("flex items-center", !isCollapsed && "space-x-3")}>
                <div
                  className={cn(
                    "w-8 h-8 rounded flex items-center justify-center border border-red-900 bg-white text-red-700 shrink-0 transition",
                    isActive && "bg-red-700 text-white border-red-950"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!isCollapsed && (
                  <div>
                    <div
                      className={cn(
                        "text-xs text-red-700 leading-snug",
                        isActive ? "font-extrabold text-red-800" : "font-semibold"
                      )}
                    >
                      {tab.label}
                    </div>
                    {tab.subLabel && (
                      <div className="text-[11px] text-red-600/80 font-normal mt-0.5">
                        {tab.subLabel}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <div className="flex items-center space-x-1.5">
                  {tab.badge && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded border border-red-900 font-bold bg-white text-red-700",
                        isActive && "bg-red-100 text-red-800"
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={cn(
                      "w-3.5 h-3.5 text-red-700 transition-transform",
                      isActive ? "translate-x-0.5 opacity-100" : "opacity-50 group-hover:opacity-100"
                    )}
                  />
                </div>
              )}

              {/* Badge dot when collapsed */}
              {isCollapsed && tab.badge && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-700 border border-red-900" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
