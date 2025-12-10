import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";

const RevenueHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: payments = [], isLoading, isError } = useQuery({
    queryKey: ["tutor-revenue", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/tutor-revenue?email=${(user.email)}`
      );
      return res.data.data || [];
    },
  });

 
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });
    } catch {
      return iso;
    }
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (isError)
    return <p className="text-center mt-10 text-red-600">Failed to load revenue.</p>;

  return (
    <div className="mt-10">
      <h2 className="text-4xl font-bold mb-4">Revenue History</h2>

      <div className="mb-6 p-4 bg-green-100 border rounded-lg w-fit">
        <h3 className="text-xl font-semibold text-green-700">
          Total Earnings: ${totalRevenue}
        </h3>
      </div>

      {payments.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Email</th>
                <th>Amount</th>
                <th>Paid At</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, index) => (
                <tr key={p._id}>
                  <td>{index + 1}</td>
                  <td>{p.studentEmail}</td>
                  <td>${p.amount}</td>
                  <td>{formatDate(p.paidAt)}</td>
                  <td className="font-mono text-sm break-all">{p.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RevenueHistory;
