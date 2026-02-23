import React from 'react';
import { Shield, Globe, Users, Building2, ArrowRight, Award } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { StickyCTA } from './StickyCTA';
import { BottomInquiry } from './BottomInquiry';

// 1. Define Interface for Navigation Props
interface AboutUsProps {
  onHomeClick?: () => void;
  onTreatmentClick?: () => void;
  onAboutClick?: () => void;
}

// 2. Accept Props in Component
export default function AboutUs({ onHomeClick, onTreatmentClick, onAboutClick }: AboutUsProps) {
  
  const partners = [
    { name: "Apollo Hospitals", location: "India", accreditation: "JCI Accredited" },
    { name: "Fortis Healthcare", location: "India", accreditation: "JCI Accredited" },
    { name: "Medanta - The Medicity", location: "India", accreditation: "JCI / NABH" },
    { name: "Manipal Hospitals", location: "India", accreditation: "JCI Accredited" },
    { name: "Bumrungrad Intl.", location: "Thailand", accreditation: "JCI Accredited" }, // Shortened name for mobile
    { name: "Acibadem Healthcare", location: "Turkey", accreditation: "JCI Accredited" },
  ];

  const investors = [
    { name: "Global Health", type: "Seed Investor" },
    { name: "Sequoia India", type: "Series A" },
    { name: "Y Combinator", type: "Accelerator" },
    { name: "Techstars", type: "Strategic Partner" }
  ];

  return (
    <div className="min-h-screen flex flex-col font-manrope bg-white text-black selection:bg-black selection:text-white">
      
      {/* 3. Pass Navigation Props to Navbar */}
      <Navbar 
        onHomeClick={onHomeClick} 
        onTreatmentClick={onTreatmentClick} 
        onAboutClick={onAboutClick} 
      />
      
      <div className="flex-grow pt-24 md:pt-32">
          
          {/* === 1. HERO SECTION === */}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 md:mb-24">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 border-b border-black pb-8 md:pb-12">
                <div className="max-w-3xl">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4 md:mb-6 block">
                      Our Manifesto
                    </span>
                    <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-4 md:mb-6">
                        HEALTHCARE<br/>WITHOUT BORDERS.
                    </h1>
                </div>
                <div className="md:w-1/3">
                    <p className="text-base md:text-lg font-medium text-gray-600 leading-relaxed">
                        We are dismantling the barriers of cost and geography. MediVoyage is the bridge between you and the world's finest medical institutions.
                    </p>
                </div>
             </div>
          </div>

          {/* === 2. THE ORIGIN STORY (Editorial Layout) === */}
          <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 md:mb-32">
              <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                  
                  {/* Image */}
                  <div className="w-full md:w-1/2">
                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-sm group">
                          <img 
                            src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1000&auto=format&fit=crop" 
                            alt="Medical Team Meeting" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                          />
                          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-white p-4 md:p-6 shadow-xl border border-gray-100">
                              <p className="text-lg md:text-xl font-bold italic leading-tight mb-2 md:mb-4">
                                  "Why should geography dictate your chance of survival?"
                              </p>
                              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">
                                  — The Question that started it all
                              </p>
                          </div>
                      </div>
                  </div>

                  {/* Text Content */}
                  <div className="w-full md:w-1/2 md:pt-12">
                      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 md:mb-8">
                          The Genesis.
                      </h2>
                      <div className="space-y-4 md:space-y-6 text-sm md:text-base text-gray-600 font-medium leading-relaxed border-l-2 border-black pl-6 md:pl-8">
                          <p>
                              It started with a simple bill. A routine surgery in New York was quoted at $45,000. Across the ocean, the exact same procedure cost $6,500.
                          </p>
                          <p>
                              The disparity wasn't just unfair; it was illogical.
                          </p>
                          <p>
                              MediVoyage was born to close this gap. We spent two years vetting hospitals, negotiating exclusive rates, and building a concierge network that handles everything from visas to post-op recovery.
                          </p>
                          <p className="text-black font-bold">
                              Today, we don't just book appointments. We engineer medical journeys that save money without compromising a single standard of care.
                          </p>
                      </div>

                      <div className="grid grid-cols-2 gap-8 mt-8 md:mt-12 pt-8 md:pt-12 border-t border-gray-100">
                          <div>
                              <span className="block text-3xl md:text-4xl font-extrabold text-black mb-1">5k+</span>
                              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">Patients Served</span>
                          </div>
                          <div>
                              <span className="block text-3xl md:text-4xl font-extrabold text-black mb-1">12</span>
                              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">Global Hubs</span>
                          </div>
                      </div>
                  </div>

              </div>
          </section>

          {/* === 3. PARTNER NETWORK (Directory List) === */}
          <section className="bg-gray-50 py-16 md:py-24 border-y border-black">
              <div className="max-w-5xl mx-auto px-6 lg:px-8">
                  <div className="text-center mb-12 md:mb-16">
                      <div className="inline-flex items-center gap-2 mb-4">
                          <Building2 className="w-4 h-4 text-black" />
                          <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">The Network</span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                          Our Hospital Partners.
                      </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-12 md:gap-y-4">
                      {partners.map((partner, index) => (
                          <div key={index} className="flex items-center justify-between p-4 md:p-6 bg-white border border-gray-200 hover:border-black transition-colors duration-300 group rounded-sm shadow-sm md:shadow-none">
                              <div className="flex items-center gap-3 md:gap-4">
                                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shrink-0">
                                      <Building2 className="w-4 h-4 md:w-5 md:h-5" />
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-base md:text-lg">{partner.name}</h3>
                                      <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">
                                          <Globe className="w-3 h-3" /> {partner.location}
                                      </div>
                                  </div>
                              </div>
                              {/* Hidden on very small screens to prevent layout break */}
                              <div className="hidden xs:flex items-center gap-1.5 px-2 md:px-3 py-1 bg-gray-50 rounded-sm border border-gray-100 shrink-0">
                                  <Shield className="w-3 h-3 text-black" />
                                  <span className="text-[9px] md:text-[10px] font-bold uppercase">{partner.accreditation}</span>
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  <div className="mt-12 text-center">
                      <p className="text-xs md:text-sm text-gray-500 font-medium">
                          And 40+ other specialized clinics worldwide.
                      </p>
                  </div>
              </div>
          </section>

          {/* === 4. BACKING PARTNERS (Trust Signals) === */}
          <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
                  <div className="md:w-1/3">
                      <h2 className="text-2xl md:text-3xl font-extrabold mb-3 md:mb-4">Backed by the Best.</h2>
                      <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">
                          Our mission is supported by leading global investors and healthcare accelerators who believe in transparent, borderless medicine.
                      </p>
                  </div>

                  <div className="md:w-2/3 w-full">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                          {investors.map((inv, i) => (
                              <div key={i} className="aspect-[3/2] border border-gray-200 flex flex-col items-center justify-center p-3 md:p-4 text-center hover:border-black transition-colors group cursor-default rounded-sm">
                                  <Award className="w-6 h-6 md:w-8 md:h-8 text-gray-300 group-hover:text-black mb-2 md:mb-3 transition-colors" />
                                  <span className="font-bold text-xs md:text-sm block">{inv.name}</span>
                                  <span className="text-[9px] md:text-[10px] font-bold uppercase text-gray-400 mt-0.5">{inv.type}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </section>

          {/* === 5. BOTTOM INQUIRY FORM === */}
          <div id="inquiry-form">
            <BottomInquiry />
          </div>

      </div>
      
      <StickyCTA />
      <Footer />
    </div>
  );
}