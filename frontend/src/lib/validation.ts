import { CourseClassData, CourseData, CompletedCourseData } from "./mock-data";

export interface ConflictCheckResult {
  hasConflict: boolean;
  message?: string;
  conflictingClass?: CourseClassData;
}

export interface PrerequisiteCheckResult {
  isValid: boolean;
  missingPrerequisites?: string[];
  message?: string;
}

export interface CreditLimitResult {
  isValid: boolean;
  totalCredits: number;
  message?: string;
}

/**
 * Kiểm tra xem 2 lớp học phần có bị trùng lịch học hay không
 * Hai lớp trùng lịch khi:
 * 1. Cùng Thứ trong tuần (dayOfWeek)
 * 2. Khoảng tiết học [start, start + count - 1] giao nhau
 */
export function checkScheduleOverlap(
  classA: { dayOfWeek: number; startPeriod: number; periodCount: number },
  classB: { dayOfWeek: number; startPeriod: number; periodCount: number }
): boolean {
  if (classA.dayOfWeek !== classB.dayOfWeek) {
    return false;
  }

  const startA = classA.startPeriod;
  const endA = classA.startPeriod + classA.periodCount - 1;

  const startB = classB.startPeriod;
  const endB = classB.startPeriod + classB.periodCount - 1;

  // Giao nhau khi max(startA, startB) <= min(endA, endB)
  return Math.max(startA, startB) <= Math.min(endA, endB);
}

/**
 * Kiểm tra trùng lịch của một lớp mới với danh sách lớp đã đăng ký
 */
export function checkTimeConflict(
  newClass: CourseClassData,
  registeredClasses: CourseClassData[]
): ConflictCheckResult {
  for (const registered of registeredClasses) {
    // Nếu cùng mã lớp học phần thì bỏ qua (hoặc xử lý riêng ở check duplicate)
    if (registered.classCode === newClass.classCode) continue;

    if (checkScheduleOverlap(newClass, registered)) {
      const dayName = newClass.dayOfWeek === 8 ? "Chủ nhật" : `Thứ ${newClass.dayOfWeek}`;
      return {
        hasConflict: true,
        conflictingClass: registered,
        message: `Trùng lịch vào ${dayName} (Tiết ${newClass.startPeriod}-${newClass.startPeriod + newClass.periodCount - 1}) với lớp ${registered.courseName} [${registered.classCode}] (Tiết ${registered.startPeriod}-${registered.startPeriod + registered.periodCount - 1}, Phòng ${registered.room}).`,
      };
    }
  }

  return { hasConflict: false };
}

/**
 * Kiểm tra điều kiện tiên quyết của môn học
 */
export function checkPrerequisites(
  course: CourseData,
  completedCourses: CompletedCourseData[]
): PrerequisiteCheckResult {
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return { isValid: true };
  }

  const missing: string[] = [];

  for (const prereqCode of course.prerequisites) {
    const passed = completedCourses.some(
      (c) => c.courseCode === prereqCode && c.isPassed
    );
    if (!passed) {
      missing.push(prereqCode);
    }
  }

  if (missing.length > 0) {
    return {
      isValid: false,
      missingPrerequisites: missing,
      message: `Chưa đạt điều kiện tiên quyết: Bạn chưa hoàn thành học phần [${missing.join(", ")}].`,
    };
  }

  return { isValid: true };
}

/**
 * Kiểm tra giới hạn tín chỉ (tối đa trong kỳ)
 */
export function checkCreditLimit(
  currentCredits: number,
  additionalCredits: number,
  maxCredits: number = 24
): CreditLimitResult {
  const total = currentCredits + additionalCredits;
  if (total > maxCredits) {
    return {
      isValid: false,
      totalCredits: total,
      message: `Vượt quá giới hạn tín chỉ: Tổng số tín chỉ sau khi thêm là ${total} TC, vượt quá mức tối đa ${maxCredits} TC trong một học kỳ.`,
    };
  }

  return { isValid: true, totalCredits: total };
}

/**
 * Kiểm tra lớp đã đầy sĩ số hay chưa
 */
export function checkSlotAvailability(courseClass: CourseClassData): {
  isAvailable: boolean;
  message?: string;
} {
  if (courseClass.currentSlots >= courseClass.maxSlots) {
    return {
      isAvailable: false,
      message: `Lớp học phần [${courseClass.classCode}] đã đầy sĩ số (${courseClass.currentSlots}/${courseClass.maxSlots}).`,
    };
  }
  return { isAvailable: true };
}

/**
 * Kiểm tra xem sinh viên đã đăng ký một lớp khác của cùng môn này chưa
 */
export function checkDuplicateCourse(
  newCourseCode: string,
  registeredClasses: CourseClassData[]
): { isDuplicate: boolean; registeredClassCode?: string; message?: string } {
  const existing = registeredClasses.find((c) => c.courseCode === newCourseCode);
  if (existing) {
    return {
      isDuplicate: true,
      registeredClassCode: existing.classCode,
      message: `Bạn đã đăng ký môn học này ở lớp [${existing.classCode}]. Vui lòng hủy lớp cũ trước nếu muốn đổi lớp.`,
    };
  }
  return { isDuplicate: false };
}
