import connectDB from '@/lib/db';
import Schedule from '@/models/User';
import { NextResponse,NextRequest } from 'next/server';

export async function GET(request:NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const id = params.id;
    const schedule = await Schedule.findOne({ ID: id });
    
    if (schedule) {
      return NextResponse.json(schedule);
    } else {
      return NextResponse.json(
        { message: 'Schedule not found' },
        { status: 404 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
