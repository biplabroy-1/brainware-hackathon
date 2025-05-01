import { NextRequest, NextResponse } from "next/server";
import Holiday from "@/models/holiday";
import connectDB from "@/lib/db";

// DELETE a holiday by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const id = params.id;
    console.log("Deleting holiday with ID:", id);

    const result = await Holiday.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Holiday not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Holiday deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// GET a specific holiday by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const id = params.id;
    const holiday = await Holiday.findById(id);

    if (!holiday) {
      return NextResponse.json(
        { message: "Holiday not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(holiday);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
