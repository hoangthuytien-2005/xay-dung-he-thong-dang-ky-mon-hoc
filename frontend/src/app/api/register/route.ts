import { NextResponse } from "next/server";
import {
  getStudentProfile,
  getAllCourses,
  getAllCourseClasses,
  getActivePeriod,
  registerClassForStudent,
  dropClassForStudent,
} from "@/lib/data-repository";
import {
  checkTimeConflict,
  checkPrerequisites,
  checkCreditLimit,
  checkSlotAvailability,
  checkDuplicateCourse,
} from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentCode = "B21DCCN001", classCode } = body;

    if (!classCode) {
      return NextResponse.json(
        { success: false, message: "Mã lớp học phần không được để trống." },
        { status: 400 }
      );
    }

    // 1. Kiểm tra đợt đăng ký có đang mở không
    const period = await getActivePeriod();
    if (!period.isActive) {
      return NextResponse.json(
        { success: false, message: "Đợt đăng ký tín chỉ hiện đang đóng." },
        { status: 400 }
      );
    }

    // 2. Lấy dữ liệu sinh viên, môn học, các lớp học phần
    const student = await getStudentProfile(studentCode);
    if (student.academicStatus === "DROPPED_OUT") {
      return NextResponse.json(
        {
          success: false,
          errorType: "STUDENT_INACTIVE",
          message: "Tài khoản sinh viên đã có quyết định THÔI HỌC, không thể đăng ký học phần.",
        },
        { status: 400 }
      );
    }
    if (student.academicStatus === "RESERVED") {
      return NextResponse.json(
        {
          success: false,
          errorType: "STUDENT_INACTIVE",
          message: "Tài khoản sinh viên đang trong thời gian BẢO LƯU kết quả học tập, không thể đăng ký học phần.",
        },
        { status: 400 }
      );
    }
    const courses = await getAllCourses();
    const allClasses = await getAllCourseClasses(period.periodId);

    const targetClass = allClasses.find((c) => c.classCode === classCode);
    if (!targetClass) {
      return NextResponse.json(
        { success: false, message: `Không tìm thấy lớp học phần [${classCode}].` },
        { status: 404 }
      );
    }

    const courseInfo = courses.find((c) => c.code === targetClass.courseCode);
    if (!courseInfo) {
      return NextResponse.json(
        { success: false, message: `Không tìm thấy thông tin môn học [${targetClass.courseCode}].` },
        { status: 404 }
      );
    }

    // 3. Lấy danh sách các lớp sinh viên ĐÃ đăng ký
    const registeredClasses = allClasses.filter((c) =>
      student.registeredClasses.includes(c.classCode)
    );

    // 4. Kiểm tra xem đã đăng ký chính lớp này chưa
    if (student.registeredClasses.includes(classCode)) {
      return NextResponse.json(
        { success: false, message: `Bạn đã đăng ký lớp học [${classCode}] này rồi.` },
        { status: 400 }
      );
    }

    // 5. Kiểm tra đăng ký trùng môn (đã chọn 1 lớp khác của cùng môn)
    const duplicateCheck = checkDuplicateCourse(targetClass.courseCode, registeredClasses);
    if (duplicateCheck.isDuplicate) {
      return NextResponse.json(
        { success: false, message: duplicateCheck.message },
        { status: 400 }
      );
    }

    // 6. Kiểm tra điều kiện tiên quyết
    const prereqCheck = checkPrerequisites(courseInfo, student.completedCourses);
    if (!prereqCheck.isValid) {
      return NextResponse.json(
        {
          success: false,
          errorType: "PREREQUISITE_FAILED",
          message: prereqCheck.message,
          missingPrerequisites: prereqCheck.missingPrerequisites,
        },
        { status: 400 }
      );
    }

    // 7. Kiểm tra trùng thời khóa biểu
    const conflictCheck = checkTimeConflict(targetClass, registeredClasses);
    if (conflictCheck.hasConflict) {
      return NextResponse.json(
        {
          success: false,
          errorType: "TIME_CONFLICT",
          message: conflictCheck.message,
          conflictingClass: conflictCheck.conflictingClass,
        },
        { status: 400 }
      );
    }

    // 8. Kiểm tra sĩ số lớp còn trống
    const slotCheck = checkSlotAvailability(targetClass);
    if (!slotCheck.isAvailable) {
      return NextResponse.json(
        {
          success: false,
          errorType: "SLOT_FULL",
          message: slotCheck.message,
        },
        { status: 400 }
      );
    }

    // 9. Kiểm tra giới hạn tín chỉ tối đa
    const currentCredits = registeredClasses.reduce((sum, c) => sum + c.credits, 0);
    const creditCheck = checkCreditLimit(
      currentCredits,
      targetClass.credits,
      period.maxCredits
    );
    if (!creditCheck.isValid) {
      return NextResponse.json(
        {
          success: false,
          errorType: "MAX_CREDITS_EXCEEDED",
          message: creditCheck.message,
        },
        { status: 400 }
      );
    }

    // 10. Mọi ràng buộc hợp lệ -> Tiến hành lưu đăng ký
    const result = await registerClassForStudent(studentCode, classCode);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { studentCode = "B21DCCN001", classCode } = body;

    if (!classCode) {
      return NextResponse.json(
        { success: false, message: "Mã lớp học phần không được để trống." },
        { status: 400 }
      );
    }

    const result = await dropClassForStudent(studentCode, classCode);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
