// src/hooks/useRole.jsx
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: rawRole, isLoading: roleLoading, isError, error } = useQuery({
    queryKey: ['user-role', user?.email],
    enabled: !!user?.email, 
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${(user.email)}/role`);
      console.log('useRole -> api response', res?.data);
      return res?.data?.role || null;
    },
    
  });

 
  const role = rawRole ? String(rawRole).trim().toLowerCase() : null;

  return { role, roleLoading, isError, error };
};

export default useRole;
