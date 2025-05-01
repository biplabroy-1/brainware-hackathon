import connectDB from "@/lib/db";
import Teacher from "@/models/Teacher";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const university = searchParams.get("university");
    const program = searchParams.get("program");

    // Build the filter object based on provided query parameters
    const filter: any = {};
    if (university) filter.university = university;
    if (program) filter.program = program;

    // Find teachers that match the filter criteria
    const teachers = await Teacher.find(filter).select("-__v -_id");
    teachers.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name

    if (teachers.length > 0) {
      return NextResponse.json(teachers);
    } else {
      return NextResponse.json(
        {
          message: "No teachers found with the specified criteria",
          filters: filter,
        },
        { status: 404 }
      );
    }
  } catch (err: any) {
    console.error("Error fetching teachers:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
