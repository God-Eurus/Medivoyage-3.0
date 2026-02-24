"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const pillars = [
  {
    num: "01",
    title: "Clinical Excellence",
    desc: "We exclusively partner with JCI-accredited hospitals and strictly vetted, board-certified surgeons. A 98% satisfaction rate built on uncompromising medical safety.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop"
  },
  {
    num: "02",
    title: "Zero Wait Times",
    desc: "Time is critical. Our concierge team bypasses standard hospital waitlists, securing your private consultations and procedures within a 24-hour turnaround.",
    image: "https://images.unsplash.com/photo-1499933374294-4584d31ac0f8?q=80&w=1000&auto=format&fit=crop"
  },
  {
    num: "03",
    title: "Holistic Concierge",
    desc: "From fast-tracking priority medical visas to arranging private airport transfers and luxury recovery villas, we manage every logistical variable.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    num: "04",
    title: "Premium Recovery",
    desc: "Post-procedure rehabilitation in dedicated luxury recovery retreats with 24/7 nursing staff and bespoke nutritional support plans.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000&auto=format&fit=crop"
  }
];

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export function Features() {
  return (
    <section className="py-24 md:py-40 bg-white font-manrope text-black flex justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      <div className="w-full max-w-[90rem]">
        
        {/* ==========================================
            SPLIT HEADER
            ========================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 md:mb-24">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="md:w-1/2"
          >
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gray-400 block mb-6">
              Why MediVoyage
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter text-black leading-[1.05]">
              The Standard <br className="hidden md:block" />
              <span className="font-light text-gray-400">of care.</span>
            </h2>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="md:w-5/12 lg:w-1/3"
          >
            <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
              We don't just book appointments; we engineer a complete medical ecosystem around your safety, combining world-class clinical oversight with elite hospitality.
            </p>
          </motion.div>
        </div>

        {/* ==========================================
            THE 2x2 ARCHITECTURAL WINDOW GRID
            ========================================== */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 border-l border-t border-black/10 bg-white"
        >
          {pillars.map((pillar, index) => (
            <motion.div 
              key={index}
              variants={fadeUp}
              className="group relative h-[450px] lg:h-[550px] overflow-hidden border-r border-b border-black/10 cursor-pointer"
            >
              
              {/* 1. Background Image (Full Color, Slow Zoom on Hover) */}
              <img 
                src={pillar.image} 
                alt={pillar.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              
              {/* 2. Sharp Gradient Overlay (Maintains readability over bright images) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent group-hover:from-black/80 transition-colors duration-700" />

              {/* 3. The Overlay Content Container */}
              <div className="absolute inset-0 p-8 md:p-10 lg:p-12 flex flex-col justify-between z-20">
                
                {/* Top: Number Tag (Sharp Square Box) */}
                <div>
                   <span className="inline-flex items-center justify-center w-12 h-12 border border-white/20 bg-black/40 backdrop-blur-md text-white text-xs font-bold tracking-widest uppercase">
                    {pillar.num}
                  </span>
                </div>

                {/* Bottom: Title, Description & Action */}
                <div className="flex flex-col max-w-xl">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-white mb-4 group-hover:translate-x-1 transition-transform duration-500">
                    {pillar.title}
                  </h3>
                  
                  {/* Description Reveal Animation */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out text-white/80 group-hover:text-white">
                    <div className="overflow-hidden">
                      <p className="text-sm md:text-base font-medium leading-relaxed pb-6 lg:pb-8">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>

                  {/* Sharp Divider & Explore Button */}
                  <div className="pt-6 border-t border-white/20 flex items-center justify-between text-white/70 group-hover:text-white transition-colors duration-300">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
                      Explore Standard
                    </span>
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>

              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}