import { NextResponse } from "next/server";
import {
  getStudentProfile,
  getAllStudents,
  updateStudentAcademicStatus,
} from "@/lib/data-repository";
import { AcademicStatusType } from "@/lib/mock-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");
    const code = searchParams.get("code") || "B21DCCN001";

    if (all === "true") {
      const students = await getAllStudents();
      return NextResponse.json({ success: true, data: students });
    }

    const student = await getStudentProfile(code);
    return NextResponse.json({ success: true, data: student });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { studentCode, academicStatus } = body as {
      studentCode: string;
      academicStatus: AcademicStatusType;
    };

    if (!studentCode || !academicStatus) {
      return NextResponse.json(
        { success: false, message: "Thiếu mã sinh viên hoặc trạng thái học vụ." },
        { status: 400 }
      );
    }

    const result = await updateStudentAcademicStatus(studentCode, academicStatus);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
