// src/pages/tutor/TuitionsManagement.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../components/LoadingSpinner";
import Swal from "sweetalert2";
import {
  FiEye,
  FiCheck,
  FiX,
  FiTrash2,
  FiDollarSign,
} from "react-icons/fi";

const TuitionsManagement = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [viewItem, setViewItem] = useState(null);

  const { data: applications = [], isLoading, refetch } = useQuery({
    queryKey: ["applications", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/applications?studentEmail=${encodeURIComponent(user.email)}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <LoadingSpinner />;

  // generic status updater: 'approved' | 'rejected' | 'pending'
  const updateStatus = async (appId, newStatus) => {
    const confirm = await Swal.fire({
      title: `${newStatus === "approved" ? "Approve" : "Reject"} application?`,
      text: `Are you sure you want to ${newStatus === "approved" ? "approve" : "reject"} this application?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: newStatus === "approved" ? "Yes, approve" : "Yes, reject",
    });
    if (!confirm.isConfirmed) return;

    try {
      // PATCH /applications/:id  with { status: 'approved' }
      const res = await axiosSecure.patch(`/applications/${appId}`, { status: newStatus });
      const ok = res?.data?.modifiedCount > 0 || res?.data?.acknowledged || res?.data?.success;
      if (ok) {
        await refetch();
        Swal.fire({ icon: "success", title: `Application ${newStatus}`, timer: 1300, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: "Update failed" });
      }
    } catch (err) {
      console.error("Status update error", err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || err?.message || "Server error" });
    }
  };

  const handleDelete = async (appId) => {
    const confirm = await Swal.fire({
      title: "Delete application?",
      text: "This will remove the application permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/applications/${appId}`);
      const ok = res?.data?.deletedCount > 0 || res?.data?.acknowledged || res?.data?.success;
      if (ok) {
        await refetch();
        Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: "Delete failed" });
      }
    } catch (err) {
      console.error("Delete error", err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || err?.message || "Server error" });
    }
  };

  const handlePay = async (appId) => {
    const confirm = await Swal.fire({
      title: "Mark as paid?",
      text: "You can mark this application as paid. (You can change backend later to integrate real payment.)",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, mark paid",
    });
    if (!confirm.isConfirmed) return;

    try {
      // PATCH /applications/:id/pay  or PATCH /applications/:id with { paid: true }
      // I'm using PATCH /applications/:id/pay here:
      const res = await axiosSecure.patch(`/applications/${appId}/pay`, { paid: true });
      const ok = res?.data?.modifiedCount > 0 || res?.data?.acknowledged || res?.data?.success;
      if (ok) {
        await refetch();
        Swal.fire({ icon: "success", title: "Marked as paid", timer: 1200, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: "Operation failed" });
      }
    } catch (err) {
      console.error("Pay error", err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || err?.message || "Server error" });
    }
  };

  const openView = (item) => setViewItem(item);
  const closeView = () => setViewItem(null);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4">Tuitions Management</h2>
      <p className="mb-4">Welcome, {user?.email}! Here are your received applications.</p>

      {applications.length === 0 ? (
        <p className="text-gray-500">No tutor has applied to your tuitions yet.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow bg-white p-3">
            <table className="table w-full">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th>#</th>
                  <th>Tutor</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Applied At</th>
                  <th className="w-48 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((app, idx) => (
                  <tr key={app._id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="font-semibold">{app.tutorName}</div>
                      <div className="text-xs text-gray-500">{app.tutorEmail}</div>
                    </td>
                    <td>{app.subject}</td>
                    <td>{app.class}</td>
                    <td>
  <span
  className={`badge mt-2 ${
    app.status === "requested"
      ? "badge-warning badge-outline"
      : app.status === "paid"
      ? "badge-info badge-outline"
      : app.status === "accepted"
      ? "badge-success"
      : app.status === "completed"
      ? "badge-primary"
      : app.status === "rejected"
      ? "badge-error"
      : "badge-neutral"
  }`}
>
  {app.status}
</span>

                      {app.paid && <div className="text-xs text-blue-600 mt-1">Paid</div>}
                    </td>
                    <td className="text-xs text-gray-500">{new Date(app.createdAt).toLocaleString()}</td>
                    <td className="flex items-center gap-2 justify-center">
                      <button onClick={() => openView(app)} className="btn btn-ghost btn-sm" title="View">
                        <FiEye />
                      </button>

                      <button onClick={() => updateStatus(app._id, "approved")} className="btn btn-ghost btn-sm" title="Accept">
                        <FiCheck />
                      </button>

                      <button onClick={() => updateStatus(app._id, "rejected")} className="btn btn-ghost btn-sm" title="Reject">
                        <FiX />
                      </button>

                      <button onClick={() => handlePay(app._id)} className="btn btn-ghost btn-sm" title="Mark as Paid">
                        <FiDollarSign />
                      </button>

                      <button onClick={() => handleDelete(app._id)} className="btn btn-ghost btn-sm text-red-600" title="Delete">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {applications.map((app) => (
              <article key={app._id} className="border p-4 rounded-lg shadow bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{app.subject}</h3>
                    <p className="text-sm text-gray-600">Class: {app.class} • {app.location}</p>
                    <p className="mt-2"><span className="font-semibold">Tutor:</span> {app.tutorName}</p>
                    <p className="text-xs text-gray-500">{app.tutorEmail}</p>
                    <p className="mt-2"><span className="font-semibold">Budget:</span> <span className="text-green-600">৳{app.budget}</span></p>
                    <p className="mt-1 text-xs text-gray-500">{new Date(app.createdAt).toLocaleString()}</p>
   <span
  className={`badge mt-2 ${
    app.status === "requested"
      ? "badge-warning badge-outline"
      : app.status === "paid"
      ? "badge-info badge-outline"
      : app.status === "accepted"
      ? "badge-success"
      : app.status === "completed"
      ? "badge-primary"
      : app.status === "rejected"
      ? "badge-error"
      : "badge-neutral"
  }`}
>
  {app.status}
</span>

                    {app.paid && <div className="text-xs text-blue-600 mt-1">Paid</div>}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <button onClick={() => openView(app)} className="btn btn-square btn-sm" title="View"><FiEye /></button>
                      <button onClick={() => updateStatus(app._id, "approved")} className="btn btn-square btn-sm" title="Accept"><FiCheck /></button>
                      <button onClick={() => updateStatus(app._id, "rejected")} className="btn btn-square btn-sm" title="Reject"><FiX /></button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handlePay(app._id)} className="btn btn-sm"><FiDollarSign /> Pay</button>
                      <button onClick={() => handleDelete(app._id)} className="btn btn-sm btn-ghost text-red-600"><FiTrash2 /></button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeView}></div>

          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 z-10 overflow-auto max-h-[90vh]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{viewItem.subject} — {viewItem.class}</h3>
                <p className="text-sm text-gray-500">{viewItem.location} • Applied: {new Date(viewItem.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={closeView} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Student Email:</strong> {viewItem.studentEmail}</p>
                <p><strong>Tutor Name:</strong> {viewItem.tutorName}</p>
                <p><strong>Tutor Email:</strong> {viewItem.tutorEmail}</p>
                <p><strong>Qualifications:</strong> {viewItem.tutorQualifications}</p>
                <p><strong>Experience:</strong> {viewItem.tutorExperience}</p>
                <p><strong>Expected Salary:</strong> ৳{viewItem.expectedSalary}</p>
              </div>

              <div className="space-y-2">
                <p><strong>Budget (student):</strong> ৳{viewItem.budget}</p>
                <p><strong>Status:</strong> {viewItem.status}</p>
                <p><strong>Paid:</strong> {viewItem.paid ? "Yes" : "No"}</p>
                <p><strong>Location:</strong> {viewItem.location}</p>
                <p><strong>Additional Info:</strong> {viewItem.note || "—"}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => updateStatus(viewItem._id, "approved")} className="btn btn-success"><FiCheck /> Accept</button>
              <button onClick={() => updateStatus(viewItem._id, "rejected")} className="btn btn-error"><FiX /> Reject</button>
              <button onClick={() => handlePay(viewItem._id)} className="btn btn-primary"><FiDollarSign /> Mark Paid</button>
              <button onClick={() => handleDelete(viewItem._id)} className="btn btn-ghost text-red-600"><FiTrash2 /> Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuitionsManagement;
