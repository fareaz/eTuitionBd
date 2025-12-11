
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/LoadingSpinner";

const isEditableStatus = (status) => {
  const s = String(status || "").toLowerCase();
  return !["approved", "paid", "confirmed"].includes(s);
};

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso || "-";
  }
};

const PAGE_SIZES = [5, 10, 20];

const MyTuitionApplications = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [editOpen, setEditOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [qualifications, setQualifications] = useState("");
  const [experience, setExperience] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { data: rawData, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["my-applications", user?.email, page, limit],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/applications?tutorEmail=${encodeURIComponent(user.email)}&page=${page}&limit=${limit}&sort=createdAt:desc`
      );
      return res.data;
    },
    enabled: !!user?.email,
    keepPreviousData: true,
    staleTime: 1000 * 30,
  });

  const results = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.results)
    ? rawData.results
    : [];

  const total = Array.isArray(rawData) ? results.length : Number(rawData?.total ?? results.length);
  const totalPages = Array.isArray(rawData)
    ? Math.max(1, Math.ceil(results.length / limit))
    : Number(rawData?.totalPages ?? Math.max(1, Math.ceil(total / limit)));

  if (isLoading) return <LoadingSpinner />;

  const openEdit = (app) => {
    if (!isEditableStatus(app.status)) {
      return Swal.fire({
        icon: "info",
        title: "Cannot edit",
        text: "This application is already approved/paid/confirmed and cannot be edited.",
      });
    }
    setEditingApp(app);
    setQualifications(app.tutorQualifications || "");
    setExperience(app.tutorExperience || "");
    setExpectedSalary(app.expectedSalary ?? "");
    setEditOpen(true);
  };

  const closeEdit = () => {
    if (submitting) return;
    setEditOpen(false);
    setEditingApp(null);
  };

  const handleDelete = async (app) => {
    const confirm = await Swal.fire({
      title: "Delete application?",
      text: `Delete application for "${app.subject}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      setDeletingId(app._id);
      await axiosSecure.delete(`/applications/${app._id}`);
      await refetch();
      setDeletingId(null);
      Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false });
    } catch (err) {
      setDeletingId(null);
      console.error("Delete error:", err);
      Swal.fire({ icon: "error", title: "Delete failed", text: err?.response?.data?.message || err.message });
      await refetch();
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingApp) return;

    if (!qualifications.trim() || !experience.trim() || expectedSalary === "" || expectedSalary === null) {
      return Swal.fire({ icon: "warning", title: "Missing fields", text: "Please complete all required fields." });
    }

    const confirm = await Swal.fire({
      title: "Update application?",
      text: `We'll replace your existing application for "${editingApp.subject}". Continue?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
    });
    if (!confirm.isConfirmed) return;

    try {
      setSubmitting(true);

    
      await axiosSecure.delete(`/applications/${editingApp._id}`);

      const postPayload = {
        tuitionId: String(editingApp.tuitionId),
        qualifications: qualifications.trim(),
        experience: experience.trim(),
        expectedSalary: Number(expectedSalary),
      };

      const res = await axiosSecure.post("/applications", postPayload);

      if (res.status === 201 || (res.data && res.data.insertedId)) {
        await refetch();
        setEditOpen(false);
        setEditingApp(null);
        Swal.fire({ icon: "success", title: "Updated", text: "Application updated successfully.", timer: 1400, showConfirmButton: false });
      } else {
        // fallback
        await refetch();
        setEditOpen(false);
        setEditingApp(null);
        Swal.fire({ icon: "success", title: "Updated", timer: 1200, showConfirmButton: false });
      }
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire({ icon: "error", title: "Update failed", text: err?.response?.data?.message || err.message || "Try again." });
      await refetch();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-2xl font-bold">My Tuition <span className="text-primary">Applications</span></h2>
        <div className="text-sm text-gray-500 text-left sm:text-right">
          <div>Total: {total}</div>
          <div className="mt-1">{isFetching ? "Updating..." : `Page ${page} / ${totalPages}`}</div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You have no applications yet.</p>
        </div>
      ) : (
        <>
         
          <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow">
            <table className="table w-full">
              <thead className="bg-gray-100 text-sm text-gray-700">
                <tr>
                  <th className="w-12">#</th>
                  <th>Subject</th>
                  <th className="hidden md:table-cell">Class</th>
                  <th className="hidden lg:table-cell">Location</th>
                  <th>Budget</th>
                  <th className="hidden lg:table-cell">Expected</th>
                  <th>Status</th>
                  <th className="hidden md:table-cell">Applied At</th>
                  <th className="w-40 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {results.map((app, i) => {
                  const editable = isEditableStatus(app.status);
                  return (
                    <tr key={app._id || i}>
                      <td>{(page - 1) * limit + i + 1}</td>
                      <td className="font-medium">{app.subject}</td>
                      <td className="hidden md:table-cell">{app.class}</td>
                      <td className="hidden lg:table-cell">{app.location}</td>
                      <td className="text-green-600 font-semibold">৳{app.budget}</td>
                      <td className="hidden lg:table-cell">৳{app.expectedSalary ?? "—"}</td>
                      <td>
                        <span className={`badge ${editable ? "badge-outline" : "badge-primary"}`}>{String(app.status)}</span>
                      </td>
                      <td className="hidden md:table-cell text-xs text-gray-500">{formatDate(app.createdAt)}</td>
                      <td className="flex gap-2 justify-center">
                        <button
                          onClick={() => openEdit(app)}
                          className={`btn btn-sm ${editable ? "btn-primary" : "btn-disabled"}`}
                          disabled={!editable}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(app)}
                          className={`btn btn-sm btn-error ${!editable ? "opacity-60" : ""}`}
                          disabled={!editable || deletingId === app._id}
                        >
                          {deletingId === app._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

       
          <div className="sm:hidden space-y-3">
            {results.map((app, i) => {
              const editable = isEditableStatus(app.status);
              return (
                <div key={app._id || i} className="p-3 bg-white rounded-lg border shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-md font-semibold truncate">
                          {(page - 1) * limit + i + 1}. {app.subject}
                        </h3>
                        <div className="text-xs">
                          <span className={`badge ${editable ? "badge-outline" : "badge-primary"}`}>{String(app.status)}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mt-1 truncate">{app.class} • {app.location}</div>

                      <div className="mt-2 text-sm space-y-1">
                        <div><strong>Budget:</strong> <span className="text-green-600 font-semibold">৳{app.budget}</span></div>
                        <div><strong>Expected:</strong> ৳{app.expectedSalary ?? "—"}</div>
                        <div className="text-xs text-gray-500">Applied: {formatDate(app.createdAt)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => openEdit(app)}
                      className={`btn btn-sm flex-1 ${editable ? "btn-primary" : "btn-disabled"}`}
                      disabled={!editable}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(app)}
                      className={`btn btn-sm btn-error flex-1 ${!editable ? "opacity-60" : ""}`}
                      disabled={!editable || deletingId === app._id}
                    >
                      {deletingId === app._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

    
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="btn btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</button>
          <div className="text-sm">Page {page} of {totalPages}</div>
          <button className="btn btn-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next ›</button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Per page</label>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="select select-bordered select-sm"
          >
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

     
      {editOpen && editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => { if (!submitting) closeEdit(); }}
            aria-hidden
          ></div>

          <form onSubmit={submitEdit} className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-6 z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Edit Application — {editingApp.subject}</h3>
              <button
                type="button"
                className="text-gray-500"
                onClick={() => { if (!submitting) closeEdit(); }}
                aria-label="Close edit modal"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Qualifications *</label>
                <input value={qualifications} onChange={(e) => setQualifications(e.target.value)} className="w-full px-3 py-2 border rounded" required />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Experience *</label>
                <input value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full px-3 py-2 border rounded" required />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Expected Salary (৳) *</label>
                <input type="number" min="0" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} className="w-full px-3 py-2 border rounded" required />
              </div>

              <div>
                <label className="text-sm text-gray-600">Tuition: <span className="font-medium">{editingApp.subject}</span></label>
                <div className="text-xs text-gray-500">Location: {editingApp.location} • Budget: ৳{editingApp.budget}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
              <button type="button" className="btn btn-ghost" onClick={closeEdit} disabled={submitting}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Updating..." : "Update Application"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyTuitionApplications;
