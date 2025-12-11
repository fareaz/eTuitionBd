import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaUserShield, FaTrash } from 'react-icons/fa';
import { FiEdit, FiShieldOff } from 'react-icons/fi';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';


const UsersManagement = () => {
  const axiosSecure = useAxiosSecure();
  
  const [searchText, setSearchText] = useState('');

  const { refetch, data: users = [], isFetching } = useQuery({
    queryKey: ['users', searchText],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?searchText=${(searchText)}`);
      // console.log(res.data)
      return res.data;
    },
    keepPreviousData: true,
  });


  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ email: '', name: '', phone: '', role: '' });
  const [saving, setSaving] = useState(false);

  const openEditModal = (u) => {
    setEditingUser(u);
    setForm({
      email: u.email || '',
      name: u.displayName || u.name || '',
      phone: u.phone || '',
      role: (u.role || '').trim()
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setForm({ email: '', name: '', phone: '', role: '' });
    setSaving(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Make Admin / Remove Admin
  const handleMakeAdmin = async (user) => {
    const roleInfo = { role: 'admin' };
    const confirm = await Swal.fire({
      title: `Make ${user.displayName || user.email} an admin?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, make admin',
    });
    if (!confirm.isConfirmed) return;
    try {
      const res = await axiosSecure.patch(`/users/${user._id}/role`, roleInfo);
      if (res.data.modifiedCount) {
        await refetch();
        Swal.fire({ position: "top-end", icon: "success", title: `${user.displayName || user.email} is now Admin`, showConfirmButton: false, timer: 2000 });
      } else Swal.fire({ icon: 'info', title: 'No changes' });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update role.' });
    }
  };

  const handleRemoveAdmin = async (user) => {
    const roleInfo = { role: 'student' };
    const confirm = await Swal.fire({
      title: `Remove admin from ${user.displayName || user.email}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove admin',
    });
    if (!confirm.isConfirmed) return;
    
    try {
      const res = await axiosSecure.patch(`/users/${user._id}/role`, roleInfo);
      // console.log(res.data)
      if (res.data.modifiedCount) {
        await refetch();
        Swal.fire({ position: "top-end", icon: "success", title: `${user.displayName || user.email} removed from Admin`, showConfirmButton: false, timer: 2000 });
      } else Swal.fire({ icon: 'info', title: 'No changes' });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update role.' });
    }
  };


  const handleDeleteUser = async (user) => {
    const confirm = await Swal.fire({
      title: `Delete ${user.displayName || user.email}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete user"
    });
    if (!confirm.isConfirmed) return;
    try {
      const res = await axiosSecure.delete(`/users/${user._id}`);
      if (res.data.deletedCount) {
        await refetch();
        Swal.fire({ icon: "success", title: "User Deleted Successfully", timer: 1500, showConfirmButton: false });
      } else Swal.fire({ icon: "error", title: "Could not delete user" });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error deleting account" });
    }
  };


  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
   
    setSaving(true);

    const payload = {
      email: form.email?.toLowerCase().trim(),
      name: form.name?.trim(),
      phone: form.phone?.trim(),
      role: form.role?.trim()
    };

  
    if (!payload.email || !payload.name) {
      Swal.fire({ icon: 'warning', title: 'Validation', text: 'Email and name are required.' });
      setSaving(false);
      return;
    }

    try {
      const res = await axiosSecure.patch(`/users/${editingUser._id}`, payload);
      if (res.data.modifiedCount || res.data.acknowledged) {
        await refetch();
        Swal.fire({ icon: 'success', title: 'User updated', timer: 1400, showConfirmButton: false });
        closeEditModal();
      } else {
        Swal.fire({ icon: 'info', title: 'No changes' });
        setSaving(false);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Update failed', text: err?.response?.data?.message || err.message || 'Server error' });
      setSaving(false);
    }
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className='text-2xl md:text-4xl font-semibold'>Manage <span className='text-primary'>Users</span> <span className="text-sm text-gray-500">({users.length})</span></h2>

        <div className="w-full md:w-1/3">
          <label htmlFor="search" className="sr-only">Search users</label>
          <div className="relative">
            <input
              id="search"
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search users by name or email"
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 bg-white focus:ring-1 focus:ring-lime-400 focus:border-lime-400"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
      </div>


      <div className="hidden md:block">
        <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Other Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((u, index) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{u.displayName || u.name || "No name"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{u.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(u.role || "").trim()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {(u.role || "").trim().toLowerCase() === "admin" ? (
                      <button onClick={() => handleRemoveAdmin(u)} className='inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200'>
                        <FiShieldOff />
                        <span className="text-sm hidden lg:inline">Remove Admin</span>
                      </button>
                    ) : (
                      <button onClick={() => handleMakeAdmin(u)} className='inline-flex items-center gap-2 px-3 py-1 rounded-md bg-green-100 text-green-800 hover:bg-green-200'>
                        <FaUserShield />
                        <span className="text-sm hidden lg:inline">Make Admin</span>
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button onClick={() => openEditModal(u)} className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 mr-2">
                      <FiEdit />
                      <span className="text-sm hidden lg:inline">Edit</span>
                    </button>

                    <button onClick={() => handleDeleteUser(u)} className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700">
                      <FaTrash />
                      <span className="text-sm hidden lg:inline">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-500 py-6">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Card/List view */}
      <div className="md:hidden space-y-4">
        {users.length === 0 && !isFetching && (
          <div className="text-center text-gray-500 py-6">No users found</div>
        )}

        {users.map((u, index) => (
          <div key={u._id} className="bg-white shadow-sm rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-gray-400">#{index + 1}</div>
                <div className="mt-1 font-medium text-gray-900">{u.displayName || u.name || 'No name'}</div>
                <div className="text-sm text-gray-600 break-all">{u.email}</div>
                <div className="mt-2 text-xs inline-block px-2 py-1 rounded bg-gray-100 text-gray-700">{(u.role || '').trim()}</div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                {(u.role || '').trim().toLowerCase() === 'admin' ? (
                  <button onClick={() => handleRemoveAdmin(u)} className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-100 text-red-700">
                    <FiShieldOff />
                    <span className="text-xs">Remove</span>
                  </button>
                ) : (
                  <button onClick={() => handleMakeAdmin(u)} className="flex items-center gap-2 px-3 py-1 rounded-md bg-green-100 text-green-700">
                    <FaUserShield />
                    <span className="text-xs">Make Admin</span>
                  </button>
                )}

                <div className="flex gap-2">
                  <button onClick={() => openEditModal(u)} className="flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700">
                    <FiEdit />
                    <span className="text-xs">Edit</span>
                  </button>

                  <button onClick={() => handleDeleteUser(u)} className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-600 text-white">
                    <FaTrash />
                    <span className="text-xs">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal (simple dialog) */}
      {editingUser && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <form onSubmit={handleSaveEdit} className="modal-box w-full max-w-lg">
            <h3 className="font-bold text-lg">Edit User</h3>

            <label className="label mt-3">
              <span className="label-text">Email</span>
            </label>
            <input name="email" value={form.email} onChange={handleFormChange} className="input input-bordered w-full" />

            <label className="label mt-3"><span className="label-text">Name</span></label>
            <input name="name" value={form.name} onChange={handleFormChange} className="input input-bordered w-full" />

            <label className="label mt-3"><span className="label-text">Phone</span></label>
            <input name="phone" value={form.phone} onChange={handleFormChange} className="input input-bordered w-full" />

            <label className="label mt-3"><span className="label-text">Role</span></label>
            <select name="role" value={form.role} onChange={handleFormChange} className="select select-bordered w-full">
              <option value="Student">Student</option>
              <option value="Tutor">Tutor</option>
              <option value="admin">admin</option>
            </select>

            <div className="modal-action">
              <button type="button" className="btn" onClick={closeEditModal}>Cancel</button>
              <button type="submit" className={`btn btn-primary ${saving ? 'loading' : ''}`}>Save</button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default UsersManagement;
