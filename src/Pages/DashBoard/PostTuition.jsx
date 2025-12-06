import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import useAuth from '../../hooks/useAuth'

const PostTuition = () => {
  const { register, handleSubmit } = useForm()
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  const handlePostTuition = data => {
    // Normalize fields
    const payload = {
      subject: String(data.subject || '').trim(),
      class: String(data.class || '').trim(),
      location: String(data.location || '').trim(),
      budget: Number(data.budget || 0),
      createdBy: user?.email || null,
    }

    // quick validation
    if (!payload.subject || !payload.class || !payload.location || !payload.budget) {
      Swal.fire({
        icon: 'error',
        title: 'Missing fields',
        text: 'Please fill all required fields and set a valid budget.',
      })
      return
    }

    Swal.fire({
      title: 'Confirm Post?',
      html: `You are about to post a tuition for <strong>${payload.subject}</strong> with budget <strong>৳${payload.budget}</strong>.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Post it',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        // save to backend
        axiosSecure.post('/tuitions', payload)
          .then(res => {
            // expecting { insertedId: ... } from backend
            if (res?.data?.insertedId) {
              Swal.fire({
                icon: 'success',
                title: 'Tuition Posted',
                text: 'Your tuition has been posted successfully.',
                timer: 1800,
                showConfirmButton: false,
                position: 'top-end'
              })
              // navigate to listing or dashboard
              navigate('/tuitions')
            } else {
              // fallback success handling
              Swal.fire({
                icon: 'success',
                title: 'Posted',
                text: 'Tuition posted (no insertedId returned).',
              })
              navigate('/tuitions')
            }
          })
          .catch(err => {
            console.error('Post tuition error:', err)
            Swal.fire({
              icon: 'error',
              title: 'Failed to post',
              text: err?.response?.data?.message || err?.message || 'Server error',
            })
          })
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-base-100 rounded-2xl shadow-xl mt-10">
  <h2 className="text-4xl font-extrabold text-center mb-10">Post a Tuition</h2>

  <form
    onSubmit={handleSubmit(handlePostTuition)}
    className="grid grid-cols-1 gap-10 text-black"
  >

    {/* subject & class */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <fieldset className="fieldset bg-base-200 p-5 rounded-xl shadow-sm">
        <label className="label font-semibold text-lg">Subject</label>
        <input
          type="text"
          {...register("subject")}
          className="input input-bordered w-full"
          placeholder="e.g. Physics, Math, English"
        />
      </fieldset>

      <fieldset className="fieldset bg-base-200 p-5 rounded-xl shadow-sm">
        <label className="label font-semibold text-lg">Class</label>
        <input
          type="text"
          {...register("class")}
          className="input input-bordered w-full"
          placeholder="e.g. Class 8, HSC, O-Level"
        />
      </fieldset>
    </div>

    {/* location & budget */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <fieldset className="fieldset bg-base-200 p-5 rounded-xl shadow-sm">
        <label className="label font-semibold text-lg">Location</label>
        <input
          type="text"
          {...register("location")}
          className="input input-bordered w-full"
          placeholder="e.g. Dhanmondi, Chittagong, Mirpur"
        />
      </fieldset>

      <fieldset className="fieldset bg-base-200 p-5 rounded-xl shadow-sm">
        <label className="label font-semibold text-lg">Budget (BDT)</label>
        <input
          type="number"
          {...register("budget")}
          className="input input-bordered w-full"
          placeholder="e.g. 5000"
        />
      </fieldset>
    </div>

    {/* submit button */}
    <button className="btn btn-primary text-lg font-bold mt-4 w-full">
      Post Tuition
    </button>
  </form>
</div>

  )
}

export default PostTuition
