import { NextResponse } from "next/server";
import { getAllCourses } from "@/lib/data-repository";

export async function GET() {
  try {
    const courses = await getAllCourses();
    return NextResponse.json({ success: true, data: courses });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
