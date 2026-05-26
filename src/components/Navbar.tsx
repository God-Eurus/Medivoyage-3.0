import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, LogOut, User, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onHomeClick?: () => void;
  onTreatmentClick?: () => void;
  onAboutClick?: () => void;
  onWellnessClick?: () => void;
  onAIClick?: () => void;
  onSecondOpinionClick?: () => void;
  onTravelClick?: () => void;
  onDoctorsClick?: () => void;
  onSignOutClick?: () => void;
  onLoginClick?: () => void;
  userEmail?: string;
}

export function Navbar({
  onHomeClick, onTreatmentClick, onAboutClick,
  onWellnessClick, onAIClick, onSecondOpinionClick, onTravelClick, onDoctorsClick,
  onSignOutClick, onLoginClick, userEmail,
}: NavbarProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { label: 'About Us',       action: onAboutClick },
    { label: 'Treatments',     action: onTreatmentClick },
    { label: 'Doctors',        action: onDoctorsClick },
    // { label: 'Wellness',       action: onWellnessClick },
    { label: '2nd Opinion',    action: onSecondOpinionClick },
    { label: 'Travel',         action: onTravelClick },
    { label: 'AI',             action: onAIClick, highlight: true },
  ];

  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onHomeClick?.();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full font-manrope bg-white/80 backdrop-blur-xl border-b border-black/5">
      <div className="relative max-w-7xl mx-auto flex items-center justify-between md:justify-start px-4 md:px-6 py-3 overflow-x-auto md:overflow-visible scrollbar-hide">

        {/* Logo */}
        <div className="text-lg font-extrabold tracking-tight select-none whitespace-nowrap mr-6 shrink-0 z-10">
          <a href="/" onClick={handleLogoClick} className="cursor-pointer">
            <span className="hidden md:block">
              <span className="text-gray-400">MY </span>
              <span className="text-brand-blue">MEDIVOYAGE</span>
            </span>
            <span className="md:hidden text-brand-blue">MMV.</span>
          </a>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-5 md:gap-8 text-xs font-bold text-gray-500 shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 uppercase tracking-wide ml-auto md:ml-0">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              onClick={(e) => { e.preventDefault(); item.action?.(); }}
              className={`whitespace-nowrap cursor-pointer transition-colors ${
                item.highlight
                  ? 'text-brand-teal hover:text-brand-blue flex items-center gap-1'
                  : 'hover:text-brand-blue'
              }`}
            >
              {item.highlight && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
              )}
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3 ml-auto shrink-0 z-10">

          {/* Account dropdown (when logged in) */}
          {userEmail ? (
            /* Account dropdown (logged in) */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center">
                  <User className="w-3 h-3 text-brand-blue" />
                </div>
                <span className="max-w-[120px] truncate">{userEmail}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/60 py-1 overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Signed in as</p>
                    <p className="text-xs font-semibold text-gray-700 truncate">{userEmail}</p>
                  </div>
                  <button
                    onClick={() => { setAccountOpen(false); onSignOutClick?.(); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Sign In + Book Now (logged out) */
            <>
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 text-xs font-bold text-brand-blue border border-brand-blue/30 px-4 py-2 rounded-sm hover:bg-brand-blue/5 hover:border-brand-blue transition-all whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
              <a
                href="#inquiry-form"
                onClick={scrollToForm}
                className="bg-brand-blue text-white text-[10px] md:text-xs font-bold px-4 py-2 rounded-sm hover:bg-[#1565c0] transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-brand-blue/20 cursor-pointer"
              >
                Book Now
                <ArrowRight className="w-2.5 h-2.5" />
              </a>
            </>
          )}
        </div>

      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </header>
  );
}
