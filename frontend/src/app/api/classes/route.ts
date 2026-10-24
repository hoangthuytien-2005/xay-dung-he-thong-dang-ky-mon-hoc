import { NextResponse } from "next/server";
import {
  getAllCourseClasses,
  saveClassAttendance,
  updateClassSchedule,
} from "@/lib/data-repository";
import { AttendanceEntryData } from "@/lib/mock-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const periodId = searchParams.get("periodId") || "2024-2025-HK1";
    const classes = await getAllCourseClasses(periodId);
    return NextResponse.json({ success: true, data: classes });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { action, classCode, attendanceRecords, dayOfWeek, startPeriod, periodCount, room } =
      body as {
        action: "attendance" | "schedule";
        classCode: string;
        attendanceRecords?: AttendanceEntryData[];
        dayOfWeek?: number;
        startPeriod?: number;
        periodCount?: number;
        room?: string;
      };

    if (!classCode) {
      return NextResponse.json(
        { success: false, message: "Mã lớp học phần không được để trống." },
        { status: 400 }
      );
    }

    if (action === "attendance" && Array.isArray(attendanceRecords)) {
      const result = await saveClassAttendance(classCode, attendanceRecords);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    if (
      action === "schedule" &&
      typeof dayOfWeek === "number" &&
      typeof startPeriod === "number" &&
      typeof periodCount === "number" &&
      typeof room === "string"
    ) {
      const result = await updateClassSchedule(
        classCode,
        dayOfWeek,
        startPeriod,
        periodCount,
        room
      );
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    return NextResponse.json(
      { success: false, message: "Yêu cầu cập nhật lớp học phần không hợp lệ." },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
