import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading, isError } = useQuery({
    queryKey: ['payments', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${(user.email)}`);
      return res.data.data || [];
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading payment history...</p>;
  }
  if (isError) {
    return <p className="text-center mt-10 text-red-600">Failed to load payments.</p>;
  }

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' }); // e.g. "10/12/2025, 14:31:24"
    } catch {
      return iso;
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">Payment History — {payments.length}</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Tutor Email</th>
              <th>Amount</th>
              <th>Paid Time (Asia/Dhaka)</th>
              <th>Transaction Id</th>
              <th>Payment Id</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id ?? index}>
                <th>{index + 1}</th>
                <td>{payment.tutorEmail}</td>
                <td>
                  {payment.currency ? payment.currency.toUpperCase() + ' ' : '$'}
                  {payment.amount}
                </td>
                <td>{formatDate(payment.paidAt)}</td>
                <td className="font-mono text-sm break-all">{payment.transactionId}</td>
                <td className="text-sm">{payment.paymentId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
