import { NextResponse } from "next/server";
import { getAllCourseClasses } from "@/lib/data-repository";

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
