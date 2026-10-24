import { NextResponse } from "next/server";
import { getStudentProfile } from "@/lib/data-repository";
import connectToDatabase from "@/lib/mongodb";
import Lecturer from "@/models/Lecturer";
import { INITIAL_LECTURERS } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username = "B21DCCN001", role = "student" } = body;

    await connectToDatabase();

    if (String(role).toLowerCase() === "lecturer") {
      let count = await Lecturer.countDocuments();
      if (count === 0) {
        await Lecturer.insertMany(INITIAL_LECTURERS);
      }

      const lecturer =
        (await Lecturer.findOne({
          lecturerCode: { $regex: new RegExp(`^${username}$`, "i") },
        }).lean()) || (await Lecturer.findOne({}).lean());

      return NextResponse.json({
        success: true,
        message: "Đăng nhập Giảng viên thành công (MongoDB).",
        data: {
          role: "lecturer",
          lecturer,
          token: `token_lecturer_${username}`,
        },
      });
    } else {
      const student = await getStudentProfile(String(username).toUpperCase());
      return NextResponse.json({
        success: true,
        message: "Đăng nhập Sinh viên thành công (MongoDB).",
        data: {
          role: "student",
          student,
          token: `token_student_${username}`,
        },
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
