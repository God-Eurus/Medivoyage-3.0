import React from 'react';
import { ArrowRight } from 'lucide-react';

// 1. Define the props interface to match App.tsx navigation functions
interface NavbarProps {
  onHomeClick?: () => void;
  onTreatmentClick?: () => void;
  onAboutClick?: () => void;
}

export function Navbar({ onHomeClick, onTreatmentClick, onAboutClick }: NavbarProps) {
  
  // Define links and their corresponding actions
  const navItems = [
    { label: 'About Us', action: onAboutClick },
    { label: 'Treatments', action: onTreatmentClick },
    { label: 'Wellness', action: null } // Placeholder for future or scroll
  ];

  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('inquiry-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onHomeClick) {
      onHomeClick();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full font-manrope bg-white/80 backdrop-blur-xl border-b border-black/5">
      
      {/* CONTAINER */}
      <div className="relative max-w-7xl mx-auto flex items-center justify-between md:justify-start px-4 md:px-6 py-3 overflow-x-auto md:overflow-visible scrollbar-hide">
          
          {/* 1. LOGO (Left) - Link to Home */}
          <div className="text-lg font-extrabold tracking-tight select-none whitespace-nowrap mr-6 shrink-0 z-10">
            <a href="/" onClick={handleLogoClick} className="cursor-pointer">
                {/* Desktop: MY (Gray) + MEDIVOYAGE (Black) */}
                <span className="hidden md:block">
                <span className="text-gray-600">MY </span>
                <span className="text-black">MEDIVOYAGE</span>
                </span>
                
                {/* Mobile: MMV. */}
                <span className="md:hidden text-black">MMV.</span>
            </a>
          </div>

          {/* 2. LINKS (Centered on Desktop, Right on Mobile) */}
          <nav className="flex items-center gap-5 md:gap-8 text-xs font-bold text-gray-500 shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 uppercase tracking-wide ml-auto md:ml-0">
            {navItems.map((item) => (
              <a 
                key={item.label} 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (item.action) item.action();
                }}
                className="hover:text-black transition-colors whitespace-nowrap cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* 3. BOOK NOW BUTTON (Hidden on Mobile) */}
          <div className="hidden md:flex items-center ml-auto shrink-0 z-10">
            <a 
                href="#inquiry-form"
                onClick={scrollToForm}
                className="bg-black text-white text-[10px] md:text-xs font-bold px-4 py-2 rounded-sm hover:bg-gray-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-black/5 cursor-pointer"
            >
              Book Now
              <ArrowRight className="w-2.5 h-2.5" />
            </a>
          </div>

      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </header>
  );
}