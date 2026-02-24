"use client";

import React from 'react';
import { motion } from 'framer-motion';

// --- Premium Animation Variants ---
const revealText = {
  hidden: { y: "120%", rotate: 2 },
  show: { y: "0%", rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const fadeUpSlow = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

export function PatientJourney() {
  
  // Reduced top/bottom padding (py-16 md:py-24)
  return (
    <section className="py-16 md:py-24 bg-[#faf9f6] font-manrope flex flex-col items-center justify-center overflow-hidden">
      
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
        
        {/* --- TOP: CENTERED HEADER & SUBTEXT --- */}
        {/* Reduced margin-bottom (mb-12 md:mb-16) to tighten the gap to the video */}
        <div className="text-center max-w-4xl mb-12 md:mb-16 flex flex-col items-center">
          
          <motion.span 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={fadeUpSlow}
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gray-400 block mb-6 font-manrope"
          >
            Inside the Experience
          </motion.span>
          
          <motion.h2 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-50px" }} 
            transition={{ staggerChildren: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-black tracking-tighter mb-8 leading-[1.05] font-manrope flex flex-wrap justify-center gap-x-4 md:gap-x-6"
          >
            {/* Sliced Text Masking Animation */}
            <div className="overflow-hidden pb-2"><motion.div variants={revealText}>The</motion.div></div>
            <div className="overflow-hidden pb-2"><motion.div variants={revealText} className="font-light text-gray-400">Journey.</motion.div></div>
          </motion.h2>
          
          {/* Increased max-w to 4xl and forced a justified 2-line layout on desktop */}
          <motion.p 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={fadeUpSlow}
            className="text-gray-600 text-sm md:text-base lg:text-lg font-medium leading-relaxed max-w-4xl px-4 font-manrope text-justify md:text-center md:text-balance"
          >
            Watch how we transform medical travel into a seamless, luxury experience. <br className="hidden md:block" /> From your initial consultation to your safe return home, we engineer every detail for your peace of mind.
          </motion.p>
          
        </div>

        {/* --- BOTTOM: CINEMATIC CLIP-PATH VIDEO REVEAL --- */}
        {/* Softened the starting clip-path so it looks better on mobile devices */}
        <motion.div 
          initial={{ clipPath: "inset(20% 10% 20% 10%)", scale: 1.05 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-6xl aspect-video bg-black relative overflow-hidden"
        >
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            {/* Replace this src with your actual video path */}
            <source src="/interview.mp4" type="video/mp4" />
            
            {/* Fallback image if the video fails to load */}
            <img 
              src="./jahaz.jpg" 
              alt="Medical Journey Background" 
              className="w-full h-full object-cover" 
            />
          </video>
        </motion.div>

      </div>

    </section>
  );
}