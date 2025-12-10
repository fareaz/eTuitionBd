// src/pages/tutor/TutorOngoingTuitions.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../components/LoadingSpinner";
import Swal from "sweetalert2";
import { FiTrash2, FiCheck } from "react-icons/fi";

/** Helpers */
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

  const { data: applications = [], isLoading, refetch } = useQuery({
    queryKey: ["tutor-ongoing", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/applications?tutorEmail=${encodeURIComponent(user.email)}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  // DELETE
  const handleDelete = (app) => {
    Swal.fire({
      title: "Delete application?",
      text: `This will remove "${app.subject}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((res) => {
      if (!res.isConfirmed) return;

      axiosSecure
        .delete(`/applications/${app._id}`)
        .then(() => {
          refetch();
          Swal.fire({
            icon: "success",
            title: "Deleted",
            timer: 1200,
            showConfirmButton: false,
          });
        })
        .catch((err) => {
          Swal.fire({ icon: "error", title: "Error", text: err.message });
        });
    });
  };

  // CONFIRM ONLY WHEN paid
  const handleConfirm = (app) => {
    if (String(app.status).toLowerCase() !== "paid") {
      return Swal.fire({
        icon: "info",
        title: "Not Allowed",
        text: "Confirm only after student payment.",
      });
    }

    Swal.fire({
      title: "Confirm tuition?",
      text: `Mark "${app.subject}" as confirmed?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    }).then((res) => {
      if (!res.isConfirmed) return;

      axiosSecure
        .patch(`/applications/${app._id}`, {
          status: "confirmed",
          updatedAt: new Date().toISOString(),
        })
        .then(() => {
          refetch();
          Swal.fire({
            icon: "success",
            title: "Confirmed",
            timer: 1200,
            showConfirmButton: false,
          });
        })
        .catch((err) => {
          Swal.fire({ icon: "error", title: "Error", text: err.message });
        });
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Ongoing Tuitions</h2>
          <p className="text-sm text-gray-500">These tuitions are approved by students or already paid.</p>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">Total</div>
          <div className="text-lg font-semibold">{applications.length}</div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No ongoing tuitions to show.</p>
        </div>
      ) : (
        <>
          {/* ---------- Desktop / Tablet table ---------- */}
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
                    <tr key={app._id}>
                      <td>{idx + 1}</td>

                      <td>
                        <div className="font-semibold">{app.subject}</div>
                        <div className="text-xs text-gray-500 md:hidden">{app.class}</div>
                      </td>

                      <td className="hidden md:table-cell text-xs">{app.class}</td>

                      <td className="text-sm">{app.location}</td>

                      <td className="min-w-[180px] break-words text-sm">{app.studentEmail}</td>

                      <td className="hidden lg:table-cell text-sm">৳{app.expectedSalary ?? "—"}</td>

                      <td className="text-green-600 font-semibold">৳{app.budget}</td>

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
  >
    <FiTrash2 />
  </button>
)}



                          {String(app.status).toLowerCase() === "paid" && (
                            <button
                              onClick={() => handleConfirm(app)}
                              className="btn btn-success btn-sm"
                              title="Confirm"
                            >
                              <FiCheck /> Confirm
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

     
          <div className="sm:hidden space-y-3">
            {applications.map((app, idx) => (
              <div key={app._id} className="p-3 bg-base-100 rounded-lg border shadow">
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

                    <div className="text-sm text-gray-600 mt-1 truncate">{app.class} • {app.location}</div>

                    <div className="mt-2 text-sm space-y-1">
                      <div><strong>Student:</strong> <span className="break-words">{app.studentEmail}</span></div>
                      <div><strong>Budget:</strong> <span className="font-semibold text-green-600">৳{app.budget}</span></div>
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
  >
    <FiTrash2 />
  </button>
)}


                  {String(app.status).toLowerCase() === "paid" && (
                    <button
                      onClick={() => handleConfirm(app)}
                      className="btn btn-success btn-sm flex-1"
                    >
                      <FiCheck /> Confirm
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
