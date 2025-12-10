// src/pages/tuition/TuitionsManagement.jsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../components/LoadingSpinner";
import Swal from "sweetalert2";
import { FiEye, FiCheck, FiX, FiTrash2, FiDollarSign } from "react-icons/fi";

const TuitionsManagement = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [viewItem, setViewItem] = useState(null);

  const { data: applications = [], isLoading, refetch } = useQuery({
    queryKey: ["applications", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/applications?studentEmail=${(user.email)}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Close modal if currently viewed item becomes rejected/removed
  useEffect(() => {
    if (!viewItem) return;
    const stillExists = applications.find((a) => String(a._id) === String(viewItem._id));
    if (!stillExists || stillExists.status === "rejected") {
      setViewItem(null);
    }
  }, [applications, viewItem]);

  if (isLoading) return <LoadingSpinner />;

  // Filter out rejected statuses (client-side)
  const visibleApplications = Array.isArray(applications)
    ? applications.filter((a) => String(a.status).toLowerCase() !== "rejected")
    : [];

  const openView = (item) => setViewItem(item);
  const closeView = () => setViewItem(null);

  // APPROVE (Accept) - sets status to 'approved'
  const handleApprove = async (application) => {
    const confirm = await Swal.fire({
      title: "Approve tutor application?",
      text: `Approve ${application.tutorName} for "${application.subject}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/applications/${application._id}`, { status: "approved" });
      const ok =
        (res?.data && (res.data.modifiedCount > 0 || res.data.acknowledged || res.data.success)) ||
        Boolean(res?.data);
      if (ok) {
        await refetch();
        Swal.fire({ icon: "success", title: "Approved", timer: 1200, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: "Approve failed" });
      }
    } catch (err) {
      console.error("Approve error", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || err?.message || "Server error",
      });
    }
  };

  // REJECT - sets status to 'rejected'
  const handleReject = async (application) => {
    const confirm = await Swal.fire({
      title: "Reject tutor application?",
      text: `Reject ${application.tutorName} for "${application.subject}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/applications/${application._id}`, { status: "rejected" });
      const ok =
        (res?.data && (res.data.modifiedCount > 0 || res.data.acknowledged || res.data.success)) ||
        Boolean(res?.data);
      if (ok) {
        await refetch();
        // view modal will auto-close via useEffect if it was the same item
        Swal.fire({ icon: "success", title: "Rejected", timer: 1200, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: "Reject failed" });
      }
    } catch (err) {
      console.error("Reject error", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || err?.message || "Server error",
      });
    }
  };

 
const handlePay = async (application) => {
    console.log("Proceed to payment for application:", application);

    const confirm = await Swal.fire({
      title: "Proceed to payment?",
      text: `Pay for ${application._id} (${application.class}) — ৳${application.budget}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Pay now",
    });
    if (!confirm.isConfirmed) return;
    const paymentInfo = {
            cost: application.budget,
            paymentId: application._id,
            studentEmail: application.studentEmail,
            tutorEmail: application.tutorEmail
        }

        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);

        console.log(res.data);
        
        window.location.href = res.data.url;
    }


  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4">Tuitions Management</h2>
      <p className="mb-4">Welcome, {user?.email}! Here are your received applications.</p>

      {visibleApplications.length === 0 ? (
        <p className="text-gray-500">No tutor applications to show.</p>
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
                  <th className="w-56 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleApplications.map((app, idx) => (
                  <tr key={app._id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="font-semibold">{app.tutorName}</div>
                      <div className="text-xs text-gray-500">{app.tutorEmail}</div>
                      <div className="text-xs text-gray-400">{app.tutorQualifications} • {app.tutorExperience}</div>
                    </td>
                    <td>{app.subject}</td>
                    <td>{app.class}</td>
                    <td>
                      <span
                        className={`badge mt-2 ${
                          app.status === "pending"
                            ? "badge-warning badge-outline"
                            : app.status === "paid"
                            ? "badge-info badge-outline"
                            : app.status === "approved"
                            ? "badge-success"
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

                      <button onClick={() => handleApprove(app)} className="btn btn-ghost btn-sm" title="Accept">
                        <FiCheck />
                      </button>

                      <button onClick={() => handleReject(app)} className="btn btn-ghost btn-sm" title="Reject">
                        <FiX />
                      </button>

                      {app.status === "paid" ? (
                        <span className="text-green-700 text-sm">Paid</span>
                      ) : (
                        <button onClick={() => handlePay(app)} className="btn btn-ghost btn-sm" title="Pay">
                          <FiDollarSign />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {visibleApplications.map((app) => (
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
                        app.status === "pending"
                          ? "badge-warning badge-outline"
                          : app.status === "paid"
                          ? "badge-info badge-outline"
                          : app.status === "approved"
                          ? "badge-success"
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
                      <button onClick={() => handleApprove(app)} className="btn btn-square btn-sm" title="Accept"><FiCheck /></button>
                      <button onClick={() => handleReject(app)} className="btn btn-square btn-sm" title="Reject"><FiX /></button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handlePay(app)} className="btn btn-sm"><FiDollarSign /> Pay</button>
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
              <button onClick={() => handleApprove(viewItem)} className="btn btn-success"><FiCheck /> Accept</button>
              <button onClick={() => handleReject(viewItem)} className="btn btn-error"><FiX /> Reject</button>
              <button onClick={() => handlePay(viewItem)} className="btn btn-primary"><FiDollarSign /> Mark Paid</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuitionsManagement;
