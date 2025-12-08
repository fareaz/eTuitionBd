// src/pages/Tuitions.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Container from '../../components/Container';
import LoadingSpinner from '../../components/LoadingSpinner';

const Tuitions = () => {
  const axiosSecure = useAxiosSecure();


  const { data: tuitions = [], isLoading, isError, error } = useQuery({
    queryKey: ['approved-tuitions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/approved-tuitions');
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <p className="text-center mt-20 text-xl text-red-500">
        Failed to load tuitions: {error?.message}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
     
        <h1 className="text-3xl font-bold text-center mt-6 mb-8">
          Welcome to eTuitionBd Tuitions Page
        </h1>

        {tuitions.length === 0 ? (
          <p className="text-center text-gray-500">No tuitions found.</p>
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
                  {tuitions.map((t, index) => (
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
                        <button className="btn btn-sm btn-primary">Apply</button>
                      </td>
                    </tr>
                    
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: cards */}
            <div className="md:hidden space-y-4">
              {tuitions.map((t, index) => (
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
                      <div className="text-xs text-gray-400">
                        #{index + 1}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-700">
                    <p><strong>Location:</strong> {t.location}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button className="btn btn-sm btn-primary">Apply</button>
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
