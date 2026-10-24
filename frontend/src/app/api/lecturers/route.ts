import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Lecturer from "@/models/Lecturer";
import { INITIAL_LECTURERS } from "@/lib/mock-data";

export async function GET() {
  try {
    await connectToDatabase();
    let list = await Lecturer.find({}).lean();
    if (!list || list.length === 0) {
      await Lecturer.insertMany(INITIAL_LECTURERS);
      list = await Lecturer.find({}).lean();
    }
    return NextResponse.json({ success: true, data: list });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
