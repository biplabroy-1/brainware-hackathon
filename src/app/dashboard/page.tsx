"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Users,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// Define types for our data
interface Holiday {
  _id: string;
  name: string;
  date: string;
}

interface Teacher {
  name: string;
  program: string;
  university: string;
}

interface Schedule {
  ID: string;
}

const DashboardPage = () => {
  const { user } = useUser();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schedules, setSchedules] = useState<string[]>([]);
  const [loading, setLoading] = useState({
    holidays: true,
    teachers: true,
    schedules: true,
  });

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch holidays
        const holidaysRes = await axios.get("/api/holidays");
        setHolidays(holidaysRes.data);
        setLoading((prev) => ({ ...prev, holidays: false }));

        // Fetch teachers
        const teachersRes = await axios.get("/api/teachers");
        setTeachers(teachersRes.data);
        setLoading((prev) => ({ ...prev, teachers: false }));

        // Fetch schedules
        const schedulesRes = await axios.get("/api/schedules");
        console.log("got here");

        setSchedules(schedulesRes.data.ids);
        setLoading((prev) => ({ ...prev, schedules: false }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading({
          holidays: false,
          teachers: false,
          schedules: false,
        });
      }
    };

    fetchData();
  }, []);

  // Prepare data for charts
  const prepareHolidaysByMonth = () => {
    const monthsData = Array(12).fill(0);

    holidays.forEach((holiday) => {
      const date = new Date(holiday.date);
      const month = date.getMonth(); // 0-11
      monthsData[month]++;
    });

    return [
      { name: "Jan", count: monthsData[0] },
      { name: "Feb", count: monthsData[1] },
      { name: "Mar", count: monthsData[2] },
      { name: "Apr", count: monthsData[3] },
      { name: "May", count: monthsData[4] },
      { name: "Jun", count: monthsData[5] },
      { name: "Jul", count: monthsData[6] },
      { name: "Aug", count: monthsData[7] },
      { name: "Sep", count: monthsData[8] },
      { name: "Oct", count: monthsData[9] },
      { name: "Nov", count: monthsData[10] },
      { name: "Dec", count: monthsData[11] },
    ];
  };

  const prepareTeachersByProgram = () => {
    const programsCount: Record<string, number> = {};

    return Object.keys(programsCount).map((program) => ({
      name: program,
      value: programsCount[program],
    }));
  };

  // COLORS for pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Analytics Dashboard
      </h1>

      {/* Welcome message with user name if available */}
      {user && (
        <div className="text-lg text-gray-600 mb-8">
          Welcome back, {user.firstName || "User"}! Here&apos;s an overview of
          your data.
        </div>
      )}
      <Link href="/admin">Go to Adminpanel</Link>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Total Holidays</h2>
            <Calendar className="text-indigo-600" />
          </div>
          {loading.holidays ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-800">
                {holidays.length}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Upcoming events and holidays
              </div>
            </>
          )}
        </Card>

        <Card className="p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Total Teachers</h2>
            <Users className="text-blue-600" />
          </div>
          {loading.teachers ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-800">
                {teachers.length}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Faculty members registered
              </div>
            </>
          )}
        </Card>

        <Card className="p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Total Schedules</h2>
            <CalendarIcon className="text-green-600" />
          </div>
          {loading.schedules ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="animate-spin text-green-600" />
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-800">
                {schedules.length}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Active course schedules
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Holidays by Month Chart */}
        <Card className="p-6 shadow-md">
          <h2 className="font-semibold text-lg mb-4">
            Holidays Distribution by Month
          </h2>
          {loading.holidays ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-indigo-600" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepareHolidaysByMonth()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Holidays" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Teachers by Program Chart */}
        <Card className="p-6 shadow-md">
          <h2 className="font-semibold text-lg mb-4">Teachers by Program</h2>
          {loading.teachers ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-600" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={prepareTeachersByProgram()}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {prepareTeachersByProgram().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} teachers`, "Count"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Upcoming Holidays Section */}
      <Card className="p-6 shadow-md mb-8">
        <h2 className="font-semibold text-lg mb-4">Upcoming Holidays</h2>
        {loading.holidays ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-indigo-600" />
          </div>
        ) : holidays.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 rounded-l-lg">Name</th>
                  <th className="px-4 py-2 rounded-r-lg">Date</th>
                </tr>
              </thead>
              <tbody>
                {holidays
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .slice(0, 5)
                  .map((holiday) => (
                    <tr key={holiday._id} className="border-b border-gray-200">
                      <td className="px-4 py-3">{holiday.name}</td>
                      <td className="px-4 py-3">
                        {new Date(holiday.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 py-4 text-center">No holidays found</p>
        )}
      </Card>

      {/* Teacher List Section */}
      <Card className="p-6 shadow-md">
        <h2 className="font-semibold text-lg mb-4">Teachers Directory</h2>
        {loading.teachers ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-blue-600" />
          </div>
        ) : teachers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 rounded-l-lg">Name</th>
                  <th className="px-4 py-2">Program</th>
                  <th className="px-4 py-2 rounded-r-lg">University</th>
                </tr>
              </thead>
              <tbody>
                {teachers.slice(0, 5).map((teacher, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-3">{teacher.name}</td>
                    <td className="px-4 py-3">{teacher.program}</td>
                    <td className="px-4 py-3">{teacher.university}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {teachers.length > 5 && (
              <div className="text-center mt-4">
                <span className="text-sm text-gray-500">
                  Showing 5 of {teachers.length} teachers
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 py-4 text-center">No teachers found</p>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;
