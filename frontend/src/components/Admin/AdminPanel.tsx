"use client";

import React, { useState, useEffect } from "react";
import {
  RegistrationPeriodData,
  CourseClassData,
  StudentData,
  AdminData,
  AcademicStatusType,
} from "@/lib/mock-data";
import {
  Settings,
  Save,
  AlertTriangle,
  Users,
  ShieldCheck,
  Lock,
  Unlock,
  Search,
  UserCog,
  CheckCircle2,
  PauseCircle,
  UserX,
} from "lucide-react";
import { DAY_NAMES, cn } from "@/lib/utils";

interface AdminPanelProps {
  admin?: AdminData | null;
  period: RegistrationPeriodData | null;
  classes: CourseClassData[];
  students: StudentData[];
  onUpdatePeriod: (
    minCredits: number,
    maxCredits: number,
    isActive: boolean
  ) => Promise<void>;
  onUpdateStudentStatus: (
    studentCode: string,
    academicStatus: AcademicStatusType
  ) => Promise<{ success: boolean; message?: string }>;
  externalSubTab?: "period" | "students";
  onChangeExternalSubTab?: (tab: "period" | "students") => void;
}

const ACADEMIC_STATUS_META: Record<
  AcademicStatusType,
  {
    label: string;
    badgeClass: string;
    activeBtnClass: string;
  }
> = {
  ACTIVE: {
    label: "Đang theo học",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
    activeBtnClass: "bg-emerald-700 text-white border-emerald-900",
  },
  RESERVED: {
    label: "Đang bảo lưu",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300",
    activeBtnClass: "bg-amber-600 text-white border-amber-800",
  },
  DROPPED_OUT: {
    label: "Đã thôi học",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-300",
    activeBtnClass: "bg-rose-700 text-white border-rose-900",
  },
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  admin,
  period,
  classes,
  students,
  onUpdatePeriod,
  onUpdateStudentStatus,
  externalSubTab,
  onChangeExternalSubTab,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<"period" | "students">(
    "period"
  );
  const activeSubTab = externalSubTab ?? internalSubTab;
  const setActiveSubTab = (tab: "period" | "students") => {
    setInternalSubTab(tab);
    if (onChangeExternalSubTab) onChangeExternalSubTab(tab);
  };

  const [minCredits, setMinCredits] = useState<number>(period?.minCredits || 10);
  const [maxCredits, setMaxCredits] = useState<number>(period?.maxCredits || 24);
  const [isActive, setIsActive] = useState<boolean>(period?.isActive ?? true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>("");

  // Student status management state
  const [studentSearch, setStudentSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<AcademicStatusType | "ALL">(
    "ALL"
  );
  const [updatingStudentCode, setUpdatingStudentCode] = useState<string | null>(
    null
  );
  const [studentStatusBanner, setStudentStatusBanner] = useState<string>("");

  useEffect(() => {
    if (period) {
      setMinCredits(period.minCredits);
      setMaxCredits(period.maxCredits);
      setIsActive(period.isActive);
    }
  }, [period]);

  const handleSavePeriod = async (nextActive?: boolean) => {
    const targetActive = nextActive !== undefined ? nextActive : isActive;
    setIsActive(targetActive);
    setIsSaving(true);
    await onUpdatePeriod(minCredits, maxCredits, targetActive);
    setIsSaving(false);
    setSaveMessage(
      targetActive
        ? "Đã MỞ CỔNG đăng ký tín chỉ cho sinh viên toàn trường."
        : "Đã ĐÓNG CỔNG đăng ký tín chỉ."
    );
    setTimeout(() => setSaveMessage(""), 4000);
  };

  const handleChangeStudentStatus = async (
    studentCode: string,
    newStatus: AcademicStatusType
  ) => {
    setUpdatingStudentCode(studentCode);
    try {
      const res = await onUpdateStudentStatus(studentCode, newStatus);
      if (res.success) {
        setStudentStatusBanner(
          res.message ||
            `Đã cập nhật trạng thái sinh viên [${studentCode}] thành "${ACADEMIC_STATUS_META[newStatus].label}".`
        );
      }
    } finally {
      setUpdatingStudentCode(null);
    }
  };

  // Identify classes with low enrollment (< 20 students)
  const lowEnrollmentClasses = classes.filter((c) => c.currentSlots < 20);

  // Filter students for Academic Status management
  const filteredStudents = students.filter((s) => {
    const currentStatus: AcademicStatusType = s.academicStatus || "ACTIVE";
    if (statusFilter !== "ALL" && currentStatus !== statusFilter) return false;
    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase();
      return (
        s.studentCode.toLowerCase().includes(q) ||
        s.fullName.toLowerCase().includes(q) ||
        s.administrativeClass.toLowerCase().includes(q) ||
        s.major.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statusCounts = React.useMemo(() => {
    const counts = { ACTIVE: 0, RESERVED: 0, DROPPED_OUT: 0 };
    students.forEach((s) => {
      const st = s.academicStatus || "ACTIVE";
      counts[st] = (counts[st] || 0) + 1;
    });
    return counts;
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Training Administration Profile Banner */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-red-100 text-red-800 border border-red-300 font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                <span>QUẢN TRỊ ĐÀO TẠO</span>
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {admin?.fullName || "Ban Quản Trị Giáo Vụ & Đào Tạo"} (
                {admin?.adminCode || "ADMIN01"})
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {admin?.title || "Chuyên viên Quản lý Đào tạo"} •{" "}
              {admin?.department || "Phòng Đào tạo Đại học"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "px-3 py-2 rounded-md border text-xs font-bold flex items-center space-x-2",
                isActive
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-rose-50 border-rose-300 text-rose-800"
              )}
            >
              {isActive ? (
                <>
                  <Unlock className="w-4 h-4 text-emerald-700" />
                  <span>CỔNG ĐKTC: ĐANG MỞ</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-rose-700" />
                  <span>CỔNG ĐKTC: ĐANG ĐÓNG</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sub-tab switcher synced with left sidebar */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveSubTab("period")}
            className={cn(
              "flex items-center space-x-2 px-3.5 py-2 text-xs font-bold rounded-md transition cursor-pointer",
              activeSubTab === "period"
                ? "bg-red-800 text-white shadow-2xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            <Settings className="w-4 h-4" />
            <span>Mở / Đóng cổng đăng ký tín chỉ & Giám sát sĩ số</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("students")}
            className={cn(
              "flex items-center space-x-2 px-3.5 py-2 text-xs font-bold rounded-md transition cursor-pointer",
              activeSubTab === "students"
                ? "bg-red-800 text-white shadow-2xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            <UserCog className="w-4 h-4" />
            <span>Quản lý hồ sơ sinh viên (Đánh dấu Bảo lưu / Thôi học)</span>
          </button>
        </div>
      </div>

      {activeSubTab === "period" ? (
        <>
          {/* Open / Close Portal & Credit Limit Configuration Card */}
          <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-red-800" />
                <h2 className="text-base font-bold text-slate-900">
                  Điều Khiển Đóng / Mở Cổng Đăng Ký Tín Chỉ Sinh Viên
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Mã đợt: <strong>{period?.periodId || "2024-2025-HK1"}</strong>
              </span>
            </div>

            {/* Prominent Portal Gate Action Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                  <span>Trạng thái cổng đăng ký hiện tại:</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded border text-[11px] font-extrabold uppercase",
                      isActive
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                        : "bg-rose-100 text-rose-900 border-rose-300"
                    )}
                  >
                    {isActive
                      ? "Đang mở cho sinh viên đăng ký"
                      : "Đã khóa cổng đăng ký"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Khi đóng cổng, sinh viên trên toàn hệ thống sẽ không thể đăng ký
                  thêm học phần mới.
                </p>
              </div>

              <div className="flex items-center space-x-2.5 shrink-0">
                <button
                  type="button"
                  disabled={isSaving || isActive}
                  onClick={() => handleSavePeriod(true)}
                  className={cn(
                    "inline-flex items-center space-x-1.5 px-4 py-2 rounded text-xs font-bold border transition cursor-pointer",
                    isActive
                      ? "bg-emerald-700 text-white border-emerald-900 opacity-60 cursor-default"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-900 shadow-2xs"
                  )}
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Mở cổng đăng ký</span>
                </button>

                <button
                  type="button"
                  disabled={isSaving || !isActive}
                  onClick={() => handleSavePeriod(false)}
                  className={cn(
                    "inline-flex items-center space-x-1.5 px-4 py-2 rounded text-xs font-bold border transition cursor-pointer",
                    !isActive
                      ? "bg-rose-700 text-white border-rose-900 opacity-60 cursor-default"
                      : "bg-rose-700 hover:bg-rose-800 text-white border-rose-900 shadow-2xs"
                  )}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Đóng cổng đăng ký</span>
                </button>
              </div>
            </div>

            {/* Min / Max Credit Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số tín chỉ tối thiểu trong học kỳ (Min credits)
                </label>
                <input
                  type="number"
                  value={minCredits}
                  onChange={(e) => setMinCredits(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số tín chỉ tối đa cho phép đăng ký (Max credits)
                </label>
                <input
                  type="number"
                  value={maxCredits}
                  onChange={(e) => setMaxCredits(Number(e.target.value))}
                  min={10}
                  max={40}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                {saveMessage && (
                  <span className="text-xs text-emerald-700 font-bold">
                    {saveMessage}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleSavePeriod()}
                disabled={isSaving}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded transition shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>
                  {isSaving ? "Đang lưu cấu hình..." : "Lưu cấu hình đợt đăng ký"}
                </span>
              </button>
            </div>
          </div>

          {/* Class Quota Monitor */}
          <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-red-800" />
                <h2 className="text-base font-bold text-slate-900">
                  Giám Sát Sĩ Số Lớp Học Phần Toàn Trường
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Tổng cộng: {classes.length} lớp học phần mở trong kỳ
              </span>
            </div>

            {lowEnrollmentClasses.length > 0 && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-900 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Cảnh báo sĩ số thấp:</strong> Có{" "}
                  {lowEnrollmentClasses.length} lớp học phần hiện có dưới 20 sinh
                  viên đăng ký. Phòng Đào tạo cần theo dõi để xem xét gộp lớp nếu hết
                  hạn đăng ký.
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
                    <th className="py-2.5 px-3 font-semibold text-center">
                      Tỷ lệ lấp đầy
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classes.map((cls) => {
                    const percentage = Math.round(
                      (cls.currentSlots / cls.maxSlots) * 100
                    );
                    const isFull = cls.currentSlots >= cls.maxSlots;
                    const isLow = cls.currentSlots < 20;

                    return (
                      <tr
                        key={cls.classCode}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {cls.classCode}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">
                          {cls.courseName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {DAY_NAMES[cls.dayOfWeek]} (Tiết {cls.startPeriod} -{" "}
                          {cls.startPeriod + cls.periodCount - 1})
                        </td>
                        <td className="py-2.5 px-3 text-slate-800 font-medium">
                          {cls.room}
                        </td>
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
        </>
      ) : (
        /* TAB 2: STUDENT ACADEMIC STATUS MANAGEMENT (ACTIVE / RESERVED / DROPPED_OUT) */
        <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <UserCog className="w-5 h-5 text-red-800" />
                <span>
                  Quản Lý Trạng Thái Học Vụ Sinh Viên (Đang học • Bảo lưu • Thôi học)
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Đánh dấu sinh viên bảo lưu kết quả học tập hoặc đã có quyết định thôi
                học. Sinh viên bảo lưu hoặc thôi học sẽ bị khóa quyền đăng ký tín chỉ.
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-md border border-emerald-200 bg-emerald-50/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-semibold block">
                  Sinh viên Đang theo học
                </span>
                <span className="text-xl font-extrabold text-emerald-900">
                  {statusCounts.ACTIVE} sinh viên
                </span>
              </div>
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>

            <div className="p-3.5 rounded-md border border-amber-200 bg-amber-50/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-800 font-semibold block">
                  Sinh viên Bảo lưu
                </span>
                <span className="text-xl font-extrabold text-amber-900">
                  {statusCounts.RESERVED} sinh viên
                </span>
              </div>
              <PauseCircle className="w-7 h-7 text-amber-600" />
            </div>

            <div className="p-3.5 rounded-md border border-rose-200 bg-rose-50/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-rose-800 font-semibold block">
                  Sinh viên Đã thôi học
                </span>
                <span className="text-xl font-extrabold text-rose-900">
                  {statusCounts.DROPPED_OUT} sinh viên
                </span>
              </div>
              <UserX className="w-7 h-7 text-rose-600" />
            </div>
          </div>

          {studentStatusBanner && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded text-xs font-medium flex items-center justify-between">
              <span>{studentStatusBanner}</span>
              <button
                type="button"
                onClick={() => setStudentStatusBanner("")}
                className="text-emerald-800 font-bold ml-3"
              >
                Đóng
              </button>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: "ALL", label: `Tất cả (${students.length})` },
                  {
                    id: "ACTIVE",
                    label: `Đang theo học (${statusCounts.ACTIVE})`,
                  },
                  { id: "RESERVED", label: `Bảo lưu (${statusCounts.RESERVED})` },
                  {
                    id: "DROPPED_OUT",
                    label: `Đã thôi học (${statusCounts.DROPPED_OUT})`,
                  },
                ] as { id: AcademicStatusType | "ALL"; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-semibold border transition cursor-pointer",
                    statusFilter === tab.id
                      ? "bg-red-800 text-white border-red-900"
                      : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Tìm sinh viên theo mã SV, họ tên, lớp..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-800"
              />
            </div>
          </div>

          {/* Students Academic Status Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold w-10 text-center">STT</th>
                  <th className="py-2.5 px-3 font-semibold w-28">Mã SV</th>
                  <th className="py-2.5 px-3 font-semibold">Họ và tên sinh viên</th>
                  <th className="py-2.5 px-3 font-semibold">Lớp / Ngành</th>
                  <th className="py-2.5 px-3 font-semibold text-center">
                    CPA / Tín chỉ
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-center">
                    Trạng thái hiện tại
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-center">
                    Đánh dấu trạng thái học vụ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Không tìm thấy hồ sơ sinh viên phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st, idx) => {
                    const currentStatus: AcademicStatusType =
                      st.academicStatus || "ACTIVE";
                    const meta = ACADEMIC_STATUS_META[currentStatus];
                    const isUpdating = updatingStudentCode === st.studentCode;

                    return (
                      <tr
                        key={st.studentCode}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-3 text-center text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {st.studentCode}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">
                            {st.fullName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {st.email}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800">
                            {st.administrativeClass}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {st.major}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-slate-900">
                            {st.cpa.toFixed(2)}
                          </span>{" "}
                          <span className="text-slate-400">•</span>{" "}
                          <span className="text-slate-600">
                            {st.accumulatedCredits} TC
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={cn(
                              "inline-block px-2.5 py-1 rounded border text-[11px] font-bold",
                              meta.badgeClass
                            )}
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex flex-wrap items-center justify-center gap-1.5">
                            <button
                              type="button"
                              disabled={isUpdating || currentStatus === "ACTIVE"}
                              onClick={() =>
                                handleChangeStudentStatus(st.studentCode, "ACTIVE")
                              }
                              className={cn(
                                "px-2.5 py-1 rounded text-[11px] font-semibold border transition cursor-pointer",
                                currentStatus === "ACTIVE"
                                  ? ACADEMIC_STATUS_META.ACTIVE.activeBtnClass
                                  : "bg-white text-slate-700 border-slate-300 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-800"
                              )}
                            >
                              Đang học
                            </button>

                            <button
                              type="button"
                              disabled={isUpdating || currentStatus === "RESERVED"}
                              onClick={() =>
                                handleChangeStudentStatus(
                                  st.studentCode,
                                  "RESERVED"
                                )
                              }
                              className={cn(
                                "px-2.5 py-1 rounded text-[11px] font-semibold border transition cursor-pointer",
                                currentStatus === "RESERVED"
                                  ? ACADEMIC_STATUS_META.RESERVED.activeBtnClass
                                  : "bg-white text-slate-700 border-slate-300 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-800"
                              )}
                            >
                              Bảo lưu
                            </button>

                            <button
                              type="button"
                              disabled={
                                isUpdating || currentStatus === "DROPPED_OUT"
                              }
                              onClick={() =>
                                handleChangeStudentStatus(
                                  st.studentCode,
                                  "DROPPED_OUT"
                                )
                              }
                              className={cn(
                                "px-2.5 py-1 rounded text-[11px] font-semibold border transition cursor-pointer",
                                currentStatus === "DROPPED_OUT"
                                  ? ACADEMIC_STATUS_META.DROPPED_OUT.activeBtnClass
                                  : "bg-white text-slate-700 border-slate-300 hover:bg-rose-50 hover:border-rose-400 hover:text-rose-800"
                              )}
                            >
                              Thôi học
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
