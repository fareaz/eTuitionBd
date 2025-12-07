import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Container from '../../components/Container';
import LoadingSpinner from '../../components/LoadingSpinner';


const Tuitions = () => {
  const axiosSecure = useAxiosSecure();

  // React Query: fetch all tuitions
  const { data: tuitions = [], isLoading, isError, error  } = useQuery({
    queryKey: ['tuitions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/tuitions');
      return res.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>
  }

  if (isError) {
    return (
      <p className="text-center mt-20 text-xl text-red-500">
        Failed to load tuitions: {error?.message}
      </p>
    );
  }

  return (
    <div className="p-6 ">
  <Container>
    <h1 className="text-3xl font-bold text-center mt-6 mb-8">
      Welcome to eTuitionBd Tuitions Page
    </h1>

    {tuitions.length === 0 ? (
      <p className="text-center text-gray-500">No tuitions found.</p>
    ) : (
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="table w-full">
          {/* table head */}
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th>#</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Location</th>
              <th>Budget (BDT)</th>
              <th>Posted</th>
            </tr>
          </thead>

          {/* table body */}
          <tbody>
            {tuitions.map((t, index) => (
              <tr key={t._id || index} className="hover:bg-gray-50">
                <th>{index + 1}</th>
                <td className="font-semibold">{t.subject}</td>
                <td>{t.class}</td>
                <td>{t.location}</td>
                <td className="font-medium text-green-600">৳{t.budget}</td>
                <td className="text-xs text-gray-500">
                  {t.createdAt ? new Date(t.createdAt).toLocaleString() : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Container>
</div>

  );
};

export default Tuitions;
