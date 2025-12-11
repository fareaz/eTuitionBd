
import React from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import useAuth from '../../hooks/useAuth'

const PostTuition = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting },reset } = useForm()
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  

  const onSubmit = async (data) => {
  
    const payload = {
      name: user?.displayName || 'Anonymous',
      subject: String(data.subject || '').trim(),
      class: String(data.classLevel || '').trim(), 
      location: String(data.location || '').trim(),
      budget: Number(data.budget || 0),
      createdBy: user?.email || null,
      createdAt: new Date(),
    }

  
    if (!payload.subject || !payload.class || !payload.location || !payload.budget) {
      return Swal.fire({
        icon: 'error',
        title: 'Missing fields',
        text: 'Please fill all required fields and set a valid budget.',
      })
    }

    const confirm = await Swal.fire({
      title: 'Confirm Post?',
      html: `You are about to post a tuition for <strong>${payload.subject}</strong> with budget <strong>৳${payload.budget}</strong>.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Post it',
      cancelButtonText: 'Cancel',
    })

    if (!confirm.isConfirmed) return

    try {
      const res = await axiosSecure.post('/tuitions', payload)
      if (res?.data?.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Tuition Posted',
          text: 'Your tuition has been posted successfully.',
          timer: 1500,
          showConfirmButton: false,
          position: 'top-end',
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Posted',
          text: 'Tuition posted.',
        })
      }
      reset()
    } catch (err) {
      console.error('Post tuition error:', err)
      Swal.fire({
        icon: 'error',
        title: 'Failed to post',
        text: err?.response?.data?.message || err?.message || 'Server error',
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-base-100 rounded-2xl shadow-xl mt-10">
      <h2 className="text-4xl font-extrabold text-center mb-10">Post a <span className='text-primary'> Tuition</span></h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 text-black">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <fieldset className="bg-base-200 p-5 rounded-xl shadow-sm">
            <label className="label font-semibold text-lg">Subject</label>
            <input
              type="text"
              {...register('subject', { required: true })}
              className="input input-bordered w-full"
              placeholder="e.g. Physics, Math, English"
            />
            {errors.subject && <p className="text-sm text-red-500 mt-1">Subject is required.</p>}
          </fieldset>

          <fieldset className="bg-base-200 p-5 rounded-xl shadow-sm">
            <label className="label font-semibold text-lg">Class</label>
            <input
              type="text"
              {...register('classLevel', { required: true })}
              className="input input-bordered w-full"
              placeholder="e.g. Class 8, HSC, O-Level"
            />
            {errors.classLevel && <p className="text-sm text-red-500 mt-1">Class is required.</p>}
          </fieldset>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <fieldset className="bg-base-200 p-5 rounded-xl shadow-sm">
            <label className="label font-semibold text-lg">Location</label>
            <input
              type="text"
              {...register('location', { required: true })}
              className="input input-bordered w-full"
              placeholder="e.g. Dhanmondi, Chittagong, Mirpur"
            />
            {errors.location && <p className="text-sm text-red-500 mt-1">Location is required.</p>}
          </fieldset>

          <fieldset className="bg-base-200 p-5 rounded-xl shadow-sm">
            <label className="label font-semibold text-lg">Budget (BDT)</label>
            <input
              type="number"
              {...register('budget', { required: true, min: 1 })}
              className="input input-bordered w-full"
              placeholder="e.g. 5000"
            />
            {errors.budget && <p className="text-sm text-red-500 mt-1">Enter a valid budget.</p>}
          </fieldset>
        </div>

        <button
          type="submit"
          className="btn btn-primary text-lg font-bold mt-4 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Tuition'}
        </button>
      </form>
    </div>
  )
}

export default PostTuition
