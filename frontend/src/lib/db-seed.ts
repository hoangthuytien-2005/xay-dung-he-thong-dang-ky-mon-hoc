import connectToDatabase from "./mongodb";
import Student from "../models/Student";
import Course from "../models/Course";
import CourseClass from "../models/CourseClass";
import RegistrationPeriod from "../models/RegistrationPeriod";
import Lecturer from "../models/Lecturer";
import {
  INITIAL_STUDENTS_COLLECTION,
  INITIAL_COURSES,
  INITIAL_COURSE_CLASSES,
  INITIAL_PERIOD,
  INITIAL_LECTURERS,
} from "./mock-data";

export async function seedDatabase(): Promise<{ success: boolean; message: string }> {
  const { isConnected, error } = await connectToDatabase();
  if (!isConnected) {
    return {
      success: false,
      message: `Không thể kết nối tới MongoDB: ${error || "Kiểm tra MONGODB_URI trong .env.local"}.`,
    };
  }

  try {
    // 1. Seed Registration Period
    await RegistrationPeriod.deleteMany({});
    await RegistrationPeriod.create({
      ...INITIAL_PERIOD,
      startDate: new Date(INITIAL_PERIOD.startDate),
      endDate: new Date(INITIAL_PERIOD.endDate),
    });

    // 2. Seed Students (Full list of students for Admin & Student portals)
    await Student.deleteMany({});
    await Student.insertMany(INITIAL_STUDENTS_COLLECTION);

    // 3. Seed Courses (52 môn học 9 kỳ)
    await Course.deleteMany({});
    await Course.insertMany(INITIAL_COURSES);

    // 4. Seed Course Classes
    await CourseClass.deleteMany({});
    await CourseClass.insertMany(INITIAL_COURSE_CLASSES);

    // 5. Seed Lecturers
    await Lecturer.deleteMany({});
    await Lecturer.insertMany(INITIAL_LECTURERS);

    console.log(
      `✅ [MongoDB Seed] Đã nạp thành công ${INITIAL_COURSES.length} môn học, ${INITIAL_COURSE_CLASSES.length} lớp học phần, ${INITIAL_LECTURERS.length} giảng viên và hồ sơ sinh viên vào MongoDB (unicredit_db)!`
    );
    return {
      success: true,
      message: `Khởi tạo dữ liệu thành công vào MongoDB (${INITIAL_COURSES.length} môn học, ${INITIAL_COURSE_CLASSES.length} lớp học phần)!`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ [Seed Error]:", msg);
    return {
      success: false,
      message: `Lỗi khi nạp dữ liệu: ${msg}`,
    };
  }
}
