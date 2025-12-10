// src/pages/tuition/TutorApplyForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const TutorApplyForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
      qualifications: '',
      experience: '',
      expectedSalary: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        role: "tutor",
        name: data.name || user?.displayName || '',
        email: user?.email || data.email || '',
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
      <h2 className="text-2xl font-semibold mb-4">Apply as a Tutor</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-black">
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name required' })}
            className="input w-full"
            placeholder="Your name"
            defaultValue={user?.displayName || ''}
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
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Apply as Tutor'}
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
