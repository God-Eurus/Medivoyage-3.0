"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const destinations = [
  {
    num: "01",
    city: "Dubai",
    country: "United Arab Emirates",
    desc: "The epicenter of futuristic medical infrastructure, paired seamlessly with unparalleled luxury recovery resorts.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop",
    // Map coordinates (percentages to keep it responsive)
    mapX: "63%",
    mapY: "43%"
  },
  {
    num: "02",
    city: "Toronto",
    country: "Canada",
    desc: "World-renowned clinical specialists operating within serene, temperate, and highly discreet environments.",
    image: "https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2000&auto=format&fit=crop",
    mapX: "26%",
    mapY: "30%"
  },
  {
    num: "03",
    city: "New Delhi",
    country: "India",
    desc: "Pioneering surgical excellence integrated with elite, five-star hospitality and rich cultural heritage.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2000&auto=format&fit=crop",
    mapX: "70%",
    mapY: "46%"
  }
];

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export function GlobalNetwork() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 md:py-40 bg-black text-white font-manrope overflow-hidden selection:bg-white selection:text-black">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* --- LEFT SIDE: HEADER & INTERACTIVE LIST --- */}
        <div className="lg:w-5/12 flex flex-col justify-between">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="mb-16 md:mb-24"
          >
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gray-500 block mb-6 md:mb-8">
              The Network
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05]">
              Border-less <br />
              <span className="text-gray-500 font-light">healing.</span>
            </h2>
          </motion.div>

          {/* Interactive City List */}
          <div className="flex flex-col gap-6 md:gap-8 border-t border-white/10 pt-8">
            {destinations.map((dest, index) => {
              const isActive = activeIndex === index;
              return (
                <div 
                  key={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className="group flex items-center gap-6 cursor-pointer"
                >
                  <span className={`text-sm font-bold font-manrope transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                    {dest.num}
                  </span>
                  <h3 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter uppercase transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                    {dest.city}
                  </h3>
                  
                  {/* Subtle active line indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeLine" 
                      className="h-[2px] bg-white ml-4 flex-grow max-w-[50px] md:max-w-[100px]"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- RIGHT SIDE: MAP & EDITORIAL CARD --- */}
        <div className="lg:w-7/12 flex flex-col gap-10">
          
          {/* 1. The Interactive Map */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative w-full aspect-[16/9] bg-[#0a0a0a] border border-white/5 rounded-sm overflow-hidden flex items-center justify-center"
          >
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            {/* Minimalist World Map Vector (Inverted to be white on dark background) */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" 
              alt="World Map" 
              className="w-[90%] opacity-20 filter invert brightness-75 pointer-events-none select-none"
            />

            {/* Glowing Map Coordinate Dots */}
            {destinations.map((dest, index) => {
              const isActive = activeIndex === index;
              return (
                <div 
                  key={index}
                  className="absolute"
                  style={{ left: dest.mapX, top: dest.mapY }}
                >
                  {/* The core dot */}
                  <div className={`relative w-2 h-2 md:w-3 md:h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-500 ${isActive ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-gray-600'}`}>
                    
                    {/* The radar ping animation (only plays on active city) */}
                    {isActive && (
                      <span className="absolute inset-0 rounded-full border border-white animate-ping opacity-75 w-full h-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* 2. The Dynamic Content Below Map */}
          <div className="relative h-[400px] md:h-[450px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col md:flex-row gap-6 md:gap-10"
              >
                {/* Image */}
                <div className="w-full md:w-1/2 h-[250px] md:h-full overflow-hidden">
                  <img 
                    src={destinations[activeIndex].image} 
                    alt={destinations[activeIndex].city}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                  />
                </div>
                
                {/* Details */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
                    {destinations[activeIndex].country}
                  </span>
                  <h4 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-white">
                    {destinations[activeIndex].city}
                  </h4>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed font-medium">
                    {destinations[activeIndex].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}