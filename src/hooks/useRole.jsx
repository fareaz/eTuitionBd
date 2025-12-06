import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { isLoading: roleLoading, data: role = 'student' } = useQuery({
        queryKey: ['student-role', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/students/${user.email}/role`);
            
            return res.data?.role || 'student';
        }
    })

    return { role, roleLoading };
};

export default useRole;