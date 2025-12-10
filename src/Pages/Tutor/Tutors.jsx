
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import LoadingSpinner from '../../components/LoadingSpinner';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useRole from '../../hooks/useRole';

const Tutors = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
    const { role } = useRole();
  const navigate = useNavigate();

  const { data: tutors = [], isLoading } = useQuery({
    queryKey: ['approved-tutors'],
    queryFn: async () => {
      const res = await axiosSecure.get('/approved-tutors');
      return res.data;
    }
  });

  const [selectedTutor, setSelectedTutor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = (tutor) => {
    setSelectedTutor(tutor);
    setModalOpen(true);
  };
  const closeModal = () => {
    setSelectedTutor(null);
    setModalOpen(false);
  };


  //   // if not logged in, redirect to login
  //   if (!user) {
  //     navigate('/login');
  //     return;
  //   }
  //   // open modal with tutor details
  //   openModal(tutor);
  // };
  const handleContact = (tutor) => {
  
  if (!user) {
    navigate('/login');
    return;
  }

 
  if (role !== 'student') {
    Swal.fire({
      icon: 'warning',
      title: 'Access denied!',
      text: 'Only students can contact or apply to tutors.',
    });
    return;
  }

  // 3️⃣ Open modal if allowed
  openModal(tutor);
};

  const handlePay = async (tutor) => {
    if (!user) {
      // extra guard — shouldn't happen if modal only opens for logged in users
      navigate('/login');
      return;
    }

    try {
      const confirm = await Swal.fire({
        title: 'Proceed to payment?',
        text: `Pay for  (${tutor.name}) — ৳${tutor.expectedSalary || 0}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Pay now',
      });

      if (!confirm.isConfirmed) return;

      const paymentInfo = {
        cost: Number(tutor.expectedSalary || 0),
        paymentId: tutor._id,
        studentEmail: user.email,
        tutorEmail: tutor.email,
        tutorName: tutor.name,
        // add any other fields your backend expects
      };

      const res = await axiosSecure.post('/create-checkout-session', paymentInfo);

      if (res?.data?.url) {
        // redirect browser to checkout url returned by backend
        window.location.href = res.data.url;
      } else {
        console.error('create-checkout-session response:', res);
        Swal.fire('Error', 'Could not create checkout session — please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err?.message || 'Something went wrong', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Approved <span className="text-primary">Tutors</span> (<span className="text-primary">{tutors.length}</span>)
      </h1>

      {/* Desktop / Tablet table */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow bg-white">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="w-12">#</th>
              <th>Name</th>
              <th>Qualifications</th>
              <th>Experience</th>
              <th>Expected Salary</th>
              <th className="w-36 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor, i) => (
              <tr key={tutor._id || i} className="hover:bg-gray-50">
                <th>{i + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-semibold">{tutor.name}</div>
                      <div className="text-sm text-gray-500">{tutor.email}</div>
                    </div>
                  </div>
                </td>
                <td className="align-top">{tutor.qualifications}</td>
                <td className="align-top">{tutor.experience}</td>
                <td className="align-top font-medium text-green-600">৳{tutor.expectedSalary}</td>
                <td className="align-top text-center space-y-2">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleContact(tutor)}
                      className="btn btn-sm btn-outline w-full"
                      title={`Contact ${tutor.name}`}
                    >
                      Contact
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {tutors.map((tutor, i) => (
          <article key={tutor._id || i} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{tutor.name}</h3>
                <div className="text-sm text-gray-500">{tutor.email}</div>
                <p className="mt-2 text-sm"><strong>Qualifications:</strong> {tutor.qualifications}</p>
                <p className="text-sm"><strong>Experience:</strong> {tutor.experience}</p>
                <p className="text-sm mt-1"><strong>Expected:</strong> <span className="font-medium text-green-600">৳{tutor.expectedSalary}</span></p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => handleContact(tutor)}
                  className="btn btn-sm btn-outline"
                >
                  Contact
                </button>

                <div className="text-xs text-gray-400">#{i + 1}</div>
              </div>
            </div>
          </article>
        ))}

        {tutors.length === 0 && (
          <p className="text-center text-gray-500">No approved tutors found.</p>
        )}
      </div>

      {/* Modal */}
      {modalOpen && selectedTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal}></div>

          <div className="relative bg-white rounded-lg max-w-lg w-full p-6 z-10">
            <h2 className="text-xl font-semibold mb-2">Contact {selectedTutor.name}</h2>
            <p className="text-sm text-gray-600 mb-4">{selectedTutor.email}</p>

            <div className="space-y-2 mb-4">
              <p><strong>Qualifications:</strong> {selectedTutor.qualifications}</p>
              <p><strong>Experience:</strong> {selectedTutor.experience}</p>
              <p><strong>Expected Salary:</strong> ৳{selectedTutor.expectedSalary}</p>
            </div>

            <div className="flex gap-3 justify-end">
              <button className="btn btn-ghost" onClick={closeModal}>Close</button>
              <button
                className="btn btn-primary"
                onClick={() => handlePay(selectedTutor)}
              >
                Pay ৳{selectedTutor.expectedSalary}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutors;
