// src/components/WhyChooseUs.jsx
import React from "react";
import {
  FaUserShield,
  FaMoneyBillWave,
  FaSearch,
  FaCheckCircle,
  FaBullhorn,
  FaHandshake,
} from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const FeatureCard = ({ title, text, Icon }) => (
  <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition h-full flex flex-col">
    <div className="flex items-start gap-3 flex-1">
      <div className="text-2xl text-primary mt-1">
        <Icon />
      </div>
      <div>
        <h5 className="font-semibold">{title}</h5>
        <p className="text-sm text-gray-600 mt-1">{text}</p>
      </div>
    </div>
  </div>
);


const ChooseUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-3">
        Why Choose e<span className='text-primary'>Tuition</span>Bd?
      </h2>
      <p className="text-gray-600 mb-6 max-w-2xl">
        We built eTuitionBd to make tuition discovery and hiring simple, secure, and efficient.
      </p>

      <motion.div
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {[ 
          {
            title: "Verified Tutors",
            text: "Hire confidently from trusted and vetted local tutors.",
            Icon: FaUserShield,
          },
          {
            title: "Flexible Pricing",
            text: "Compare tutor expectations and select within your budget.",
            Icon: FaMoneyBillWave,
          },
          {
            title: "Fast Search",
            text: "Find perfect tutors quickly using advanced matching filters.",
            Icon: FaSearch,
          },
          {
            title: "Secure Communication",
            text: "Chat and coordinate safely inside the platform.",
            Icon: FaCheckCircle,
          },
          {
            title: "Admin Moderation",
            text: "Active moderation ensures quality and platform safety.",
            Icon: FaBullhorn,
          },
          {
            title: "Transparent Process",
            text: "Track applications, hiring, and payment history easily.",
            Icon: FaHandshake,
          },
        ].map((item, idx) => (
          <motion.div
  key={item.title}
  variants={cardVariants}
  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(15,23,42,0.1)" }}
  whileTap={{ scale: 0.99 }}
  className="h-full"
>
  <FeatureCard {...item} />
</motion.div>

        ))}
      </motion.div>
    </section>
  );
};

export default ChooseUs;
