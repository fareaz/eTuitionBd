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
      createdAt: new Date().toISOString(),
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
    <div>
      <h2 className="text-5xl font-bold">Post a Tuition</h2>

      <form onSubmit={handleSubmit(handlePostTuition)} className="mt-12 p-4 text-black">

        {/* subject & class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-8">
          <fieldset className="fieldset">
            <label className="label">Subject</label>
            <input type="text" {...register('subject')} className="input w-full" placeholder="e.g. Mathematics" />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label">Class</label>
            <input type="text" {...register('class')} className="input w-full" placeholder="e.g. Class 9" />
          </fieldset>
        </div>

        {/* location & budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <fieldset className="fieldset">
            <label className="label">Location</label>
            <input type="text" {...register('location')} className="input w-full" placeholder="e.g. Dhanmondi, Dhaka" />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label">Budget (BDT)</label>
            <input type="number" {...register('budget')} className="input w-full" placeholder="e.g. 4500" />
          </fieldset>
        </div>

        {/* optional note or extra */}
        <div className="mt-8">
          <label className="label">Additional Note (optional)</label>
          <textarea {...register('note')} className="textarea w-full" placeholder="Any additional details..."></textarea>
        </div>

        <input type="submit" className="btn btn-primary mt-8 text-black" value="Post Tuition" />
      </form>
    </div>
  )
}

export default PostTuition
