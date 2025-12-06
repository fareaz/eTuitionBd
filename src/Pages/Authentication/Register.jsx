// src/pages/auth/Register.jsx
import { Link, useLocation, useNavigate } from 'react-router'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-hot-toast'
import { TbFidgetSpinner } from 'react-icons/tb'
import { useForm } from 'react-hook-form'
import useAuth from '../../hooks/useAuth'

import { useState } from 'react'



const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'Student',
    },
  })

  const [localUploading, setLocalUploading] = useState(false)

  const onSubmit = async formData => {
    console.log('Form Data:', formData)
    const { name, email, password, role, phone } = formData
    

    try {
      setLocalUploading(true)
      const result = await createUser(email, password)

      // 2. Save user in DB with role & phone
    //   await saveOrUpdateUser({ name, email, image: imageURL, role, phone })

      // 3. Update firebase profile
      const imageURL='';
      await updateUserProfile(name  , role,  imageURL ,phone)

  
      toast.success('Signup successful')
      navigate(from, { replace: true })
      console.log('Register result:', result)
    } catch (err) {
      console.error('Register error:', err)
      toast.error(err?.message || 'Signup failed')
    } finally {
      setLocalUploading(false)
    }
  }
      const handleGoogleSignIn = () => {
         signInWithGoogle()
            .then(result => {
                console.log(result.user);
                 // create user in the database
            //     const userInfo = {
            //         email: result.user.email,
            //         displayName: result.user.displayName,
            //         photoURL: result.user.photoURL,
            //         role: 'Student',
            //                  phone: '',
            //     }
            //      axiosSecure.post('/users', userInfo)
            //         .then(res => {
            //             console.log('user data has been stored', res.data)
            //             navigate(location.state || '/');
            //         })
            toast.success('Signup successful')
            navigate(from, { replace: true })
           })
            .catch(error => {
                console.log(error)
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
                {...register('name', {
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
                  {...register('role', { required: true })}
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
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: {
                      // simple BD phone pattern (starts with 01 and 11 digits total), adjust as needed
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
                {...register('email', {
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
                {...register('password', {
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
