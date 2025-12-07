import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';


const TutorRoute = ({ children }) => {
    const { loading, user } = useAuth();
    const { role, roleLoading } = useRole()

    if (loading || !user || roleLoading) {
        return <LoadingSpinner></LoadingSpinner>
    }

    if (role !== 'tutor') {
        return <Forbidden></Forbidden>
    }

    return children;
};

export default TutorRoute;