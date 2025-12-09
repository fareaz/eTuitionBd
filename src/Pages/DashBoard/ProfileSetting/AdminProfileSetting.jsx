// src/pages/admin/AdminProfileSetting.jsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { LoaderIcon, toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const AdminProfileSetting = () => {
 const axiosSecure = useAxiosSecure();
  const [version, setVersion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  const { data: admin, isLoading } = useQuery({
    queryKey: ["adminProfile", version],
    queryFn: () =>
      axiosSecure.get("/users/admin").then((res) => res.data),
  });

 
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      phone: "",
    },
  });


  useEffect(() => {
    if (admin) {
      reset({
        name: admin.name || "",
        phone: admin.phone || "",
      });
    }
  }, [admin, reset]);

 
  const onSubmit = (data) => {
  

    setIsSubmitting(true);

    axiosSecure
      .patch(`/users/${admin._id}`, {
        name: data.name,
        phone: data.phone,
      })
      .then((res) => {
        const ok =
          res?.data?.modifiedCount ||
          res?.data?.acknowledged ||
          res?.data?.matchedCount ||
          res?.status === 200;

        if (ok) {
          toast.success("Profile updated!");
          setVersion((v) => v + 1);
        } else {
          toast.error("Unexpected update response");
        }
      })
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error(err?.response?.data?.message || "Update failed");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Profile <span className="text-primary">setting</span></h1>

      {/* Read-only info */}
      <div className="space-y-2 mb-6">
        <p><strong>Email:</strong> {admin?.email}</p>
        <p><strong>Role:</strong> {admin?.role}</p>
        <p><strong>Created At:</strong> {new Date(admin?.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(admin?.updatedAt).toLocaleString()}</p>
      </div>

      {/* Editable form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className="font-semibold block mb-1">Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="font-semibold block mb-1">Phone</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("phone", { required: "Phone is required" })}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default AdminProfileSetting;
