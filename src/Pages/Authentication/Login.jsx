import React from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { FcGoogle } from 'react-icons/fc'
import { TbFidgetSpinner } from 'react-icons/tb'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const Login = () => {
  const { signIn, signInWithGoogle, loading, user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  // helper to save user on Google sign-in
  const saveOrUpdateUser = async userObj => {
    try {
      const res = await axiosSecure.post('/users', userObj)
      console.log('saveOrUpdateUser (login) response:', res?.data)
      return res?.data
    } catch (err) {
      console.error('saveOrUpdateUser error (login):', err?.response?.data || err.message)
    }
  }

  if (loading) return <LoadingSpinner />
  if (user) return <Navigate to={from} replace={true} />

  // form submit handler
  const handleSubmit = async event => {
    event.preventDefault()
    const form = event.target
    const email = form.email.value
    const password = form.password.value

    try {
      await signIn(email, password)
      toast.success('Login Successful')
      navigate(from, { replace: true })
    } catch (err) {
      console.error('Login error:', err)
      toast.error(err?.message || 'Login failed')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle()
      console.log('Google sign-in user:', result.user)

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
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-white'>
      <div className='flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900'>
        <div className='mb-8 text-center'>
          <h1 className='my-3 text-4xl font-bold'>Log In</h1>
          <p className='text-sm text-gray-400'>Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block mb-2 text-sm'>Email address</label>
              <input
                type='email'
                name='email'
                id='email'
                required
                placeholder='Enter Your Email Here'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900'
              />
            </div>

            <div>
              <div className='flex justify-between'>
                <label htmlFor='password' className='text-sm mb-2'>Password</label>
              </div>
              <input
                type='password'
                name='password'
                autoComplete='current-password'
                id='password'
                required
                placeholder='*******'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900'
              />
            </div>
          </div>

          <div>
            <button type='submit' className='bg-lime-500 w-full rounded-md py-3 text-white'>
              {loading ? <TbFidgetSpinner className='animate-spin m-auto' /> : 'Continue'}
            </button>
          </div>
        </form>

        <div className='space-y-1'>
          <button className='text-xs hover:underline hover:text-lime-500 text-gray-400 cursor-pointer'>
            Forgot password?
          </button>
        </div>

        <div className='flex items-center pt-4 space-x-1'>
          <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
          <p className='px-3 text-sm dark:text-gray-400'>Login with social accounts</p>
          <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
        </div>

        <div onClick={handleGoogleSignIn} className='flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 border-rounded cursor-pointer'>
          <FcGoogle size={32} />
          <p>Continue with Google</p>
        </div>

        <p className='px-6 text-sm text-center text-gray-400'>
          Don&apos;t have an account yet?{' '}
          <Link state={from} to='/register' className='hover:underline hover:text-lime-500 text-gray-600'>Sign up</Link>.
        </p>
      </div>
    </div>
  )
}

export default Login
