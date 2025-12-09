// src/pages/tuition/TutorApplyForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';

const TutorApplyForm = () => {
  const { user } = useAuth(); // user object from your message
  const axiosSecure = useAxiosSecure();
  const loader = useLoaderData() || {};
  const { post = {}, availableTutors = [] } = loader;

  // Determine role: prefer explicit user.role, fallback to photoURL === 'Tutor'
  const currentRole = user?.role
    ? user.role
    : (user?.photoURL === 'Tutor' ? 'Tutor' : 'Student');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: currentRole === 'Tutor' ? (user?.displayName || '') : '',
      email: user?.email || '',
      qualifications: '',
      experience: '',
      expectedSalary: '',
      selectedTutorEmail: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        role: "tutor",
        name: currentRole === 'Tutor' ? (user?.displayName || data.name) : data.name,
        email: user?.email,
        qualifications: data.qualifications || '',
        experience: data.experience || '',
        expectedSalary: data.expectedSalary || '',
        createdAt: new Date(),
        status: 'Pending'
      };

      const res = await axiosSecure.post('/tutors', payload);

      if (res?.data?.insertedId || res?.data?.acknowledged) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Application submitted',
          showConfirmButton: false,
          timer: 1500
        });
        reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Submission failed',
        text: err?.response?.data?.message || err.message || 'Try again later'
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Apply for this Tuition</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-black">

       
        {currentRole === 'Student' && (
          <div>
            <label className="label mb-2">Choose Tutor (radio)</label>
            {availableTutors.length === 0 ? (
              <div className="text-sm text-gray-600">No tutors available to choose.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {availableTutors.map((tutor, idx) => (
                  <label key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={tutor.email}
                      {...register('selectedTutorEmail')}
                      className="radio"
                    />
                    <span>{tutor.name} — {tutor.email}</span>
                  </label>
                ))}
                <label className="flex items-center gap-2">
                  <input type="radio" value="" {...register('selectedTutorEmail')} className="radio" />
                  <span>Not selecting specific tutor</span>
                </label>
              </div>
            )}
          </div>
        )}


        <div>
          <label className="label">Name</label>
          <input
            type="text"
            {...register('name', { required: currentRole === 'Student' ? 'Name required' : false })}
            className="input w-full"
            placeholder="Your name"
            defaultValue={currentRole === 'Tutor' ? (user?.displayName || '') : ''}
            readOnly={currentRole === 'Tutor'}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

      
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            {...register('email')}
            className="input w-full"
            defaultValue={user?.email || ''}
            readOnly
          />
        </div>

   
        <div>
          <label className="label">Qualifications</label>
          <textarea
            {...register('qualifications', { required: 'Qualifications required' })}
            className="textarea w-full"
            rows={3}
            placeholder="Degrees, certifications, subjects..."
          />
          {errors.qualifications && <p className="text-red-500 text-sm mt-1">{errors.qualifications.message}</p>}
        </div>

        {/* Experience */}
        <div>
          <label className="label">Experience</label>
          <textarea
            {...register('experience', { required: 'Experience required' })}
            className="textarea w-full"
            rows={3}
            placeholder="Years, institutions, levels taught..."
          />
          {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
        </div>

        {/* Expected Salary */}
        <div>
          <label className="label">Expected Salary</label>
          <input
            type="text"
            {...register('expectedSalary', { required: 'Expected salary required' })}
            className="input w-full"
            placeholder="e.g., 2000৳ per month"
          />
          {errors.expectedSalary && <p className="text-red-500 text-sm mt-1">{errors.expectedSalary.message}</p>}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary " disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : (currentRole === 'Tutor' ? 'Apply as Tutor' : 'Submit Application')}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => reset()}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default TutorApplyForm;
