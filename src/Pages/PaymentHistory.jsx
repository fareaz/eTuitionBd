
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import LoadingSpinner from '../components/LoadingSpinner';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading, isError } = useQuery({
    queryKey: ['payments', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${encodeURIComponent(user.email)}`);
      // expect { success: true, data: [...] } or just array - handle both
      if (res?.data?.data) return res.data.data;
      if (Array.isArray(res?.data)) return res.data;
      return res.data || [];
    },
  });

  const totalAmount = useMemo(() => {
    return payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [payments]);

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' }); // e.g. "10/12/2025, 14:31:24"
    } catch {
      return iso || '-';
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError)
    return <p className="text-center mt-10 text-red-600">Failed to load payments.</p>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">Payment <span className='text-primary'>History</span> <span className="text-sm text-gray-500">— {payments.length}</span></h2>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="text-xs text-gray-500">Total Earnings</div>
            <div className="text-lg font-semibold">
              {payments[0]?.currency ? payments[0].currency.toUpperCase() + ' ' : '$'}
              {totalAmount}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop / tablet table */}
      <div className="hidden sm:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="text-sm text-gray-600">
              <th className="w-12">#</th>
              <th>Tutor Email</th>
              <th className="text-right">Amount</th>
              <th>Paid Time (Asia/Dhaka)</th>
              <th className="w-48">Transaction Id</th>
              <th>Payment Id</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id ?? index}>
                <th>{index + 1}</th>
                <td className="max-w-[220px] truncate">{payment.tutorEmail}</td>
                <td className="text-right">
                  {payment.currency ? payment.currency.toUpperCase() + ' ' : '$'}
                  {payment.amount}
                </td>
                <td className="text-sm">{formatDate(payment.paidAt)}</td>
                <td className="font-mono text-sm break-words max-w-xs">{payment.transactionId}</td>
                <td className="text-sm">{payment.paymentId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-4">
        {payments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No payments found.</div>
        ) : (
          payments.map((payment, index) => (
            <article key={payment._id ?? index} className="bg-white rounded-lg shadow p-4 border">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-md font-semibold truncate">
                      {payment.tutorEmail}
                    </h3>
                    <div className="text-sm font-medium">
                      {payment.currency ? payment.currency.toUpperCase() + ' ' : '$'}
                      {payment.amount}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">{formatDate(payment.paidAt)}</p>

                  <div className="mt-3 text-xs text-gray-600 space-y-1">
                    <div><strong>Transaction:</strong> <span className="font-mono break-all">{payment.transactionId}</span></div>
                    <div><strong>Payment Id:</strong> <span>{payment.paymentId}</span></div>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
