
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../components/LoadingSpinner";
import Swal from "sweetalert2";
import { FiTrash2 } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";


const statusBadge = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "paid") return "badge badge-info";
  if (s === "approved") return "badge badge-success";
  if (s === "requested") return "badge badge-ghost";
  if (s === "rejected") return "badge badge-error";
  if (s === "confirmed") return "badge badge-primary";
  return "badge badge-outline";
};

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso || "-";
  }
};

const TutorOngoingTuitions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [deletingId, setDeletingId] = useState(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["tutor-ongoing-approved", user?.email],
    queryFn: async () => {
      const email = encodeURIComponent(String(user?.email || "").toLowerCase().trim());
      const res = await axiosSecure.get(`/applications/approved-for-me?email=${email}`);
      return res.data;
    },
    enabled: Boolean(user?.email),
    staleTime: 1000 * 30,
  });

  const applications = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
    ? data.results
    : [];

  const total =
    typeof data === "object" && !Array.isArray(data)
      ? Number(data.total ?? applications.length)
      : applications.length;

  const handleDelete = (app) => {
    Swal.fire({
      title: "Delete application?",
      text: `This will remove "${app.subject}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((res) => {
      if (!res.isConfirmed) return;

      setDeletingId(app._id);
      axiosSecure
        .delete(`/applications/${app._id}`)
        .then(() => {
          refetch();
          setDeletingId(null);
          Swal.fire({
            icon: "success",
            title: "Deleted",
            timer: 1200,
            showConfirmButton: false,
          });
        })
        .catch((err) => {
          setDeletingId(null);
          console.error("Delete error:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err?.response?.data?.message || err.message,
          });
        });
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Ongoing <span className="text-primary">Tuitions</span></h2>
          <p className="text-sm text-gray-500">These tuitions are approved by students.</p>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">Total</div>
          <div className="text-lg font-semibold">{total}</div>
          <div className="text-xs text-gray-500 mt-1">{isFetching ? "Updating..." : ""}</div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No ongoing tuitions to show.</p>
        </div>
      ) : (
        <>
          {/* Desktop/table */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto rounded-lg bg-base-100 shadow">
              <table className="min-w-[900px] w-full table table-zebra">
                <thead className="sticky top-0 bg-base-200">
                  <tr>
                    <th className="w-8">#</th>
                    <th>Subject</th>
                    <th className="hidden md:table-cell">Class</th>
                    <th>Location</th>
                    <th className="min-w-[180px]">Student</th>
                    <th className="hidden lg:table-cell">Expected Salary</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th className="hidden md:table-cell">Created</th>
                    <th className="w-36 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app, idx) => (
                    <tr key={app._id ?? idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="font-semibold">{app.subject}</div>
                        <div className="text-xs text-gray-500 md:hidden">{app.class}</div>
                      </td>
                      <td className="hidden md:table-cell text-xs">{app.class}</td>
                      <td className="text-sm">{app.location}</td>
                      <td className="min-w-[180px] break-words text-sm">{app.studentEmail || app.studentName || "—"}</td>
                      <td className="hidden lg:table-cell text-sm">৳{app.expectedSalary ?? "—"}</td>
                      <td className="text-green-600 font-semibold">৳{app.budget ?? "—"}</td>
                      <td>
                        <span className={statusBadge(app.status)}>{app.status}</span>
                      </td>
                      <td className="hidden md:table-cell text-xs text-gray-600">{formatDate(app.createdAt)}</td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {String(app.status).toLowerCase() !== "paid" && (
                            <button
                              onClick={() => handleDelete(app)}
                              className="btn btn-error btn-sm text-white"
                              title="Delete"
                              disabled={deletingId === app._id}
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile */}
          <div className="sm:hidden space-y-3">
            {applications.map((app, idx) => (
              <div key={app._id ?? idx} className="p-3 bg-base-100 rounded-lg border shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-md font-semibold truncate">
                        {idx + 1}. {app.subject}
                      </h3>
                      <div className="text-xs">
                        <span className={statusBadge(app.status)}>{app.status}</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mt-1 truncate">
                      {app.class} • {app.location}
                    </div>

                    <div className="mt-2 text-sm space-y-1">
                      <div>
                        <strong>Student:</strong>{" "}
                        <span className="break-words">{app.studentEmail || app.studentName || "—"}</span>
                      </div>
                      <div>
                        <strong>Budget:</strong>{" "}
                        <span className="font-semibold text-green-600">৳{app.budget ?? "—"}</span>
                      </div>
                      <div className="text-xs text-gray-500">Created: {formatDate(app.createdAt)}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  {String(app.status).toLowerCase() !== "paid" && (
                    <button
                      onClick={() => handleDelete(app)}
                      className="btn btn-error btn-sm text-white"
                      title="Delete"
                      disabled={deletingId === app._id}
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TutorOngoingTuitions;
