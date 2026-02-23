import React from 'react';

// --- IMPORT YOUR COMPONENTS ---
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { PatientJourney } from '../components/PatientJourney';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Blogs from '../components/Blogs';
import FounderMessage from '../components/FounderMessage';

// --- NEW COMPONENTS (Create these files below) ---
import HeroTwo from '../components/HeroTwo';
import StickyMobileCTA from '../components/StickyMobileCTA';




export default function MediVoyageLanding() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-gray-800 relative">
      
      {/* 1. Navigation */}
      <Navbar />

      {/* 2. Hero Section (Includes Background, Text & Glass Form) */}
      <HeroTwo />

      {/* 3. Floating Buttons */}
      <WhatsAppButton />

      {/* 4. Steps / Slider Section */}
      
      <PatientJourney/>
        {/* 4. Founder Message Section */}
        <FounderMessage/>


      {/* 5. Statistics Bar */}
        <Testimonials/>
        {/* 5. Blog Section */}
        <Blogs/>
        {/* 6. FAQ Section */}
        <FAQ/>
    

      {/* 6. Footer */}
      <Footer />
        {/* 7. Sticky Mobile CTA */}
        <StickyMobileCTA />

    </div>
  );
}