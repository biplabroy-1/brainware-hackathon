import connectDB from "@/lib/db";
import Schedule from "@/models/Schedule";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB()
    const schedules = await Schedule.find({}, { ID: 1, _id: 0 });
    const Allids = schedules.map((schedule) => schedule.ID);
    return NextResponse.json({ ids: Allids });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
