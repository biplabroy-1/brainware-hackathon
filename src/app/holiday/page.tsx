"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface Holiday {
    _id: string;
    name: string;
    date: string;
    dates?: string[];
}

interface HolidayToAdd {
    name: string;
    date: string;
}

const Holiday: React.FC = () => {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [name, setName] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [dayCount, setDayCount] = useState<number>(1);

    useEffect(() => {
        fetchHolidays();
    }, []);

    const fetchHolidays = async (): Promise<void> => {
        try {
            const response = await axios.get(`/api/holiday/all`);
            const combinedHolidays = combineHolidays(response.data);
            setHolidays(combinedHolidays);
            console.log(combinedHolidays);
        } catch (error) {
            console.error("Error fetching holidays:", error);
            toast.error("Error fetching holidays. Please try again.");
        }
    };

    const combineHolidays = (holidayList: Holiday[]): Holiday[] => {
        interface HolidayMapItem {
            name: string;
            dates: string[];
            _id: string;
        }

        const holidayMap: Record<string, HolidayMapItem> = {};

        holidayList.forEach((holiday) => {
            if (holidayMap[holiday.name]) {
                // Combine dates if the holiday name already exists
                holidayMap[holiday.name].dates.push(holiday.date);
            } else {
                // Initialize the holiday entry
                holidayMap[holiday.name] = {
                    name: holiday.name,
                    dates: [holiday.date],
                    _id: holiday._id, // Keep the ID of the first holiday
                };
            }
        });

        // Convert the map back to an array
        return Object.values(holidayMap).map((holiday) => {
            const dates = holiday.dates;
            const start = dates[0];
            const end = dates[dates.length - 1];
            const dateString =
                dates.length > 2 ? `${start} - ${end}` : dates.join(", "); // Show range or list of dates

            return {
                ...holiday,
                date: dateString,
            };
        });
    };

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleAddHolidays = async (): Promise<void> => {
        if (!name || !startDate) {
            toast.error("Please enter a holiday name and start date.");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + dayCount - 1);

        try {
            const holidaysToAdd: HolidayToAdd[] = [];
            for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
                holidaysToAdd.push({ name, date: formatDate(new Date(date)) });
            }

            await Promise.all(
                holidaysToAdd.map((holiday) => axios.post(`/api/holiday/add`, holiday))
            );

            toast.success("Holidays added successfully.");
            fetchHolidays();
            setName("");
            setStartDate("");
            setDayCount(1);
        } catch (error) {
            console.error("Error adding holidays:", error);
            toast.error("Failed to add holidays.");
        }
    };

    const handleDeleteHoliday = async (id: string): Promise<void> => {
        if (!id) {
            console.error("No ID provided for deletion.");
            toast.error("No holiday ID specified for deletion.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this holiday?")) {
            try {
                const response = await axios.delete(`/api/holiday/delete/${id}`);
                toast.success(response.data.message);
                fetchHolidays();
            } catch (error: any) {
                console.error("Error deleting holiday:", error);
                toast.error("Failed to delete holiday: " + (error.message || 'Unknown error'));
            }
        }
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
            />
            <h2 className="text-4xl font-semibold mb-4">Holiday Manager</h2>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="Holiday Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-3 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-3 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    value={dayCount}
                    onChange={(e) => setDayCount(Math.max(1, parseInt(e.target.value, 10)))}
                    className="border p-3 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                />
                <button
                    onClick={handleAddHolidays}
                    className="bg-blue-600 text-white p-3 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                >
                    Add Holidays
                </button>
            </div>

            <h2 className="text-3xl font-semibold mt-6 mb-2">All Holidays</h2>
            <ul className="list-disc pl-5">
                {holidays.map((holiday) => (
                    <li
                        key={holiday._id}
                        className="flex justify-between items-center bg-white p-3 rounded-lg shadow mb-2"
                    >
                        <span>
                            {holiday.name} - {holiday.date}
                        </span>
                        <button
                            onClick={() => handleDeleteHoliday(holiday._id)}
                            className="text-red-600 hover:text-red-800 transition duration-200"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Holiday;
