
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const containerVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      when: "beforeChildren",
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
  hover: { y: -6, boxShadow: "0 10px 30px rgba(2,6,23,0.08)", transition: { duration: 0.25 } },
};

const Stat = ({ label, value, hint }) => (
  <motion.div
    variants={cardVariant}
    whileHover="hover"
    className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-2"
  >
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-3xl font-bold text-primary">{value}</div>
    {hint && <div className="text-xs text-gray-400">{hint}</div>}
  </motion.div>
);

const ProfileCard = ({ profile }) => (
  <motion.div
    variants={cardVariant}
    whileHover="hover"
    className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
  >
    <h3 className="text-lg font-semibold mb-3">My Profile</h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
      <div>
        <div className="text-xs text-gray-400">Name</div>
        <div className="font-medium">{profile?.name || "N/A"}</div>
      </div>

      <div>
        <div className="text-xs text-gray-400">Email</div>
        <div className="font-medium break-all">{profile?.email}</div>
      </div>

      <div>
        <div className="text-xs text-gray-400">Phone</div>
        <div className="font-medium">{profile?.phone || "N/A"}</div>
      </div>

      <div>
        <div className="text-xs text-gray-400">Role</div>
        <div className="font-medium">{profile?.role || "N/A"}</div>
      </div>

      <div className="sm:col-span-2">
        <div className="text-xs text-gray-400">Created</div>
        <div className="text-sm text-gray-600">{profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : "N/A"}</div>
      </div>

      <div className="sm:col-span-2">
        <div className="text-xs text-gray-400">Updated</div>
        <div className="text-sm text-gray-600">{profile?.updatedAt ? new Date(profile.updatedAt).toLocaleString() : "N/A"}</div>
      </div>
    </div>
  </motion.div>
);

const StudentDashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

 
  const { data: users = [], isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile", user?.email],
    queryFn: () => axiosSecure.get(`/users?searchText=${(user.email)}`).then(res => res.data || []),
    enabled: !!user?.email,
    keepPreviousData: true,
  });

  const profile = Array.isArray(users) && users.length
    ? users.find(u => String(u.email).toLowerCase().trim() === String(user.email).toLowerCase().trim()) || users[0]
    : null;


  const { data: tuitions = [], isLoading: tuitionsLoading } = useQuery({
    queryKey: ["my-tuitions", user?.email],
    queryFn: () => axiosSecure.get(`/my-tuitions?email=${(user.email)}`).then(res => res.data || []),
    enabled: !!user?.email,
    keepPreviousData: true,
  });

  const loading = profileLoading || tuitionsLoading;

  return (
    <div className="p-6 md:p-10">
      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-3xl font-bold text-center mb-6"
      >
        <span className="text-primary">{profile?.name?.split(" ")[0] || "Student"}</span> Dashboard
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={loading ? "hidden" : "visible"}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <AnimatePresence>
            {!loading && <ProfileCard profile={profile} key={profile?._id || "profile"} />}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {!loading && (
              <>
                <Stat
                  key="posts"
                  label="Your Tuition Posts"
                  value={Array.isArray(tuitions) ? tuitions.length : 0}
                  hint="Number of posts you created"
                />

                <motion.div variants={cardVariant} whileHover="hover" className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                  <div className="text-sm text-gray-500">Account Email</div>
                  <div className="font-medium mt-1 break-all">{profile?.email || user?.email}</div>
                  
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {loading && (
        <LoadingSpinner></LoadingSpinner>
      )}
    </div>
  );
};

export default StudentDashboardHome;
