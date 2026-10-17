import { NextResponse } from "next/server";
import { getStudentProfile } from "@/lib/data-repository";

export async function GET() {
  try {
    const student = await getStudentProfile("B21DCCN001");
    return NextResponse.json({ success: true, data: student });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
