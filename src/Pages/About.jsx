// src/pages/About.jsx
import React from 'react';

const Stat = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="text-2xl md:text-3xl font-bold">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const Feature = ({ title, text }) => (
  <div className="p-4 border rounded-lg bg-white shadow-sm">
    <h4 className="font-semibold mb-2">{title}</h4>
    <p className="text-sm text-gray-600">{text}</p>
  </div>
);

const About = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-white to-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4">About eTuitionBd</h1>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                The Tuition Management System is a complete platform where students, tutors, and admins can
                manage tuition activities including tuition posting, tutor applications, financial tracking,
                payments, and student–tutor communication.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                  className="btn btn-primary"
                >
                  Get Started
                </button>
                <a href="#contact" className="btn btn-ghost">
                  Contact Us
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-semibold mb-3">Why eTuitionBd?</h3>
              <ul className="list-disc ml-5 space-y-2 text-gray-600 text-sm">
                <li>Easy tuition posting and discovery for students</li>
                <li>Streamlined tutor application and approval workflow</li>
                <li>Secure payment flow and financial tracking</li>
                <li>Profile-driven matching so students find the right tutors</li>
                <li>Admin tools for moderation and user management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Platform features</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              title="Tuition Posting"
              text="Post tuitions in seconds with subject, class, location and budget. Students and tutors can keep track of posts."
            />
            <Feature
              title="Tutor Applications"
              text="Tutors can apply directly to postings. Admins review and approve qualified tutors."
            />
            <Feature
              title="Payments & Tracking"
              text="Integrated payment checkout and history for secure financial management."
            />
            <Feature
              title="User Management"
              text="Admin interface to manage users, roles, and content moderation quickly and safely."
            />
            <Feature
              title="Profiles & Matching"
              text="Detailed tutor profiles and simple search/filter options to find the right match."
            />
            <Feature
              title="Responsive UI"
              text="Mobile-first, accessible and easy-to-use interface for students & tutors on any device."
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-xl font-bold mb-6">Quick stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat value="1.2K+" label="Active Students" />
            <Stat value="450+" label="Approved Tutors" />
            <Stat value="3.5K+" label="Tuitions Posted" />
            <Stat value="99%" label="Satisfaction Rate" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-3">Our mission</h3>
            <p className="text-gray-700 leading-relaxed">
              We aim to make quality tutoring accessible to all learners by connecting them to verified,
              skilled tutors and providing a simple, secure platform for managing every step of the learning journey.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-3">Our vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To become the most trusted tuition marketplace in the region — improving education outcomes by
              empowering tutors and enabling students to find the exact help they need.
            </p>
          </div>
        </div>
      </section>

      {/* Team / Contact CTA */}
      <section id="contact" className="py-12 bg-gradient-to-r from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Want to get in touch?</h3>
          <p className="text-gray-600 mb-6">
            For partnership, support, or feedback — contact our team. We reply within 24–48 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:hello@etuitionbd.com" className="btn btn-primary">
              Email Us
            </a>
            <a href="/dashboard/contact" className="btn btn-ghost">
              Dashboard Contact
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="font-semibold">Founder</div>
              <div className="text-sm text-gray-600">Fareaz</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Support</div>
              <div className="text-sm text-gray-600">support@etuitionbd.com</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Office</div>
              <div className="text-sm text-gray-600">Dhaka, Bangladesh</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} eTuitionBd — All rights reserved.
      </footer>
    </main>
  );
};

export default About;
