// src/pages/tuition/MyTuition.jsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiEdit } from 'react-icons/fi';
import { FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useForm } from 'react-hook-form';

const MyTuition = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: tuitions = [], refetch, isLoading } = useQuery({
    queryKey: ['my-tuitions', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-tuitions?email=${(user.email)}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // react-hook-form for edit form
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      subject: '',
      class: '',
      location: '',
      budget: ''
    }
  });

  useEffect(() => {
    if (selected) {
      // populate form
      reset({
        subject: selected.subject || '',
        class: selected.class || '',
        location: selected.location || '',
        budget: selected.budget || ''
      });
    } else {
      reset({
        subject: '',
        class: '',
        location: '',
        budget: ''
      });
    }
  }, [selected, reset]);

  const openEditModal = (tuition) => {
    setSelected(tuition);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setSelected(null);
    setIsEditOpen(false);
  };

  const handleTuitionDelete = id => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/tuitions/${id}`)
          .then(res => {
            if (res.data.deletedCount || res.data.acknowledged) {
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "Your tuition post has been deleted.",
                icon: "success",
                timer: 1400,
                showConfirmButton: false
              });
            } else {
              Swal.fire({ icon: 'error', title: 'Delete failed' });
            }
          })
          .catch(err => {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Delete failed', text: err?.message || 'Server error' });
          });
      }
    });
  };

  const formatDate = iso => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso || 'N/A';
    }
  };

  const onEditSubmit = async (data) => {
    if (!selected?._id) return;
    try {
     
      const payload = {
        subject: data.subject,
        class: data.class,
        location: data.location,
        budget: Number(data.budget)
      };

      const res = await axiosSecure.patch(`/tuitions/${selected._id}`, payload);
      if (res.data && (res.data.modifiedCount || res.data.success)) {
        await refetch();
        closeEditModal();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Tuition post updated",
          showConfirmButton: false,
          timer: 1600
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Update failed' });
      }
    } catch (err) {
      console.error('Update error', err);
      Swal.fire({ icon: 'error', title: 'Error', text: err?.message || 'Server error' });
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading your tuitions...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-4">My Tuitions: {tuitions.length}</h2>

      {/* Desktop / Tablet: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Location</th>
              <th>Budget</th>
              <th>Created At</th>
              <th>Status</th>
              <th className="w-56">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tuitions.map((t, idx) => (
              <tr key={t._id}>
                <th>{idx + 1}</th>
                <td className="font-medium">{t.subject}</td>
                <td>{t.class}</td>
                <td>{t.location}</td>
                <td className="text-green-600 font-semibold">৳{t.budget}</td>
                <td className="text-sm text-gray-500">{formatDate(t.createdAt)}</td>
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
                <td className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(t)}
                    className="btn btn-square"
                    title="Edit"
                  >
                    <FiEdit />
                  </button>

                  <button
                    onClick={() => handleTuitionDelete(t._id)}
                    className="btn btn-square"
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}

            {tuitions.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-600">You have no tuition posts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: Cards */}
      <div className="md:hidden space-y-4">
        {tuitions.map((t) => (
          <article key={t._id} className="bg-white border rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{t.subject}</h3>
                <p className="text-sm text-gray-600">{t.class} • {t.location}</p>
                <p className="mt-2 text-sm text-gray-700">Budget: <span className="font-semibold text-green-600">৳{t.budget}</span></p>
                <p className="mt-1 text-xs text-gray-400">{formatDate(t.createdAt)}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(t)} className="btn btn-square" title="Edit">
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleTuitionDelete(t._id)}
                    className="btn btn-square"
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}

        {tuitions.length === 0 && (
          <div className="text-center py-6 text-gray-600">You have no tuition posts yet.</div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeEditModal}></div>

          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Tuition</h3>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4 text-black">
              <div>
                <label className="block text-sm mb-1">Subject</label>
                <input
                  type="text"
                  {...register('subject', { required: 'Subject is required' })}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm mb-1">Class</label>
                <input
                  type="text"
                  {...register('class', { required: 'Class is required' })}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
                {errors.class && <p className="text-xs text-red-500 mt-1">{errors.class.message}</p>}
              </div>

              <div>
                <label className="block text-sm mb-1">Location</label>
                <input
                  type="text"
                  {...register('location', { required: 'Location is required' })}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
              </div>

              <div>
                <label className="block text-sm mb-1">Budget (BDT)</label>
                <input
                  type="number"
                  {...register('budget', {
                    required: 'Budget is required',
                    min: { value: 0, message: 'Budget must be positive' }
                  })}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
                {errors.budget && <p className="text-xs text-red-500 mt-1">{errors.budget.message}</p>}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={closeEditModal} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Tuition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTuition;
