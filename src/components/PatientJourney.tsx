import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';

const steps = [
  { title: 'Inquiry & Consultation', duration: '1-2 Days' },
  { title: 'Travel & Arrival', duration: '6-7 Days' },
  { title: 'World-Class Treatment', duration: '1-2 Weeks' },
  { title: 'Recovery & Return', duration: '3-4 Weeks' }
];

export function PatientJourney() {
  
  // Helper for smooth scrolling
  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('inquiry-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[100vh] flex flex-col font-manrope overflow-hidden">
      
      {/* 1. BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <img 
          src="./jahaz.jpg" 
          alt="Medical Journey Background" 
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
      </div>

      {/* 2. MAIN CONTENT CONTAINER */}
      <div className="relative z-10 w-full h-full flex-grow flex flex-col justify-between py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* --- TOP: TITLE --- */}
        <div className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
            The Journey
          </h2>
        </div>

        {/* --- MIDDLE: CTA BUTTON --- 
            - Converted to <a> tag pointing to #inquiry-form
        */}
        <div 
          className="flex-grow flex items-center justify-center pt-32 pb-12 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <a 
            href="#inquiry-form"
            onClick={scrollToForm}
            className="group bg-white text-black px-8 py-4 rounded-sm font-bold text-lg hover:bg-gray-200 transition-all duration-300 flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* --- BOTTOM: STEPS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center relative w-full">
          
          {/* Animated Horizontal Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[15px] left-0 h-px bg-white/30 z-0 animate-line-grow origin-left" />

          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group relative z-10 flex flex-col items-center opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.5 + (index * 0.2)}s` }} // Staggered delay (0.5s, 0.7s, 0.9s...)
            >
              
              {/* Step Number (Circle) */}
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold mb-6 ring-4 ring-black/20 group-hover:scale-125 group-hover:ring-white/50 transition-all duration-500 shadow-lg">
                0{index + 1}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white group-hover:text-gray-200 transition-colors drop-shadow-md mb-2">
                {step.title}
              </h3>

              {/* Timeline / Duration */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold tracking-wide uppercase group-hover:bg-white group-hover:text-black transition-all duration-300">
                <Clock className="w-3 h-3" />
                {step.duration}
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* CUSTOM ANIMATION STYLES */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes lineGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-line-grow {
          animation: lineGrow 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          animation-delay: 0.5s; /* Starts after title/CTA appear */
        }
      `}</style>
    </section>
  );
}