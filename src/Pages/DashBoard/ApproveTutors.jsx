
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaEye } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

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
        Swal.fire({ icon: 'success', title: `${newStatus}`, timer: 1100, showConfirmButton: false });
        setSelectedTutor(null);
        refetch();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err?.message || err?.response?.data?.message || '' });
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
      if (res.data.deletedCount || res.data.acknowledged) {
        Swal.fire({ icon: 'success', title: 'Deleted', timer: 1000, showConfirmButton: false });
        setSelectedTutor(null);
        refetch();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err?.message || '' });
    }
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Approve <span className='text-primary'>Tutors</span> ({tutors.length})</h2>
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-md">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="w-12">#</th>
              <th>Name</th>
              <th>Created At</th>
              <th>Status</th>
              <th className="w-32 text-center">Approve</th>
              <th className="w-32 text-center">Reject</th>
              <th className="w-32 text-center">View</th>
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
                    className={`badge badge-lg px-4 py-2 ${
                      t.status === 'Approved'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : t.status === 'Rejected'
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    {t.status || 'Pending'}
                  </span>
                </td>

                <td className="text-center">
                  <button
                    className="btn btn-sm btn-success text-white w-full"
                    disabled={t.status === 'Approved'}
                    onClick={() => setStatus(t, 'Approved')}
                  >
                    Approve
                  </button>
                </td>

                <td className="text-center">
                  <button
                    className="btn btn-sm btn-warning w-full"
                    disabled={t.status === 'Rejected'}
                    onClick={() => setStatus(t, 'Rejected')}
                  >
                    Reject
                  </button>
                </td>

                <td className="text-center">
                  <button
                    className="btn btn-sm btn-info text-white w-full"
                    onClick={() => setSelectedTutor(t)}
                  >
                    <FaEye className="mr-2" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-4">
        {tutors.map((t, ) => (
          <div key={t._id} className="card bg-base-100 shadow-sm border p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{t.name}</div>
                <div className="text-sm text-gray-500">{new Date(t.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    t.status === 'Approved'
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : t.status === 'Rejected'
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  {t.status || 'Pending'}
                </span>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                className="btn btn-sm btn-success flex-1"
                disabled={t.status === 'Approved'}
                onClick={() => setStatus(t, 'Approved')}
              >
                Approve
              </button>

              <button
                className="btn btn-sm btn-warning flex-1"
                disabled={t.status === 'Rejected'}
                onClick={() => setStatus(t, 'Rejected')}
              >
                Reject
              </button>

              <button
                className="btn btn-sm btn-info text-white"
                onClick={() => setSelectedTutor(t)}
              >
                <FaEye />
              </button>
            </div>
          </div>
        ))}

        {tutors.length === 0 && (
          <div className="text-center p-6 text-gray-500">No tutor applications found.</div>
        )}
      </div>

      {/* Modal — responsive: bottom on mobile, middle on larger */}
      {selectedTutor && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box w-full max-w-lg">
            <h3 className="font-bold text-xl mb-2">{selectedTutor.name}</h3>

            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {selectedTutor.email}</p>
              <p><strong>Qualifications:</strong> {selectedTutor.qualifications}</p>
              <p><strong>Experience:</strong> {selectedTutor.experience}</p>
              <p><strong>Expected Salary:</strong> {selectedTutor.expectedSalary}</p>
              <p><strong>Status:</strong> {selectedTutor.status}</p>
            </div>

            <div className="modal-action flex flex-wrap gap-2">
            

              <button className="btn btn-error" onClick={() => handleDelete(selectedTutor)}>
                Delete
              </button>

              <button className="btn" onClick={() => setSelectedTutor(null)}>Close</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ApproveTutors;
