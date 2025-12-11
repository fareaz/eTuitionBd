
import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import LoadingSpinner from "../../../components/LoadingSpinner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.10, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.4, ease: "easeOut" } 
  },
  hover: {
    y: -6,
    scale: 1.02,
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    transition: { duration: 0.25 }
  }
};

const TutorDashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();


  const { data: users = [], isLoading: profileLoading } = useQuery({
    queryKey: ["tutor-profile", user?.email],
    queryFn: () =>
      axiosSecure
        .get(`/users?searchText=${(user.email)}`)
        .then((res) => res.data || []),
    enabled: !!user?.email,
  });

  const profile =
    Array.isArray(users) && users.length
      ? users.find((u) => u.email === user.email) || users[0]
      : null;

  // 2) Fetch tutor applications
  const { data: myApps = [], isLoading: appLoading } = useQuery({
    queryKey: ["my-applications", user?.email],
    queryFn: () =>
      axiosSecure
        .get(`/my-tutors?email=${(user.email)}`)
        .then((res) => res.data || []),
    enabled: !!user?.email,
  });

  const loading = profileLoading || appLoading;

  const formatDate = (d) => (d ? new Date(d).toLocaleString() : "N/A");

  if (loading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="p-6 md:p-10">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-3xl font-bold text-center mb-10"
      > <span className="text-primary">
        {profile?.name?.split(" ")[0] || "Tutor"} </span>Profile
      </motion.h1>

      {/* Animated container */}
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Card */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">My Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <p><strong>Name:</strong> {profile?.name}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Phone:</strong> {profile?.phone || "N/A"}</p>
            <p><strong>Role:</strong> {profile?.role}</p>
            <p><strong>Created:</strong> {formatDate(profile?.createdAt)}</p>
            <p><strong>Updated:</strong> {formatDate(profile?.updatedAt)}</p>
          </div>
        </motion.div>

        {/* Applications Card */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center"
        >
          <h3 className="text-lg font-semibold">My Applications</h3>
          <p className="text-4xl font-bold text-primary mt-2">
            {myApps.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total tuition applications</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TutorDashboardHome;
