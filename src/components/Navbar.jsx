import { AiOutlineMenu } from 'react-icons/ai'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import Container from './Container'
import useAuth from '../hooks/useAuth'
import { toast } from 'react-hot-toast' // <-- added

const Navbar = () => {
  const { user, logOut } = useAuth()
 console.log('Navbar User-->', user

 )

  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // handle logout with toast notifications
  const handleLogout = async () => {
    try {
      await logOut()
      setIsOpen(false)
      toast.success('Logout successful')
    } catch (err) {
      console.error('Logout error:', err)
      toast.error(err?.message || 'Logout failed')
    }
  }

  return (
    <div className='w-full z-10 shadow-sm'>
      <div className='py-2 border'>
        <Container>
          <div className='relative flex items-center justify-between'>

            {/* Left: Brand */}
            <Link to='/' className='text-lg font-semibold px-2 py-1 z-20'>
              eTuitionBd
            </Link>

            {/* Center: Links for md+ (hidden on small) */}
            <nav className='hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-10'>
              <ul className='flex gap-6 items-center'>
                <li>
                  <Link to='/' className='font-medium hover:underline'>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to='/tuitions' className='font-medium hover:underline'>
                    Tuitions
                  </Link>
                </li>
                <li>
                  <Link to='/tutors' className='font-medium hover:underline'>
                    Tutors
                  </Link>
                </li>
                <li>
                  <Link to='/about' className='font-medium hover:underline'>
                    About
                  </Link>
                </li>
                <li>
                  <Link to='/contact' className='font-medium hover:underline'>
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Right: Menu button */}
            <div className='relative z-20' ref={menuRef}>
             
              <button
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
                aria-controls='nav-dropdown'
                className='p-3 border flex items-center gap-2 rounded-full cursor-pointer hover:shadow-md transition'
              >
                <AiOutlineMenu />
                  
              </button>

              {/* Dropdown content */}
              {isOpen && (
                <div
                  id='nav-dropdown'
                  className='absolute right-0 mt-2 w-56 rounded-xl shadow-md overflow-hidden text-sm border'
                >
                  <div className='flex flex-col'>
                    <div className='md:hidden'>
                      <Link
                        to='/'
                        onClick={() => setIsOpen(false)}
                        className='block px-4 py-3 hover:border-b transition font-semibold'
                      >
                        Home
                      </Link>
                      <Link
                        to='/tuitions'
                        onClick={() => setIsOpen(false)}
                        className='block px-4 py-3 hover:border-b transition font-semibold'
                      >
                        Tuitions
                      </Link>
                      <Link
                        to='/tutors'
                        onClick={() => setIsOpen(false)}
                        className='block px-4 py-3 hover:border-b transition font-semibold'
                      >
                        Tutors
                      </Link>
                      <Link
                        to='/about'
                        onClick={() => setIsOpen(false)}
                        className='block px-4 py-3 hover:border-b transition font-semibold'
                      >
                        About
                      </Link>
                      <Link
                        to='/contact'
                        onClick={() => setIsOpen(false)}
                        className='block px-4 py-3 hover:border-b transition font-semibold'
                      >
                        Contact
                      </Link>
                    </div>

                    {/* Auth links (show on all sizes inside dropdown; adjust as you like) */}
                    {user ? (
                      <>
                        <Link
                          to='/dashboard'
                          onClick={() => setIsOpen(false)}
                          className='px-4 py-3 hover:border-b transition font-semibold'
                        >
                          Dashboard
                        </Link>
                        <div
                          onClick={handleLogout} // <-- use handler
                          className='px-4 py-3 hover:border-b transition font-semibold cursor-pointer'
                        >
                          Logout
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          to='/login'
                          onClick={() => setIsOpen(false)}
                          className='px-4 py-3 hover:border-b transition font-semibold'
                        >
                          Login
                        </Link>
                        <Link
                          to='/register'
                          onClick={() => setIsOpen(false)}
                          className='px-4 py-3 hover:border-b transition font-semibold'
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Navbar
