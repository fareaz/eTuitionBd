import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    
    <footer className="max-w-7xl mx-auto py-5 mt-10 z-10 shadow-sm">
      <div className=" px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* About Platform */}
        <div>
          <h2 className="text-xl font-semibold  mb-3">About eTuitionBd</h2>
          <p className="text-gray-700 text-sm leading-6">
            The Tuition Management System is a complete platform where students, tutors, 
            and admins can manage tuition activities including tuition posting, tutor 
            applications, financial tracking, payments, and student–tutor communication.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-lime-400">Home</a></li>
            <li><a href="/tuitions" className="hover:text-lime-400">Browse Tuitions</a></li>
            <li><a href="/post-tuition" className="hover:text-lime-400">Post Tuition</a></li>
            <li><a href="/login" className="hover:text-lime-400">Login</a></li>
            <li><a href="/register" className="hover:text-lime-400">Register</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <ul className="text-sm space-y-2">
            <li>Email: <span className="text-gray-700">support@etuitionbd.com</span></li>
            <li>Phone: <span className="text-gray-700">+880 1700-000000</span></li>
            <li>Address: <span className="text-gray-700">Dhaka, Bangladesh</span></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Follow Us</h2>
          <div className="flex items-center gap-4 text-2xl">
            <a href="#" className="hover:text-lime-400"><FaFacebook /></a>
            <a href="#" className="hover:text-lime-400"><FaInstagram /></a>
            <a href="#" className="hover:text-lime-400"><FaLinkedin /></a>
            <a href="#" className="hover:text-lime-400"><FaXTwitter /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-4">
         &copy; 2025 eTuitionBd — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
