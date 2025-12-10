import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import useAxiosSecure from '../hooks/useAxiosSecure';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();

    const [transactionId, setTransactionId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (sessionId) {
            axiosSecure
                .patch(`/payment-success?session_id=${sessionId}`)
                .then(res => {
                    setTransactionId(res.data.transactionId);
                })
                .finally(() => setLoading(false));
        }
    }, [sessionId, axiosSecure]);

    if (loading) return <p className="text-center mt-10">Processing payment...</p>;

    return (
        <div className="text-center mt-16">
            <h2 className="text-4xl font-bol mb-4">
                Payment <span className='text-primary'>complete</span>
            </h2>

            <p className="text-xl mb-4">
                Thank you! Your payment was completed successfully.
            </p>

            <div className="bg-gray-100 p-4 rounded-lg inline-block mb-6">
                <p className="font-semibold text-lg">
                    Transaction ID:
                </p>
                <p className=" ont-mono text-lg">
                    {transactionId}
                </p>
            </div>

            <br />

            <Link
                to="/dashboard/payment-history"
                className="btn btn-primary"
            >
                View Payment History
            </Link>
        </div>
    );
};

export default PaymentSuccess;
