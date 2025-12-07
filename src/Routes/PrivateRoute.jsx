import React from 'react';

import { Navigate, useLocation } from 'react-router';

import LoadingSpinner from '../components/LoadingSpinner';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    
    if (loading) {
        return <LoadingSpinner></LoadingSpinner>
    }

    if(!user){
        return <Navigate state={location.pathname} to="/login"></Navigate>
    }

    return children;
};

export default PrivateRoute;