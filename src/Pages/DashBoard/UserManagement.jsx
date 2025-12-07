// src/pages/admin/UsersManagement.jsx
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { FaUserShield } from 'react-icons/fa';
import { FiShieldOff } from 'react-icons/fi';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const UsersManagement = () => {
  const axiosSecure = useAxiosSecure();
  const [searchText, setSearchText] = useState('');

  const { refetch, data: users = [], isFetching } = useQuery({
    queryKey: ['users', searchText],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?searchText=${(searchText)}`);
      return res.data;
    },

    keepPreviousData: true
  });
   
  //  const handleMakeAdmin = user => {
  //       const roleInfo = { role: 'admin' }
  //       //TODO: must ask for confirmation before proceed
  //       axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
  //           .then(res => {
  //               console.log(res.data);
  //               if (res.data.modifiedCount) {
  //                   refetch();
  //                   Swal.fire({
  //                       position: "top-end",
  //                       icon: "success",
  //                       title: `${user.displayName} marked as an Admin`,
  //                       showConfirmButton: false,
  //                       timer: 2000
  //                   });
  //               }
  //           })
  //   }
  const handleMakeAdmin = async (user) => {
  
    const roleInfo = { role: 'admin' };

    const confirm = await Swal.fire({
      title: `Make ${user.displayName} an admin?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, make admin',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/users/${user._id}/role`, roleInfo);
      if (res.data.modifiedCount) {
        await refetch();
        Swal.fire({ position: "top-end", icon: "success", title: `${user.displayName} marked as an Admin`, showConfirmButton: false, timer: 2000 });
      } else {
        Swal.fire({ icon: 'warning', title: 'No change', text: 'Role not updated.' });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: err?.response?.data?.message || err.message || 'Operation failed' });
    }
  };

  const handleRemoveAdmin = async (user) => {
    const roleInfo = { role: 'student' };

    const confirm = await Swal.fire({
      title: `Remove admin from ${user.displayName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove admin',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/users/${user._id}/role`, roleInfo);
      if (res.data.modifiedCount) {
        await refetch();
        Swal.fire({ position: "top-end", icon: "success", title: `${user.displayName} removed from Admin`, showConfirmButton: false, timer: 2000 });
      } else {
        Swal.fire({ icon: 'warning', title: 'No change', text: 'Role not updated.' });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: err?.response?.data?.message || err.message || 'Operation failed' });
    }
  };

  return (
    <div>
      <h2 className='text-4xl mb-2'>Manage Users: {users.length}</h2>

      <div className="mb-4">
        <label className="input">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="search"
            className="grow"
            placeholder="Search users by name or email"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Admin Action</th>
              <th>Others Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u._id || u.email}>
                <td>{index + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
            
                    <div>
                      <div className="font-bold">{u.displayName || u.name || 'No name'}</div>
                      <div className="text-sm opacity-50">{u.country || ''}</div>
                    </div>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{(u.role || '').trim()}</td>
                <td>
                  { (u.role || '').trim().toLowerCase() === 'admin' ? (
                    <button onClick={() => handleRemoveAdmin(u)} className='btn bg-red-300'>
                      <FiShieldOff />
                    </button>
                  ) : (
                    <button onClick={() => handleMakeAdmin(u)} className='btn bg-green-400'>
                      <FaUserShield />
                    </button>
                  )}
                </td>
                <td>
                  {/* place for other actions, e.g., view or delete */}
                  <button className="btn btn-ghost">Actions</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={6} className="text-center py-6 text-gray-600">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagement;
