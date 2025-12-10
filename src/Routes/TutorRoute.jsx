import React from 'react';

import LoadingSpinner from '../components/LoadingSpinner';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';


const TutorRoute = ({ children }) => {
     const { loading } = useAuth();
    const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <LoadingSpinner></LoadingSpinner>
    }

    if (role !== 'tutor') {
        return <h2 className='text-center text-3xl mt-20'>Access Denied. You are not authorized to view this page.</h2>
    }

    return children;
    
};

export default TutorRoute;