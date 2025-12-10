// src/pages/tutor/MyApplications.jsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiEdit } from 'react-icons/fi';
import { FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useForm } from 'react-hook-form';

const MyApplications = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: applications = [], refetch, isLoading } = useQuery({
    queryKey: ['my-applications', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-tutors?email=${(user.email)}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      qualifications: '',
      experience: '',
      expectedSalary: ''
    }
  });

  useEffect(() => {
    if (selected) {
      reset({
        name: selected.name || '',
        qualifications: selected.qualifications || '',
        experience: selected.experience || '',
        expectedSalary: selected.expectedSalary || ''
      });
    } else {
      reset({
        name: '',
        qualifications: '',
        experience: '',
        expectedSalary: ''
      });
    }
  }, [selected, reset]);

  const openEditModal = (app) => {
    setSelected(app);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setSelected(null);
    setIsEditOpen(false);
  };

  const handleDelete = id => {
    Swal.fire({
      title: "Are you sure?",
      text: "This application will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/tutors/${id}`)
          .then(res => {
            // accept different server shapes: { deletedCount: 1 } or { acknowledged:true }
            if (res.data?.deletedCount > 0 || res.data?.acknowledged || res.data?.success) {
              refetch();
              Swal.fire({ icon: 'success', title: 'Deleted', timer: 1400, showConfirmButton: false });
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
        name: data.name,
        qualifications: data.qualifications,
        experience: data.experience,
        expectedSalary: String(data.expectedSalary)
      };
      const res = await axiosSecure.patch(`/tutors/${selected._id}`, payload);
      if (res.data && (res.data.modifiedCount || res.data.success || res.data.updatedCount)) {
        await refetch();
        closeEditModal();
        Swal.fire({ position: 'top-end', icon: 'success', title: 'Application updated', showConfirmButton: false, timer: 1400 });
      } else {
        Swal.fire({ icon: 'error', title: 'Update failed' });
      }
    } catch (err) {
      console.error('Update error', err);
      Swal.fire({ icon: 'error', title: 'Error', text: err?.message || 'Server error' });
    }
  };

  if (isLoading) return <div className="p-6 text-center">Loading your applications...</div>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-4">My Applications: {applications.length}</h2>

      {/* Desktop / Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>Name</th>
              <th>Qualifications</th>
              <th>Experience</th>
              <th>Expected Salary</th>
              <th>Created At</th>
              <th>Status</th>
              <th className="w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a, idx) => (
              <tr key={a._id}>
                <th>{idx + 1}</th>
                <td className="font-medium">{a.name}</td>
                <td>{a.qualifications}</td>
                <td>{a.experience}</td>
                <td className="text-green-600 font-semibold">৳{a.expectedSalary}</td>
                <td className="text-sm text-gray-500">{formatDate(a.createdAt)}</td>
                <td>
                  <span className={`badge px-3 py-1 ${
                    a.status === 'Approved' ? 'bg-green-100 text-green-700 border border-green-300'
                    : a.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}>{a.status || 'Pending'}</span>
                </td>
                <td className="flex items-center gap-2">
                  <button onClick={() => openEditModal(a)} className="btn btn-square" title="Edit">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(a._id)} className="btn btn-square" title="Delete">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}

            {applications.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-600">You have no applications yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {applications.map(a => (
          <article key={a._id} className="bg-white border rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{a.name}</h3>
                <p className="text-sm text-gray-600">{a.qualifications}</p>
                <p className="mt-1 text-sm text-gray-700">{a.experience}</p>
                <p className="mt-2 text-sm">Expected Salary: <span className="font-semibold text-green-600">৳{a.expectedSalary}</span></p>
                <p className="mt-1 text-xs text-gray-400">{formatDate(a.createdAt)}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(a)} className="btn btn-square" title="Edit"><FiEdit /></button>
                  <button onClick={() => handleDelete(a._id)} className="btn btn-square" title="Delete"><FaTrashAlt /></button>
                </div>
              </div>
            </div>
          </article>
        ))}

        {applications.length === 0 && (
          <div className="text-center py-6 text-gray-600">You have no applications yet.</div>
        )}
      </div>

      {/* Edit modal */}
      {isEditOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeEditModal}></div>

          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Application</h3>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4 text-black">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input type="text" {...register('name', { required: 'Name is required' })} className="w-full px-3 py-2 border rounded-md bg-gray-100" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm mb-1">Qualifications</label>
                <input type="text" {...register('qualifications', { required: 'Qualifications required' })} className="w-full px-3 py-2 border rounded-md bg-gray-100" />
                {errors.qualifications && <p className="text-xs text-red-500 mt-1">{errors.qualifications.message}</p>}
              </div>

              <div>
                <label className="block text-sm mb-1">Experience</label>
                <input type="text" {...register('experience', { required: 'Experience required' })} className="w-full px-3 py-2 border rounded-md bg-gray-100" />
                {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience.message}</p>}
              </div>

              <div>
                <label className="block text-sm mb-1">Expected Salary (BDT)</label>
                <input type="number" {...register('expectedSalary', { required: 'Expected salary required', min: { value: 0, message: 'Must be positive' } })} className="w-full px-3 py-2 border rounded-md bg-gray-100" />
                {errors.expectedSalary && <p className="text-xs text-red-500 mt-1">{errors.expectedSalary.message}</p>}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={closeEditModal} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update Application'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
