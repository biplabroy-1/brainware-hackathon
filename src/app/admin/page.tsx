"use client"

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Modal from "@/components/Modal";
import { Card } from "@/components/ui/card";
import ScheduleFormHeader from "@/components/sideBarForm";
import DaySelector from "@/components/DaySelector";
import DayClassesContainer from "@/components/DayClassesContainer";
import { IClass, ScheduleData, FormData, Instructor } from "@/types";

const ScheduleForm: React.FC = () => {
    const [schedule, setSchedule] = useState<ScheduleData>({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
    });
    const [formData, setFormData] = useState<FormData>({
        ID: "",
        selectedID: "",
        university: "",
        program: "",
        section: "",
        semester: "",
        Name: "",
        Start_Date: "",
        End_Date: "",
    });

    const [allIDs, setAllIDs] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState<{ day: string; index: number } | null>(null);
    const [currentDay, setCurrentDay] = useState<string>("Monday");
    const [instructors, setInstructors] = useState<Instructor[]>([]);

    const calculateEndTime = useCallback((startTime: string = "08:00", duration: number = 60, count: number = 1): string => {
        const [hours, minutes] = startTime.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes + duration * count;
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
            2,
            "0"
        )}`;
    }, []);

    const handleClassChange = useCallback(
        (day: string, index: number, field: string, value: string | number) => {
            setSchedule((prev) => {
                const updatedSchedule = { ...prev };
                updatedSchedule[day] = [...updatedSchedule[day]];
                const updatedClass = { ...updatedSchedule[day][index], [field]: value };

                if (
                    field === "Start_Time" ||
                    field === "Class_Duration" ||
                    field === "Class_Count"
                ) {
                    updatedClass.End_Time = calculateEndTime(
                        updatedClass.Start_Time || "08:00",
                        updatedClass.Class_Duration || 60,
                        updatedClass.Class_Count || 1
                    );
                }

                updatedSchedule[day][index] = updatedClass;

                for (let i = index + 1; i < updatedSchedule[day].length; i++) {
                    const prevClass = updatedSchedule[day][i - 1];
                    updatedSchedule[day][i] = {
                        ...updatedSchedule[day][i],
                        Start_Time: prevClass.End_Time,
                        End_Time: calculateEndTime(
                            prevClass.End_Time,
                            updatedSchedule[day][i].Class_Duration,
                            updatedSchedule[day][i].Class_Count
                        ),
                    };
                }

                return updatedSchedule;
            });
        },
        [calculateEndTime]
    );

    const handleInstructorChange = useCallback((day: string, index: number, newValue: Instructor | null) => {
        const instructorName = newValue ? newValue.value : "";
        handleClassChange(day, index, "Instructor", instructorName);
    }, [handleClassChange]);

    useEffect(() => {
        const fetchInstructors = async () => {
            const { university, program } = formData;

            if (!university && !program) return;

            try {
                const params = new URLSearchParams();
                if (university) params.append("university", university);
                if (program) params.append("program", program);

                const response = await axios.get(
                    `/api/schedule/teachers?${params.toString()}`
                );

                // Axios already parses the JSON response, so we don't need to call response.json()
                // response.data contains the parsed JSON data
                if (Array.isArray(response.data)) {
                    setInstructors(response.data);
                } else {
                    // If the response is not an array, it might be an error object
                    console.log("Unexpected response format:", response.data);
                    toast.error(response.data.message || "Failed to fetch instructors");
                }
            } catch (error: any) {
                console.error("Error fetching instructors:", error);

                // Handle different error scenarios
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    if (error.response.status === 404) {
                        toast.error("No instructors found for the selected criteria");
                    } else {
                        toast.error(error.response.data.message || "Error fetching instructors");
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    toast.error("No response from server. Please check your connection.");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    toast.error("Error setting up request: " + error.message);
                }
            }
        };

        fetchInstructors();
    }, [formData.university, formData.program]);

    const fetchIDs = useCallback(async () => {
        try {
            const response = await axios.get(`/api/schedule/ids`);
            const allId = response.data.ids.sort();

            setAllIDs(allId);
        } catch (error) {
            console.error("Error fetching IDs:", error);
            toast.error("Error fetching IDs");
        }
    }, []);

    useEffect(() => {
        fetchIDs();
    }, [fetchIDs]);

    useEffect(() => {
        const { program, section, semester, university } = formData;
        if (program && section && semester && university) {
            setFormData((prev) => ({
                ...prev,
                ID: `${university}-${program}-${semester}-${section}`,
            }));
        } else {
            setFormData((prev) => ({ ...prev, ID: "" }));
        }
    }, [formData]);

    useEffect(() => {
        if (formData.selectedID) {
            fetchScheduleByID(formData.selectedID);
        }
    }, [formData.selectedID]);

    const fetchScheduleByID = useCallback(async (id: string) => {
        try {
            const response = await axios.get(`/api/schedule/find/${id}`);
            const {
                semester,
                program,
                section,
                university,
                schedule: fetchedSchedule,
            } = response.data;
            setFormData((prev) => ({
                ...prev,
                semester,
                program,
                section,
                university,
                ID: id,
            }));
            setSchedule(fetchedSchedule);
        } catch (error) {
            console.error("Error fetching schedule:", error);
            toast.error("Error fetching schedule");
        }
    }, []);

    const handleAddClass = useCallback(
        (day: string) => {
            setSchedule((prev) => {
                const existingClasses = prev[day];
                const lastClass = existingClasses[existingClasses.length - 1];
                const startTime = lastClass ? lastClass.End_Time : "08:00";
                const newClass: IClass = {
                    Period: existingClasses.length + 1,
                    Start_Time: startTime!,
                    End_Time: calculateEndTime(startTime, 60, 1),
                    Course_Name: "",
                    Instructor: "",
                    Building: "",
                    Room: "",
                    Group: "All",
                    Class_Duration: 60,
                    Class_Count: 1,
                    Class_type: "Theory",
                };
                return {
                    ...prev,
                    [day]: [...prev[day], newClass],
                };
            });
        },
        [calculateEndTime, schedule]
    );

    const handleRemoveClass = useCallback((day: string, index: number) => {
        setClassToDelete({ day, index });
        setIsModalOpen(true);
    }, []);

    const confirmRemoveClass = useCallback(() => {
        if (classToDelete) {
            const { day, index } = classToDelete;

            setSchedule((prev) => {
                const updatedClasses = prev[day].filter((_: IClass, idx: number) => idx !== index);
                const recalculatedClasses = updatedClasses.map((cls: IClass, idx: number) => ({
                    ...cls,
                    Period: idx + 1,
                }));

                return {
                    ...prev,
                    [day]: recalculatedClasses,
                };
            });

            setIsModalOpen(false);
            setClassToDelete(null);
        }
    }, [classToDelete]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            if (allIDs.includes(formData.ID) && formData.selectedID !== formData.ID) {
                toast.error(
                    "ID already exists in the database, please select another ID"
                );
                return;
            }
            e.preventDefault();
            try {
                const dataToSubmit = {
                    ...formData,
                    schedule: schedule,
                };
                const response = await axios.post(`/api/schedule/add`, dataToSubmit);
                toast.success(response.data.message);
                fetchIDs();
            } catch (error) {
                console.error("There was an error adding the schedule:", error);
                toast.error("There was an error adding the schedule.");
            }
        },
        [formData, schedule, allIDs, fetchIDs]
    );

    const handleDeleteSchedules = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            if (!formData.selectedID) {
                toast.error("Nothing is selected");
                return;
            }
            setIsModalOpen(true);
        },
        [formData.selectedID]
    );

    const uploadSuccess = useCallback((data: any) => {
        if (data === null) return;
        console.log("Upload successful:", data);
        setSchedule(data.schedule);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        try {
            setIsModalOpen(false);
            const response = await axios.delete(
                `/api/schedule/delete/${formData.selectedID}`
            );
            toast.success(response.data.message);

            setFormData({
                ID: "",
                selectedID: "",
                university: "",
                program: "",
                section: "",
                semester: "",
                Name: "",
                Start_Date: "",
                End_Date: "",
            });

            setSchedule({
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: [],
            });

            fetchIDs();
        } catch (error) {
            console.error("There was an error deleting the schedule:", error);
            toast.error("There was an error deleting the schedule.");
        }
    }, [formData.selectedID, fetchIDs]);

    const handleDayChange = useCallback((day: string) => {
        setCurrentDay(day);
    }, []);

    return (
        <Card className="p-8 w-full max-w-full min-h-screen">
            <Toaster
                reverseOrder={false}
                gutter={8}
            />
            <div className="flex flex-col md:flex-row">
                <ScheduleFormHeader
                    formData={formData}
                    setFormData={setFormData}
                    allIDs={allIDs}
                    handleInputChange={handleInputChange as (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: any } }) => void}
                    handleDeleteSchedules={handleDeleteSchedules}
                    handleSubmit={handleSubmit}
                />

                <div className="w-full md:w-3/4">
                    <h2 className="text-xl font-bold mb-4">Class Schedule</h2>
                    <DaySelector
                        schedule={schedule}
                        currentDay={currentDay}
                        handleDayChange={handleDayChange}
                    />

                    <DayClassesContainer
                        currentDay={currentDay}
                        schedule={schedule}
                        handleAddClass={handleAddClass}
                        formData={formData}
                        onUploadSuccess={uploadSuccess}
                        handleRemoveClass={handleRemoveClass}
                        handleClassChange={handleClassChange}
                        handleInstructorChange={handleInstructorChange}
                        instructors={instructors}
                    />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={classToDelete ? confirmRemoveClass : handleConfirmDelete}
                message={
                    classToDelete
                        ? "Are you sure you want to delete this class?"
                        : "Are you sure you want to delete this schedule?"
                }
            />
        </Card>
    );
};

export default React.memo(ScheduleForm);
