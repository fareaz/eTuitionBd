import React from 'react';

import LoadingSpinner from '../../../components/LoadingSpinner';
import useRole from '../../../hooks/useRole';
import AdminDashboardHome from './AdminDashboardHome';
import StudentDashboardHome from './StudentDashboardHome';
import TutorDashboardHome from './TutorDashboardHome';

const DashboardHome = () => {
    const { role, roleLoading } = useRole();
    if (roleLoading) {
        return <LoadingSpinner></LoadingSpinner>
    }
    if (role === 'admin') {
        return <AdminDashboardHome></AdminDashboardHome>
    }
    else if (role === 'tutor') {
        return <TutorDashboardHome></TutorDashboardHome>
    }
    else {
        return <StudentDashboardHome></StudentDashboardHome>
    }
};

export default DashboardHome;