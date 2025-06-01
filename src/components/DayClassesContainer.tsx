import React from "react";
import { Button } from "@/components/ui/button";
import ClassForm from "@/components/classForm";
import UploadPDFModal from "@/components/upload";
import { DayClassesContainerProps, IClass } from "@/types";

const DayClassesContainer: React.FC<DayClassesContainerProps> = ({
  currentDay,
  schedule,
  handleAddClass,
  formData,
  onUploadSuccess,
  handleRemoveClass,
  handleClassChange,
  handleInstructorChange,
  instructors,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{currentDay}</h3>
        <div className="flex gap-4 items-center justify-center">
          <UploadPDFModal onUploadSuccess={onUploadSuccess} />
          {formData.ID && (
            <Button
              type="button"
              variant={formData.ID === "" ? "outline" : "default"}
              onClick={() => handleAddClass(currentDay)}
              disabled={formData.ID === ""}
            >
              <span className="mr-2">➕</span>
              {formData.ID ? formData.ID : "Add a new class"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4">
        {(schedule[currentDay] as IClass[]).map((cls: IClass, index: number) => (
          <ClassForm
            key={index}
            cls={cls}
            index={index}
            day={currentDay}
            handleRemoveClass={handleRemoveClass}
            handleClassChange={handleClassChange}
            handleInstructorChange={handleInstructorChange}
            instructors={instructors}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(DayClassesContainer);
