import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AiOutlineEye } from "react-icons/ai";
import { FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/LoadingSpinner";

const ApproveTuition = () => {
  const axiosSecure = useAxiosSecure();
  const [selected, setSelected] = useState(null); // selected tuition for modal
  const {
    data: tuitions = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["tuitions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tuitions");
      return res.data;
    },
  });

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso || "N/A";
    }
  };

  const openView = (t) => setSelected(t);
  const closeModal = () => setSelected(null);

  // Reusable status change handler: can set 'Approved' or 'Rejected' etc.
  const handleChangeStatus = async (t, newStatus) => {
    const confirm = await Swal.fire({
      title: `${newStatus === "Approved" ? "Approve" : "Reject"} this tuition?`,
      html: `<strong>${t.subject}</strong><br/>${t.class} • ${t.location}<br/><small>Budget: ৳${t.budget}</small>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `${
        newStatus === "Approved" ? "Yes, Approve" : "Yes, Reject"
      }`,
    });
    if (!confirm.isConfirmed) return;

    try {
      // Call the new status endpoint
      const res = await axiosSecure.patch(`/tuitions/${t._id}/status`, {
        status: newStatus,
      });
      // Some backends return result.modifiedCount, some return custom success.
      const ok =
        res?.data?.modifiedCount ||
        res?.data?.modifiedCount === 1 ||
        res?.data?.acknowledged ||
        res?.data?.success;
      if (ok) {
        Swal.fire({
          icon: "success",
          title: `${newStatus}d`,
          timer: 1200,
          showConfirmButton: false,
        });
        refetch();
        // if modal open, update selected to reflect change (or close)
        if (selected && selected._id === t._id) {
          // optionally refresh modal data or close
          closeModal();
        }
      } else {
        Swal.fire({ icon: "error", title: "Could not change status" });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Server error",
      });
    }
  };

  const handleDelete = async (t) => {
    const confirm = await Swal.fire({
      title: `Delete this tuition?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/tuitions/${t._id}`);
      const ok = res?.data?.deletedCount || res?.data?.acknowledged;
      if (ok) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          timer: 1200,
          showConfirmButton: false,
        });
        refetch();
        closeModal();
      } else {
        Swal.fire({ icon: "error", title: "Delete failed" });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Server error",
      });
    }
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-3xl font-semibold mb-4">Approve <span className='text-primary'>Tuitions</span></h2>

      {tuitions.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          No tuitions found.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Posted By</th>
                  <th>Status</th>
                  <th className="w-52">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tuitions.map((t, i) => (
                  <tr key={t._id}>
                    <td>{i + 1}</td>
                    <td className="font-medium">{t.subject}</td>
                    <td className="text-sm">{t.createdBy || "—"}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          (t.status || "pending").toLowerCase() === "approved"
                            ? "bg-green-100 text-green-800"
                            : (t.status || "pending").toLowerCase() ===
                              "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {t.status || "pending"}
                      </span>
                    </td>
                    <td className="flex gap-2">
                      <button
                        title="View"
                        onClick={() => openView(t)}
                        className="btn btn-ghost btn-sm"
                      >
                        <AiOutlineEye />
                      </button>

                      {/* Approve only if not already Approved */}
                      {String(t.status || "").toLowerCase() !== "approved" && (
                        <button
                          title="Approve"
                          onClick={() => handleChangeStatus(t, "Approved")}
                          className="btn btn-success btn-sm flex items-center gap-1"
                        >
                          <FaCheckCircle /> Approve
                        </button>
                      )}

                      {/* Reject only if not already Rejected */}
                      {String(t.status || "").toLowerCase() !== "rejected" && (
                        <button
                          title="Reject"
                          onClick={() => handleChangeStatus(t, "Rejected")}
                          className="btn btn-warning btn-sm flex items-center gap-1"
                        >
                          <FaTimesCircle /> Reject
                        </button>
                      )}

                      <button
                        title="Delete"
                        onClick={() => handleDelete(t)}
                        className="btn btn-error btn-sm"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {tuitions.map((t) => (
              <article
                key={t._id}
                className="bg-white border rounded-lg shadow-sm p-4"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{t.subject}</h3>
                    <p className="text-sm text-gray-600">
                      {t.class} • {t.location}
                    </p>
                    <p className="mt-2 text-sm">
                      Budget:{" "}
                      <span className="font-semibold text-green-600">
                        ৳{t.budget}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(t.createdAt)}
                    </p>
                    <p className="mt-1 text-xs">
                      Status: <strong>{t.status}</strong>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => openView(t)}
                        className="btn btn-ghost btn-sm w-full sm:w-auto"
                        title="View"
                      >
                        <AiOutlineEye />
                      </button>

                      {String(t.status).toLowerCase() !== "approved" && (
                        <button
                          onClick={() => handleChangeStatus(t, "Approved")}
                          className="btn btn-success btn-sm w-full sm:w-auto"
                          title="Approve"
                        >
                          Approve
                        </button>
                      )}

                      {String(t.status).toLowerCase() !== "rejected" && (
                        <button
                          onClick={() => handleChangeStatus(t, "Rejected")}
                          className="btn btn-warning btn-sm w-full sm:w-auto"
                          title="Reject"
                        >
                          Reject
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(t)}
                        className="btn btn-error btn-sm w-full sm:w-auto"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 btn btn-ghost"
            >
              ✕
            </button>
            <h3 className="text-2xl font-semibold mb-2">{selected.subject}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {selected.class} • {selected.location}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Budget:</strong> ৳{selected.budget}
                </p>
                <p>
                  <strong>Posted By:</strong> {selected.createdBy || "—"}
                </p>
                <p>
                  <strong>Created At:</strong> {formatDate(selected.createdAt)}
                </p>
                {selected.updatedAt && (
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {formatDate(selected.updatedAt)}
                  </p>
                )}
                <p className="mt-2">
                  <strong>Status:</strong> {selected.status || "pending"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Location details / notes can go here.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => handleDelete(selected)}
                className="btn btn-outline "
              >
                <FaTrash />
              </button>
              <button onClick={closeModal} className="btn btn-ghost">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveTuition;
