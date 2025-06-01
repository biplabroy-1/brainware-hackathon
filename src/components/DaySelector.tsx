import React from "react";
import { Button } from "@/components/ui/button";

interface ScheduleData {
  Monday: any[];
  Tuesday: any[];
  Wednesday: any[];
  Thursday: any[];
  Friday: any[];
  Saturday: any[];
}

interface DaySelectorProps {
  schedule: ScheduleData;
  currentDay: string;
  handleDayChange: (day: string) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ schedule, currentDay, handleDayChange }) => {
  return (
    <div className="flex overflow-x-auto mb-4 pb-2">
      {Object.keys(schedule).map((day) => (
        <Button
          key={day}
          variant={currentDay === day ? "default" : "outline"}
          className="mr-2 whitespace-nowrap cursor-pointer"
          onClick={() => handleDayChange(day)}
        >
          {day}
        </Button>
      ))}
    </div>
  );
};

export default React.memo(DaySelector);
