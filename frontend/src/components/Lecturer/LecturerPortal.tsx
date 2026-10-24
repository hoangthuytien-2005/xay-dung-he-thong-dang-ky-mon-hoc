"use client";

import React, { useState } from "react";
import {
  LecturerData,
  CourseClassData,
  StudentData,
  AttendanceStatusType,
  AttendanceEntryData,
  SAMPLE_STUDENTS_LIST,
} from "@/lib/mock-data";
import { DAY_NAMES, PERIOD_TIMES, cn } from "@/lib/utils";
import {
  Users,
  Printer,
  Search,
  BookOpen,
  Clock,
  ChevronRight,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  Edit3,
  CheckCheck,
} from "lucide-react";

interface LecturerPortalProps {
  lecturer: LecturerData;
  classes: CourseClassData[];
  students: StudentData[];
  onSaveAttendance: (
    classCode: string,
    attendanceRecords: AttendanceEntryData[]
  ) => Promise<{ success: boolean; message?: string }>;
  onUpdateClassSchedule: (
    classCode: string,
    dayOfWeek: number,
    startPeriod: number,
    periodCount: number,
    room: string
  ) => Promise<{ success: boolean; message?: string }>;
  externalSubTab?: "attendance" | "schedule";
  onChangeExternalSubTab?: (tab: "attendance" | "schedule") => void;
}

interface RosterStudentItem {
  studentCode: string;
  fullName: string;
  administrativeClass: string;
  email: string;
}

const ATTENDANCE_STATUS_CONFIG: Record<
  AttendanceStatusType,
  { label: string; shortLabel: string; badgeClass: string; activeBtnClass: string }
> = {
  PRESENT: {
    label: "Có mặt",
    shortLabel: "Có mặt",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
    activeBtnClass: "bg-emerald-700 text-white border-emerald-800",
  },
  LATE: {
    label: "Đi muộn",
    shortLabel: "Đi muộn",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300",
    activeBtnClass: "bg-amber-600 text-white border-amber-700",
  },
  EXCUSED: {
    label: "Vắng có phép",
    shortLabel: "Có phép",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-300",
    activeBtnClass: "bg-blue-700 text-white border-blue-800",
  },
  ABSENT: {
    label: "Vắng không phép",
    shortLabel: "Không phép",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-300",
    activeBtnClass: "bg-rose-700 text-white border-rose-800",
  },
};

export const LecturerPortal: React.FC<LecturerPortalProps> = ({
  lecturer,
  classes,
  students,
  onSaveAttendance,
  onUpdateClassSchedule,
  externalSubTab,
  onChangeExternalSubTab,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<"attendance" | "schedule">("attendance");
  const activeSubTab = externalSubTab ?? internalSubTab;
  const setActiveSubTab = (tab: "attendance" | "schedule") => {
    setInternalSubTab(tab);
    if (onChangeExternalSubTab) onChangeExternalSubTab(tab);
  };

  // Find classes taught by this lecturer
  const myClasses = classes.filter(
    (c) =>
      c.lecturer.toLowerCase().includes(lecturer.fullName.toLowerCase()) ||
      lecturer.teachingClassCodes.includes(c.classCode)
  );

  const [selectedClassCode, setSelectedClassCode] = useState<string>(
    myClasses[0]?.classCode || ""
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sessionDate, setSessionDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const selectedClass =
    myClasses.find((c) => c.classCode === selectedClassCode) || myClasses[0];

  // Build roster for the selected class from MongoDB students + sample roster
  const classRoster: RosterStudentItem[] = (() => {
    const map = new Map<string, RosterStudentItem>();

    students.forEach((st) => {
      if (
        selectedClass?.registeredStudents?.includes(st.studentCode) ||
        st.registeredClasses?.includes(selectedClass?.classCode || "")
      ) {
        map.set(st.studentCode, {
          studentCode: st.studentCode,
          fullName: st.fullName,
          administrativeClass: st.administrativeClass,
          email: st.email,
        });
      }
    });

    SAMPLE_STUDENTS_LIST.forEach((s) => {
      if (!map.has(s.studentCode)) {
        map.set(s.studentCode, {
          studentCode: s.studentCode,
          fullName: s.fullName,
          administrativeClass: s.administrativeClass,
          email: s.email,
        });
      }
    });

    return Array.from(map.values());
  })();

  // Local edits for attendance records keyed by `${classCode}:${studentCode}`
  const [attendanceEdits, setAttendanceEdits] = useState<
    Record<string, { status: AttendanceStatusType; note: string; updatedAt?: string }>
  >({});
  const [isSavingAttendance, setIsSavingAttendance] = useState<boolean>(false);
  const [savingStudentCode, setSavingStudentCode] = useState<string | null>(null);
  const [attendanceBanner, setAttendanceBanner] = useState<string>("");

  const activeClassCode = selectedClass?.classCode || "";

  const getStudentAttendance = (studentCode: string): {
    status: AttendanceStatusType;
    note: string;
    updatedAt?: string;
  } => {
    const editKey = `${activeClassCode}:${studentCode}`;
    if (attendanceEdits[editKey]) {
      return attendanceEdits[editKey];
    }
    const existing = selectedClass?.attendanceRecords?.find(
      (r) => r.studentCode === studentCode
    );
    return {
      status: existing?.status || "PRESENT",
      note: existing?.note || "",
      updatedAt: existing?.updatedAt,
    };
  };

  // Schedule Management State
  const [editingClassCode, setEditingClassCode] = useState<string>(
    myClasses[0]?.classCode || ""
  );
  const [editDayOfWeek, setEditDayOfWeek] = useState<number>(
    myClasses[0]?.dayOfWeek || 2
  );
  const [editStartPeriod, setEditStartPeriod] = useState<number>(
    myClasses[0]?.startPeriod || 1
  );
  const [editPeriodCount, setEditPeriodCount] = useState<number>(
    myClasses[0]?.periodCount || 3
  );
  const [editRoom, setEditRoom] = useState<string>(myClasses[0]?.room || "401-A2");
  const [isSavingSchedule, setIsSavingSchedule] = useState<boolean>(false);
  const [scheduleFeedback, setScheduleFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSelectScheduleClass = (cls: CourseClassData) => {
    setEditingClassCode(cls.classCode);
    setEditDayOfWeek(cls.dayOfWeek);
    setEditStartPeriod(cls.startPeriod);
    setEditPeriodCount(cls.periodCount);
    setEditRoom(cls.room);
    setScheduleFeedback(null);
  };

  // 1. Mark attendance for a single student
  const handleSingleStudentStatusChange = (
    studentCode: string,
    status: AttendanceStatusType
  ) => {
    const current = getStudentAttendance(studentCode);
    const editKey = `${activeClassCode}:${studentCode}`;
    setAttendanceEdits((prev) => ({
      ...prev,
      [editKey]: {
        status,
        note: current.note,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const handleSingleStudentNoteChange = (studentCode: string, note: string) => {
    const current = getStudentAttendance(studentCode);
    const editKey = `${activeClassCode}:${studentCode}`;
    setAttendanceEdits((prev) => ({
      ...prev,
      [editKey]: {
        status: current.status,
        note,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  // Save single student attendance immediately to MongoDB
  const handleSaveSingleStudentAttendance = async (studentCode: string) => {
    if (!selectedClass) return;
    setSavingStudentCode(studentCode);
    try {
      const nowIso = new Date().toISOString();
      const targetRecord = getStudentAttendance(studentCode);
      const records: AttendanceEntryData[] = classRoster.map((st) => {
        const rec =
          st.studentCode === studentCode
            ? { ...targetRecord, updatedAt: nowIso }
            : getStudentAttendance(st.studentCode);
        return {
          studentCode: st.studentCode,
          status: rec.status,
          note: rec.note,
          updatedAt: rec.updatedAt || nowIso,
        };
      });

      const res = await onSaveAttendance(selectedClass.classCode, records);
      if (res.success) {
        const stObj = classRoster.find((s) => s.studentCode === studentCode);
        setAttendanceBanner(
          `Đã lưu điểm danh cá nhân cho sinh viên ${stObj?.fullName || studentCode} (${
            ATTENDANCE_STATUS_CONFIG[targetRecord.status].label
          }).`
        );
      }
    } finally {
      setSavingStudentCode(null);
    }
  };

  // 2. Bulk mark attendance for ALL students in the selected class
  const handleBulkMarkAllClass = async (
    status: AttendanceStatusType,
    autoSave: boolean = true
  ) => {
    if (!selectedClass) return;
    const nowIso = new Date().toISOString();
    const nextEdits: Record<
      string,
      { status: AttendanceStatusType; note: string; updatedAt?: string }
    > = { ...attendanceEdits };

    classRoster.forEach((st) => {
      const current = getStudentAttendance(st.studentCode);
      nextEdits[`${activeClassCode}:${st.studentCode}`] = {
        status,
        note: current.note,
        updatedAt: nowIso,
      };
    });
    setAttendanceEdits(nextEdits);

    if (autoSave) {
      setIsSavingAttendance(true);
      try {
        const records: AttendanceEntryData[] = classRoster.map((st) => ({
          studentCode: st.studentCode,
          status,
          note: getStudentAttendance(st.studentCode).note,
          updatedAt: nowIso,
        }));
        const res = await onSaveAttendance(selectedClass.classCode, records);
        if (res.success) {
          setAttendanceBanner(
            `Đã đánh điểm danh "${ATTENDANCE_STATUS_CONFIG[status].label}" cho toàn bộ ${classRoster.length} sinh viên lớp ${selectedClass.classCode} và lưu vào cơ sở dữ liệu.`
          );
        }
      } finally {
        setIsSavingAttendance(false);
      }
    }
  };

  // Save full class attendance table
  const handleSaveClassAttendanceAll = async () => {
    if (!selectedClass) return;
    setIsSavingAttendance(true);
    try {
      const nowIso = new Date().toISOString();
      const records: AttendanceEntryData[] = classRoster.map((st) => {
        const rec = getStudentAttendance(st.studentCode);
        return {
          studentCode: st.studentCode,
          status: rec.status,
          note: rec.note,
          updatedAt: rec.updatedAt || nowIso,
        };
      });
      const res = await onSaveAttendance(selectedClass.classCode, records);
      if (res.success) {
        setAttendanceBanner(
          res.message ||
            `Đã lưu bảng điểm danh toàn bộ lớp ${selectedClass.classCode} (${records.length} sinh viên) thành công.`
        );
      }
    } finally {
      setIsSavingAttendance(false);
    }
  };

  // Save updated teaching schedule for a class
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClassCode) return;

    // Validate period bounds
    if (editStartPeriod + editPeriodCount - 1 > 12) {
      setScheduleFeedback({
        type: "error",
        text: "Tiết kết thúc không được vượt quá Tiết 12 trong ngày.",
      });
      return;
    }

    // Check if lecturer has another class overlapping on the same day
    const newStart = editStartPeriod;
    const newEnd = editStartPeriod + editPeriodCount - 1;
    const conflicting = myClasses.find((cls) => {
      if (cls.classCode === editingClassCode) return false;
      if (cls.dayOfWeek !== editDayOfWeek) return false;
      const existStart = cls.startPeriod;
      const existEnd = cls.startPeriod + cls.periodCount - 1;
      return newStart <= existEnd && newEnd >= existStart;
    });

    if (conflicting) {
      setScheduleFeedback({
        type: "error",
        text: `Trùng lịch giảng dạy với lớp [${conflicting.classCode}] (${conflicting.courseName}) vào ${DAY_NAMES[conflicting.dayOfWeek]}, Tiết ${conflicting.startPeriod}-${conflicting.startPeriod + conflicting.periodCount - 1}.`,
      });
      return;
    }

    setIsSavingSchedule(true);
    setScheduleFeedback(null);
    try {
      const res = await onUpdateClassSchedule(
        editingClassCode,
        editDayOfWeek,
        editStartPeriod,
        editPeriodCount,
        editRoom
      );
      if (res.success) {
        setScheduleFeedback({
          type: "success",
          text:
            res.message ||
            `Đã cập nhật lịch dạy lớp [${editingClassCode}] sang ${DAY_NAMES[editDayOfWeek]} (Tiết ${editStartPeriod}-${editStartPeriod + editPeriodCount - 1}) tại phòng ${editRoom}.`,
        });
      } else {
        setScheduleFeedback({
          type: "error",
          text: res.message || "Không thể cập nhật lịch giảng dạy.",
        });
      }
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const filteredStudents = classRoster.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.administrativeClass.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Attendance statistics for selected class
  const attendanceStats = (() => {
    const counts: Record<AttendanceStatusType, number> = {
      PRESENT: 0,
      LATE: 0,
      EXCUSED: 0,
      ABSENT: 0,
    };
    classRoster.forEach((st) => {
      const stStatus = getStudentAttendance(st.studentCode).status;
      counts[stStatus] = (counts[stStatus] || 0) + 1;
    });
    return counts;
  })();

  return (
    <div className="space-y-6">
      {/* Lecturer Header Card */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-xs bg-[#FFF5F5] text-[#7F1D2D] border border-[#7F1D2D]/25 font-semibold px-2.5 py-0.5 rounded">
                Giảng viên
              </span>
              <h1 className="text-base sm:text-lg font-bold text-[#1F2937]">
                {lecturer.fullName} ({lecturer.lecturerCode})
              </h1>
            </div>
            <p className="text-xs text-[#4B5563] mt-1">
              {lecturer.title} • {lecturer.department}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B7280] mt-2">
              <span>
                Email: <strong className="text-[#1F2937]">{lecturer.email}</strong>
              </span>
              <span>•</span>
              <span>
                Điện thoại: <strong className="text-[#1F2937]">{lecturer.phone}</strong>
              </span>
              <span>•</span>
              <span>
                Lớp phụ trách:{" "}
                <strong className="text-[#7F1D2D] font-semibold">
                  {myClasses.length} lớp học phần
                </strong>
              </span>
            </div>
          </div>

          <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-3 text-right">
            <span className="text-xs text-[#6B7280]">Học kỳ giảng dạy</span>
            <div className="text-sm font-semibold text-[#1F2937] mt-0.5">
              Học kỳ 1 • Năm học 2024 - 2025
            </div>
          </div>
        </div>

        {/* Sub-navigation bar synced with Left Sidebar */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3.5 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => setActiveSubTab("attendance")}
            className={cn(
              "px-3.5 py-2 text-xs font-semibold rounded-md border transition-colors duration-150 cursor-pointer",
              activeSubTab === "attendance"
                ? "bg-[#7F1D2D] text-white border-[#7F1D2D]"
                : "bg-[#F8F9FB] text-[#4B5563] border-[#E5E7EB] hover:bg-[#FFF5F5] hover:text-[#7F1D2D]"
            )}
          >
            <span>Điểm danh sinh viên (Từng cá nhân & Toàn bộ lớp)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("schedule")}
            className={cn(
              "px-3.5 py-2 text-xs font-semibold rounded-md border transition-colors duration-150 cursor-pointer",
              activeSubTab === "schedule"
                ? "bg-[#7F1D2D] text-white border-[#7F1D2D]"
                : "bg-[#F8F9FB] text-[#4B5563] border-[#E5E7EB] hover:bg-[#FFF5F5] hover:text-[#7F1D2D]"
            )}
          >
            <span>Quản lý lịch dạy từng lớp học phần</span>
          </button>
        </div>
      </div>

      {/* TAB 1: STUDENT ATTENDANCE (SINGLE & BULK CLASS) */}
      {activeSubTab === "attendance" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 4 columns: Lecturer's assigned classes */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-red-800" />
              <span>Chọn lớp học phần để điểm danh</span>
            </h3>

            {myClasses.length === 0 ? (
              <div className="p-4 bg-white border border-slate-200 rounded text-center text-xs text-slate-400">
                Chưa có lớp học phần nào được phân công.
              </div>
            ) : (
              myClasses.map((cls) => {
                const isSelected = cls.classCode === selectedClass?.classCode;
                const recordedCount = cls.attendanceRecords?.length || 0;
                return (
                  <div
                    key={cls.classCode}
                    onClick={() => setSelectedClassCode(cls.classCode)}
                    className={cn(
                      "p-4 rounded-md border cursor-pointer transition-all duration-150 bg-white",
                      isSelected
                        ? "border-red-800 shadow-xs ring-1 ring-red-800"
                        : "border-slate-200 hover:border-slate-400"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-xs bg-red-50 text-red-800 px-2 py-0.5 rounded border border-red-200">
                        {cls.classCode}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        Sĩ số: {cls.currentSlots} / {cls.maxSlots} SV
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 mb-1">
                      {cls.courseName}
                    </h4>

                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {DAY_NAMES[cls.dayOfWeek]} (Tiết {cls.startPeriod} -{" "}
                          {cls.startPeriod + cls.periodCount - 1})
                        </span>
                      </div>
                      <div>
                        Phòng học: <strong className="text-slate-800">{cls.room}</strong>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        Đã lưu điểm danh:{" "}
                        <strong className="text-slate-800">{recordedCount} SV</strong>
                      </span>
                      <span className="text-red-800 font-semibold flex items-center">
                        Điểm danh lớp <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right 8 columns: Attendance Workspace */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs space-y-4">
              {/* Top Class Info & Session Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-red-800" />
                    <span>
                      Bảng Điểm Danh Lớp: {selectedClass?.classCode} -{" "}
                      {selectedClass?.courseName}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Phòng: <strong>{selectedClass?.room}</strong> •{" "}
                    {DAY_NAMES[selectedClass?.dayOfWeek || 2]} (Tiết{" "}
                    {selectedClass?.startPeriod} -{" "}
                    {(selectedClass?.startPeriod || 1) +
                      (selectedClass?.periodCount || 3) -
                      1}
                    )
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs">
                    <span className="text-slate-500 font-medium">Ngày dạy:</span>
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="bg-transparent font-mono font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center space-x-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded border border-slate-300 font-medium transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In phiếu</span>
                  </button>
                </div>
              </div>

              {/* CHỨC NĂNG 2: ĐÁNH ĐIỂM DANH CHO TOÀN BỘ SINH VIÊN CỦA LỚP */}
              <div className="bg-red-50/60 border border-red-200 rounded-md p-3.5 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-red-900 flex items-center space-x-1.5">
                      <CheckCheck className="w-4 h-4 text-red-800" />
                      <span>
                        Chức năng 1: Điểm danh nhanh cho toàn bộ sinh viên lớp{" "}
                        {selectedClass?.classCode}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Áp dụng trạng thái điểm danh đồng loạt cho tất cả{" "}
                      <strong>{classRoster.length} sinh viên</strong> trong lớp học phần
                      này.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveClassAttendanceAll}
                    disabled={isSavingAttendance}
                    className="inline-flex items-center space-x-1.5 bg-red-800 hover:bg-red-900 text-white text-xs font-bold px-3.5 py-2 rounded shadow-2xs transition cursor-pointer shrink-0"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>
                      {isSavingAttendance
                        ? "Đang lưu CSDL..."
                        : "Lưu điểm danh toàn lớp"}
                    </span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isSavingAttendance}
                    onClick={() => handleBulkMarkAllClass("PRESENT", true)}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded border border-emerald-900 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đánh dấu Có mặt toàn bộ lớp ({classRoster.length} SV)</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSavingAttendance}
                    onClick={() => handleBulkMarkAllClass("LATE", true)}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white hover:bg-amber-50 text-amber-800 px-3 py-1.5 rounded border border-amber-400 transition cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Đánh dấu Đi muộn toàn lớp</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSavingAttendance}
                    onClick={() => handleBulkMarkAllClass("EXCUSED", true)}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white hover:bg-blue-50 text-blue-800 px-3 py-1.5 rounded border border-blue-400 transition cursor-pointer"
                  >
                    <span>Đánh dấu Vắng có phép toàn lớp</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSavingAttendance}
                    onClick={() => handleBulkMarkAllClass("ABSENT", true)}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white hover:bg-rose-50 text-rose-800 px-3 py-1.5 rounded border border-rose-400 transition cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Đánh dấu Vắng không phép toàn lớp</span>
                  </button>
                </div>
              </div>

              {/* Feedback notification */}
              {attendanceBanner && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded text-xs font-medium flex items-center justify-between">
                  <span>{attendanceBanner}</span>
                  <button
                    type="button"
                    onClick={() => setAttendanceBanner("")}
                    className="text-emerald-700 hover:text-emerald-950 font-bold ml-2"
                  >
                    Đóng
                  </button>
                </div>
              )}

              {/* Summary Counters & Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded border bg-emerald-50 text-emerald-800 border-emerald-300 font-bold">
                    Có mặt: {attendanceStats.PRESENT}
                  </span>
                  <span className="px-2.5 py-1 rounded border bg-amber-50 text-amber-800 border-amber-300 font-bold">
                    Đi muộn: {attendanceStats.LATE}
                  </span>
                  <span className="px-2.5 py-1 rounded border bg-blue-50 text-blue-800 border-blue-300 font-bold">
                    Có phép: {attendanceStats.EXCUSED}
                  </span>
                  <span className="px-2.5 py-1 rounded border bg-rose-50 text-rose-800 border-rose-300 font-bold">
                    Không phép: {attendanceStats.ABSENT}
                  </span>
                </div>

                <div className="relative w-full md:w-72">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm mã SV, họ tên, lớp hành chính..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-800"
                  />
                </div>
              </div>

              {/* CHỨC NĂNG 1: BẢNG ĐIỂM DANH CHO TỪNG SINH VIÊN */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Chức năng 2: Điểm danh chi tiết cho từng sinh viên
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Bấm chọn trạng thái trên từng dòng sinh viên và nhấn Lưu
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-md">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                        <th className="py-2.5 px-2.5 font-semibold w-10 text-center">
                          STT
                        </th>
                        <th className="py-2.5 px-2.5 font-semibold w-24">Mã SV</th>
                        <th className="py-2.5 px-2.5 font-semibold">
                          Họ và tên sinh viên
                        </th>
                        <th className="py-2.5 px-2.5 font-semibold text-center">
                          Đánh điểm danh từng sinh viên
                        </th>
                        <th className="py-2.5 px-2.5 font-semibold w-44">Ghi chú</th>
                        <th className="py-2.5 px-2.5 font-semibold w-20 text-center">
                          Lưu lẻ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-slate-400">
                            Không tìm thấy sinh viên nào phù hợp.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((s, idx) => {
                          const currentRecord = getStudentAttendance(s.studentCode);
                          const isSavingThis = savingStudentCode === s.studentCode;

                          return (
                            <tr
                              key={s.studentCode}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <td className="py-2.5 px-2.5 text-center text-slate-400 font-mono">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-2.5 font-mono font-bold text-slate-900">
                                {s.studentCode}
                              </td>
                              <td className="py-2.5 px-2.5">
                                <div className="font-bold text-slate-900">
                                  {s.fullName}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  Lớp: {s.administrativeClass}
                                </div>
                              </td>
                              <td className="py-2.5 px-2.5">
                                <div className="flex flex-wrap items-center justify-center gap-1">
                                  {(
                                    [
                                      "PRESENT",
                                      "LATE",
                                      "EXCUSED",
                                      "ABSENT",
                                    ] as AttendanceStatusType[]
                                  ).map((stKey) => {
                                    const cfg = ATTENDANCE_STATUS_CONFIG[stKey];
                                    const isSelected = currentRecord.status === stKey;
                                    return (
                                      <button
                                        key={stKey}
                                        type="button"
                                        onClick={() =>
                                          handleSingleStudentStatusChange(
                                            s.studentCode,
                                            stKey
                                          )
                                        }
                                        className={cn(
                                          "px-2 py-1 rounded text-[11px] font-semibold border transition cursor-pointer",
                                          isSelected
                                            ? cfg.activeBtnClass
                                            : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                                        )}
                                      >
                                        {cfg.shortLabel}
                                      </button>
                                    );
                                  })}
                                </div>
                              </td>
                              <td className="py-2.5 px-2.5">
                                <input
                                  type="text"
                                  value={currentRecord.note}
                                  onChange={(e) =>
                                    handleSingleStudentNoteChange(
                                      s.studentCode,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Ghi chú (nếu có)..."
                                  className="w-full px-2 py-1 text-[11px] bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:border-red-800"
                                />
                              </td>
                              <td className="py-2.5 px-2.5 text-center">
                                <button
                                  type="button"
                                  disabled={isSavingThis}
                                  onClick={() =>
                                    handleSaveSingleStudentAttendance(s.studentCode)
                                  }
                                  className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white font-semibold rounded text-[11px] transition cursor-pointer"
                                >
                                  {isSavingThis ? "..." : "Lưu"}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: TEACHING SCHEDULE MANAGEMENT FOR EACH CLASS */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 cols: Edit Teaching Schedule Form for Each Class */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-md p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
                <Edit3 className="w-4 h-4 text-red-800" />
                <h3 className="text-sm font-bold text-slate-900">
                  Điều Chỉnh Lịch Dạy Từng Lớp Học Phần
                </h3>
              </div>

              <form onSubmit={handleSaveSchedule} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Chọn lớp học phần phụ trách
                  </label>
                  <select
                    value={editingClassCode}
                    onChange={(e) => {
                      const found = myClasses.find(
                        (c) => c.classCode === e.target.value
                      );
                      if (found) handleSelectScheduleClass(found);
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-red-800"
                  >
                    {myClasses.map((cls) => (
                      <option key={cls.classCode} value={cls.classCode}>
                        [{cls.classCode}] {cls.courseName} ({cls.credits} TC)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Thứ giảng dạy trong tuần
                    </label>
                    <select
                      value={editDayOfWeek}
                      onChange={(e) => setEditDayOfWeek(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:border-red-800"
                    >
                      {[2, 3, 4, 5, 6, 7].map((day) => (
                        <option key={day} value={day}>
                          {DAY_NAMES[day]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Phòng học / Giảng đường
                    </label>
                    <input
                      type="text"
                      value={editRoom}
                      onChange={(e) => setEditRoom(e.target.value)}
                      required
                      placeholder="VD: 401-A2"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-red-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tiết bắt đầu (1 - 12)
                    </label>
                    <select
                      value={editStartPeriod}
                      onChange={(e) => setEditStartPeriod(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:border-red-800"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((p) => (
                        <option key={p} value={p}>
                          Tiết {p} ({PERIOD_TIMES[p]?.start})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Số tiết giảng dạy
                    </label>
                    <select
                      value={editPeriodCount}
                      onChange={(e) => setEditPeriodCount(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:border-red-800"
                    >
                      {[2, 3, 4, 5].map((cnt) => (
                        <option key={cnt} value={cnt}>
                          {cnt} tiết liên tiếp
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {scheduleFeedback && (
                  <div
                    className={cn(
                      "p-2.5 rounded border text-xs font-medium",
                      scheduleFeedback.type === "success"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : "bg-rose-50 border-rose-300 text-rose-900"
                    )}
                  >
                    {scheduleFeedback.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSavingSchedule}
                  className="w-full py-2.5 px-4 bg-red-800 hover:bg-red-900 text-white font-bold rounded shadow-2xs transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isSavingSchedule
                      ? "Đang cập nhật lịch dạy..."
                      : "Lưu cập nhật lịch giảng dạy"}
                  </span>
                </button>
              </form>

              {/* List of Lecturer's Classes with Quick Edit Trigger */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Danh sách lịch dạy các lớp hiện tại
                </h4>
                {myClasses.map((cls) => (
                  <div
                    key={cls.classCode}
                    onClick={() => handleSelectScheduleClass(cls)}
                    className={cn(
                      "p-3 rounded border text-xs flex items-center justify-between cursor-pointer transition",
                      editingClassCode === cls.classCode
                        ? "bg-red-50/70 border-red-800"
                        : "bg-slate-50 border-slate-200 hover:border-slate-400"
                    )}
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        [{cls.classCode}] {cls.courseName}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {DAY_NAMES[cls.dayOfWeek]} • Tiết {cls.startPeriod} -{" "}
                        {cls.startPeriod + cls.periodCount - 1} • Phòng:{" "}
                        <strong className="text-red-800">{cls.room}</strong>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-red-800 underline">
                      Đổi lịch
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 7 cols: Weekly Teaching Schedule Grid */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-md p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-red-800" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Thời Khóa Biểu Lịch Dạy Tuần Của Giảng Viên
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  Tổng số: <strong>{myClasses.length} lớp học phần</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-red-800 text-white">
                      <th className="border border-red-900 py-2 px-2 w-20 text-center font-bold">
                        Tiết / Thứ
                      </th>
                      {[2, 3, 4, 5, 6, 7].map((day) => (
                        <th
                          key={day}
                          className="border border-red-900 py-2 px-2 text-center font-bold w-32"
                        >
                          {DAY_NAMES[day]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 12 }, (_, idx) => idx + 1).map((periodNum) => (
                      <tr key={periodNum} className="hover:bg-slate-50/60">
                        <td className="border border-slate-300 bg-slate-100 py-1.5 px-2 text-center font-semibold text-slate-700">
                          <div>Tiết {periodNum}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {PERIOD_TIMES[periodNum]?.start}
                          </div>
                        </td>
                        {[2, 3, 4, 5, 6, 7].map((day) => {
                          const classStartingHere = myClasses.find(
                            (c) => c.dayOfWeek === day && c.startPeriod === periodNum
                          );
                          const classCoveringHere = myClasses.find(
                            (c) =>
                              c.dayOfWeek === day &&
                              periodNum > c.startPeriod &&
                              periodNum < c.startPeriod + c.periodCount
                          );

                          if (classCoveringHere) return null;

                          if (classStartingHere) {
                            return (
                              <td
                                key={day}
                                rowSpan={classStartingHere.periodCount}
                                onClick={() =>
                                  handleSelectScheduleClass(classStartingHere)
                                }
                                className="border border-red-800 bg-red-50 p-2 align-top cursor-pointer hover:bg-red-100/80 transition"
                              >
                                <div className="font-mono font-bold text-red-900 text-xs">
                                  {classStartingHere.classCode}
                                </div>
                                <div className="font-bold text-slate-900 leading-snug mt-0.5">
                                  {classStartingHere.courseName}
                                </div>
                                <div className="mt-1 inline-block bg-white border border-red-300 text-red-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                                  Phòng: {classStartingHere.room}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1">
                                  Sĩ số: {classStartingHere.currentSlots}/
                                  {classStartingHere.maxSlots} SV
                                </div>
                              </td>
                            );
                          }

                          return (
                            <td
                              key={day}
                              className="border border-slate-200 py-1.5 px-2"
                            />
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
