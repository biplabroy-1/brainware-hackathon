import connectDB from "@/lib/db";
import Schedule from "@/models/Schedule";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ message: "unauthorised" }, { status: 401 });
    }
    await connectDB()
    const id = params.id;
    const result = await Schedule.deleteOne({ ID: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Schedule Not Found" },
        { status: 404 }
      );
    } else {
      return NextResponse.json({ message: "Schedule deleted" });
    }
  } catch (err: any) {
    console.log("Error deleting Document", err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
