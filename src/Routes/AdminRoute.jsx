import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import LoadingSpinner from '../components/LoadingSpinner';


const AdminRoute = ({ children }) => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <LoadingSpinner></LoadingSpinner>
    }

    if (role !== 'admin') {
        return <h2 className='text-center text-3xl mt-20'>Access Denied. You are not authorized to view this page.</h2>
    }

    return children;
};

export default AdminRoute;