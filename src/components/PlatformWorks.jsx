// src/components/PlatformWorks.jsx
import React from "react";
import { FaBullhorn, FaSearch, FaHandshake } from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const Step = ({ num, title, text, Icon }) => (
  <motion.div
    className="bg-white  rounded-xl p-5 shadow-md hover:shadow-lg transition duration-200"
    variants={stepVariants}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center gap-3">
      <div className="rounded-full bg-primary/10 text-primary w-12 h-12 flex items-center justify-center text-xl">
        <Icon />
      </div>
      <div>
        <div className="text-xs text-gray-400">Step {num}</div>
        <h4 className="font-semibold text-lg">{title}</h4>
      </div>
    </div>
    <p className="text-sm text-gray-600 mt-3">{text}</p>
  </motion.div>
);

const PlatformWorks = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-3">
        How the Platform <span className='text-primary'>Works</span>
      </h2>
      <p className="text-gray-600 mb-6 max-w-2xl">
        A simple 3-step flow that connects students and tutors quickly — post, apply, connect.
      </p>

      <motion.div
        className="grid gap-4 grid-cols-1 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Step
          num={1}
          title="Post or Search Tuition"
          text="Students post tuition details (subject, class, location, budget). Tutors browse verified posts."
          Icon={FaBullhorn}
        />
        <Step
          num={2}
          title="Apply & Review"
          text="Tutors apply with credentials. Students review tutor profiles and shortlist."
          Icon={FaSearch}
        />
        <Step
          num={3}
          title="Hire & Teach"
          text="Student selects a tutor, negotiates, and starts lessons immediately."
          Icon={FaHandshake}
        />
      </motion.div>
    </section>
  );
};

export default PlatformWorks;
