// src/components/Navbar.jsx
import { AiOutlineMenu } from 'react-icons/ai';
import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router';
import Container from './Container';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { user, logOut } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      setIsOpen(false);
      toast.success('Logout successful');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error(err?.message || 'Logout failed');
    }
  };

  const navClass = ({ isActive }) =>
    `font-medium px-2 py-1 transition ${isActive ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`;

  // Helper to render avatar or initial
  const Avatar = ({ size = 8 }) => {
    const initials = (user?.displayName || user?.email || 'U').slice(0, 1).toUpperCase();
    return user?.photoURL ? (
      <img
        src={user.photoURL}
        alt={user.displayName || 'avatar'}
        className={`w-${size} h-${size} rounded-full object-cover`}
      />
    ) : (
      <div
        className={`w-${size} h-${size} rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold`}
        aria-hidden="true"
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto z-10">
      <div className="py-2">
        <Container>
          <div className="relative flex items-center justify-between">

            {/* Left: Brand */}
            <Link to="/" className="text-lg font-bold px-2 py-1 z-20">
              e<span className="text-primary">Tuition</span>Bd
            </Link>

            {/* Center: Links for md+ (hidden on small) */}
            <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-10">
              <ul className="flex gap-6 items-center">
                <li><NavLink to="/" className={navClass}>Home</NavLink></li>
                <li><NavLink to="/tuitions" className={navClass}>Tuitions</NavLink></li>
                <li><NavLink to="/tutors" className={navClass}>Tutors</NavLink></li>
                <li><NavLink to="/about" className={navClass}>About</NavLink></li>
                <li><NavLink to="/contact" className={navClass}>Contact</NavLink></li>
              </ul>
            </nav>

            {/* Right: Menu / Profile */}
            <div className="relative z-20" ref={menuRef}>

              {/* Mobile: menu icon button */}
              <button
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
                aria-controls="nav-dropdown"
                aria-label="Open menu"
                className="p-3 border flex items-center gap-2 rounded-full cursor-pointer hover:shadow-md transition md:hidden"
              >
                <AiOutlineMenu />
              </button>

              {/* Desktop: Avatar + name button */}
              <div className="hidden md:flex items-center">
                {user ? (
                  <button
                    onClick={() => setIsOpen(prev => !prev)}
                    aria-expanded={isOpen}
                    aria-controls="nav-dropdown"
                    aria-label="Open profile menu"
                    className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 transition"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen(prev => !prev);
                      }
                    }}
                  >
                    {/* Avatar */}
                    <span className="hidden lg:inline-block font-medium">
                      {user.displayName || (user.email ? user.email.split('@')[0] : 'User')}
                    </span>

                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
                    </svg>
                  </button>
                ) : (
                  // If logged out, show plain links on desktop (optional)
                  <div className="hidden md:flex gap-3">
                    <NavLink to="/login" className={({ isActive }) => `font-medium px-2 py-1 transition ${isActive ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}>Login</NavLink>
                    <NavLink to="/register" className={({ isActive }) => `font-medium px-2 py-1 transition ${isActive ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}>Register</NavLink>
                  </div>
                )}
              </div>

              {/* Dropdown content */}
              {isOpen && (
                <div
                  id="nav-dropdown"
                  role="menu"
                  aria-label="Navigation dropdown"
                  className="absolute right-0 mt-2 w-64 sm:w-56 rounded-xl shadow-md overflow-hidden bg-white text-sm border"
                >
                  <div className="flex flex-col">

                    {/* Mobile nav links (visible on small screens) */}
                    <div className="md:hidden">
                      <NavLink
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 transition font-semibold ${isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'}`
                        }
                      >
                        Home
                      </NavLink>

                      <NavLink
                        to="/tuitions"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 transition font-semibold ${isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'}`
                        }
                      >
                        Tuitions
                      </NavLink>

                      <NavLink
                        to="/tutors"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 transition font-semibold ${isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'}`
                        }
                      >
                        Tutors
                      </NavLink>

                      <NavLink
                        to="/about"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 transition font-semibold ${isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'}`
                        }
                      >
                        About
                      </NavLink>

                      <NavLink
                        to="/contact"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 transition font-semibold ${isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'}`
                        }
                      >
                        Contact
                      </NavLink>
                    </div>

                    <div className="border-t" />

                    {/* Auth-specific links */}
                    {user ? (
                      <>
                        {/* Dashboard */}
                        <NavLink
                          to="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-3 transition font-semibold ${isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'}`
                          }
                        >
                          Dashboard
                        </NavLink>

                        {/* Profile */}
                        <NavLink
                          to="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-3 transition font-semibold ${isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'}`
                          }
                        >
                          Profile
                        </NavLink>

                        <div className="border-t" />

                        <button
                          onClick={handleLogout}
                          className="text-left w-full px-4 py-3 hover:bg-gray-50 transition font-semibold"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <NavLink
                          to="/login"
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-3 transition font-semibold ${isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'}`
                          }
                        >
                          Login
                        </NavLink>

                        <NavLink
                          to="/register"
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-3 transition font-semibold ${isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'}`
                          }
                        >
                          Sign Up
                        </NavLink>
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
  );
};

export default Navbar;
