import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Teacher document
export interface ITeacher extends Document {
  name: string;
  university?: string;
  program?: string;
  email?: string;
  phoneNumber?: string;
}

const TeacherSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  university: {
    type: String,
    trim: true,
  },
  program: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
});

TeacherSchema.index({ name: 1, university: 1, program: 1 }, { unique: true });

// Fix: Handle undefined mongoose.connection more safely
const Teacher =
  mongoose.models?.Teacher ||
  mongoose.model<ITeacher>("Teacher", TeacherSchema);

export default Teacher;
