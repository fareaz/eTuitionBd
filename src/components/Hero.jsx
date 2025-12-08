
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router';
import "react-responsive-carousel/lib/styles/carousel.min.css";



const SlideLayout = ({ children }) => (
  <div className="min-h-[55vh] md:min-h-[65vh] flex items-center">
    <div className="max-w-6xl mx-auto w-full px-6">
      {children}
    </div>
  </div>
);

const Hero = () => {
  return (
    <>
     
      <style>{`
        @keyframes etb-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .etb-appear { animation: etb-fade-up 700ms cubic-bezier(.2,.9,.2,1) both; }
      `}</style>

      <section aria-label="eTuitionBd hero ">
        <Carousel
          showArrows
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={6500}
          transitionTime={600}
          swipeable
          emulateTouch
          stopOnHover
          dynamicHeight={false}
        >
      
          <div className="bg-gradient-to-r from-indigo-50 to-white ">
            <SlideLayout>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-2/3 text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 etb-appear">
                    Welcome to <span className="text-primary">eTuitionBd</span>
                  </h1>
                  <p className="mt-4 text-gray-700 max-w-2xl mx-auto md:mx-0 etb-appear" style={{ animationDelay: '120ms' }}>
                    A simple, reliable tuition platform — post tuitions, apply as a tutor,
                    manage payments and connect with learners across Bangladesh.
                  </p>

                  <div className="mt-6 flex justify-center md:justify-start gap-3 etb-appear" style={{ animationDelay: '220ms' }}>
                    <Link to="/tuitions" className="btn btn-primary">
                      Browse Tuitions
                    </Link>
                    <Link to="/tutors" className="btn btn-ghost">
                      Meet Tutors
                    </Link>
                  </div>
                </div>

                
              
              </div>
            </SlideLayout>
          </div>

          {/* Slide 2 - Find your tuition (text left, button right) */}
          <div className="bg-gradient-to-r from-emerald-50 to-white">
            <SlideLayout>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* left: text */}
                <div className="w-full md:w-2/3 pr-0 md:pr-6">
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-900 etb-appear">
                    Find your tuition
                  </h2>
                  <p className="mt-3 text-gray-700 max-w-xl etb-appear" style={{ animationDelay: '120ms' }}>
                    Browse verified tuition posts by subject, class and location. Easy filters help you
                    find the exact match — part-time or full-time.
                  </p>
                </div>

                {/* right: CTA */}
                <div className="w-full md:w-1/3 flex justify-center md:justify-end">
                  <Link
                    to="/tuitions"
                    className="btn btn-lg btn-primary etb-appear"
                    style={{ animationDelay: '220ms' }}
                  >
                    See Tuitions
                  </Link>
                </div>
              </div>
            </SlideLayout>
          </div>

          {/* Slide 3 - Find tutor (text left, button right) */}
          <div className="bg-gradient-to-r from-purple-50 to-white">
            <SlideLayout>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* left: text */}
                <div className="w-full md:w-2/3 pr-0 md:pr-6">
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-900 etb-appear">
                    Find the right tutor
                  </h2>
                  <p className="mt-3 text-gray-700 max-w-xl etb-appear" style={{ animationDelay: '120ms' }}>
                    Search experienced tutors by subjects and qualifications. View profiles, check reviews
                    and hire with confidence.
                  </p>
                </div>

              
                <div className="w-full md:w-1/3 flex justify-center md:justify-end">
                  <Link
                    to="/tutors"
                    className="btn btn-lg btn-primary etb-appear"
                    style={{ animationDelay: '220ms' }}
                  >
                    Find Tutors
                  </Link>
                </div>
              </div>
            </SlideLayout>
          </div>
        </Carousel>
      </section>
    </>
  );
};

export default Hero;
