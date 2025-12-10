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
      const res = await axiosSecure.get(`/tutor-revenue?email=${(user.email)}`);
      return res.data.data || [];
    },
  });


  const totalRevenue = payments.reduce((sum, p) => {
    const amt = Number(p?.amount) || 0;
    return sum + amt;
  }, 0);

  const formatAmount = (value, currency = "USD") => {
    try {
      const code = (currency || "USD").toString().toUpperCase();
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        maximumFractionDigits: 2,
      }).format(Number(value) || 0);
    } catch {
      return `$${Number(value || 0).toFixed(2)}`;
    }
  };

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });
    } catch {
      return iso || "-";
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p className="text-center mt-10 text-red-600">Failed to load revenue.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Revenue <span className="text-primary"> History </span></h1>
        <p className="text-sm text-gray-500 mt-1">All payouts from students (most recent first)</p>
      </header>

      <section className="mb-6">
        <div className="inline-flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
          <div className="text-xs text-emerald-700">Total Earnings</div>
          <div className="text-xl md:text-2xl font-semibold text-emerald-900">
            {payments.length > 0 ? formatAmount(totalRevenue, payments[0]?.currency || "USD") : formatAmount(0, "USD")}
          </div>
        </div>
      </section>

      {payments.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p>No transactions yet.</p>
        </div>
      ) : (
        <>
       
          <div className="hidden md:block overflow-x-auto rounded-lg shadow bg-white">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 text-left text-sm text-gray-700 sticky top-0">
                <tr>
                  <th className="px-4 py-3 w-12">#</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Paid At</th>
                  <th className="px-4 py-3">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {payments.map((p, i) => (
                  <tr key={p._id || `${p.transactionId}-${i}`} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 align-top">{i + 1}</td>
                    <td className="px-4 py-3 align-top break-words max-w-[220px]">{p.studentEmail || "—"}</td>
                    <td className="px-4 py-3 align-top font-medium text-green-600">
                      {formatAmount(p.amount || 0, p.currency || "USD")}
                    </td>
                    <td className="px-4 py-3 align-top">{formatDate(p.paidAt)}</td>
                    <td className="px-4 py-3 align-top font-mono text-sm break-words max-w-[300px]">{p.transactionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

       
          <div className="md:hidden space-y-3">
            {payments.map((p, i) => (
              <article key={p._id || `${p.transactionId}-${i}`} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold truncate">
                        {p.studentEmail || "Student"}
                      </h3>
                      <div className="text-sm font-medium text-green-600">
                        {formatAmount(p.amount || 0, p.currency || "USD")}
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      <div>Paid: {formatDate(p.paidAt)}</div>
                    </div>

                    <div className="mt-3">
                      <div className="text-xs text-gray-600">Transaction</div>
                      <div className="mt-1 font-mono text-sm break-words">{p.transactionId}</div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RevenueHistory;
