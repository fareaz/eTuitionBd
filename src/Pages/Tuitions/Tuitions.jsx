import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Container from '../../components/Container';


const Tuitions = () => {
  const axiosSecure = useAxiosSecure();

  // React Query: fetch all tuitions
  const { data: tuitions = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['tuitions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/tuitions');
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-20 text-xl">Loading...</p>;
  }

  if (isError) {
    return (
      <p className="text-center mt-20 text-xl text-red-500">
        Failed to load tuitions: {error?.message}
      </p>
    );
  }

  return (
    <div className="p-6">
     <Container>
         <h1 className="text-3xl font-bold text-center mt-6 mb-8">
        Welcome to eTuitionBd Tuitions Page
      </h1>

      {tuitions.length === 0 ? (
        <p className="text-center text-gray-500">No tuitions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tuitions.map((t, index) => (
            <div
              key={t._id || index}
              className="border bg-white shadow p-4 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-2">{t.subject}</h3>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Class:</span> {t.class}
              </p>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Location:</span> {t.location}
              </p>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Budget:</span> ৳{t.budget}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                Posted: {t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
     </Container>
    </div>
  );
};

export default Tuitions;
