import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, ArrowUpRight, Plus, Search, 
  ChevronDown, Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { StickyCTA } from './StickyCTA';
import { BottomInquiry } from './BottomInquiry'; 

// --- STATIC DATA (Kept outside for performance) ---
const medicalTreatments = [
  { 
    key: "cardiac", 
    title: "Cardiac Sciences", 
    desc: "Advanced cardiovascular interventions.",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "orthopaedics", 
    title: "Orthopaedics", 
    desc: "Joint replacement & sports medicine.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "cosmetic", 
    title: "Cosmetic Surgery", 
    desc: "Aesthetic & reconstructive procedures.",
    image: "https://images.unsplash.com/photo-1512462615634-82a9d8a59489?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "dental", 
    title: "Dental Care", 
    desc: "Implants, veneers & rehabilitation.",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "neuro", 
    title: "Neuro Sciences", 
    desc: "Brain & spine surgical excellence.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "general", 
    title: "General Surgery", 
    desc: "Minimally invasive laparoscopy.",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "ent", 
    title: "ENT", 
    desc: "Sinus, nasal & throat care.",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "gynae", 
    title: "Gynaecology", 
    desc: "Women's reproductive health.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "urology", 
    title: "Urology", 
    desc: "Kidney & prostate treatments.",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1000&auto=format&fit=crop"
  },
];

const subcategories: Record<string, { title: string; price: number; recovery: string }[]> = {
  cardiac: [
    { title: "Angiography", price: 375, recovery: "1 Day" },
    { title: "Angioplasty", price: 1450, recovery: "2 Days" },
    { title: "CABG (Bypass)", price: 3625, recovery: "3 Weeks" },
    { title: "Valve Replacement", price: 4500, recovery: "5 Weeks" },
  ],
  orthopaedics: [
     { title: "Knee Replacement", price: 2625, recovery: "4 Weeks" },
     { title: "Hip Replacement", price: 3200, recovery: "5 Weeks" },
     { title: "ACL Reconstruction", price: 2300, recovery: "4 Months" },
  ],
  cosmetic: [
      { title: "Rhinoplasty", price: 1800, recovery: "1 Week" },
      { title: "Liposuction", price: 1200, recovery: "4 Days" },
      { title: "Hair Transplant", price: 1500, recovery: "5 Days" }
  ],
  dental: [
      { title: "Dental Implants", price: 450, recovery: "2 Days" },
      { title: "Full Mouth Veneers", price: 3500, recovery: "1 Week" }
  ],
  neuro: [
      { title: "Craniotomy", price: 4800, recovery: "6 Weeks" },
      { title: "Spine Surgery", price: 3500, recovery: "8 Weeks" }
  ],
  general: [{ title: "Appendectomy", price: 1450, recovery: "2 Weeks" }],
  ent: [{ title: "Septoplasty", price: 1200, recovery: "1 Week" }],
  gynae: [{ title: "Hysterectomy", price: 1725, recovery: "3 Weeks" }],
  urology: [{ title: "Lithotripsy", price: 1100, recovery: "2 Days" }],
};

// 1. UPDATE INTERFACE FOR NAVIGATION
interface TreatmentProps {
  onHomeClick?: () => void;
  onTreatmentClick?: () => void;
  onAboutClick?: () => void;
  onBack?: () => void;
}

// 2. ACCEPT PROPS
export default function Treatment({ onHomeClick, onTreatmentClick, onAboutClick }: TreatmentProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (key: string) => {
    setActiveCategory(activeCategory === key ? null : key);
  };

  const scrollToForm = () => {
    document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredList = useMemo(() => {
    return medicalTreatments.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col font-manrope bg-white text-black selection:bg-black selection:text-white">
      
      {/* 3. PASS PROPS TO NAVBAR */}
      <Navbar 
        onHomeClick={onHomeClick} 
        onTreatmentClick={onTreatmentClick} 
        onAboutClick={onAboutClick} 
      />
      
      <div className="flex-grow pt-28 pb-0">
          
          {/* === 1. HEADER SECTION === */}
          <div className="max-w-6xl mx-auto px-6 mb-16">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-black pb-8">
                <div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] mb-4">
                        TREATMENT<br/>ARCHIVE.
                    </h1>
                    <p className="text-sm md:text-base font-medium text-gray-500 max-w-md leading-relaxed">
                        A curated directory of world-class procedures. 
                        Transparent, fixed pricing with JCI-accredited excellence.
                    </p>
                </div>

                {/* Search */}
                <div className="w-full md:w-auto min-w-[300px]">
                    <div className="relative border-b-2 border-gray-200 focus-within:border-black transition-colors">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                        <input 
                            type="text" 
                            placeholder="SEARCH PROCEDURES..." 
                            className="w-full pl-8 py-3 text-sm font-bold uppercase tracking-widest outline-none bg-transparent placeholder:text-gray-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
             </div>
          </div>

          {/* === 2. THE VISUAL ACCORDION === */}
          <div className="max-w-6xl mx-auto px-6 mb-24">
              <div className="flex flex-col">
                  {filteredList.map((category, index) => {
                      const isActive = activeCategory === category.key;
                      
                      return (
                          <motion.div 
                            key={category.key} 
                            className="border-b border-gray-200 last:border-b-0"
                            layout 
                          >
                              {/* HEADER ROW */}
                              <button 
                                onClick={() => toggleCategory(category.key)}
                                className="w-full py-8 group relative overflow-hidden"
                              >
                                  {/* Hover Background Reveal */}
                                  <div className={`absolute inset-0 bg-black transition-transform duration-500 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></div>

                                  <div className="relative z-10 flex items-center justify-between px-4">
                                      <div className="flex items-baseline gap-8">
                                          <span className={`text-sm font-bold font-mono ${isActive || 'group-hover:text-white'} text-gray-400 transition-colors`}>
                                              {(index + 1).toString().padStart(2, '0')}
                                          </span>
                                          <h3 className={`text-3xl md:text-5xl font-extrabold tracking-tight transition-colors ${isActive ? 'text-white' : 'text-black group-hover:text-white'}`}>
                                              {category.title}
                                          </h3>
                                      </div>
                                      
                                      <div className={`flex items-center gap-4 ${isActive ? 'text-white' : 'text-black group-hover:text-white'}`}>
                                          <span className="hidden md:block text-xs font-bold uppercase tracking-widest opacity-60">
                                              {category.desc}
                                          </span>
                                          {isActive ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                      </div>
                                  </div>
                              </button>

                              {/* EXPANDABLE VISUAL CONTENT */}
                              <AnimatePresence initial={false}>
                                  {isActive && (
                                      <motion.div
                                          initial="collapsed"
                                          animate="open"
                                          exit="collapsed"
                                          variants={{
                                            open: { opacity: 1, height: "auto" },
                                            collapsed: { opacity: 0, height: 0 }
                                          }}
                                          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                          className="overflow-hidden"
                                          style={{ willChange: "height, opacity" }}
                                      >
                                          <div className="py-8 px-4 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                                              
                                              {/* LEFT: IMAGE (4 Columns) */}
                                              <div className="md:col-span-5 h-64 md:h-auto relative overflow-hidden bg-gray-100">
                                                  <img 
                                                    src={category.image} 
                                                    alt={category.title}
                                                    className="w-full h-full object-cover transition-all duration-700 ease-in-out scale-105 hover:scale-100"
                                                    loading="lazy"
                                                  />
                                                  {/* Overlay Text */}
                                                  <div className="absolute bottom-0 left-0 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">
                                                      {subcategories[category.key]?.length} Procedures Available
                                                  </div>
                                              </div>

                                              {/* RIGHT: LIST (7 Columns) */}
                                              <div className="md:col-span-7 flex flex-col justify-center">
                                                  <div className="grid gap-4">
                                                      {subcategories[category.key]?.map((sub, i) => (
                                                          <div key={i} className="group/item flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 hover:border-black transition-colors cursor-default">
                                                              
                                                              <div className="mb-2 sm:mb-0">
                                                                  <h4 className="text-lg font-bold group-hover/item:translate-x-2 transition-transform duration-300">
                                                                    {sub.title}
                                                                  </h4>
                                                                  <div className="flex items-center gap-2 mt-1">
                                                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                                                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">
                                                                        Recovery: {sub.recovery}
                                                                    </span>
                                                                  </div>
                                                              </div>

                                                              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                                                  <span className="text-xl font-extrabold tracking-tight">
                                                                    ${sub.price.toLocaleString()}
                                                                  </span>
                                                                  <button 
                                                                    onClick={scrollToForm}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-black group-hover/item:bg-black group-hover/item:text-white transition-all"
                                                                  >
                                                                    <ArrowUpRight className="w-4 h-4" />
                                                                  </button>
                                                              </div>
                                                          </div>
                                                      ))}
                                                  </div>
                                                  
                                                  <div className="mt-8 pt-4 border-t-2 border-black flex justify-between items-center">
                                                      <p className="text-xs font-medium text-gray-500 max-w-xs">
                                                        *Prices include procedure, hospital stay, and medication.
                                                      </p>
                                                      <button 
                                                        onClick={scrollToForm}
                                                        className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:text-gray-600 transition-colors"
                                                      >
                                                        Book Consultation
                                                      </button>
                                                  </div>
                                              </div>

                                          </div>
                                      </motion.div>
                                  )}
                              </AnimatePresence>
                          </motion.div>
                      );
                  })}
              </div>
          </div>

          {/* === 3. BOTTOM FORM === */}
          <div id="inquiry-form">
            <BottomInquiry />
          </div>

      </div>
      <StickyCTA />
      <Footer />
    </div>
  );
}