import React from "react";
import { useQuery } from "@tanstack/react-query";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import useAxios from "../../../hooks/useAxios";
import LoadingSpinner from "../../../components/LoadingSpinner";

const AdminDashboardHome = () => {
  const axiosSecure = useAxios();

  const fetchCounts = async () => {
    const [usersRes, tutorsRes, tuitionsRes] = await Promise.all([
      axiosSecure.get("/users"),
      axiosSecure.get("/tutors"),
      axiosSecure.get("/tuitions"),
    ]);

    const users = usersRes.data || [];
    const tutors = tutorsRes.data || [];
    const tuitions = tuitionsRes.data || [];

    const studentCount = users.filter(
      (u) => (u.role || "").toLowerCase() === "student"
    ).length;

    const tutorUsers = users.filter(
      (u) => (u.role || "").toLowerCase() === "tutor"
    ).length;

    return {
      students: studentCount,
      tutorUsers,
      tutorPosts: tutors.length,
      tuitionPosts: tuitions.length,
    };
  };

  const { data: counts, isLoading, isError } = useQuery({
    queryKey: ["dashboardCounts"],
    queryFn: fetchCounts,
  });

  const barData = [
    { name: "Students", value: counts?.students || 0 },
    { name: "Tutor Users", value: counts?.tutorUsers || 0 },
    { name: "Tutor Posts", value: counts?.tutorPosts || 0 },
    { name: "Tuition Posts", value: counts?.tuitionPosts || 0 },
  ];

  const pieData = [
    { name: "Students", value: counts?.students || 0 },
    { name: "Tutor Posts", value: counts?.tutorPosts || 0 },
    { name: "Tuition Posts", value: counts?.tuitionPosts || 0 },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mt-10">
      <span className="text-primary">Admin</span> Profile 
      </h1>

      {isLoading && (
        <LoadingSpinner></LoadingSpinner>
      )}

     

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          
          {/* Summary Box */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Students</span>
                <span className="font-bold">{counts.students}</span>
              </div>

              <div className="flex justify-between">
                <span>Tutor Users</span>
                <span className="font-bold">{counts.tutorUsers}</span>
              </div>

              <div className="flex justify-between">
                <span>Tutor Posts</span>
                <span className="font-bold">{counts.tutorPosts}</span>
              </div>

              <div className="flex justify-between">
                <span>Tuition Posts</span>
                <span className="font-bold">{counts.tuitionPosts}</span>
              </div>
            </div>
          </div>

          
          <div className="bg-white shadow rounded-xl p-4 col-span-2">
            <h2 className="text-xl font-semibold mb-4">Bar Chart</h2>

            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

       
          <div className="bg-white shadow rounded-xl p-4 col-span-1 md:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Data Distribution</h2>

            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>

                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminDashboardHome;
