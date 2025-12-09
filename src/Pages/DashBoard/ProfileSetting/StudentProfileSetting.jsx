
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";

const StudentProfileSetting = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [version, setVersion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: users = [], isLoading} = useQuery({
    queryKey: ["user-profile", user?.email, version],
    queryFn: () =>
      axiosSecure
        .get(`/users?searchText=${(user.email)}`)
        .then((res) => res.data || []),
    enabled: !!user?.email,
    
  });


  const profile =
    Array.isArray(users) && users.length
      ? users.find(
          (u) =>
            String(u.email).toLowerCase().trim() ===
            String(user.email).toLowerCase().trim()
        ) || users[0]
      : null;


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
      });
    } else {
      reset({
        name: "",
        phone: "",
      });
    }
  }, [profile, reset]);

 
  const onSubmit = (data) => {
    if (!profile?._id) {
      toast.error("Profile not found");
      return;
    }

    setIsSubmitting(true);

    axiosSecure
      .patch(`/users/update/${profile._id}`, {
        name: data.name,
        phone: data.phone,
      })
      .then((res) => {
        
        const ok =
          (res?.data?.modifiedCount && res.data.modifiedCount > 0) ||
          res?.data?.acknowledged ||
          res?.status === 200 ||
          res?.data?.matchedCount;

        if (ok) {
          toast.success("Profile updated successfully");
          setVersion((v) => v + 1);
        } else {
          toast.error("Update returned unexpected response");
        }
      })
      .catch((err) => {
        console.error("Profile update error:", err);
        toast.error(err?.response?.data?.message || err?.message || "Update failed");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (isLoading) return 
<LoadingSpinner />;
  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-4 text-center">Student Profile Settings</h1>

  
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-2">
         
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="text"
              readOnly
              value={profile.email}
              className="w-full input input-bordered bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Read-only Role */}
          <div>
            <label className="block text-sm text-gray-600">Role</label>
            <input
              type="text"
              readOnly
              value={profile.role || "Student"}
              className="w-full input input-bordered bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Editable: Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name too short" },
              })}
              className="w-full input input-bordered"
              placeholder="Your full name"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Editable: Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              {...register("phone", {
                required: "Phone is required",
                minLength: { value: 7, message: "Enter a valid phone" },
              })}
              className="w-full input input-bordered"
              placeholder="01XXXXXXXXX"
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                reset({
                  name: profile.name || "",
                  phone: profile.phone || "",
                });
              }}
            >
              Reset
            </button>
          </div>
        </form>
      
    </div>
  );
};

export default StudentProfileSetting;
