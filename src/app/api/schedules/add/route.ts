import Schedule from "@/models/Schedule";
import { NextRequest, NextResponse } from "next/server";
import { extractAndSaveTeachers } from "@/lib/utils";
import connectDB from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { ID, semester, program, section, university, schedule } =
      await request.json();
    console.log(schedule);

    const existingSchedule = await Schedule.findOne({ ID });
    if (existingSchedule) {
      existingSchedule.semester = semester;
      existingSchedule.program = program;
      existingSchedule.section = section;
      existingSchedule.schedule = schedule;
      existingSchedule.university = university;
      await existingSchedule.save();

      // Extract and save teachers from updated schedule
      await extractAndSaveTeachers(schedule, university, program);

      return NextResponse.json({ message: "Schedule updated successfully" });
    }

    const newSchedule = new Schedule({
      ID,
      semester,
      program,
      section,
      university,
      schedule,
    });
    await newSchedule.save();

    // Extract and save teachers from new schedule
    await extractAndSaveTeachers(schedule, university, program);
    return NextResponse.json({ message: "Schedule added successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
