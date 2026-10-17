import connectToDatabase from "./mongodb";
import Student from "../models/Student";
import Course from "../models/Course";
import CourseClass from "../models/CourseClass";
import RegistrationPeriod from "../models/RegistrationPeriod";
import {
  INITIAL_STUDENT,
  INITIAL_COURSES,
  INITIAL_COURSE_CLASSES,
  INITIAL_PERIOD,
  StudentData,
  CourseData,
  CourseClassData,
  RegistrationPeriodData,
} from "./mock-data";

// Fallback in-memory mutable store
interface MemoryStore {
  student: StudentData;
  courses: CourseData[];
  classes: CourseClassData[];
  period: RegistrationPeriodData;
  isSeeded: boolean;
}

const memoryStore: MemoryStore = {
  student: JSON.parse(JSON.stringify(INITIAL_STUDENT)),
  courses: JSON.parse(JSON.stringify(INITIAL_COURSES)),
  classes: JSON.parse(JSON.stringify(INITIAL_COURSE_CLASSES)),
  period: JSON.parse(JSON.stringify(INITIAL_PERIOD)),
  isSeeded: true,
};

export async function getActivePeriod(): Promise<RegistrationPeriodData> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    try {
      const p = await RegistrationPeriod.findOne({ isActive: true }).lean();
      if (p) {
        return {
          periodId: p.periodId,
          name: p.name,
          academicYear: p.academicYear,
          semester: p.semester,
          startDate: p.startDate.toISOString(),
          endDate: p.endDate.toISOString(),
          minCredits: p.minCredits,
          maxCredits: p.maxCredits,
          targetBatches: p.targetBatches,
          isActive: p.isActive,
        };
      }
    } catch {
      // Fallback
    }
  }
  return memoryStore.period;
}

export async function getStudentProfile(studentCode: string = "B21DCCN001"): Promise<StudentData> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    try {
      const s = await Student.findOne({ studentCode }).lean();
      if (s) {
        return {
          studentCode: s.studentCode,
          fullName: s.fullName,
          email: s.email,
          major: s.major,
          administrativeClass: s.administrativeClass,
          academicYear: s.academicYear,
          cpa: s.cpa,
          accumulatedCredits: s.accumulatedCredits,
          advisorName: s.advisorName,
          completedCourses: s.completedCourses,
          registeredClasses: s.registeredClasses,
        };
      }
    } catch {
      // Fallback
    }
  }
  return memoryStore.student;
}

export async function getAllCourses(): Promise<CourseData[]> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    try {
      const list = await Course.find({}).lean();
      if (list && list.length > 0) {
        return list.map((c) => ({
          code: c.code,
          name: c.name,
          credits: c.credits,
          theoryCredits: c.theoryCredits,
          practiceCredits: c.practiceCredits,
          department: c.department,
          semesterProposal: c.semesterProposal,
          prerequisites: c.prerequisites,
          previousCourses: c.previousCourses,
          corequisites: c.corequisites,
          description: c.description,
        }));
      }
    } catch {
      // Fallback
    }
  }
  return memoryStore.courses;
}

export async function getAllCourseClasses(periodId: string = "2024-2025-HK1"): Promise<CourseClassData[]> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    try {
      const list = await CourseClass.find({ periodId }).lean();
      if (list && list.length > 0) {
        return list.map((c) => ({
          classCode: c.classCode,
          courseCode: c.courseCode,
          courseName: c.courseName,
          credits: c.credits,
          periodId: c.periodId,
          dayOfWeek: c.dayOfWeek,
          startPeriod: c.startPeriod,
          periodCount: c.periodCount,
          room: c.room,
          lecturer: c.lecturer,
          maxSlots: c.maxSlots,
          currentSlots: c.currentSlots,
          registeredStudents: c.registeredStudents,
          tuitionPerCredit: c.tuitionPerCredit,
        }));
      }
    } catch {
      // Fallback
    }
  }
  return memoryStore.classes;
}

export async function registerClassForStudent(
  studentCode: string,
  classCode: string
): Promise<{ success: boolean; message: string; updatedStudent?: StudentData }> {
  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      const student = await Student.findOne({ studentCode });
      const courseClass = await CourseClass.findOne({ classCode });

      if (!student || !courseClass) {
        return { success: false, message: "Không tìm thấy thông tin sinh viên hoặc lớp học phần." };
      }

      if (student.registeredClasses.includes(classCode)) {
        return { success: false, message: "Sinh viên đã đăng ký lớp học này trước đó." };
      }

      if (courseClass.currentSlots >= courseClass.maxSlots) {
        return { success: false, message: "Lớp học phần đã đầy sĩ số." };
      }

      // Update student & courseClass
      student.registeredClasses.push(classCode);
      await student.save();

      courseClass.currentSlots += 1;
      if (!courseClass.registeredStudents.includes(studentCode)) {
        courseClass.registeredStudents.push(studentCode);
      }
      await courseClass.save();

      return {
        success: true,
        message: `Đăng ký thành công lớp [${classCode}]!`,
        updatedStudent: {
          studentCode: student.studentCode,
          fullName: student.fullName,
          email: student.email,
          major: student.major,
          administrativeClass: student.administrativeClass,
          academicYear: student.academicYear,
          cpa: student.cpa,
          accumulatedCredits: student.accumulatedCredits,
          advisorName: student.advisorName,
          completedCourses: student.completedCourses,
          registeredClasses: student.registeredClasses,
        },
      };
    } catch (err: unknown) {
      console.warn("MongoDB write error, falling back to memory store:", err);
    }
  }

  // Memory store fallback
  const s = memoryStore.student;
  const c = memoryStore.classes.find((x) => x.classCode === classCode);
  if (!c) {
    return { success: false, message: "Không tìm thấy lớp học phần." };
  }
  if (s.registeredClasses.includes(classCode)) {
    return { success: false, message: "Sinh viên đã đăng ký lớp học này trước đó." };
  }
  if (c.currentSlots >= c.maxSlots) {
    return { success: false, message: "Lớp học phần đã đầy sĩ số." };
  }

  s.registeredClasses.push(classCode);
  c.currentSlots += 1;
  c.registeredStudents.push(studentCode);

  return {
    success: true,
    message: `Đăng ký thành công lớp [${classCode}]!`,
    updatedStudent: JSON.parse(JSON.stringify(s)),
  };
}

export async function dropClassForStudent(
  studentCode: string,
  classCode: string
): Promise<{ success: boolean; message: string; updatedStudent?: StudentData }> {
  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      const student = await Student.findOne({ studentCode });
      const courseClass = await CourseClass.findOne({ classCode });

      if (student) {
        student.registeredClasses = student.registeredClasses.filter((c) => c !== classCode);
        await student.save();
      }

      if (courseClass) {
        courseClass.currentSlots = Math.max(0, courseClass.currentSlots - 1);
        courseClass.registeredStudents = courseClass.registeredStudents.filter((s) => s !== studentCode);
        await courseClass.save();
      }

      if (student) {
        return {
          success: true,
          message: `Đã hủy lớp học phần [${classCode}] thành công.`,
          updatedStudent: {
            studentCode: student.studentCode,
            fullName: student.fullName,
            email: student.email,
            major: student.major,
            administrativeClass: student.administrativeClass,
            academicYear: student.academicYear,
            cpa: student.cpa,
            accumulatedCredits: student.accumulatedCredits,
            advisorName: student.advisorName,
            completedCourses: student.completedCourses,
            registeredClasses: student.registeredClasses,
          },
        };
      }
    } catch (err: unknown) {
      console.warn("MongoDB drop error, falling back to memory store:", err);
    }
  }

  // Memory store fallback
  const s = memoryStore.student;
  const c = memoryStore.classes.find((x) => x.classCode === classCode);

  s.registeredClasses = s.registeredClasses.filter((code) => code !== classCode);
  if (c) {
    c.currentSlots = Math.max(0, c.currentSlots - 1);
    c.registeredStudents = c.registeredStudents.filter((code) => code !== studentCode);
  }

  return {
    success: true,
    message: `Đã hủy lớp học phần [${classCode}] thành công.`,
    updatedStudent: JSON.parse(JSON.stringify(s)),
  };
}

export async function updatePeriodConfig(
  minCredits: number,
  maxCredits: number,
  isActive: boolean
): Promise<{ success: boolean; message: string }> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    try {
      await RegistrationPeriod.findOneAndUpdate(
        { periodId: "2024-2025-HK1" },
        { minCredits, maxCredits, isActive }
      );
    } catch {
      // Fallback
    }
  }

  memoryStore.period.minCredits = minCredits;
  memoryStore.period.maxCredits = maxCredits;
  memoryStore.period.isActive = isActive;

  return { success: true, message: "Cập nhật cấu hình đợt đăng ký thành công!" };
}
