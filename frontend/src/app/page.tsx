"use client";

import React, { useState, useEffect } from "react";
import { Navbar, UserRole } from "@/components/Navbar";
import { LoginPage } from "@/components/Auth/LoginPage";
import { LecturerPortal } from "@/components/Lecturer/LecturerPortal";
import { AdminPanel } from "@/components/Admin/AdminPanel";
import { NavigationTabs, ActiveTabType } from "@/components/NavigationTabs";
import { PeriodBanner } from "@/components/Registration/PeriodBanner";
import { CourseFilter, CourseCategoryType } from "@/components/Registration/CourseFilter";
import { CourseCard } from "@/components/Registration/CourseCard";
import { RegisteredTable } from "@/components/Registration/RegisteredTable";
import { MiniSchedulePreview } from "@/components/Registration/MiniSchedulePreview";
import { FullTimetableGrid } from "@/components/Timetable/FullTimetableGrid";
import { CurriculumView } from "@/components/Curriculum/CurriculumView";
import { TranscriptView } from "@/components/Transcript/TranscriptView";
import { ConflictModal, ModalErrorData } from "@/components/ConflictModal";
import { UserProfileModal } from "@/components/Modals/UserProfileModal";
import { ChangePasswordModal } from "@/components/Modals/ChangePasswordModal";
import {
  StudentData,
  LecturerData,
  AdminData,
  CourseData,
  CourseClassData,
  RegistrationPeriodData,
  AttendanceEntryData,
  AcademicStatusType,
} from "@/lib/mock-data";
import { api } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  // Authentication session state
  const [currentUser, setCurrentUser] = useState<{
    role: UserRole;
    student?: StudentData;
    lecturer?: LecturerData;
    admin?: AdminData;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTabType>("registration");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const [student, setStudent] = useState<StudentData | null>(null);
  const [allStudents, setAllStudents] = useState<StudentData[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [classes, setClasses] = useState<CourseClassData[]>([]);
  const [period, setPeriod] = useState<RegistrationPeriodData | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegistering, setIsRegistering] = useState<string | null>(null);
  const [isDropping, setIsDropping] = useState<string | null>(null);

  // Modal dialog states
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);

  // Registration Filter & Hover State
  const [category, setCategory] = useState<CourseCategoryType>("proposal");
  const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hoveredClass, setHoveredClass] = useState<CourseClassData | null>(null);
  const [errorModal, setErrorModal] = useState<ModalErrorData | null>(null);

  // Fetch data (with optional showSpinner so background refreshes don't flash)
  const loadData = async (showSpinner: boolean = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      const [resStudent, resAllStudents, resCourses, resClasses, resPeriod] = await Promise.all([
        api.getStudent(student?.studentCode || "B21DCCN001"),
        api.getAllStudents(),
        api.getCourses(),
        api.getClasses(),
        api.getPeriod(),
      ]);

      if (resStudent.success && resStudent.data) {
        setStudent(resStudent.data);
        setCurrentUser((prev) =>
          prev && prev.role === "student" ? { ...prev, student: resStudent.data } : prev
        );
      }
      if (resAllStudents.success && resAllStudents.data) {
        setAllStudents(resAllStudents.data);
      }
      if (resCourses.success && resCourses.data) setCourses(resCourses.data);
      if (resClasses.success && resClasses.data) setClasses(resClasses.data);
      if (resPeriod.success && resPeriod.data) setPeriod(resPeriod.data);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.getStudent("B21DCCN001"),
      api.getAllStudents(),
      api.getCourses(),
      api.getClasses(),
      api.getPeriod(),
    ])
      .then(([resStudent, resAllStudents, resCourses, resClasses, resPeriod]) => {
        if (!isMounted) return;
        if (resStudent.success && resStudent.data) setStudent(resStudent.data);
        if (resAllStudents.success && resAllStudents.data) setAllStudents(resAllStudents.data);
        if (resCourses.success && resCourses.data) setCourses(resCourses.data);
        if (resClasses.success && resClasses.data) setClasses(resClasses.data);
        if (resPeriod.success && resPeriod.data) setPeriod(resPeriod.data);
      })
      .catch((err) => console.error("Error loading data:", err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered registered classes for current student
  const registeredClasses = classes.filter((c) =>
    student?.registeredClasses?.some(
      (regCode) => regCode.toLowerCase() === c.classCode.toLowerCase()
    )
  );

  const currentTotalCredits = registeredClasses.reduce((sum, c) => sum + c.credits, 0);

  // Retake & improve counts
  const retakeCodes =
    student?.completedCourses
      .filter((c) => !c.isPassed)
      .map((c) => c.courseCode) || [];

  const improveCodes =
    student?.completedCourses
      .filter((c) => c.isPassed && (c.grade === "D" || c.grade === "D+"))
      .map((c) => c.courseCode) || [];

  // Filter courses by category, semester, and search
  const filteredCourses = courses.filter((course) => {
    // 1. Search filter
    if (searchTerm.trim()) {
      const matchName = course.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCode = course.code.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchName && !matchCode) return false;
    }

    // 2. Category filter
    if (category === "proposal") {
      return course.semesterProposal === 5; // Kỳ hiện tại K21 là Kỳ 5
    } else if (category === "retake") {
      return retakeCodes.includes(course.code);
    } else if (category === "improve") {
      return improveCodes.includes(course.code);
    } else if (category === "all" && selectedSemester !== "all") {
      return course.semesterProposal === selectedSemester;
    }
    return true; // "all" across all 9 semesters
  });

  // Action: Register Class
  const handleRegisterClass = async (classCode: string) => {
    setIsRegistering(classCode);
    const activeStudentCode = student?.studentCode || "B21DCCN001";
    try {
      const data = await api.registerClass(activeStudentCode, classCode);

      if (!data.success) {
        setErrorModal({
          title: "Không thể đăng ký lớp học này",
          message: data.message || "Đã xảy ra lỗi trong quá trình kiểm tra ràng buộc.",
          errorType: (data.errorType as ModalErrorData["errorType"]) || "GENERAL",
        });
      } else {
        // Immediately update local student & class state
        const returnedStudent = data.data || data.updatedStudent;
        if (returnedStudent) {
          setStudent(returnedStudent);
          setCurrentUser((prev) =>
            prev && prev.role === "student" ? { ...prev, student: returnedStudent } : prev
          );
        } else {
          setStudent((prev) =>
            prev
              ? {
                  ...prev,
                  registeredClasses: prev.registeredClasses.includes(classCode)
                    ? prev.registeredClasses
                    : [...prev.registeredClasses, classCode],
                }
              : prev
          );
        }

        setClasses((prev) =>
          prev.map((cls) =>
            cls.classCode === classCode
              ? {
                  ...cls,
                  currentSlots: cls.currentSlots + 1,
                  registeredStudents: cls.registeredStudents.includes(activeStudentCode)
                    ? cls.registeredStudents
                    : [...cls.registeredStudents, activeStudentCode],
                }
              : cls
          )
        );

        // Background sync
        await loadData(false);
      }
    } catch {
      setErrorModal({
        title: "Lỗi kết nối",
        message: "Không thể gửi yêu cầu đăng ký tới máy chủ. Vui lòng kiểm tra lại đường truyền.",
        errorType: "GENERAL",
      });
    } finally {
      setIsRegistering(null);
    }
  };

  // Action: Drop Class
  const handleDropClass = async (classCode: string) => {
    setIsDropping(classCode);
    const activeStudentCode = student?.studentCode || "B21DCCN001";
    try {
      const data = await api.dropClass(activeStudentCode, classCode);
      if (!data.success) {
        alert(data.message || "Không thể hủy lớp học phần.");
      } else {
        // Immediately remove classCode from student state so table updates right away
        const returnedStudent = data.data || data.updatedStudent;
        if (returnedStudent) {
          setStudent({
            ...returnedStudent,
            registeredClasses: (returnedStudent.registeredClasses || []).filter(
              (c) => c.toLowerCase() !== classCode.toLowerCase()
            ),
          });
          setCurrentUser((prev) =>
            prev && prev.role === "student"
              ? {
                  ...prev,
                  student: {
                    ...returnedStudent,
                    registeredClasses: (returnedStudent.registeredClasses || []).filter(
                      (c) => c.toLowerCase() !== classCode.toLowerCase()
                    ),
                  },
                }
              : prev
          );
        } else {
          setStudent((prev) =>
            prev
              ? {
                  ...prev,
                  registeredClasses: prev.registeredClasses.filter(
                    (c) => c.toLowerCase() !== classCode.toLowerCase()
                  ),
                }
              : prev
          );
        }

        // Immediately decrement slot count in classes state
        setClasses((prev) =>
          prev.map((cls) =>
            cls.classCode.toLowerCase() === classCode.toLowerCase()
              ? {
                  ...cls,
                  currentSlots: Math.max(0, cls.currentSlots - 1),
                  registeredStudents: cls.registeredStudents.filter(
                    (s) => s.toLowerCase() !== activeStudentCode.toLowerCase()
                  ),
                }
              : cls
          )
        );

        // Sync with backend in background
        await loadData(false);
      }
    } catch {
      alert("Lỗi khi kết nối với máy chủ.");
    } finally {
      setIsDropping(null);
    }
  };

  // Action: Update Period Config (Admin)
  const handleUpdatePeriod = async (
    minCredits: number,
    maxCredits: number,
    isActive: boolean
  ) => {
    try {
      await api.updatePeriodConfig(minCredits, maxCredits, isActive);
      await loadData(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Action: Save Class Attendance (Lecturer)
  const handleSaveAttendance = async (
    classCode: string,
    attendanceRecords: AttendanceEntryData[]
  ) => {
    try {
      const res = await api.saveClassAttendance(classCode, attendanceRecords);
      if (res.success) {
        setClasses((prev) =>
          prev.map((c) =>
            c.classCode === classCode
              ? { ...c, attendanceRecords }
              : c
          )
        );
        await loadData(false);
      }
      return { success: res.success, message: res.message };
    } catch {
      return { success: false, message: "Lỗi khi lưu điểm danh." };
    }
  };

  // Action: Update Class Teaching Schedule (Lecturer)
  const handleUpdateClassSchedule = async (
    classCode: string,
    dayOfWeek: number,
    startPeriod: number,
    periodCount: number,
    room: string
  ) => {
    try {
      const res = await api.updateClassSchedule(
        classCode,
        dayOfWeek,
        startPeriod,
        periodCount,
        room
      );
      if (res.success) {
        setClasses((prev) =>
          prev.map((c) =>
            c.classCode === classCode
              ? { ...c, dayOfWeek, startPeriod, periodCount, room }
              : c
          )
        );
        await loadData(false);
      }
      return { success: res.success, message: res.message };
    } catch {
      return { success: false, message: "Lỗi khi cập nhật lịch giảng dạy." };
    }
  };

  // Action: Update Student Academic Status (Admin)
  const handleUpdateStudentStatus = async (
    studentCode: string,
    academicStatus: AcademicStatusType
  ) => {
    try {
      const res = await api.updateStudentStatus(studentCode, academicStatus);
      if (res.success) {
        setAllStudents((prev) =>
          prev.map((s) =>
            s.studentCode === studentCode ? { ...s, academicStatus } : s
          )
        );
        if (student?.studentCode === studentCode) {
          setStudent((prev) => (prev ? { ...prev, academicStatus } : prev));
        }
        await loadData(false);
      }
      return { success: res.success, message: res.message };
    } catch {
      return { success: false, message: "Lỗi khi cập nhật trạng thái học vụ sinh viên." };
    }
  };

  // If user is not logged in, show LoginPage
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === "student") {
            setActiveTab("registration");
            if (user.student) {
              setStudent(user.student);
            }
            loadData(false);
          } else if (user.role === "lecturer") {
            setActiveTab("lecturer_attendance");
            loadData(false);
          } else {
            setActiveTab("admin_period");
            loadData(false);
          }
        }}
      />
    );
  }

  const isLecturer = currentUser.role === "lecturer";
  const isAdmin = currentUser.role === "admin";

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] flex flex-col">
      {/* 1. Burgundy Navbar with User Profile Dropdown */}
      <Navbar
        currentUser={{
          ...currentUser,
          student: student || currentUser.student,
        }}
        period={period}
        onLogout={() => setCurrentUser(null)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
      />

      {/* 2. Body Layout: Left Function Column + Right Main Workspace */}
      <div className="flex flex-1 min-h-0 w-full max-w-[1600px] mx-auto bg-[#FFFFFF]">
        <NavigationTabs
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          registeredCount={registeredClasses.length}
          totalCredits={currentTotalCredits}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          role={currentUser.role}
        />

        {/* 3. Main Content Container */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 bg-[#FFFFFF]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#6B7280] space-y-2.5">
              <div className="w-7 h-7 border-2 border-[#7F1D2D] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-medium">Đang tải dữ liệu học vụ...</p>
            </div>
          ) : isLecturer && currentUser.lecturer ? (
            /* LECTURER PORTAL VIEW */
            <motion.div
              key="lecturer-portal"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <LecturerPortal
                lecturer={currentUser.lecturer}
                classes={classes}
                students={allStudents}
                onSaveAttendance={handleSaveAttendance}
                onUpdateClassSchedule={handleUpdateClassSchedule}
                externalSubTab={
                  activeTab === "lecturer_schedule" ? "schedule" : "attendance"
                }
                onChangeExternalSubTab={(sub) =>
                  setActiveTab(
                    sub === "schedule"
                      ? "lecturer_schedule"
                      : "lecturer_attendance"
                  )
                }
              />
            </motion.div>
          ) : isAdmin ? (
            /* TRAINING ADMINISTRATION PORTAL VIEW */
            <motion.div
              key="admin-portal"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <AdminPanel
                admin={currentUser.admin}
                period={period}
                classes={classes}
                students={allStudents}
                onUpdatePeriod={handleUpdatePeriod}
                onUpdateStudentStatus={handleUpdateStudentStatus}
                externalSubTab={
                  activeTab === "admin_students" ? "students" : "period"
                }
                onChangeExternalSubTab={(sub) =>
                  setActiveTab(
                    sub === "students" ? "admin_students" : "admin_period"
                  )
                }
              />
            </motion.div>
          ) : (
            /* STUDENT PORTAL VIEWS */
            <AnimatePresence mode="wait">
              {/* TAB 1: ĐĂNG KÝ TÍN CHỈ */}
              {activeTab === "registration" && (
                <motion.div
                  key="tab-registration"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  {/* Period banner & credit progress */}
                  <PeriodBanner
                    period={period}
                    currentCredits={currentTotalCredits}
                    registeredCount={registeredClasses.length}
                  />

                  {/* 2-Column Responsive Layout */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left Column (Courses to register) */}
                    <div className="xl:col-span-7 space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-[#1F2937]">
                          Danh sách học phần mở đăng ký
                        </h2>
                        <span className="text-xs text-[#6B7280]">
                          Hiển thị:{" "}
                          <strong className="text-[#1F2937]">
                            {filteredCourses.length}
                          </strong>{" "}
                          / {courses.length} học phần
                        </span>
                      </div>

                      {/* Filter categories, semester selector & Search bar */}
                      <CourseFilter
                        activeCategory={category}
                        onChangeCategory={setCategory}
                        selectedSemester={selectedSemester}
                        onChangeSemester={setSelectedSemester}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        retakeCount={retakeCodes.length}
                        improveCount={improveCodes.length}
                        totalCoursesCount={courses.length}
                      />

                      {/* Courses list */}
                      {filteredCourses.length === 0 ? (
                        <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-8 text-center text-[#6B7280]">
                          <p className="text-xs font-medium text-[#4B5563]">
                            Không tìm thấy học phần nào phù hợp với bộ lọc hiện tại.
                          </p>
                        </div>
                      ) : (
                        filteredCourses.map((c) => {
                          const courseClasses = classes.filter(
                            (cls) => cls.courseCode === c.code
                          );

                          return (
                            <CourseCard
                              key={c.code}
                              course={c}
                              classes={courseClasses}
                              student={student}
                              registeredClasses={registeredClasses}
                              onHoverClass={setHoveredClass}
                              onLeaveClass={() => setHoveredClass(null)}
                              onRegisterClass={handleRegisterClass}
                              isRegistering={isRegistering}
                            />
                          );
                        })
                      )}
                    </div>

                    {/* Right Column (Mini Schedule Preview & Registered Cart) */}
                    <div className="xl:col-span-5 space-y-5">
                      <div className="sticky top-20 space-y-5">
                        {/* Mini Live Preview */}
                        <MiniSchedulePreview
                          registeredClasses={registeredClasses}
                          hoveredClass={hoveredClass}
                        />

                        {/* Registered Courses Table in Cart */}
                        <RegisteredTable
                          registeredClasses={registeredClasses}
                          onDropClass={handleDropClass}
                          isDropping={isDropping}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 1B: HỦY MÔN HỌC ĐÃ ĐĂNG KÝ */}
              {activeTab === "drop_courses" && (
                <motion.div
                  key="tab-drop-courses"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <PeriodBanner
                    period={period}
                    currentCredits={currentTotalCredits}
                    registeredCount={registeredClasses.length}
                  />

                  <RegisteredTable
                    registeredClasses={registeredClasses}
                    onDropClass={handleDropClass}
                    isDropping={isDropping}
                  />

                  <MiniSchedulePreview
                    registeredClasses={registeredClasses}
                    hoveredClass={null}
                  />
                </motion.div>
              )}

              {/* TAB 2: THỜI KHÓA BIỂU TOÀN DIỆN */}
              {activeTab === "timetable" && (
                <motion.div
                  key="tab-timetable"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <FullTimetableGrid registeredClasses={registeredClasses} />
                </motion.div>
              )}

              {/* TAB 3: CHƯƠNG TRÌNH ĐÀO TẠO */}
              {activeTab === "curriculum" && (
                <motion.div
                  key="tab-curriculum"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <CurriculumView
                    courses={courses}
                    student={student}
                    registeredClasses={registeredClasses}
                  />
                </motion.div>
              )}

              {/* TAB 4: BẢNG ĐIỂM & HỌC TẬP */}
              {activeTab === "transcript" && (
                <motion.div
                  key="tab-transcript"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <TranscriptView student={student} />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* 4. Conflict / Validation Error Modal */}
      <ConflictModal
        errorData={errorModal}
        onClose={() => setErrorModal(null)}
      />

      {/* 5. User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={{
          ...currentUser,
          student: student || currentUser.student,
        }}
      />

      {/* 6. Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* 7. Academic Footer */}
      <footer className="bg-[#F8F9FB] border-t border-[#E5E7EB] py-4 text-center text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto px-4">
          UniCredit Portal © 2024 - 2026 • Hệ thống Đăng ký Tín chỉ & Quản lý Học vụ Đại học
        </div>
      </footer>
    </div>
  );
}
