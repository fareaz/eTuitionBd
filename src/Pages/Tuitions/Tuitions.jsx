// src/pages/tuitions/Tuitions.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useRole from '../../hooks/useRole';
import useAuth from '../../hooks/useAuth';
import Swal from "sweetalert2";

const PAGE_SIZES = [5, 10, 20, 50];

const Tuitions = () => {
  const axiosSecure = useAxiosSecure();
  const { role } = useRole();
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  // For Apply modal
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedTuition, setSelectedTuition] = useState(null);
  const [qualifications, setQualifications] = useState('');
  const [experience, setExperience] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchText.trim()), 300);
    return () => clearTimeout(id);
  }, [searchText]);

  const fetchTuitions = async ({ queryKey }) => {
    const [_key, _page, _limit, _search, _sort] = queryKey;
    const res = await axiosSecure.get(
      `/approved-tuitions?page=${_page}&limit=${_limit}&search=${encodeURIComponent(_search)}&sort=${_sort}`
    );
    return res.data;
  };

  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ['approved-tuitions', page, limit, debouncedSearch, sortOption],
    queryFn: fetchTuitions,
    keepPreviousData: true,
    staleTime: 1000 * 30
  });

  const total = data?.total || 0;
  const tuitions = data?.results || [];
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, limit, sortOption]);

  const pagesToShow = useMemo(() => {
    const pages = [];
    const visible = 7;
    let start = Math.max(1, page - Math.floor(visible / 2));
    let end = Math.min(totalPages, start + visible - 1);
    start = Math.max(1, end - visible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  // Open apply modal and prefill read-only fields
  const openApplyModal = (tuition) => {
    if (!user) {
      Swal.fire({ icon: 'warning', title: 'Please login', text: 'You must be logged in as a tutor to apply.' });
      return;
    }
    if (role !== 'tutor') {
      Swal.fire({ icon: 'error', title: 'Only tutors can apply', text: 'Switch to a tutor account to apply.' });
      return;
    }
    setSelectedTuition(tuition);
    // clear form fields or keep previous values as you prefer
    setQualifications('');
    setExperience('');
    setExpectedSalary('');
    setApplyModalOpen(true);
  };

  const closeApplyModal = () => {
    if (submitting) return; // prevent closing while submitting
    setApplyModalOpen(false);
    setSelectedTuition(null);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!selectedTuition) return;

    // Basic validation
    if (!qualifications.trim() || !experience.trim() || !expectedSalary) {
      Swal.fire({ icon: 'warning', title: 'Missing fields', text: 'Please complete all required fields.' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        tuitionId: selectedTuition._id,
        tutorName: user?.displayName || user?.email?.split('@')[0] || 'Tutor',
        tutorEmail: user?.email,
        qualifications: qualifications.trim(),
        experience: experience.trim(),
        expectedSalary: Number(expectedSalary),
      };

      const res = await axiosSecure.post('/applications', payload);

      // handle typical REST responses
      if (res.status === 201 || (res.data && (res.data.insertedId || res.data.success))) {
        Swal.fire({
          icon: 'success',
          title: 'Applied Successfully!',
          text: 'Your application has been submitted.',
          timer: 1500,
          showConfirmButton: false,
        });
        setApplyModalOpen(false);
        setSelectedTuition(null);
        // optional: refresh list or user applications
        if (typeof refetch === 'function') refetch();
      } else {
        // fallback success notification
        Swal.fire({
          icon: 'success',
          title: 'Applied',
          timer: 1200,
          showConfirmButton: false,
        });
        setApplyModalOpen(false);
        setSelectedTuition(null);
        if (typeof refetch === 'function') refetch();
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;
      if (status === 409) {
        Swal.fire({ icon: 'warning', title: 'Already Applied', text: msg || 'You already applied to this tuition.' });
      } else if (status === 401 || status === 403) {
        Swal.fire({ icon: 'error', title: 'Unauthorized', text: 'Please login again.' });
      } else {
        Swal.fire({ icon: 'error', title: 'Apply Failed', text: msg || 'Something went wrong. Try again.' });
      }
      console.error('Apply error', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center mt-6 mb-4">
        All <span className='text-primary'>Tuitions</span>
      </h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex-1 md:mr-4">
          <div className="relative">
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by subject or location"
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 bg-white focus:ring-1 focus:ring-lime-400 focus:border-lime-400"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="select select-bordered"
          >
            <option value="newest">Date: Newest first</option>
            <option value="oldest">Date: Oldest first</option>
            <option value="budget-desc">Budget: High → Low</option>
            <option value="budget-asc">Budget: Low → High</option>
          </select>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="select select-bordered w-28"
          >
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s}/page</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <div>{isFetching ? <span>Updating...</span> : <span>{total} tuitions found</span>}</div>
        <div><span>Page {page} / {totalPages}</span></div>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="w-12">#</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Location</th>
              <th>Budget</th>
              <th>Posted</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tuitions.map((t, idx) => (
              <tr key={t._id || idx} className="hover:bg-gray-50">
                <th>{(page - 1) * limit + idx + 1}</th>
                <td className="font-semibold">{t.subject}</td>
                <td>{t.class}</td>
                <td>{t.location}</td>
                <td className="text-green-600 font-semibold">৳{t.budget}</td>
                <td className="text-xs text-gray-500">{t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A'}</td>
                <td>
                  {role === 'tutor' ? (
                    <button className="btn btn-sm btn-primary" onClick={() => openApplyModal(t)}>Apply</button>
                  ) : (
                    <button className="btn btn-sm btn-disabled" title="Only tutors can apply">For Tutors</button>
                  )}
                </td>
              </tr>
            ))}

            {tuitions.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-gray-500">No tuitions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {tuitions.map((t, idx) => (
          <article key={t._id || idx} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{t.subject}</h3>
                <p className="text-sm text-gray-600">{t.class} • {t.location}</p>
                <p className="mt-2 text-sm text-gray-700">Budget: <span className="font-semibold text-green-600">৳{t.budget}</span></p>
                <p className="mt-1 text-xs text-gray-400">{t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A'}</p>
              </div>

              <div className="flex flex-col gap-2">
                {role === 'tutor' ? (
                  <button className="btn btn-sm btn-primary" onClick={() => openApplyModal(t)}>Apply</button>
                ) : (
                  <button className="btn btn-sm btn-disabled" title="Only tutors can apply">For Tutors</button>
                )}
              </div>
            </div>
          </article>
        ))}

        {tuitions.length === 0 && <div className="text-center text-gray-500 py-6">No tuitions found.</div>}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
        <button className="btn btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</button>
        {pagesToShow.map(pn => (
          <button key={pn} onClick={() => setPage(pn)} className={`btn btn-sm ${pn === page ? 'btn-primary' : ''}`}>{pn}</button>
        ))}
        <button className="btn btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next ›</button>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && selectedTuition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeApplyModal}></div>

          <form
            onSubmit={submitApplication}
            className="relative w-full max-w-xl bg-white rounded-lg shadow-lg p-6 z-10"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Apply for: {selectedTuition.subject}</h3>
              <button type="button" onClick={closeApplyModal} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" readOnly value={user?.displayName || user?.email?.split('@')[0] || ''} className="w-full px-3 py-2 border rounded bg-gray-100" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" readOnly value={user?.email || ''} className="w-full px-3 py-2 border rounded bg-gray-100" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Qualifications <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., BSc in Mathematics, BEd"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Experience <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., 3 years teaching in high school"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Expected Salary (৳) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., 5000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tuition Location</label>
                <input type="text" readOnly value={selectedTuition.location || ''} className="w-full px-3 py-2 border rounded bg-gray-50" />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button type="button" className="btn btn-ghost" onClick={closeApplyModal} disabled={submitting}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Tuitions;
