"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

const boardMembers = [
  {
    name: "Dr. Alistair Sterling",
    specialty: "Cardiothoracic Surgery",
    location: "Toronto, Canada",
    credentials: "FACS, FRCSC",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Dr. Elena Rostova",
    specialty: "Advanced Neurology",
    location: "Dubai, UAE",
    credentials: "MD, PhD",
    image: "https://images.unsplash.com/photo-1594824436951-7f12bcce0f52?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Dr. Sanjay Patel",
    specialty: "Orthopedic Reconstruction",
    location: "New Delhi, India",
    credentials: "MS, MCh (Ortho)",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Dr. Marcus Thorne",
    specialty: "Aesthetic & Reconstructive",
    location: "London, UK",
    credentials: "MD, FRCS (Plast)",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Dr. Aisha Rahman",
    specialty: "Reproductive Endocrinology",
    location: "Singapore",
    credentials: "MBBS, MRCOG",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Dr. Julian Rossi",
    specialty: "Advanced Hair Restoration",
    location: "Geneva, Switzerland",
    credentials: "MD, FISHRS",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=1000&auto=format&fit=crop"
  }
];

// --- Premium Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export function Doctors() {
  return (
    <section className="py-24 md:py-40 bg-white font-manrope text-black flex justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* 1. Reduced max-w to 75rem for a tighter overall grid */}
      <div className="w-full max-w-[75rem]">
        
        {/* ==========================================
            CENTERED HEADER
            ========================================== */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gray-400 block mb-6">
            The Medical Board
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 leading-[1.05] mb-6">
            Vetted <br className="hidden sm:block" />
            <span className="font-light text-gray-400">excellence.</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium px-4">
            We operate an exclusive, closed-loop network. Every surgeon on our clinical board has been rigorously vetted for their success rates, global training, and executive-level bedside manner.
          </p>
        </motion.div>

        {/* ==========================================
            THE 3x2 ARCHITECTURAL LEDGER GRID
            ========================================== */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-black/10 bg-white"
        >
          {boardMembers.map((doctor, index) => (
            <motion.div 
              key={index} 
              variants={fadeUp}
              className="group flex flex-col cursor-pointer bg-white hover:bg-[#faf9f6] transition-colors duration-500 border-r border-b border-black/10"
            >
              
              {/* 2. Shortened aspect ratio from [3/4] to [4/5] */}
              <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-black/10 bg-gray-50">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                />
                
                {/* Sharp Geometrical Location Tag (Tightened padding) */}
                <div className="absolute top-0 left-0 bg-white text-black px-3 py-2 border-r border-b border-black/10">
                  <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase">
                    {doctor.location}
                  </span>
                </div>
              </div>

              {/* 3. Tightened Payload Padding (p-6 md:p-8) & Font Sizes */}
              <div className="p-6 md:p-8 flex flex-col flex-grow justify-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-2">
                  {doctor.specialty}
                </span>
                
                <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900 mb-1 group-hover:translate-x-1 transition-transform duration-500">
                  {doctor.name}
                </h3>
                
                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-2">
                  {doctor.credentials}
                </p>
              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* ==========================================
            THE ARCHITECTURAL ACTION BUTTONS
            ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 border-l border-r border-b border-black/10 bg-white"
        >
          
          <button className="group flex items-center justify-center gap-3 py-5 md:py-6 border-b sm:border-b-0 sm:border-r border-black/10 hover:bg-[#faf9f6] transition-colors duration-300">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600 group-hover:text-black transition-colors">
              View Full Board
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transform group-hover:translate-x-1 transition-all duration-300" />
          </button>

          <button className="group flex items-center justify-center gap-3 py-5 md:py-6 bg-white hover:bg-black transition-colors duration-500">
            <Calendar className="w-4 h-4 text-black group-hover:text-white transition-colors duration-500" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-black group-hover:text-white transition-colors duration-500">
              Book Consultation
            </span>
          </button>

        </motion.div>

      </div>
    </section>
  );
}