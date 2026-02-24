"use client";

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Suvarcha Kalra',
    handle: 'UAE, Dubai',
    image: './suvarcha.jpeg',
    text: "Dr. Maharwal explained everything via video call before I even booked my procedure. My dental appointment and procedure was good and pain free, and the nursing staff was incredibly attentive."
  },
  {
    name: 'Shivam Aangan',
    handle: 'Toronto, Canada',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    text: "While visiting India for a wedding, I was referred to MediVoyage by a friend and it turned out to be the best decision. The team ensured my hospital in-time and out-time were under 90 minutes."
  },
  {
    name: 'Heena Arora',
    handle: 'Zambia, Africa',
    image: './lady.jpg',
    text: "Very prompt and professional consultation. The team handled my respiratory treatment with utmost care. The follow-up post treatment was excellent too. Highly recommend Medivoyage."
  }
];

// --- Premium Animation Variants ---
const staggerWrapper = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

// Text masking effect (slides up from an invisible box)
const revealText = {
  hidden: { y: "120%", rotate: 2 },
  show: { y: "0%", rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

// Slow, elegant fade and slide for standard text
const fadeUpSlow = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

// Image scales down slowly while fading in
const imageReveal = {
  hidden: { opacity: 0, scale: 1.2 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 lg:py-40 bg-[#faf9f6] font-manrope overflow-hidden text-black">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* --- LEFT SIDE: STICKY HEADER --- */}
        <div className="lg:w-1/3">
          <motion.div 
            variants={staggerWrapper}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:sticky lg:top-40"
          >
            <motion.span 
              variants={fadeUpSlow}
              className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gray-400 block mb-6 md:mb-8"
            >
              Patient Stories
            </motion.span>
            
            {/* Fluid typography scales smoothly from mobile to ultra-wide */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-6 md:mb-8">
              <div className="overflow-hidden pb-1 md:pb-2"><motion.div variants={revealText}>Read what</motion.div></div>
              <div className="overflow-hidden pb-1 md:pb-2"><motion.div variants={revealText}>people are</motion.div></div>
              <div className="overflow-hidden pb-1 md:pb-2"><motion.div variants={revealText} className="text-gray-400">saying.</motion.div></div>
            </h2>
            
            <motion.p 
              variants={fadeUpSlow}
              className="text-gray-500 text-sm md:text-base leading-relaxed font-medium max-w-sm"
            >
              Real feedback from patients who have experienced our seamless, global medical network.
            </motion.p>
          </motion.div>
        </div>

        {/* --- RIGHT SIDE: EDITORIAL LIST --- */}
        <div className="lg:w-2/3">
          <div className="flex flex-col">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial="hidden"
                whileInView="show"
                whileHover="hover" 
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerWrapper}
                className={`group py-10 sm:py-12 md:py-16 flex flex-col gap-6 md:gap-8 cursor-pointer ${
                  index !== testimonials.length - 1 ? 'border-b border-black/10' : ''
                }`}
              >
                {/* The Quote - scaled down slightly for mobile so long quotes don't overwhelm the screen */}
                <motion.h3 
                  variants={fadeUpSlow}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight leading-snug md:leading-tight text-gray-800 group-hover:text-black transition-colors duration-500"
                >
                  "{testimonial.text}"
                </motion.h3>
                
                {/* The Author */}
                <div className="flex items-center gap-4 md:gap-5 mt-2 md:mt-4">
                  <div className="overflow-hidden rounded-full w-12 h-12 md:w-16 md:h-16 shadow-sm border border-gray-200 shrink-0">
                    {/* Note: Grayscale hover effect is disabled on mobile (lg:grayscale) because touch devices don't have "hover", so they load in color by default on phones */}
                    <motion.img 
                      variants={imageReveal}
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover lg:grayscale opacity-90 lg:opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                    />
                  </div>
                  <motion.div variants={fadeUpSlow}>
                    <h4 className="text-sm md:text-base font-extrabold tracking-tight text-black lg:group-hover:translate-x-1 transition-transform duration-500">
                      {testimonial.name}
                    </h4>
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-gray-400 mt-0.5 md:mt-1 lg:group-hover:translate-x-1 transition-transform duration-500 delay-75">
                      {testimonial.handle}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}