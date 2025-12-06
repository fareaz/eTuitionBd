// src/pages/auth/Register.jsx
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-hot-toast'
import { TbFidgetSpinner } from 'react-icons/tb'
import { useForm } from 'react-hook-form'
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'Student',
    },
  })

  const [localUploading, setLocalUploading] = useState(false)

  // helper: save or update user in backend (no photoURL, no uid)
  const saveOrUpdateUser = async userObj => {
    try {
      const res = await axiosSecure.post('/users', userObj)
      // optional: you can inspect res.data
      console.log('saveOrUpdateUser:', res.data)
      return res.data
    } catch (err) {
      console.error('saveOrUpdateUser error:', err?.response?.data || err.message)
      // don't block signup if saving fails; but notify developer/console
      return null
    }
  }

  const onSubmit = async formData => {
    const { name, email, password, role, phone } = formData
    try {
      setLocalUploading(true)

      const result = await createUser(email, password) 
      console.log('Firebase createUser result:', result)

      
      await updateUserProfile(name, role, '', phone)


      await saveOrUpdateUser({
        email,
        name,
        phone,
        role,
      })

      toast.success('Signup successful')
      navigate(from, { replace: true })
    } catch (err) {
      console.error('Register error:', err)
      toast.error(err?.message || 'Signup failed')
    } finally {
      setLocalUploading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(async result => {
        console.log('Google sign-in user:', result.user)

        // Prepare the user object (no photoURL, no uid)
        const userInfo = {
          email: result.user?.email || '',
          name: result.user?.displayName || '',
          phone: result.user?.phoneNumber || '',
          role: 'Student',
        }

        // Save or update in backend
        await saveOrUpdateUser(userInfo)

        toast.success('Signup successful')
        navigate(from, { replace: true })
      })
      .catch(error => {
        console.error('Google sign-in error:', error)
        toast.error('Google sign-in failed')
      })
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-white'>
      <div className='flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900'>
        <div className='mb-8 text-center'>
          <h1 className='my-3 text-4xl font-bold'>Sign Up</h1>
          <p className='text-sm text-gray-400'>Welcome to eTuitionBd</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className='space-y-6 ng-untouched ng-pristine ng-valid'
        >
          <div className='space-y-4'>
            {/* Name */}
            <div>
              <label htmlFor='name' className='block mb-2 text-sm'>
                Name
              </label>
              <input
                type='text'
                id='name'
                placeholder='Enter Your Name Here'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900'
                {...formRegister('name', {
                  required: 'Name is required',
                  maxLength: {
                    value: 20,
                    message: 'Name cannot be longer than 20 characters',
                  },
                })}
              />
              {errors.name && (
                <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>
              )}
            </div>

            {/* Role & Phone (side-by-side on md+) */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='role' className='block mb-2 text-sm'>
                  Role
                </label>
                <select
                  id='role'
                  className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900'
                  {...formRegister('role', { required: true })}
                >
                  <option value='Student'>Student</option>
                  <option value='Tutor'>Tutor</option>
                </select>
              </div>

              <div>
                <label htmlFor='phone' className='block mb-2 text-sm'>
                  Phone
                </label>
                <input
                  type='tel'
                  id='phone'
                  placeholder='01XXXXXXXXX'
                  className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900'
                  {...formRegister('phone', {
                    required: 'Phone is required',
                    pattern: {
                      value: /^(?:\+?88)?01[3-9]\d{8}$/,
                      message: 'Please enter a valid phone number',
                    },
                  })}
                />
                {errors.phone && (
                  <p className='text-red-500 text-xs mt-1'>{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor='email' className='block mb-2 text-sm'>
                Email address
              </label>
              <input
                type='email'
                id='email'
                placeholder='Enter Your Email Here'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900'
                {...formRegister('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Please enter a valid email address.',
                  },
                })}
              />
              {errors.email && (
                <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className='flex justify-between'>
                <label htmlFor='password' className='text-sm mb-2'>
                  Password
                </label>
              </div>
              <input
                type='password'
                autoComplete='new-password'
                id='password'
                placeholder='*******'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900'
                {...formRegister('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='bg-lime-500 w-full rounded-md py-3 text-white disabled:opacity-60 flex justify-center items-center'
              disabled={loading || localUploading}
            >
              {loading || localUploading ? <TbFidgetSpinner className='animate-spin' /> : 'Continue'}
            </button>
          </div>
        </form>

        <div className='flex items-center pt-4 space-x-1'>
          <div className='flex-1 h-px sm:w-16 bg-gray-300'></div>
          <p className='px-3 text-sm text-gray-400'>Signup with social accounts</p>
          <div className='flex-1 h-px sm:w-16 bg-gray-300'></div>
        </div>

        <div
          onClick={handleGoogleSignIn}
          className='flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 rounded cursor-pointer'
        >
          <FcGoogle size={32} />
          <p>Continue with Google</p>
        </div>

        <p className='px-6 text-sm text-center text-gray-400'>
          Already have an account?{' '}
          <Link to='/login' className='hover:underline hover:text-lime-500 text-gray-600'>
            Login
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default Register
