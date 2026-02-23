import React from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    // pb-32 on mobile (for sticky buttons), md:pb-8 on desktop (original look)
    <footer className="relative bg-white text-gray-600 font-manrope pt-12 pb-32 md:pb-8 overflow-hidden border-t border-gray-100">
      
      {/* MAIN CONTENT WRAPPER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 flex flex-col min-h-[400px]">
        
        {/* --- TOP SECTION: RESPONSIVE GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 md:gap-x-8 mb-20">
          
          {/* Column 1: ABOUT */}
          <div className="space-y-4">
            <h4 className="text-black text-xs font-bold tracking-widest uppercase mb-4 border-b border-black/10 pb-2 inline-block">
              About
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-black transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Our Mission</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Doctors</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Success Stories</a></li>
            </ul>
          </div>

          {/* Column 2: TREATMENTS */}
          <div className="space-y-4">
            <h4 className="text-black text-xs font-bold tracking-widest uppercase mb-4 border-b border-black/10 pb-2 inline-block">
              Treatments
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-black transition-colors">Hair Transplant</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Dental Care</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Cosmetic Surgery</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Orthopedics</a></li>
            </ul>
          </div>

          {/* Column 3: SERVICES */}
          <div className="space-y-4">
            <h4 className="text-black text-xs font-bold tracking-widest uppercase mb-4 border-b border-black/10 pb-2 inline-block">
              Services
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-black transition-colors">Concierge</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Travel Assist</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Visa Support</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Post-Op Care</a></li>
            </ul>
          </div>

          {/* Column 4: CONTACT & SOCIALS */}
          <div className="space-y-4">
            <h4 className="text-black text-xs font-bold tracking-widest uppercase mb-4 border-b border-black/10 pb-2 inline-block">
              Contact
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="mailto:medivoyagehealthcare@gmail.com" className="hover:text-black transition-colors break-all">medivoyagehealthcare@gmail.com</a></li>
              <li><a href="tel:+919799636757" className="hover:text-black transition-colors whitespace-nowrap">+91 9799636757</a></li>
              <li>
                 <div className="flex gap-3 mt-4">
                  <a href="#" className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="mt-auto">
          
          {/* 1. Big Title */}
          <h1 className="font-serif text-[13vw] md:text-[12vw] leading-[0.8] text-black tracking-tighter select-none whitespace-nowrap text-center md:text-left mb-6 md:mb-2">
            My MediVoyage
          </h1>

          {/* 2. Partition Line */}
          <div className="w-full h-px bg-gray-200 mb-6"></div>

          {/* 3. Bottom Row: Copyright Left, Legal Right */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
            
            {/* Left: Copyright */}
            <p className="order-2 md:order-1">
              ©2024 My MediVoyage. All rights reserved
            </p>

            {/* Right: Legal Links */}
            <div className="flex gap-6 order-1 md:order-2">
              <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-black transition-colors">Cookies</a>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}