// models/Holiday.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for a single holiday document
export interface IHoliday extends Document {
  name: string;
  date: string; // Format: DD-MM-YYYY
  createdAt?: Date;
  updatedAt?: Date;
}

const holidaySchema = new Schema<IHoliday>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
      index: true,
    },
  },
  { timestamps: true }
);

// Export model with safe access to mongoose.models
const Holiday: Model<IHoliday> =
  mongoose.models?.Holiday ||
  mongoose.model<IHoliday>("Holiday", holidaySchema);

export default Holiday;
