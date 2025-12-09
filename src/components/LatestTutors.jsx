// src/components/LatestTutors.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';

import TutorCard from './TutorCard';
import LoadingSpinner from './LoadingSpinner';




const LatestTutors = () => {
  const axiosSecure = useAxiosSecure();

  const { data: tutors = [], isLoading } = useQuery({
    queryKey: ['approved-tutors'],
    queryFn: async () => {
      const res = await axiosSecure.get('/approved-tutors');
      return res.data;
    },
   
    staleTime: 1000 * 60,
  });

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  const itemsToShow = (tutors || []).slice(0, 4);

  if (!itemsToShow.length) return <div className="p-6 text-center text-gray-600">No approved tutors found.</div>;

  return (
    <section className="my-16 px-4  max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold">Latest Approved <span className='text-primary'> Tutors</span></h3>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto mt-2">
          Browse recently approved tutors — qualifications, experience and expected salary shown.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {itemsToShow.map((tutor, idx) => (
          <TutorCard key={tutor._id || tutor.email || idx} tutor={tutor} index={idx} />
        ))}
      </div>
    </section>
  );
};

export default LatestTutors;
