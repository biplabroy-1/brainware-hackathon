import { NextRequest, NextResponse } from "next/server";
import Holiday from "@/models/holiday";
import connectDB from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

// GET all holidays
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const holidays = await Holiday.find({}).sort({ date: 1 });
    return NextResponse.json(holidays);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST - Add or update a holiday
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ message: "unauthorised" }, { status: 401 });
    }
    await connectDB();

    const body = await request.json();
    const { name, date } = body;

    if (!name || !date) {
      return NextResponse.json(
        { message: "Name and date are required" },
        { status: 400 }
      );
    }

    const existingHoliday = await Holiday.findOneAndUpdate(
      { name, date },
      { name, date },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: existingHoliday
        ? "Holiday updated successfully"
        : "Holiday added successfully",
      holiday: existingHoliday,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
