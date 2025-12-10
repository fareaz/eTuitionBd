import React from 'react';
import { Link } from 'react-router';
import { FiXCircle } from "react-icons/fi";

const PaymentCancelled = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-xl rounded-xl p-10 max-w-lg text-center border border-gray-200">
                
                <FiXCircle className="text-red-500 mx-auto mb-4" size={80} />

                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Payment Cancelled
                </h2>

                <p className="text-gray-600 mb-6">
                    Your payment was cancelled or failed. Please try again if necessary.
                </p>

                <Link 
                    to="/dashboard/tuitions-management"
                    className="btn btn-primary px-6 text-white"
                >
                    Go Back to Tuitions
                </Link>

                <div className="mt-6 text-sm text-gray-500">
                    If you believe this is a mistake, please try again or contact support.
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelled;
