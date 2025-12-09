
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router'; 
import { motion } from 'framer-motion';

import useAxiosSecure from '../hooks/useAxiosSecure';
import LoadingSpinner from './LoadingSpinner';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const LatestTuitions = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['latest-tuitions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/approved-tuitions?page=1&limit=5&sort=newest');
      return res.data?.results || [];
    },
    staleTime: 1000 * 30,
  });

  const tuitions = data || [];

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center text-red-500">
        Failed to load latest tuitions.
      </div>
    );
  }

  if (!tuitions.length) {
    return (
      <div className="py-12 text-center text-gray-600">
        No recent tuitions available.
      </div>
    );
  }

  const itemsToShow = tuitions.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
        
         <div className="text-center mb-8">
              <h3 className="text-3xl font-bold">Latest <span className='text-primary'> Tuitions</span></h3>
        </div>
      <div className="flex items-center justify-end mb-6">
        
       
        <Link to="/tuitions" className="text-sm btn btn-ghost btn-sm">View all</Link>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {itemsToShow.map((t, idx) => (
          <motion.article
            key={t._id || idx}
            className="bg-white shadow-md rounded-xl  p-5 flex flex-col justify-between"
            variants={cardVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(2,6,23,0.08)' }}
            whileTap={{ scale: 0.995 }}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-lg font-semibold">{t.subject}</h4>
                  <p className="text-sm text-gray-500 mt-1">{t.class}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Budget</div>
                  <div className="text-green-600 font-semibold">৳{t.budget}</div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-3">{t.location}</p>

              <div className="mt-4 text-xs text-gray-400">
                {t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A'}
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default LatestTuitions;
