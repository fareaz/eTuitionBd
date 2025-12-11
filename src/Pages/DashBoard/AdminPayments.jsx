import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../components/LoadingSpinner";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso || "-";
  }
};

const Currency = ({ value }) => {
  const num = Number(value || 0);
  return <span>${num.toLocaleString()}</span>;
};

const AdminPayments = () => {
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payment-data");
      return res.data;
    },
   
  });

  const totalAmount = useMemo(
    () => payments.reduce((s, p) => s + Number(p.amount || 0), 0),
    [payments]
  );
  const adminEarning = useMemo(() => totalAmount * 0.25, [totalAmount]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Admin <span className="text-primary">Payments</span></h1>
        <p className="text-sm text-gray-500 mt-1">
          Latest payments — total and admin earnings (25%).
        </p>
      </header>

      {/* Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white shadow-sm rounded-2xl border flex flex-col">
          <div className="text-xs text-gray-500">Total Payments</div>
          <div className="mt-2 text-2xl font-bold">
            <Currency value={totalAmount} />
          </div>
          <div className="mt-3 text-xs text-gray-400">
            ({payments.length} transactions)
          </div>
        </div>

        <div className="p-4 bg-white shadow-sm rounded-2xl border flex flex-col">
          <div className="text-xs text-gray-500">Admin Earning (25%)</div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            <Currency value={adminEarning} />
          </div>
          <div className="mt-3 text-xs text-gray-400">
            Auto-calculated from total amount.
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-indigo-50 to-sky-50 shadow-sm rounded-2xl border flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Last Update</div>
            <div className="mt-1 text-sm font-medium text-gray-700">
              {payments[0]?.paidAt ? formatDate(payments[0].paidAt) : "-"}
            </div>
          </div>
          <div className="hidden md:block text-gray-300 text-4xl">💳</div>
        </div>
      </section>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-2xl border shadow-sm">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Student Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Paid At</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Admin (25%)</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y">
              {payments.map((p) => {
                const amt = Number(p.amount || 0);
                return (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">
                      <Currency value={amt} />
                    </td>
                    <td className="px-4 py-3 break-words max-w-sm">{p.transactionId || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{p.studentEmail || p.customerEmail || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(p.paidAt)}</td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600">
                      <Currency value={(amt * 0.25).toFixed(2)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3 mt-4">
        {payments.map((p) => {
          const amt = Number(p.amount || 0);
          return (
            <div
              key={p._id}
              className="bg-white border rounded-2xl p-4 shadow-sm overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-gray-400">Amount</div>
                  <div className="text-lg font-bold"><Currency value={amt} /></div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400">Admin</div>
                  <div className="text-sm font-semibold text-emerald-600">
                    <Currency value={(amt * 0.25).toFixed(2)} />
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <div className="truncate"><span className="text-xs text-gray-400 mr-2">Txn:</span>{p.transactionId || "-"}</div>
                <div className="mt-2"><span className="text-xs text-gray-400 mr-2">Student:</span>{p.studentEmail || p.customerEmail || "-"}</div>
                <div className="mt-2 text-xs text-gray-500">{formatDate(p.paidAt)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPayments;
