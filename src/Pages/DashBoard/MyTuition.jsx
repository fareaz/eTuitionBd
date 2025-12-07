// src/pages/tuition/MyTuition.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { FiEdit } from 'react-icons/fi';
import { FaMagnifyingGlass, FaTrashCan } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const MyTuition = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: tuitions = [], refetch } = useQuery({
    queryKey: ['my-tuitions', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-tuitions?email=${encodeURIComponent(user.email)}`);
      return res.data;
    },
    enabled: !!user?.email
  });

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
      return iso;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Tuitions: {tuitions.length}</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th></th>
              <th>Subject</th>
              <th>Class</th>
              <th>Location</th>
              <th>Budget</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tuitions.map((t, idx) => (
              <tr key={t._id}>
                <th>{idx + 1}</th>
                <td>{t.subject}</td>
                <td>{t.class}</td>
                <td>{t.location}</td>
                <td>{t.budget}</td>
                <td>{formatDate(t.createdAt)}</td>
                <td className="flex items-center gap-2">
                  <Link to={`/tuition/${t._id}`} className="btn btn-square hover:bg-primary" title="View">
                    <FaMagnifyingGlass />
                  </Link>
                  <Link to={`/tuition-edit/${t._id}`} className="btn btn-square hover:bg-primary" title="Edit">
                    <FiEdit />
                  </Link>
                  <button
                    onClick={() => handleTuitionDelete(t._id)}
                    className="btn btn-square hover:bg-primary"
                    title="Delete"
                  >
                    <FaTrashCan />
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
    </div>
  );
};

export default MyTuition;
