import Teacher from "@/models/Teacher";
import { ISchedule, WeekDay } from "@/models/Schedule";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractAndSaveTeachers = async (
  schedule: ISchedule,
  university: string,
  program: string
) => {
  try {
    console.log("Extracting teachers from schedule...");

    const teachersSet = new Set<string>();

    const weekdays: WeekDay[] = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Extract all instructors from each day's schedule
    weekdays.forEach((day) => {
      const daySchedule = schedule.schedule[day];
      if (Array.isArray(daySchedule)) {
        daySchedule.forEach((period) => {
          if (period.Instructor) {
            const instructors = period.Instructor.split("+").map((name) =>
              name.trim()
            );
            instructors.forEach((name) => teachersSet.add(name));
          }
        });
      }
    });

    const teacherPromises = Array.from(teachersSet).map(async (name) => {
      const existingTeacher = await Teacher.findOne({ name });
      if (!existingTeacher) {
        const newTeacher = new Teacher({
          name,
          university,
          program,
        });
        return newTeacher.save();
      }
      return Promise.resolve();
    });

    await Promise.all(teacherPromises);
    console.log(`Extracted and saved ${teachersSet.size} teachers`);
  } catch (error) {
    console.error("Error extracting teachers:", error);
  }
};
