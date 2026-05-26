"use client";

import React from 'react';
import { motion } from 'framer-motion';

// --- Premium Animation Variants ---
const revealText = {
  hidden: { y: "120%", rotate: 2 },
  show: { y: "0%", rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

// Staggered fade for the bottom image strip
const imageReveal = {
  hidden: { opacity: 0, y: 40, scale: 1.04 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const imageGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};

// Reusable cinematic clip-path wrapper for the videos
const clipReveal = {
  hidden: { clipPath: "inset(15% 8% 15% 8%)", scale: 1.06 },
  show: {
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] }
  }
};

export function PatientJourney() {
  // Four images shown below the video grid — swap these paths for your own assets
  const galleryImages = [
    { src: "/patient1.png", alt: "Arrival and welcome" },
    { src: "/patient2.png", alt: "Consultation suite" },
    { src: "/patient3.jpg", alt: "Recovery & care" },
    { src: "/patient4.png", alt: "Safe return home" },
  ];

  return (
    <section className="py-6 md:py-8 bg-[#faf9f6] font-manrope flex flex-col items-center overflow-hidden">
      <div className="w-full px-3 sm:px-4 lg:px-5 flex flex-col items-center">

        {/* --- TITLE ONLY --- */}
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ staggerChildren: 0.1 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-black tracking-tighter mb-6 md:mb-8 leading-[1.0] font-manrope flex flex-wrap justify-center gap-x-4 md:gap-x-6"
        >
          {/* Sliced Text Masking Animation */}
          <div className="overflow-hidden pb-2"><motion.div variants={revealText}>The</motion.div></div>
          <div className="overflow-hidden pb-2"><motion.div variants={revealText} className="font-light text-gray-400">Journey.</motion.div></div>
        </motion.h2>

        {/* --- VIDEO GRID --- */}
        {/* Left = wider main landscape video. Right = two portrait videos side by side.
            Grid is 5 columns: main spans 3 (60%), each portrait spans 1 (20%) — symmetric. */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-2 md:gap-3">

          {/* LEFT — wider landscape video (60% width on desktop) */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={clipReveal}
            className="lg:col-span-3 relative overflow-hidden bg-black aspect-video lg:aspect-auto lg:h-full min-h-[700px]"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              {/* Replace this src with your actual landscape video path */}
              <source src="/interview.mp4" type="video/mp4" />
              <img
                src="./jahaz.jpg"
                alt="Medical Journey — main feature"
                className="w-full h-full object-cover"
              />
            </video>
          </motion.div>

          {/* PORTRAIT VIDEO 1 (right, 20% width on desktop) */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={clipReveal}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 relative overflow-hidden bg-black aspect-[9/16] lg:aspect-auto lg:h-full min-h-[700px]"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              {/* Replace this src with your portrait video path */}
              <source src="/interview-portrait-1.mp4" type="video/mp4" />
              <img
                src="./jahaz.jpg"
                alt="Medical Journey — portrait clip one"
                className="w-full h-full object-cover"
              />
            </video>
          </motion.div>

          {/* PORTRAIT VIDEO 2 (right, 20% width on desktop) */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={clipReveal}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 relative overflow-hidden bg-black aspect-[9/16] lg:aspect-auto lg:h-full min-h-[700px]"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              {/* Replace this src with your portrait video path */}
              <source src="/interview-portrait-2.mp4" type="video/mp4" />
              <img
                src="./jahaz.jpg"
                alt="Medical Journey — portrait clip two"
                className="w-full h-full object-cover"
              />
            </video>
          </motion.div>

        </div>

        {/* --- BOTTOM: 4 IMAGE STRIP --- */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={imageGrid}
          className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mt-2 md:mt-3"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              variants={imageReveal}
              className="relative overflow-hidden bg-black aspect-[4/3] group"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}