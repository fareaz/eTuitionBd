
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useRole from '../../hooks/useRole';
import Swal from "sweetalert2";

const PAGE_SIZES = [5, 10, 20, 50];

const Tuitions = () => {
  const axiosSecure = useAxiosSecure();
  const { role } = useRole();


  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOption, setSortOption] = useState('newest');


  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchText.trim()), 300);
    return () => clearTimeout(id);
  }, [searchText]);

  
  const fetchTuitions = async ({ queryKey }) => {
    const [_key, _page, _limit, _search, _sort] = queryKey;
    const res = await axiosSecure.get(
      `/approved-tuitions?page=${_page}&limit=${_limit}&search=${(_search)}&sort=${_sort}`
    );
    return res.data; 
  };


  const { data, isFetching } = useQuery({
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


 


const handleApply = async (tuition) => {
  if (role !== "tutor") {
    Swal.fire({
      icon: "error",
      title: "Only tutors can apply!",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }


  const confirm = await Swal.fire({
    title: "Apply for this tuition?",
    text: `Subject: ${tuition.subject}\nLocation: ${tuition.location}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Apply!",
  });

  if (!confirm.isConfirmed) return; 

  try {
    const payload = { tuitionId: tuition._id };
    const res = await axiosSecure.post("/applications", payload);

    if (res.status === 201) {
      Swal.fire({
        icon: "success",
        title: "Applied Successfully!",
        text: "Your application has been submitted.",
        timer: 1500,
        showConfirmButton: false,
      });
     
    } else {
      Swal.fire({
        icon: "success",
        title: "Applied",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  } catch (err) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message;

    if (status === 409) {
      Swal.fire({
        icon: "warning",
        title: "Already Applied!",
        text: msg || "You already applied to this tuition.",
      });
    } else if (status === 401 || status === 403) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please login again.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Apply Failed",
        text: msg || "Something went wrong. Try again.",
      });
    }

    console.error("Apply error", err);
  }
};







  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center mt-6 mb-4">All <span className='text-primary'>Tuitions</span></h1>

     
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
                    <button className="btn btn-sm btn-primary" onClick={() => handleApply(t)}>Apply</button>
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
                  <button className="btn btn-sm btn-primary" onClick={() => handleApply(t)}>Apply</button>
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
    </div>
  );
};

export default Tuitions;
