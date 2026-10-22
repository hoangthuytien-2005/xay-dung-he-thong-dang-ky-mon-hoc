"use client";

import React, { useState, useEffect } from "react";
import { Navbar, UserRole } from "@/components/Navbar";
import { LoginPage } from "@/components/Auth/LoginPage";
import { LecturerPortal } from "@/components/Lecturer/LecturerPortal";
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
  CourseData,
  CourseClassData,
  RegistrationPeriodData,
  INITIAL_STUDENT,
} from "@/lib/mock-data";
import { api } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function HomePage() {
  // Authentication session state
  const [currentUser, setCurrentUser] = useState<{
    role: UserRole;
    student?: StudentData;
    lecturer?: LecturerData;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTabType>("registration");
  const [student, setStudent] = useState<StudentData | null>(null);
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hoveredClass, setHoveredClass] = useState<CourseClassData | null>(null);
  const [errorModal, setErrorModal] = useState<ModalErrorData | null>(null);

  // Fetch initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resStudent, resCourses, resClasses, resPeriod] = await Promise.all([
        api.getStudent(),
        api.getCourses(),
        api.getClasses(),
        api.getPeriod(),
      ]);

      if (resStudent.success && resStudent.data) setStudent(resStudent.data);
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
    loadData();
  }, []);

  // Filtered registered classes for current student
  const registeredClasses = classes.filter((c) =>
    student?.registeredClasses.includes(c.classCode)
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

  // Filter courses by category and search
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
    }
    return true; // "all"
  });

  // Action: Register Class
  const handleRegisterClass = async (classCode: string) => {
    setIsRegistering(classCode);
    try {
      const data = await api.registerClass(student?.studentCode || "B21DCCN001", classCode);

      if (!data.success) {
        setErrorModal({
          title: "Không thể đăng ký lớp học này",
          message: data.message || "Đã xảy ra lỗi trong quá trình kiểm tra ràng buộc.",
          errorType: (data.errorType as ModalErrorData["errorType"]) || "GENERAL",
        });
      } else {
        // Trigger celebration confetti
        try {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { y: 0.8 },
            colors: ["#b91c1c", "#059669", "#0f172a"],
          });
        } catch {
          // Ignore
        }

        // Refresh data
        await loadData();
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
    try {
      const data = await api.dropClass(student?.studentCode || "B21DCCN001", classCode);
      if (!data.success) {
        alert(data.message || "Không thể hủy lớp học phần.");
      } else {
        await loadData();
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
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // If user is not logged in, show LoginPage
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === "student" && user.student) {
            setStudent(user.student);
          }
        }}
      />
    );
  }

  const isLecturer = currentUser.role === "lecturer";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* 1. Academic Red Navbar with Profile Dropdown */}
      <Navbar
        currentUser={currentUser}
        period={period}
        onLogout={() => setCurrentUser(null)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
      />

      {/* 2. Navigation Tabs (Visible for Students) */}
      {!isLecturer && (
        <NavigationTabs
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          registeredCount={registeredClasses.length}
          totalCredits={currentTotalCredits}
        />
      )}

      {/* 3. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-2">
            <div className="w-8 h-8 border-3 border-red-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-medium">Đang tải dữ liệu học vụ...</p>
          </div>
        ) : isLecturer && currentUser.lecturer ? (
          /* LECTURER PORTAL VIEW */
          <motion.div
            key="lecturer-portal"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <LecturerPortal
              lecturer={currentUser.lecturer}
              classes={classes}
              period={period}
              onUpdatePeriod={handleUpdatePeriod}
            />
          </motion.div>
        ) : (
          /* STUDENT PORTAL VIEWS */
          <AnimatePresence mode="wait">
            {/* TAB 1: ĐĂNG KÝ TÍN CHỈ */}
            {activeTab === "registration" && (
              <motion.div
                key="tab-registration"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {/* Period banner & credit progress */}
                <PeriodBanner
                  period={period}
                  currentCredits={currentTotalCredits}
                />

                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column (Courses to register) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                        Danh sách học phần mở đăng ký
                      </h2>
                      <span className="text-xs text-slate-500">
                        Hiển thị: <strong>{filteredCourses.length}</strong> môn học
                      </span>
                    </div>

                    {/* Filter categories & Search bar */}
                    <CourseFilter
                      activeCategory={category}
                      onChangeCategory={setCategory}
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      retakeCount={retakeCodes.length}
                      improveCount={improveCodes.length}
                      totalCoursesCount={courses.length}
                    />

                    {/* Courses list */}
                    {filteredCourses.length === 0 ? (
                      <div className="bg-white border border-slate-200 rounded-md p-8 text-center text-slate-400">
                        <p className="text-xs font-medium">Không tìm thấy môn học nào phù hợp với bộ lọc.</p>
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
                  <div className="lg:col-span-5 space-y-5">
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

            {/* TAB 2: THỜI KHÓA BIỂU TOÀN DIỆN */}
            {activeTab === "timetable" && (
              <motion.div
                key="tab-timetable"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <FullTimetableGrid registeredClasses={registeredClasses} />
              </motion.div>
            )}

            {/* TAB 3: CHƯƠNG TRÌNH ĐÀO TẠO */}
            {activeTab === "curriculum" && (
              <motion.div
                key="tab-curriculum"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <TranscriptView student={student} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* 4. Conflict / Validation Error Modal */}
      <ConflictModal
        errorData={errorModal}
        onClose={() => setErrorModal(null)}
      />

      {/* 5. User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
      />

      {/* 6. Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* 7. Minimal Academic Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          UniCredit Portal © 2024 - 2026 • Cổng Thông Tin Học Vụ & Đăng Ký Tín Chỉ Trực Tuyến
        </div>
      </footer>
    </div>
  );
}
