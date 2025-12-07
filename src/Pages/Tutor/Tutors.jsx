// src/pages/Tutors.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Tutors = () => {
  const axiosSecure = useAxiosSecure();

  const { data: tutors = [], isLoading } = useQuery({
    queryKey: ['approved-tutors'],
    queryFn: async () => {
      const res = await axiosSecure.get('/approved-tutors');
      return res.data;
    }
  });

  if (isLoading) return <div className="text-center py-10">Loading Tutors...</div>;

  const handleHire = (tutor) => {
    // open user's email client with prefilled subject/body
    const subject = encodeURIComponent(`Hiring you as a tutor — ${tutor.name}`);
    const body = encodeURIComponent(
      `Hello ${tutor.name},%0A%0AI saw your profile on eTuitionBd and would like to discuss hiring you as a tutor.%0A%0APlease reply with your availability and any further details.%0A%0AThanks,%0A[Your name]`
    );
    window.location.href = `mailto:${tutor.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Approved Tutors ({tutors.length})</h1>

      {/* Desktop / Tablet table */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow bg-white">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="w-12">#</th>
              <th>Name</th>
              <th>Qualifications</th>
              <th>Experience</th>
              <th>Expected Salary</th>
              <th className="w-28 text-center">Hire</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor, i) => (
              <tr key={tutor._id || i} className="hover:bg-gray-50">
                <th>{i + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-semibold">{tutor.name}</div>
                      <div className="text-sm text-gray-500">{tutor.email}</div>
                    </div>
                  </div>
                </td>
                <td className="align-top">{tutor.qualifications}</td>
                <td className="align-top">{tutor.experience}</td>
                <td className="align-top font-medium text-green-600">৳{tutor.expectedSalary}</td>
                <td className="align-top text-center">
                  <button
                    onClick={() => handleHire(tutor)}
                    className="btn btn-sm btn-primary text-white w-full"
                    title={`Hire ${tutor.name}`}
                  >
                    Hire
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {tutors.map((tutor, i) => (
          <article key={tutor._id || i} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{tutor.name}</h3>
                <div className="text-sm text-gray-500">{tutor.email}</div>
                <p className="mt-2 text-sm"><strong>Qualifications:</strong> {tutor.qualifications}</p>
                <p className="text-sm"><strong>Experience:</strong> {tutor.experience}</p>
                <p className="text-sm mt-1"><strong>Expected:</strong> <span className="font-medium text-green-600">৳{tutor.expectedSalary}</span></p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => handleHire(tutor)}
                  className="btn btn-sm btn-primary text-white"
                >
                  Hire
                </button>
                <div className="text-xs text-gray-400">#{i + 1}</div>
              </div>
            </div>
          </article>
        ))}

        {tutors.length === 0 && (
          <p className="text-center text-gray-500">No approved tutors found.</p>
        )}
      </div>
    </div>
  );
};

export default Tutors;
