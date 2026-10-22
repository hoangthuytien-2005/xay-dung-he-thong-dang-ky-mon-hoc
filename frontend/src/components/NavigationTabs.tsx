"use client";

import React from "react";
import { BookOpen, Calendar, Award, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActiveTabType = "registration" | "timetable" | "curriculum" | "transcript";

interface NavigationTabsProps {
  activeTab: ActiveTabType;
  onChangeTab: (tab: ActiveTabType) => void;
  registeredCount: number;
  totalCredits: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onChangeTab,
  registeredCount,
  totalCredits,
}) => {
  const tabs = [
    {
      id: "registration" as ActiveTabType,
      label: "Đăng ký tín chỉ",
      icon: BookOpen,
      badge: registeredCount > 0 ? `${registeredCount} môn (${totalCredits} TC)` : undefined,
    },
    {
      id: "timetable" as ActiveTabType,
      label: "Thời khóa biểu tuần",
      icon: Calendar,
      badge: registeredCount > 0 ? `${registeredCount} lớp` : undefined,
    },
    {
      id: "curriculum" as ActiveTabType,
      label: "Chương trình đào tạo",
      icon: GitBranch,
    },
    {
      id: "transcript" as ActiveTabType,
      label: "Kết quả học tập",
      icon: Award,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 py-2 px-3 text-sm font-medium rounded-md whitespace-nowrap transition-colors duration-150",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-red-400" : "text-slate-500")} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={cn(
                      "text-[11px] px-1.5 py-0.5 rounded font-semibold",
                      isActive
                        ? "bg-red-800 text-white"
                        : "bg-slate-200 text-slate-700"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
