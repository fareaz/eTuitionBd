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

  // handle logout with toast notifications
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

  // reusable nav class for NavLink
  const navClass = ({ isActive }) =>
    `font-medium px-2 py-1 transition ${
      isActive ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'
    }`;

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

            {/* Right: Menu button + Dropdown */}
            <div className="relative z-20" ref={menuRef}>
              <button
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
                aria-controls="nav-dropdown"
                aria-label="Open menu"
                className="p-3 border flex items-center gap-2 rounded-full cursor-pointer hover:shadow-md transition"
              >
                <AiOutlineMenu />
              </button>

              {/* Dropdown content */}
              {isOpen && (
                <div
                  id="nav-dropdown"
                  className="absolute right-0 mt-2 w-64 sm:w-56 rounded-xl shadow-md overflow-hidden bg-white text-sm border"
                >
                  <div className="flex flex-col">

                    {/* Mobile nav links (visible on small screens) */}
                    <div className="md:hidden">
                      <NavLink
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 transition font-semibold ${
                            isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'
                          }`
                        }
                      >
                        Home
                      </NavLink>

                      <NavLink
                        to="/tuitions"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 transition font-semibold ${
                            isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'
                          }`
                        }
                      >
                        Tuitions
                      </NavLink>

                      <NavLink
                        to="/tutors"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 transition font-semibold ${
                            isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'
                          }`
                        }
                      >
                        Tutors
                      </NavLink>

                      <NavLink
                        to="/about"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 transition font-semibold ${
                            isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'
                          }`
                        }
                      >
                        About
                      </NavLink>

                      <NavLink
                        to="/contact"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 transition font-semibold ${
                            isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'
                          }`
                        }
                      >
                        Contact
                      </NavLink>
                    </div>

                    <div className="border-t" />

                    {/* Auth links (show on all sizes inside dropdown) */}
                    {user ? (
                      <>
                        <NavLink
                          to="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-3 transition font-semibold ${
                              isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'
                            }`
                          }
                        >
                          Dashboard
                        </NavLink>

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
                            `block px-4 py-3 transition font-semibold ${
                              isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'
                            }`
                          }
                        >
                          Login
                        </NavLink>

                        <NavLink
                          to="/register"
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-3 transition font-semibold ${
                              isActive ? 'text-primary border-b-2 border-primary' : 'hover:bg-gray-50'
                            }`
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
