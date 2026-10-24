import connectToDatabase from "./mongodb";
import Student from "../models/Student";
import Course from "../models/Course";
import CourseClass from "../models/CourseClass";
import RegistrationPeriod from "../models/RegistrationPeriod";
import {
  INITIAL_STUDENT,
  INITIAL_STUDENTS_COLLECTION,
  INITIAL_COURSES,
  INITIAL_COURSE_CLASSES,
  INITIAL_PERIOD,
  StudentData,
  CourseData,
  CourseClassData,
  RegistrationPeriodData,
  AcademicStatusType,
  AttendanceEntryData,
} from "./mock-data";

// Ensure MongoDB is connected and automatically seeded on first run if collections are empty
let isAutoSeedChecked = false;

async function ensureMongoSeeded(): Promise<void> {
  const { isConnected } = await connectToDatabase();
  if (!isConnected) {
    throw new Error(
      "Không thể kết nối tới MongoDB (mongodb://127.0.0.1:27017/unicredit_db). Vui lòng đảm bảo MongoDB Server đang chạy."
    );
  }

  if (isAutoSeedChecked) return;

  const courseCount = await Course.countDocuments();
  if (courseCount < INITIAL_COURSES.length) {
    await Course.deleteMany({});
    await Course.insertMany(INITIAL_COURSES);

    const classCount = await CourseClass.countDocuments();
    if (classCount < INITIAL_COURSE_CLASSES.length) {
      await CourseClass.deleteMany({});
      await CourseClass.insertMany(INITIAL_COURSE_CLASSES);
    }
  }

  const periodCount = await RegistrationPeriod.countDocuments();
  if (periodCount === 0) {
    await RegistrationPeriod.create({
      ...INITIAL_PERIOD,
      startDate: new Date(INITIAL_PERIOD.startDate),
      endDate: new Date(INITIAL_PERIOD.endDate),
    });
  }

  const studentCount = await Student.countDocuments();
  if (studentCount < INITIAL_STUDENTS_COLLECTION.length) {
    for (const sData of INITIAL_STUDENTS_COLLECTION) {
      const exists = await Student.findOne({ studentCode: sData.studentCode });
      if (!exists) {
        await Student.create(sData);
      } else if (!exists.academicStatus) {
        exists.academicStatus = sData.academicStatus || "ACTIVE";
        await exists.save();
      }
    }
  }

  isAutoSeedChecked = true;
}

export async function getActivePeriod(): Promise<RegistrationPeriodData> {
  await ensureMongoSeeded();
  const p =
    (await RegistrationPeriod.findOne({ isActive: true }).lean()) ||
    (await RegistrationPeriod.findOne({}).lean());

  if (!p) {
    throw new Error("Không tìm thấy cấu hình đợt đăng ký trong MongoDB.");
  }

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

export async function getStudentProfile(studentCode: string = "B21DCCN001"): Promise<StudentData> {
  await ensureMongoSeeded();
  const s =
    (await Student.findOne({ studentCode }).lean()) ||
    (await Student.findOne({}).lean());

  if (!s) {
    throw new Error(`Không tìm thấy sinh viên [${studentCode}] trong MongoDB.`);
  }

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
    academicStatus: (s.academicStatus as AcademicStatusType) || "ACTIVE",
    completedCourses: s.completedCourses,
    registeredClasses: s.registeredClasses,
  };
}

export async function getAllStudents(): Promise<StudentData[]> {
  await ensureMongoSeeded();
  const list = await Student.find({}).sort({ studentCode: 1 }).lean();
  return list.map((s) => ({
    studentCode: s.studentCode,
    fullName: s.fullName,
    email: s.email,
    major: s.major,
    administrativeClass: s.administrativeClass,
    academicYear: s.academicYear,
    cpa: s.cpa,
    accumulatedCredits: s.accumulatedCredits,
    advisorName: s.advisorName,
    academicStatus: (s.academicStatus as AcademicStatusType) || "ACTIVE",
    completedCourses: s.completedCourses,
    registeredClasses: s.registeredClasses,
  }));
}

export async function updateStudentAcademicStatus(
  studentCode: string,
  academicStatus: AcademicStatusType
): Promise<{ success: boolean; message: string; data?: StudentData }> {
  await ensureMongoSeeded();
  const student = await Student.findOne({ studentCode });
  if (!student) {
    return {
      success: false,
      message: `Không tìm thấy sinh viên [${studentCode}] trong MongoDB.`,
    };
  }

  student.academicStatus = academicStatus;
  await student.save();

  const statusLabel =
    academicStatus === "ACTIVE"
      ? "Đang học"
      : academicStatus === "RESERVED"
      ? "Bảo lưu"
      : "Đã thôi học";

  return {
    success: true,
    message: `Đã cập nhật trạng thái học vụ của sinh viên ${student.fullName} (${studentCode}) thành "${statusLabel}".`,
    data: {
      studentCode: student.studentCode,
      fullName: student.fullName,
      email: student.email,
      major: student.major,
      administrativeClass: student.administrativeClass,
      academicYear: student.academicYear,
      cpa: student.cpa,
      accumulatedCredits: student.accumulatedCredits,
      advisorName: student.advisorName,
      academicStatus: student.academicStatus,
      completedCourses: student.completedCourses,
      registeredClasses: student.registeredClasses,
    },
  };
}

export async function getAllCourses(): Promise<CourseData[]> {
  await ensureMongoSeeded();
  const list = await Course.find({}).sort({ semesterProposal: 1, code: 1 }).lean();
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

export async function getAllCourseClasses(periodId: string = "2024-2025-HK1"): Promise<CourseClassData[]> {
  await ensureMongoSeeded();
  const list = await CourseClass.find({ periodId }).lean();
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
    attendanceRecords: (c.attendanceRecords as AttendanceEntryData[]) || [],
    tuitionPerCredit: c.tuitionPerCredit,
  }));
}

export async function saveClassAttendance(
  classCode: string,
  attendanceRecords: AttendanceEntryData[]
): Promise<{ success: boolean; message: string; data?: CourseClassData }> {
  await ensureMongoSeeded();
  const courseClass = await CourseClass.findOne({ classCode });
  if (!courseClass) {
    return {
      success: false,
      message: `Không tìm thấy lớp học phần [${classCode}] trong MongoDB.`,
    };
  }

  courseClass.attendanceRecords = attendanceRecords;
  await courseClass.save();

  return {
    success: true,
    message: `Đã lưu kết quả điểm danh lớp [${classCode}] vào MongoDB thành công!`,
    data: {
      classCode: courseClass.classCode,
      courseCode: courseClass.courseCode,
      courseName: courseClass.courseName,
      credits: courseClass.credits,
      periodId: courseClass.periodId,
      dayOfWeek: courseClass.dayOfWeek,
      startPeriod: courseClass.startPeriod,
      periodCount: courseClass.periodCount,
      room: courseClass.room,
      lecturer: courseClass.lecturer,
      maxSlots: courseClass.maxSlots,
      currentSlots: courseClass.currentSlots,
      registeredStudents: courseClass.registeredStudents,
      attendanceRecords: (courseClass.attendanceRecords as AttendanceEntryData[]) || [],
      tuitionPerCredit: courseClass.tuitionPerCredit,
    },
  };
}

export async function updateClassSchedule(
  classCode: string,
  dayOfWeek: number,
  startPeriod: number,
  periodCount: number,
  room: string
): Promise<{ success: boolean; message: string; data?: CourseClassData }> {
  await ensureMongoSeeded();
  const courseClass = await CourseClass.findOne({ classCode });
  if (!courseClass) {
    return {
      success: false,
      message: `Không tìm thấy lớp học phần [${classCode}] trong MongoDB.`,
    };
  }

  courseClass.dayOfWeek = dayOfWeek;
  courseClass.startPeriod = startPeriod;
  courseClass.periodCount = periodCount;
  courseClass.room = room;
  await courseClass.save();

  return {
    success: true,
    message: `Đã cập nhật lịch dạy lớp [${classCode}] vào MongoDB thành công!`,
    data: {
      classCode: courseClass.classCode,
      courseCode: courseClass.courseCode,
      courseName: courseClass.courseName,
      credits: courseClass.credits,
      periodId: courseClass.periodId,
      dayOfWeek: courseClass.dayOfWeek,
      startPeriod: courseClass.startPeriod,
      periodCount: courseClass.periodCount,
      room: courseClass.room,
      lecturer: courseClass.lecturer,
      maxSlots: courseClass.maxSlots,
      currentSlots: courseClass.currentSlots,
      registeredStudents: courseClass.registeredStudents,
      attendanceRecords: (courseClass.attendanceRecords as AttendanceEntryData[]) || [],
      tuitionPerCredit: courseClass.tuitionPerCredit,
    },
  };
}

export async function registerClassForStudent(
  studentCode: string,
  classCode: string
): Promise<{ success: boolean; message: string; data?: StudentData; updatedStudent?: StudentData }> {
  await ensureMongoSeeded();

  const student = await Student.findOne({ studentCode });
  const courseClass = await CourseClass.findOne({ classCode });

  if (!student || !courseClass) {
    return { success: false, message: "Không tìm thấy thông tin sinh viên hoặc lớp học phần trong MongoDB." };
  }

  if (student.academicStatus === "RESERVED" || student.academicStatus === "DROPPED_OUT") {
    const label = student.academicStatus === "RESERVED" ? "Bảo lưu" : "Đã thôi học";
    return {
      success: false,
      message: `Sinh viên hiện đang ở trạng thái "${label}" nên không thể đăng ký tín chỉ.`,
    };
  }

  if (student.registeredClasses.includes(classCode)) {
    return { success: false, message: "Sinh viên đã đăng ký lớp học này trước đó." };
  }

  if (courseClass.currentSlots >= courseClass.maxSlots) {
    return { success: false, message: "Lớp học phần đã đầy sĩ số." };
  }

  // Update in MongoDB
  student.registeredClasses.push(classCode);
  await student.save();

  courseClass.currentSlots += 1;
  if (!courseClass.registeredStudents.includes(studentCode)) {
    courseClass.registeredStudents.push(studentCode);
  }
  await courseClass.save();

  const updated: StudentData = {
    studentCode: student.studentCode,
    fullName: student.fullName,
    email: student.email,
    major: student.major,
    administrativeClass: student.administrativeClass,
    academicYear: student.academicYear,
    cpa: student.cpa,
    accumulatedCredits: student.accumulatedCredits,
    advisorName: student.advisorName,
    academicStatus: student.academicStatus || "ACTIVE",
    completedCourses: student.completedCourses,
    registeredClasses: [...student.registeredClasses],
  };

  return {
    success: true,
    message: `Đăng ký thành công lớp [${classCode}] vào MongoDB!`,
    data: updated,
    updatedStudent: updated,
  };
}

export async function dropClassForStudent(
  studentCode: string,
  classCode: string
): Promise<{ success: boolean; message: string; data?: StudentData; updatedStudent?: StudentData }> {
  await ensureMongoSeeded();

  const student = await Student.findOne({ studentCode });
  const courseClass = await CourseClass.findOne({ classCode });

  if (!student) {
    return { success: false, message: `Không tìm thấy sinh viên [${studentCode}] trong MongoDB.` };
  }

  student.registeredClasses = student.registeredClasses.filter(
    (c) => c.toLowerCase() !== classCode.toLowerCase()
  );
  await student.save();

  if (courseClass) {
    courseClass.currentSlots = Math.max(0, courseClass.currentSlots - 1);
    courseClass.registeredStudents = courseClass.registeredStudents.filter(
      (s) => s.toLowerCase() !== studentCode.toLowerCase()
    );
    await courseClass.save();
  }

  const updated: StudentData = {
    studentCode: student.studentCode,
    fullName: student.fullName,
    email: student.email,
    major: student.major,
    administrativeClass: student.administrativeClass,
    academicYear: student.academicYear,
    cpa: student.cpa,
    accumulatedCredits: student.accumulatedCredits,
    advisorName: student.advisorName,
    academicStatus: student.academicStatus || "ACTIVE",
    completedCourses: student.completedCourses,
    registeredClasses: [...student.registeredClasses],
  };

  return {
    success: true,
    message: `Đã hủy lớp học phần [${classCode}] khỏi MongoDB thành công.`,
    data: updated,
    updatedStudent: updated,
  };
}

export async function updatePeriodConfig(
  minCredits: number,
  maxCredits: number,
  isActive: boolean
): Promise<{ success: boolean; message: string }> {
  await ensureMongoSeeded();
  await RegistrationPeriod.findOneAndUpdate(
    { periodId: "2024-2025-HK1" },
    { minCredits, maxCredits, isActive }
  );

  return { success: true, message: "Cập nhật cấu hình đợt đăng ký vào MongoDB thành công!" };
}
