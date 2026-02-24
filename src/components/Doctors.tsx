"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

const boardMembers = [
  {
    name: "Dr. Alistair Sterling",
    specialty: "Cardiothoracic Surgery",
    location: "Toronto, Canada",
    credentials: "FACS, FRCSC",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1500&auto=format&fit=crop"
  },
  {
    name: "Dr. Elena Rostova",
    specialty: "Advanced Neurology",
    location: "Dubai, UAE",
    credentials: "MD, PhD",
    image: "https://images.unsplash.com/photo-1594824436951-7f12bcce0f52?q=80&w=1500&auto=format&fit=crop"
  },
  {
    name: "Dr. Sanjay Patel",
    specialty: "Orthopedic Reconstruction",
    location: "New Delhi, India",
    credentials: "MS, MCh (Ortho)",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1500&auto=format&fit=crop"
  },
  {
    name: "Dr. Marcus Thorne",
    specialty: "Aesthetic & Reconstructive",
    location: "London, UK",
    credentials: "MD, FRCS (Plast)",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1500&auto=format&fit=crop"
  },
  {
    name: "Dr. Aisha Rahman",
    specialty: "Reproductive Endocrinology",
    location: "Singapore",
    credentials: "MBBS, MRCOG",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1500&auto=format&fit=crop"
  },
  {
    name: "Dr. Julian Rossi",
    specialty: "Advanced Hair Restoration",
    location: "Geneva, Switzerland",
    credentials: "MD, FISHRS",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=1500&auto=format&fit=crop"
  }
];

export function Doctors() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 md:py-40 bg-[#faf9f6] font-manrope text-black flex justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      <div className="w-full max-w-[90rem]">
        
        {/* ==========================================
            THE ARCHITECTURAL SPLIT-BLOCK
            ========================================== */}
        <div className="flex flex-col lg:flex-row border border-black/10 bg-white">
          
          {/* --- LEFT PANE: DYNAMIC IMAGE MONOLITH --- */}
          <div className="lg:w-5/12 relative h-[400px] lg:h-[800px] border-b lg:border-b-0 lg:border-r border-black/10 bg-black overflow-hidden">
            
            {/* Overlay Tag */}
            <div className="absolute top-0 left-0 z-20 bg-white px-6 py-4 border-r border-b border-white/20">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black">
                {boardMembers[activeIndex].credentials}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                src={boardMembers[activeIndex].image}
                alt={boardMembers[activeIndex].name}
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
              />
            </AnimatePresence>
            
            {/* High-end grain/gradient overlay to unify the photos */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
            
            {/* Dynamic Location Overlay */}
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <motion.span 
                key={`loc-${activeIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xs font-bold uppercase tracking-[0.3em] text-white/80 block"
              >
                {boardMembers[activeIndex].location}
              </motion.span>
            </div>
          </div>

          {/* --- RIGHT PANE: THE INTERACTIVE LEDGER --- */}
          <div className="lg:w-7/12 flex flex-col justify-between bg-white">
            
            {/* Integrated Header */}
            <div className="p-8 md:p-12 border-b border-black/10">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gray-400 block mb-4">
                The Medical Board
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 leading-[1.05]">
                Vetted <span className="font-light text-gray-400">excellence.</span>
              </h2>
            </div>

            {/* The Roster (List of Doctors) */}
            <div className="flex flex-col flex-grow divide-y divide-black/10">
              {boardMembers.map((doctor, index) => {
                const isActive = activeIndex === index;
                
                return (
                  <div 
                    key={index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    className={`group flex items-center justify-between px-8 md:px-12 py-6 cursor-pointer transition-all duration-500 ${isActive ? 'bg-black text-white' : 'hover:bg-gray-50 text-black'}`}
                  >
                    {/* Left: Index & Name */}
                    <div className="flex items-center gap-6 md:gap-12">
                      <span className={`text-[10px] font-bold font-mono tracking-widest ${isActive ? 'text-white/50' : 'text-gray-400'}`}>
                        0{index + 1}
                      </span>
                      <h3 className={`text-xl md:text-3xl font-extrabold tracking-tight transition-transform duration-500 ${isActive ? 'translate-x-2' : ''}`}>
                        {doctor.name}
                      </h3>
                    </div>

                    {/* Right: Specialty & Arrow */}
                    <div className="flex items-center gap-6 md:gap-10">
                      <span className={`hidden md:block text-[10px] font-bold uppercase tracking-[0.2em] ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                        {doctor.specialty}
                      </span>
                      <ArrowRight className={`w-5 h-5 transform transition-all duration-500 ${isActive ? 'translate-x-1 opacity-100' : '-rotate-45 opacity-30 group-hover:opacity-100'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Integrated Action Bottom Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-black/10">
              <button className="flex items-center justify-center gap-3 py-6 md:py-8 border-b sm:border-b-0 sm:border-r border-black/10 hover:bg-[#faf9f6] transition-colors duration-300">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
                  View Full Board
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <button className="group flex items-center justify-center gap-3 py-6 md:py-8 bg-white hover:bg-black transition-colors duration-500">
                <Calendar className="w-4 h-4 text-black group-hover:text-white transition-colors duration-500" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black group-hover:text-white transition-colors duration-500">
                  Book Consultation
                </span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}