import React from 'react';
import { Link } from 'react-router';

const Error = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      
      <h1 className="text-7xl md:text-9xl font-extrabold text-primary drop-shadow-md">
        404
      </h1>

      <h2 className="text-2xl md:text-3xl font-semibold mt-4 text-gray-800">
        Oops! Page Not Found
      </h2>

      <p className="text-gray-600 mt-2 text-center max-w-md">
        The page you are looking for doesn't exist or may have been moved.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-primary text-white text-lg font-medium rounded-lg shadow hover:bg-primary-dark transition-all"
      >
        Go Back Home
      </Link>

    </div>
  );
};

export default Error;
