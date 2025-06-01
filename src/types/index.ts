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

export interface ScheduleData {
    [key: string]: IClass[];
    Monday: IClass[];
    Tuesday: IClass[];
    Wednesday: IClass[];
    Thursday: IClass[];
    Friday: IClass[];
    Saturday: IClass[];
}

export interface FormData {
    ID: string;
    selectedID: string;
    university: string;
    program: string;
    section: string;
    semester: string | number;
    [key: string]: any;
}

export interface Instructor {
    value: string;
    label: string;
}

export interface ClassFormProps {
    cls: IClass;
    index: number;
    day: string;
    handleRemoveClass: (day: string, index: number) => void;
    handleClassChange: (day: string, index: number, field: string, value: any) => void;
    handleInstructorChange: (day: string, index: number, value: Instructor | null) => void;
    instructors: Instructor[];
}

export interface ScheduleFormHeaderProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    allIDs: string[];
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: any } }) => void;
    handleDeleteSchedules: (e: React.MouseEvent) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export interface DayClassesContainerProps {
    currentDay: string;
    schedule: ScheduleData;
    handleAddClass: (day: string) => void;
    formData: FormData;
    onUploadSuccess: (data: any) => void;
    handleRemoveClass: (day: string, index: number) => void;
    handleClassChange: (day: string, index: number, field: string, value: any) => void;
    handleInstructorChange: (day: string, index: number, value: Instructor | null) => void;
    instructors: Instructor[];
} 