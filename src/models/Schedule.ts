// models/Schedule.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export type ClassType = "Theory" | "Lab" | "Extra" | "Seminar" | "Free";
export type GroupType = "Group 1" | "Group 2" | "All";
export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface IClass {
  Period: number;
  Start_Time: string; // Format: HH:MM (24-hour)
  End_Time: string;
  Course_Name: string;
  Instructor: string;
  Building: string;
  Room: string;
  Group: GroupType;
  Class_Duration: number;
  Class_Count: number;
  Class_type: ClassType;
}

export interface ISchedule extends Document {
  ID: string;
  semester: string;
  program: string;
  section: string;
  university: string;
  schedule: {
    [key in WeekDay]: IClass[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const classSchema = new Schema<IClass>(
  {
    Period: Number,
    Start_Time: { type: String, match: /^\d{2}:\d{2}$/ },
    End_Time: { type: String, match: /^\d{2}:\d{2}$/ },
    Course_Name: String,
    Instructor: String,
    Building: String,
    Room: String,
    Group: {
      type: String,
      enum: ["Group 1", "Group 2", "All"],
    },
    Class_Duration: Number,
    Class_Count: Number,
    Class_type: {
      type: String,
      enum: ["Theory", "Lab", "Extra", "Seminar", "Free"],
      required: true,
    },
  },
  { _id: false }
);

const scheduleSchema = new Schema<ISchedule>(
  {
    ID: { type: String, required: true, unique: true },
    semester: { type: String, required: true },
    program: { type: String, required: true },
    section: { type: String, required: true },
    university: { type: String, required: true },
    schedule: {
      Monday: [classSchema],
      Tuesday: [classSchema],
      Wednesday: [classSchema],
      Thursday: [classSchema],
      Friday: [classSchema],
      Saturday: [classSchema],
    },
  },
  {
    timestamps: true,
  }
);

const Schedule: Model<ISchedule> =
  mongoose.models?.Schedule ||
  mongoose.model<ISchedule>("Schedule", scheduleSchema);

export default Schedule;
