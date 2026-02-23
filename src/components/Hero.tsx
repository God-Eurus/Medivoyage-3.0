import React from 'react';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  
  // Helper function for smooth scrolling
  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('inquiry-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-screen bg-gray-100 flex flex-col items-center justify-start overflow-hidden selection:bg-black/10 font-manrope pt-24 md:pt-32">
      
      {/* 0. NEW: BACKGROUND IMAGE (No Overlay) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1719934398679-d764c1410770?w=900&auto=format&fit=crop" 
          alt="Medical Background" 
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* 1. BACKGROUND: ANIMATED BLOBS */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-black/[0.03] blur-[120px] rounded-[100%] pointer-events-none animate-blob mix-blend-multiply" />
      <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[40vh] bg-gray-400/[0.05] blur-[100px] rounded-[100%] pointer-events-none animate-blob animation-delay-2000 mix-blend-multiply" />
      <div className="absolute bottom-[-20%] right-[10%] w-[60vw] h-[50vh] bg-gray-200/[0.1] blur-[120px] rounded-[100%] pointer-events-none animate-blob animation-delay-4000 mix-blend-multiply" />

      {/* 2. MAIN CONTENT */}
      <div className="relative z-10 w-full px-6 text-center flex flex-col items-center">
        
        {/* 'INTRODUCING' TAG */}
        <span 
          className="inline-block mb-6 text-sm md:text-base font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0s' }}
        >
          Introducing
        </span>

        {/* Headline */}
        <h1 
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-gray-900 mb-12 drop-shadow-sm opacity-0 animate-fade-in-up leading-[1.1] md:leading-tight"
          style={{ animationDelay: '0.1s' }}
        >
          India's First Doctor Led
          {/* Force break on desktop, natural wrap on mobile */}
          <br className="hidden md:block" /> 
          
          {/* Animated Gradient Text */}
          <span className="animate-text-shimmer bg-[linear-gradient(110deg,#9ca3af,45%,#000,55%,#9ca3af)] bg-[length:250%_100%] bg-clip-text text-transparent ml-2 md:ml-0">
             Medical Travel Portal.
          </span>
        </h1>
        
        {/* Subtext */}
        <p 
          className="text-sm md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed font-bold tracking-widest uppercase opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          Revolutionising Cross Border Medical Care
        </p>

      </div>

      {/* 3. CTA BUTTON - FIXED CENTERING
          - Converted button to <a> tag pointing to #inquiry-form
      */}
      <div className="absolute bottom-24 md:bottom-20 left-0 w-full flex justify-center z-20 pointer-events-none">
        <div 
          className="pointer-events-auto opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}
        >
          <a 
            href="#inquiry-form"
            onClick={scrollToForm}
            className="group relative px-8 py-3.5 bg-black text-white rounded-sm font-bold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_-5px_rgba(0,0,0,0.3)] flex items-center gap-2 overflow-hidden cursor-pointer"
          >
            <span className="relative z-10">Get Free Consultation</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 relative z-10" />
            
            {/* Button Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
          </a>
        </div>
      </div>

      {/* CUSTOM CSS FOR ANIMATIONS */}
      <style>{`
        /* 1. Entrance Fade In Up */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        /* 2. Text Gradient Shimmer */
        @keyframes textShimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .animate-text-shimmer {
          animation: textShimmer 5s ease-in-out infinite alternate;
        }

        /* 3. Background Blobs Floating */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* 4. Button Shine */
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        .group:hover .group-hover\:animate-shine {
          animation: shine 0.7s;
        }
      `}</style>
    </section>
  );
}