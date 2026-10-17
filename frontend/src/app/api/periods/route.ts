import { NextResponse } from "next/server";
import { getActivePeriod, updatePeriodConfig } from "@/lib/data-repository";

export async function GET() {
  try {
    const period = await getActivePeriod();
    return NextResponse.json({ success: true, data: period });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { minCredits, maxCredits, isActive } = body;

    const result = await updatePeriodConfig(
      Number(minCredits) || 10,
      Number(maxCredits) || 24,
      Boolean(isActive)
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
