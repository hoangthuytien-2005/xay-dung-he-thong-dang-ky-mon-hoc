"use client";

import React, { useState } from "react";
import { RegistrationPeriodData, CourseClassData } from "@/lib/mock-data";
import { Settings, Power, Database, Save, AlertTriangle, Users } from "lucide-react";
import { DAY_NAMES, cn } from "@/lib/utils";

interface AdminPanelProps {
  period: RegistrationPeriodData | null;
  classes: CourseClassData[];
  onUpdatePeriod: (minCredits: number, maxCredits: number, isActive: boolean) => Promise<void>;
  onSeedData: () => Promise<void>;
  isSeeding: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  period,
  classes,
  onUpdatePeriod,
  onSeedData,
  isSeeding,
}) => {
  const [minCredits, setMinCredits] = useState<number>(period?.minCredits || 10);
  const [maxCredits, setMaxCredits] = useState<number>(period?.maxCredits || 24);
  const [isActive, setIsActive] = useState<boolean>(period?.isActive ?? true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdatePeriod(minCredits, maxCredits, isActive);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Identify classes with low enrollment (< 20 students) that might be cancelled by Academic Affairs
  const lowEnrollmentClasses = classes.filter((c) => c.currentSlots < 20);

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-200">
          <Settings className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">
            Cấu Hình Đợt Đăng Ký Tín Chỉ (Phòng Đào Tạo)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Trạng thái hệ thống ĐKTC
            </label>
            <div className="flex items-center space-x-3 mt-1.5">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={cn(
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  isActive ? "bg-emerald-600" : "bg-slate-300"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    isActive ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
              <span className="text-xs font-medium text-slate-800">
                {isActive ? "Đang mở cho sinh viên" : "Đã khóa cổng đăng ký"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Số tín chỉ tối thiểu (Min credits)
            </label>
            <input
              type="number"
              value={minCredits}
              onChange={(e) => setMinCredits(Number(e.target.value))}
              min={1}
              max={20}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Số tín chỉ tối đa (Max credits)
            </label>
            <input
              type="number"
              value={maxCredits}
              onChange={(e) => setMaxCredits(Number(e.target.value))}
              min={10}
              max={40}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={onSeedData}
            disabled={isSeeding}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded border border-slate-300 transition"
          >
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>{isSeeding ? "Đang khôi phục..." : "Nạp lại dữ liệu mẫu (MongoDB Seed)"}</span>
          </button>

          <div className="flex items-center space-x-3">
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-medium">✓ Đã lưu cài đặt!</span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded transition shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Đang lưu..." : "Lưu thay đổi"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Class Quota Monitor */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Giám Sát Sĩ Số Lớp Học Phần Học Kỳ Hiện Tại
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Tổng cộng: {classes.length} lớp học phần
          </span>
        </div>

        {lowEnrollmentClasses.length > 0 && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-900 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Cảnh báo sĩ số thấp:</strong> Có {lowEnrollmentClasses.length} lớp học phần hiện có dưới 20 sinh viên đăng ký (có thể xem xét hủy hoặc gộp lớp nếu hết hạn đợt đăng ký).
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-2.5 px-3 font-semibold">Mã LHP</th>
                <th className="py-2.5 px-3 font-semibold">Tên môn học</th>
                <th className="py-2.5 px-3 font-semibold">Thời gian học</th>
                <th className="py-2.5 px-3 font-semibold">Phòng</th>
                <th className="py-2.5 px-3 font-semibold">Giảng viên</th>
                <th className="py-2.5 px-3 font-semibold text-center">Sĩ số</th>
                <th className="py-2.5 px-3 font-semibold text-center">Tỷ lệ lấp đầy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map((cls) => {
                const percentage = Math.round((cls.currentSlots / cls.maxSlots) * 100);
                const isFull = cls.currentSlots >= cls.maxSlots;
                const isLow = cls.currentSlots < 20;

                return (
                  <tr key={cls.classCode} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{cls.classCode}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{cls.courseName}</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {DAY_NAMES[cls.dayOfWeek]} (Tiết {cls.startPeriod} -{" "}
                      {cls.startPeriod + cls.periodCount - 1})
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{cls.room}</td>
                    <td className="py-2.5 px-3 text-slate-600">{cls.lecturer}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                      {cls.currentSlots} / {cls.maxSlots}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center space-x-2 justify-center">
                        <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full",
                              isFull
                                ? "bg-rose-500"
                                : isLow
                                ? "bg-amber-500"
                                : "bg-emerald-600"
                            )}
                            style={{ width: `${Math.min(100, percentage)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-600 w-9 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
