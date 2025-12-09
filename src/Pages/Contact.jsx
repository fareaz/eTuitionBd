
import React from "react";

const Contact = () => {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Contact e<span className='text-primary'>Tuition</span>Bd
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Contact Form */}
        <section className="bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Send us a <span className='text-primary'>message</span></h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Message subject"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="textarea textarea-bordered w-full h-32"
                placeholder="Write your message here..."
                required
              ></textarea>
            </div>

            <button className="btn btn-primary w-full">Send Message</button>
          </form>
        </section>

        {/* Contact Information */}
        <section className="bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>

          <p className="text-gray-600 mb-6">
            Have questions about tuitions, tutor applications, or using the platform?  
            We’re here to help!
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">📧 Email</h4>
              <p className="text-gray-600">support@etuitionbd.com</p>
            </div>

            <div>
              <h4 className="font-semibold">📞 Phone</h4>
              <p className="text-gray-600">+880 1234 567 890</p>
            </div>

            <div>
              <h4 className="font-semibold">📍 Address</h4>
              <p className="text-gray-600">Dhaka, Bangladesh</p>
            </div>
          </div>

        </section>
      </div>

      <footer className="text-center mt-12 text-gray-500 text-sm">
        &copy; eTuitionBd — All Rights Reserved
      </footer>
    </main>
  );
};

export default Contact;
