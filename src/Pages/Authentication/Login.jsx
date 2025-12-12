
import React, { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router' 
import { FcGoogle } from 'react-icons/fc'
import { TbFidgetSpinner } from 'react-icons/tb'
import { useForm } from 'react-hook-form'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const Login = () => {
  const { signIn, signInWithGoogle,  user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'


  const [googleLoading, setGoogleLoading] = useState(false)

  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '' },
  })

  const saveOrUpdateUser = async userObj => {
    try {
      const res = await axiosSecure.post('/users', userObj)
      return res?.data
    } catch (err) {
      console.error('saveOrUpdateUser error (login):', err?.response?.data || err.message)
    }
  }

  // if (loading) return <LoadingSpinner />
  if (user) return <Navigate to={from} replace={true} />

  const handleFirebaseInvalidCredential = (err, resetFn) => {
    const code = err?.code || err?.message || ''
    if (code === 'auth/invalid-credential' || code.includes('invalid-credential') || code.includes('wrong-password')) {
      resetFn()
      toast.error('Invalid credential — form has been reset. Please try again.')
      return true
    }
    return false
  }


  const onSubmit = async data => {
    try {
      // signIn should return a promise that rejects on error
      await signIn(data.email, data.password)
      toast.success('Login Successful')
      navigate(from, { replace: true })
    } catch (err) {
      console.error('Login error:', err)
      reset()
   
      if (handleFirebaseInvalidCredential(err, reset)) return
      toast.error(err?.message || 'Login failed')
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      const result = await signInWithGoogle()
      const userInfo = {
        email: result.user?.email || '',
        name: result.user?.displayName || '',
        phone: result.user?.phoneNumber || '',
        role: 'Student',
      }
      await saveOrUpdateUser(userInfo)
      toast.success('Signup successful')
      navigate(from, { replace: true })
    } catch (error) {
      console.error('Google sign-in error:', error)
      toast.error('Google sign-in failed')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-white'>
      <div className='flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900'>
        <div className='mb-8 text-center'>
          <h1 className='my-3 text-4xl font-bold'>Log In</h1>
          <p className='text-sm text-gray-400'>Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block mb-2 text-sm'>Email address</label>
              <input
                type='email'
                id='email'
                {...register('email', { required: 'Email is required' })}
                placeholder='Enter Your Email Here'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-purple-800 bg-gray-200 text-gray-900'
              />
              {errors.email && <p className='text-xs text-red-600 mt-1'>{errors.email.message}</p>}
            </div>

            <div>
              <div className='flex justify-between'>
                <label htmlFor='password' className='text-sm mb-2'>Password</label>
              </div>
              <input
                type='password'
                id='password'
                autoComplete='current-password'
                {...register('password', { required: 'Password is required' })}
                placeholder='*******'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-purple-800 bg-gray-200 text-gray-900'
              />
              {errors.password && <p className='text-xs text-red-600 mt-1'>{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='bg-purple-800 w-full rounded-md py-3 text-white flex items-center justify-center'
              disabled={isSubmitting}>
              {isSubmitting ? <TbFidgetSpinner className='animate-spin m-auto' /> : 'Continue'}
            </button>
          </div>
        </form>

        <div className='space-y-1'>
          <button className='text-xs hover:underline hover:text-purple-800 text-gray-400 cursor-pointer'>
            Forgot password?
          </button>
        </div>

        <div className='flex items-center pt-4 space-x-1'>
          <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
          <p className='px-3 text-sm dark:text-gray-400'>Login with social accounts</p>
          <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
        </div>

        <div
          onClick={handleGoogleSignIn}
          className='flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 rounded cursor-pointer'
        >
          <FcGoogle size={32} />
          {googleLoading ? <TbFidgetSpinner className='animate-spin' /> : <p>Continue with Google</p>}
        </div>

        <p className='px-6 text-sm text-center text-gray-400'>
          Don&apos;t have an account yet?{' '}
          <Link state={from} to='/register' className='hover:underline hover:text-purple-800 text-gray-600'>Sign up</Link>.
        </p>
      </div>
    </div>
  )
}

export default Login
