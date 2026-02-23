import React from 'react';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';

export function Features() {
  return (
    <section className="relative w-full py-24 bg-white font-manrope overflow-hidden text-black">
      
      {/* 1. ARCHITECTURAL GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vertical Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 hidden md:block" />
        {/* Horizontal Line */}
        <div className="absolute top-[35%] left-0 right-0 h-px bg-gray-100" />
      </div>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col">
        
        {/* --- TOP SECTION: NARRATIVE --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-24 relative">
          
          {/* Left: The Hook */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-12 bg-black"></span>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">
                  The MediVoyage Standard
                </span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] mb-8">
                Why Patients <br />
                <span className="text-gray-400 italic font-serif">Choose Us.</span>
              </h2>
            </div>
            
            {/* Stats / Badges */}
            <div className="flex gap-8 border-t border-gray-100 pt-8 mt-4">
              <div>
                <span className="block text-3xl font-extrabold">98%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Satisfaction</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold">24h</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Turnaround</span>
              </div>
            </div>
          </div>

          {/* Right: The Pitch (Pushed down for asymmetry) */}
          <div className="md:pt-32">
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-800 mb-8">
              We don't just book appointments; we engineer a complete medical ecosystem around your safety. 
            </p>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 max-w-md">
              From initial consultation to your safe return home, our concierge team handles every detail—flights, visas, and accommodation—ensuring a stress-free journey to better health.
            </p>
            
            {/* Feature List */}
            <div className="space-y-4">
              {[
                { icon: Shield, text: "JCI Accredited Hospitals Only" },
                { icon: Star, text: "Board Certified Surgeons" },
                { icon: Clock, text: "Zero Wait Time Policy" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-black">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: FEATURED TREATMENTS (Editorial Cards) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end">
          
          {/* Card 1: Hair - Image Left, Text Over/Bottom */}
          <div className="group relative cursor-pointer">
             <div className="relative overflow-hidden aspect-[4/5] md:aspect-[16/9] lg:aspect-[2/1] bg-gray-100">
                <img 
                  src="./imgone.jpeg" 
                  alt="Hair Transplant" 
                  // Added object-top here
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out" 
                />
                {/* Number Overlay */}
                <div className="absolute top-4 left-4 text-xs font-bold text-white mix-blend-difference z-10">01 — RESTORATION</div>
             </div>
             
             <div className="pt-6 flex justify-between items-start border-t border-black mt-4">
               <div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform duration-300">Hair Restoration</h3>
                  <p className="text-sm text-gray-500 max-w-xs">Advanced FUE & DHI techniques with lifetime warranty.</p>
               </div>
               <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
             </div>
          </div>

          {/* Card 2: Dental */}
          <div className="group relative cursor-pointer md:-translate-y-12">
             <div className="relative overflow-hidden aspect-[4/5] md:aspect-[16/9] lg:aspect-[2/1] bg-gray-100">
                <img 
                  src="./imgtwo.JPG" 
                  alt="Dental" 
                  // Added object-top here
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out" 
                />
                <div className="absolute top-4 left-4 text-xs font-bold text-white mix-blend-difference z-10">02 — AESTHETICS</div>
             </div>
             
             <div className="pt-6 flex justify-between items-start border-t border-black mt-4">
               <div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform duration-300">Cosmetic Dentistry</h3>
                  <p className="text-sm text-gray-500 max-w-xs">Smile makeovers using premium porcelain veneers.</p>
               </div>
               <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
             </div>
          </div>

        </div>

      </div>
    </section>
  );
}