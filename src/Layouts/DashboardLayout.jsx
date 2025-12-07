import React from 'react';
import { CiDeliveryTruck } from 'react-icons/ci';
import { FaMotorcycle, FaRegCreditCard, FaUsers } from 'react-icons/fa';
import { MdSwipeDownAlt } from "react-icons/md";
import { IoIosCreate, IoMdCreate } from "react-icons/io";
import { Link, NavLink, Outlet } from 'react-router';
import { AiFillControl } from 'react-icons/ai';
import { TiUserAdd } from 'react-icons/ti';
import { RiUserAddFill } from 'react-icons/ri';
import { FaCirclePlus } from 'react-icons/fa6';
import useRole from '../hooks/useRole';

const DashboardLayout = () => {
  const {role, roleLoading} = useRole();

  console.log('Dashboard role:', role, 'loading:', roleLoading);
  const normalizedRole = (role || '').toLowerCase().trim();
    return (
        <div className="drawer lg:drawer-open max-w-7xl mx-auto border">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300">
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        {/* Sidebar toggle icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                    </label>
                    <div className="px-4">eTuitionBd Dashboard</div>
                </nav>
                {/* Page content here */}
                <Outlet></Outlet>

            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    {/* Sidebar content here */}
                    <ul className="menu w-full grow">
                        {/* List item */}
                        <li>
                            <Link to="/" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                                {/* Home icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                                <span className="is-drawer-close:hidden">Homepage</span>
                            </Link>
                        </li>

                        {/* our dashboard links */}
                        <li>
                            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Tuitions" to="/dashboard/my_tuitions">
                                <MdSwipeDownAlt />
                                <span className="is-drawer-close:hidden">My Tuitions</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Tuitions Management" to="/dashboard/tuitions-management">
                                <AiFillControl />
                                <span className="is-drawer-close:hidden">Tuitions Management</span>
                            </NavLink>
                        </li>
                         <li>
                            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Be a Tutor" to="/dashboard/be-a-tutor">
                                <IoMdCreate />
                                <span className="is-drawer-close:hidden">Be a Tutor</span>
                            </NavLink>
                        </li>
                         <li>
                            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Tuitions Request" to="/dashboard/tuitions-request">
                               <FaCirclePlus />
                                <span className="is-drawer-close:hidden">Tuitions Request</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Post Tuition" to="/dashboard/post_tuition">
                                    <IoIosCreate />
                                <span className="is-drawer-close:hidden">Post Tuition</span>
                            </NavLink>
                        </li>
                         <li>
                            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Payment History" to="/dashboard/payment-history">
                                <FaRegCreditCard />
                                <span className="is-drawer-close:hidden">Payment History</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Approve Tutors" to="/dashboard/approve-tutors">
                                <RiUserAddFill />
                                <span className="is-drawer-close:hidden">Approve Tutors</span>
                            </NavLink>
                        </li>








    

                        {
                          normalizedRole === 'admin' && (<li>
                                    <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Users Management" to="/dashboard/users-management">
                                        <FaUsers></FaUsers>
                                        <span className="is-drawer-close:hidden">Users Management</span>
                                    </NavLink>
                                </li>)
                        }
                       

                        {/* List item */}
                        <li>
                            <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Profile Settings">
                                {/* Settings icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
                                <span className="is-drawer-close:hidden">Profile Settings</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
