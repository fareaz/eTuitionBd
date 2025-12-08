// src/pages/Tuitions.jsx
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import LoadingSpinner from '../../components/LoadingSpinner';
import useRole from '../../hooks/useRole';
import toast from 'react-hot-toast';

const Tuitions = () => {
  const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useRole();

  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('newest'); 

  const { data: tuitions = [], isLoading, isError, error } = useQuery({
    queryKey: ['approved-tuitions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/approved-tuitions');
      return res.data;
    },
  });

  const handleApply = (tuition) => {
    toast.success(`Applied to tuition: ${tuition.subject}`);
  };

  // combine search + sort (client-side)
  const filteredSorted = useMemo(() => {
    if (!Array.isArray(tuitions)) return [];

    const q = String(searchText || '').trim().toLowerCase();

   
    let filtered = q
      ? tuitions.filter(t => {
          const subj = String(t.subject || '').toLowerCase();
          const loc = String(t.location || '').toLowerCase();
          return subj.includes(q) || loc.includes(q);
        })
      : [...tuitions];

  
    filtered.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortOption === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortOption === 'budget-asc') {
        return (Number(a.budget) || 0) - (Number(b.budget) || 0);
      }
      if (sortOption === 'budget-desc') {
        return (Number(b.budget) || 0) - (Number(a.budget) || 0);
      }
      return 0;
    });

    return filtered;
  }, [tuitions, searchText, sortOption]);


  if (isLoading || roleLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <p className="text-center mt-20 text-xl text-red-500">
        Failed to load tuitions: {error?.message}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center mt-6 mb-4">
        All Tuitions ({filteredSorted.length})
      </h1>

     
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-6 ">
        <div className="w-full md:w-1/2">
          <label className="sr-only">Search tuitions</label>
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

        <div className="w-full md:w-1/3 justify-end flex items-center gap-3 ">
          <label htmlFor="sort" className="text-sm text-gray-600 hidden md:block">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="select select-bordered w-full md:w-auto"
          >
            <option value="newest">Date: Newest first</option>
            <option value="oldest">Date: Oldest first</option>
            <option value="budget-desc">Budget: High → Low</option>
            <option value="budget-asc">Budget: Low → High</option>
          </select>
        </div>
      </div>

      {filteredSorted.length === 0 ? (
        <p className="text-center text-gray-500">No tuitions found for your search.</p>
      ) : (
        <>
          {/* Desktop / Tablet: table (md+) */}
          <div className="hidden md:block overflow-x-auto rounded-xl shadow-lg bg-white">
            <table className="table w-full">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="w-12">#</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Location</th>
                  <th>Budget (BDT)</th>
                  <th>Posted</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredSorted.map((t, index) => (
                  <tr key={t._id || index} className="hover:bg-gray-50">
                    <th className="align-top">{index + 1}</th>
                    <td className="font-semibold align-top">{t.subject}</td>
                    <td className="align-top">{t.class}</td>
                    <td className="align-top">{t.location}</td>
                    <td className="font-medium text-green-600 align-top">৳{t.budget}</td>
                    <td className="text-xs text-gray-500 align-top">
                      {t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="align-top">
                      {role === 'tutor' ? (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleApply(t)}
                        >
                          Apply
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-disabled"
                          onClick={() => handleApply(t)}
                          title="Only tutors can apply"
                        >
                          {role ? 'Apply (Tutors only)' : 'Apply (for Tutor)'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden space-y-4">
            {filteredSorted.map((t, index) => (
              <article
                key={t._id || index}
                className="bg-white rounded-lg shadow-sm border p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{t.subject}</h3>
                    <p className="text-sm text-gray-600">{t.class}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-green-600 font-semibold">৳{t.budget}</div>
                    <div className="text-xs text-gray-400">#{index + 1}</div>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-700">
                  <p><strong>Location:</strong> {t.location}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  {role === 'tutor' ? (
                    <button className="btn btn-sm btn-primary" onClick={() => handleApply(t)}>Apply</button>
                  ) : (
                    <button className="btn btn-sm btn-disabled" onClick={() => handleApply(t)} title="Only tutors can apply">
                      {role ? 'Apply (Tutors only)' : 'Loading...'}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Tuitions;
