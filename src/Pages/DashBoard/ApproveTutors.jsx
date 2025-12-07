import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaEye } from 'react-icons/fa';

const ApproveTutors = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedTutor, setSelectedTutor] = useState(null);

  const { data: tutors = [], refetch, isLoading } = useQuery({
    queryKey: ['tutors-list'],
    queryFn: async () => {
      const res = await axiosSecure.get('/tutors');
      return res.data;
    },
  });

  const setStatus = async (tutor, newStatus) => {
    const confirm = await Swal.fire({
      title: `${newStatus} ${tutor.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${newStatus}`,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/tutors/${tutor._id}/status`, { status: newStatus });

      if (res.data.modifiedCount || res.data.acknowledged) {
        Swal.fire({ icon: 'success', title: `${newStatus}`, timer: 1300, showConfirmButton: false });
        setSelectedTutor(null);
        refetch();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.message });
    }
  };

  const handleDelete = async (tutor) => {
    const confirm = await Swal.fire({
      title: `Delete ${tutor.name}?`,
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/tutors/${tutor._id}`);
      if (res.data.deletedCount) {
        Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
        setSelectedTutor(null);
        refetch();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  if (isLoading) return <div className="p-6 text-center">Loading tutors...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Approve Tutors ({tutors.length})</h2>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tutors.map((t, i) => (
              <tr key={t._id}>
                <td>{i + 1}</td>
                <td className="font-semibold">{t.name}</td>

                <td>{new Date(t.createdAt).toLocaleString()}</td>

                <td>
  <span
    className={`badge badge-lg px-4 py-3   ${
      t.status === 'Approved'
        ? 'bg-green-100 text-green-700 border border-green-300'
        : t.status === 'Rejected'
        ? 'bg-red-100 text-red-700 border border-red-300'
        : 'bg-gray-100 text-gray-700 border border-gray-300'
    }`}
  >
    {t.status}
  </span>
</td>


                <td>
                  <button
                    className="btn btn-sm btn-info text-white"
                    onClick={() => setSelectedTutor(t)}
                  >
                    <FaEye /> View
                  </button>
                </td>
              </tr>
            ))}

            {tutors.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No tutor applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedTutor && (
        <dialog open className="modal">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-xl mb-3">{selectedTutor.name}</h3>

            <p><strong>Email:</strong> {selectedTutor.email}</p>
            <p><strong>Qualifications:</strong> {selectedTutor.qualifications}</p>
            <p><strong>Experience:</strong> {selectedTutor.experience}</p>
            <p><strong>Expected Salary:</strong> {selectedTutor.expectedSalary}</p>
            <p><strong>Status:</strong> {selectedTutor.status}</p>

            <div className="mt-5 space-x-2">
              <button
                className="btn btn-success"
                onClick={() => setStatus(selectedTutor, 'Approved')}
                disabled={selectedTutor.status === 'Approved'}
              >
                Approve
              </button>

              <button
                className="btn btn-warning"
                onClick={() => setStatus(selectedTutor, 'Rejected')}
                disabled={selectedTutor.status === 'Rejected'}
              >
                Reject
              </button>

              <button className="btn btn-error bg-red-600" onClick={() => handleDelete(selectedTutor)}>
                Delete
              </button>

              <button className="btn ml-2" onClick={() => setSelectedTutor(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ApproveTutors;
