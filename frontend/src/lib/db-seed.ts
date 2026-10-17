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
} from "./mock-data";

export async function seedDatabase(): Promise<{ success: boolean; message: string }> {
  const { isConnected, error } = await connectToDatabase();
  if (!isConnected) {
    return {
      success: false,
      message: `Không thể kết nối tới MongoDB: ${error || "Kiểm tra MONGODB_URI trong .env.local"}. Hệ thống đang chạy ở chế độ Memory Cache fallback.`,
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

    // 2. Seed Student
    await Student.deleteMany({});
    await Student.create(INITIAL_STUDENT);

    // 3. Seed Courses
    await Course.deleteMany({});
    await Course.insertMany(INITIAL_COURSES);

    // 4. Seed Course Classes
    await CourseClass.deleteMany({});
    await CourseClass.insertMany(INITIAL_COURSE_CLASSES);

    console.log("✅ [Seed] Dữ liệu mẫu đã được nạp thành công vào MongoDB!");
    return {
      success: true,
      message: "Khởi tạo dữ liệu mẫu thành công vào MongoDB!",
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
