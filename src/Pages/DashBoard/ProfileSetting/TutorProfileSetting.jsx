
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";

const TutorProfileSetting = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [version, setVersion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const { data: users = [], isLoading } = useQuery({
    queryKey: ["tutor-profile", user?.email, version],
    queryFn: () =>
      axiosSecure
        .get(`/users?searchText=${encodeURIComponent(user.email)}`)
        .then((res) => res.data || []),
    enabled: !!user?.email,
  });

  const profile =
    Array.isArray(users) && users.length
      ? users.find((u) => u.email === user.email) || users[0]
      : null;


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile, reset]);


  const onSubmit = (data) => {
    if (!profile?._id) return;
    setIsSubmitting(true);

    axiosSecure
      .patch(`/users/update/${profile._id}`, {
        name: data.name,
        phone: data.phone,
      })
      .then(() => {
        toast.success("Profile updated!");
        setVersion((v) => v + 1);
      })
      .catch(() => toast.error("Update failed"))
      .finally(() => setIsSubmitting(false));
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-5">Profile <span className="text-primary">Settings</span></h1>

      {/* Read-only info */}
      <div className="mb-6 space-y-2 text-gray-700">
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Role:</strong> {profile?.role}</p>
      </div>

      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className="font-semibold block">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="input input-bordered w-full"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="font-semibold block">Phone</label>
          <input
            {...register("phone", { required: "Phone is required" })}
            className="input input-bordered w-full"
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default TutorProfileSetting;
