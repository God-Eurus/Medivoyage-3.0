// "use client";

// import React, { useRef } from 'react';
// import { ArrowRight, ChevronDown } from 'lucide-react';
// import { motion, useScroll, useTransform } from 'framer-motion';

// // --- Data ---
// const packages = [
//   {
//     title: "Holistic Retreats",
//     category: "Recovery",
//     description: "Post-operative care harmonizing body and mind. Combine clinical oversight with serene environments and gentle movement.",
//     image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     title: "Mineral Therapy",
//     category: "Rejuvenation",
//     description: "Access world-class thermal baths historically proven to alleviate stress, improve circulation, and reduce inflammation.",
//     image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     title: "Preventive Care",
//     category: "Longevity",
//     description: "Future-proof your health with high-tech screenings and personalized longevity plans designed for the executive lifestyle.",
//     image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     title: "Cellular Detox",
//     category: "Metabolic",
//     description: "A comprehensive metabolic reset featuring advanced IV therapies, lymphatic drainage, and cellular nutrition protocols.",
//     image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     title: "Sleep Optimization",
//     category: "Restoration",
//     description: "Regulate your circadian rhythm with specialized lighting, clinical sleep monitoring, and neuro-acoustic therapies.",
//     image: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     title: "Cognitive Focus",
//     category: "Mental Resilience",
//     description: "Ensure you are mentally resilient through guided meditation, neurofeedback, and expert clinical counseling.",
//     image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
//   }
// ];

// // --- Animation Variants ---
// const containerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.15 }
//   }
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 40 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
// };

// export default function Wellness() {
//   const containerRef = useRef(null);
  
//   // Parallax effects tied to scroll for the Hero
//   const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
//   const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
//   const opacityFade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

//   // Smooth scroll to the inquiry form at the bottom
//   const scrollToForm = () => {
//     document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
//   };

//   // Smooth scroll down from the hero section
//   const scrollDown = () => {
//     window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
//   };

//   return (
//     <div ref={containerRef} className="min-h-screen bg-[#faf9f6] font-sans text-gray-900 overflow-hidden relative">
      
//       {/* --- IMMERSIVE HERO SECTION --- */}
//       <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 sm:px-8 lg:px-16 overflow-hidden bg-black">
        
//         {/* Slow Zooming Background Image */}
//         <motion.div 
//           initial={{ scale: 1.1 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 10, ease: "easeOut" }}
//           className="absolute inset-0 z-0"
//         >
//           <img 
//             src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=2000" 
//             alt="Serene Wellness Retreat" 
//             className="w-full h-full object-cover opacity-60"
//           />
//           {/* Gradient Overlay perfectly blending into the #faf9f6 background below */}
//           <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#faf9f6]" />
//         </motion.div>

//         {/* Centered Parallax Text */}
//         <motion.div style={{ y: yParallax, opacity: opacityFade }} className="relative z-10 max-w-4xl pt-20">
//           <motion.span 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="block text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-white/80 mb-6"
//           >
//             The Art of Recovery
//           </motion.span>
          
//           <motion.h1 
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
//             className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-tighter text-white leading-[0.9] mb-8"
//           >
//             Curated <br className="md:hidden" />
//             <span className="italic font-light text-white/90">Wellness.</span>
//           </motion.h1>
          
//           <motion.p 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 0.8 }}
//             className="mt-8 text-base md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium"
//           >
//             True healing extends beyond the procedure. Explore our exclusive collection of recovery experiences designed to rejuvenate body and mind with precision.
//           </motion.p>
//         </motion.div>

//         {/* Scroll Indicator */}
//         <motion.button
//           onClick={scrollDown}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1, delay: 1.5 }}
//           className="absolute bottom-10 z-20 text-gray-400 hover:text-gray-800 transition-colors animate-bounce"
//         >
//           <ChevronDown size={32} strokeWidth={1} />
//         </motion.button>
//       </section>

//       {/* --- PROPER CARD GRID SECTION --- */}
//       <section className="py-24 px-4 sm:px-8 lg:px-16 relative z-20 overflow-hidden">
        
//         {/* Background Image specifically for the cards section */}
//         <div className="absolute inset-0 z-0 pointer-events-none">
//           <img 
//             src="https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=2000" 
//             alt="Textured Background" 
//             className="w-full h-full object-cover opacity-[0.15]" 
//           />
//           {/* Top and bottom gradient fades to blend seamlessly into the #faf9f6 background */}
//           <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f6] via-transparent to-[#faf9f6]" />
//         </div>

//         <div className="max-w-[90rem] mx-auto relative z-10">
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true, margin: "-100px" }}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
//           >
//             {packages.map((pkg, i) => (
//               <motion.div 
//                 key={i}
//                 variants={cardVariants}
//                 // Spring physics lift on hover
//                 whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
//                 className="group flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
//               >
                
//                 {/* 1. Image Top Half */}
//                 <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 shrink-0">
//                   <img 
//                     src={pkg.image} 
//                     alt={pkg.title}
//                     className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
//                   />
//                   {/* Subtle category tag overlaid on the image */}
//                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black">
//                     {pkg.category}
//                   </div>
//                 </div>

//                 {/* 2. Text Content Bottom Half */}
//                 <div className="p-8 flex flex-col flex-grow">
//                   <div className="flex-grow">
//                     <h3 className="text-2xl font-serif text-gray-900 mb-4 tracking-tight leading-snug">
//                       {pkg.title}
//                     </h3>
//                     <p className="text-gray-500 text-sm leading-relaxed mb-8">
//                       {pkg.description}
//                     </p>
//                   </div>
                  
//                   {/* Action Button anchored to the bottom */}
//                   <div className="mt-auto border-t border-gray-100 pt-6">
//                     <button 
//                       onClick={scrollToForm}
//                       className="inline-flex items-center text-xs font-bold uppercase tracking-[0.15em] text-black group-hover:text-gray-500 transition-colors w-full"
//                     >
//                       Book Now 
//                       <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-500 ease-out ml-auto" />
//                     </button>
//                   </div>
//                 </div>

//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* --- ENHANCED CTA SECTION --- */}
//      <section id="inquiry" className="relative py-40 md:py-64 bg-black text-white text-center px-4 overflow-hidden flex items-center justify-center">
        
//         {/* Background Image with Dark Gradient Overlay */}
//         <motion.div 
//           initial={{ scale: 1.1 }}
//           whileInView={{ scale: 1 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 1.5, ease: "easeOut" }}
//           className="absolute inset-0 z-0"
//         >
//           <img 
//             src="https://images.unsplash.com/photo-1758274538961-fe8f1f24166f?q=80&w=3131&auto=format&fit=crop" 
//             alt="Luxury Spa Architecture" 
//             className="w-full h-full object-cover opacity-30"
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/30" />
//         </motion.div>

//         {/* Content Container */}
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }} 
//           whileInView={{ opacity: 1, y: 0 }} 
//           viewport={{ once: true }} 
//           transition={{ duration: 0.8 }} 
//           className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
//         >
//           <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-6 block">
//             Take the next step
//           </span>
          
//           {/* Swapped to Manrope, adjusted sizing, and removed bottom margin since it's the last element */}
//           <h2 className="text-5xl md:text-7xl lg:text-8xl font-manrope font-light tracking-tighter leading-tight">
//             Design your recovery.
//           </h2>
//         </motion.div>
        
//       </section>

//     </div>
//   );
// }


// "use client";

// import React, { useRef } from 'react';
// import { ArrowRight, ChevronDown } from 'lucide-react';
// import { motion, useScroll, useTransform } from 'framer-motion';

// // --- Data Objects ---
// const featuredPrograms = [
//   {
//     title: "Holistic Retreats",
//     description: "Post-operative care harmonizing body and mind. Combine clinical oversight with serene environments.",
//     image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     title: "Mineral Therapy",
//     description: "Access world-class thermal baths historically proven to alleviate stress and reduce inflammation.",
//     image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     title: "Executive Preventive",
//     description: "Future-proof your health with high-tech screenings and bespoke longevity plans.",
//     image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
//   }
// ];

// const processSteps = [
//   { num: "01", title: "Clinical Consultation", desc: "A comprehensive assessment of your medical history, post-operative requirements, and personal wellness goals." },
//   { num: "02", title: "Bespoke Itinerary", desc: "Our concierges design a tailored pathway blending necessary clinical oversight with restorative therapies." },
//   { num: "03", title: "The Sanctuary", desc: "Arrive at your curated environment. Experience seamless integration of luxury hospitality and medical precision." },
//   { num: "04", title: "Integrated Aftercare", desc: "Healing doesn't stop when you leave. We provide ongoing nutritional and cognitive protocols for your return home." }
// ];

// // --- Animation Variants ---
// const fadeInUp = {
//   hidden: { opacity: 0, y: 40 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
// };

// const staggerContainer = {
//   hidden: { opacity: 0 },
//   show: { opacity: 1, transition: { staggerChildren: 0.15 } }
// };

// export default function Home() {
//   const heroRef = useRef(null);
//   const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
//   const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
//   const opacityFade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

//   const scrollDown = () => {
//     window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
//   };

//   return (
//     <div className="min-h-screen bg-black font-sans text-gray-900 overflow-hidden selection:bg-gray-300 selection:text-black">
      
//       {/* 1. IMMERSIVE HERO */}
//       <section ref={heroRef} className="relative h-screen flex flex-col justify-center items-center text-center px-4 sm:px-8 lg:px-16 overflow-hidden bg-black">
//         <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: "easeOut" }} className="absolute inset-0 z-0">
//           <img 
//             src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=2000" 
//             alt="Serene Wellness Retreat" 
//             className="w-full h-full object-cover opacity-50"
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#faf9f6]" />
//         </motion.div>

//         <motion.div style={{ y: yParallax, opacity: opacityFade }} className="relative z-10 max-w-5xl pt-20">
//           <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="block text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-white/80 mb-6">
//             Redefining Restoration
//           </motion.span>
          
//           <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-tighter text-white leading-[0.9] mb-8">
//             The Pinnacle of <br className="hidden md:block" />
//             <span className="italic font-light text-white/90">Clinical Wellness.</span>
//           </motion.h1>
          
//           <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="mt-8 text-base md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
//             Bridging the gap between medical precision and architectural serenity. A sanctuary designed for the executive lifestyle.
//           </motion.p>
//         </motion.div>

//         <motion.button onClick={scrollDown} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }} className="absolute bottom-10 z-20 text-gray-500 hover:text-gray-800 transition-colors animate-bounce">
//           <ChevronDown size={32} strokeWidth={1} />
//         </motion.button>
//       </section>

//       {/* 2. THE PHILOSOPHY (SEO Anchor) */}
//       <section className="py-32 md:py-48 px-4 sm:px-8 lg:px-16 bg-[#faf9f6] relative z-20">
//         <div className="max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
          
//           {/* Sticky Left Column */}
//           <div className="lg:w-5/12">
//             <div className="lg:sticky lg:top-40">
//               <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-6 block">Our Philosophy</span>
//               <h2 className="text-5xl lg:text-7xl font-serif text-gray-900 tracking-tighter leading-[1.1]">
//                 Healing is not a destination. <br />
//                 <span className="italic text-gray-500">It is a curated environment.</span>
//               </h2>
//             </div>
//           </div>

//           {/* Scrolling Right Column (SEO Text) */}
//           <div className="lg:w-7/12 flex flex-col justify-center lg:pt-32">
//             <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
//               <p className="text-xl md:text-3xl text-gray-800 leading-relaxed mb-12 font-serif">
//                 We believe that true recovery requires more than just world-class medical intervention. It requires an environment engineered for absolute peace, absolute privacy, and absolute physical restoration.
//               </p>
//               <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
//                 Our holistic recovery retreats merge post-operative care with five-star luxury hospitality. We remove the clinical sterility of standard recovery and replace it with thermal mineral therapy, personalized cellular nutrition, and cognitive resilience training. 
//               </p>
//               <p className="text-base md:text-lg text-gray-600 leading-relaxed">
//                 Whether you are recovering from a major procedure or future-proofing your health through executive preventive care, our clinical concierges manage every variable of your wellness journey.
//               </p>
//             </motion.div>
//           </div>
          
//         </div>
//       </section>

//       {/* 3. CURATED EXPERIENCES (Teaser) */}
//       <section className="py-32 md:py-48 px-4 sm:px-8 lg:px-16 bg-white border-t border-gray-100">
//         <div className="max-w-[90rem] mx-auto">
          
//           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
//             <div>
//               <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Specialized Pathways</span>
//               <h2 className="text-4xl md:text-6xl font-serif text-gray-900 tracking-tighter">Curated Experiences</h2>
//             </div>
//             <a href="/wellness" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors whitespace-nowrap">
//               Explore All Programs <ArrowRight size={14} />
//             </a>
//           </div>

//           <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {featuredPrograms.map((pkg, i) => (
//               <motion.div key={i} variants={fadeInUp} whileHover={{ y: -8 }} className="group flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer">
//                 <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
//                   <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
//                 </div>
//                 <div className="p-8 flex flex-col flex-grow">
//                   <h3 className="text-2xl font-serif text-gray-900 mb-4 tracking-tight">{pkg.title}</h3>
//                   <p className="text-gray-500 text-sm leading-relaxed">{pkg.description}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>

//         </div>
//       </section>

//       {/* 4. THE SANCTUARIES (Visual Breaker) */}
//       <section className="py-32 bg-black text-white overflow-hidden">
//         <div className="px-4 sm:px-8 lg:px-16 max-w-[90rem] mx-auto mb-16">
//           <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">The Facilities</span>
//           <h2 className="text-4xl md:text-6xl font-serif tracking-tighter">Architectural Silence.</h2>
//         </div>
        
//         {/* Staggered Masonry-style Flex Layout */}
//         <div className="flex flex-col md:flex-row gap-4 px-4 sm:px-8 lg:px-16 max-w-[100rem] mx-auto h-auto md:h-[60vh]">
//           <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="md:w-1/2 h-[50vh] md:h-full relative overflow-hidden group">
//             <img src="https://images.unsplash.com/photo-1730367019975-4ad8d9e14ef2?w=900&auto=format&fit=crop" alt="Spa Architecture" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
//             <div className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.2em] font-bold">Thermal Pools</div>
//           </motion.div>
//           <div className="md:w-1/2 flex flex-col gap-4 h-[100vh] md:h-full">
//             <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="h-1/2 relative overflow-hidden group">
//               <img src="https://images.unsplash.com/photo-1630443069393-3ed603e7f37a?q=80&w=2457&auto=format&fit=crop" alt="Private Villas" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
//               <div className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.2em] font-bold">Private Villas</div>
//             </motion.div>
//             <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }} className="h-1/2 relative overflow-hidden group">
//               <img src="https://images.unsplash.com/photo-1628744876497-eb30460be9f6?w=900&auto=format&fit=crop" alt="IV Lounges" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
//               <div className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.2em] font-bold">Clinical Lounges</div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* 5. THE CONCIERGE PROCESS */}
//       <section className="py-32 md:py-48 px-4 sm:px-8 lg:px-16 bg-[#faf9f6]">
//         <div className="max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-16">
//           <div className="lg:w-1/3">
//             <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">The Process</span>
//             <h2 className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tighter mb-6">Seamlessly Engineered.</h2>
//             <p className="text-gray-500 text-sm md:text-base leading-relaxed">From the moment you inquire, our clinical coordinators manage every logistical and medical variable, allowing you to focus entirely on restoration.</p>
//           </div>

//           <div className="lg:w-2/3 flex flex-col">
//             <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
//               {processSteps.map((step, index) => (
//                 <motion.div key={index} variants={fadeInUp} className="flex flex-col md:flex-row gap-6 md:gap-12 py-10 border-t border-gray-200 group">
//                   <span className="text-3xl md:text-4xl font-serif text-gray-300 group-hover:text-black transition-colors">{step.num}</span>
//                   <div>
//                     <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-3">{step.title}</h3>
//                     <p className="text-gray-500 text-base leading-relaxed max-w-xl">{step.desc}</p>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* 6. EDITORIAL SOCIAL PROOF */}
//       <section className="py-40 md:py-56 bg-white text-center px-4">
//         <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} viewport={{ once: true }} className="max-w-5xl mx-auto">
//           <div className="text-gray-300 text-8xl font-serif leading-none h-10 mx-auto w-max rotate-180 mb-8">"</div>
//           <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-gray-900 leading-tight tracking-tight mb-12">
//             "An absolute sanctuary. The clinical oversight was invisible yet omnipresent, allowing me to heal in pure architectural silence."
//           </h2>
//           <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">— A. Thompson, Executive</span>
//         </motion.div>
//       </section>

//       {/* 7. MINIMALIST FINAL CTA */}
//       <section className="relative py-40 md:py-64 bg-black text-white text-center px-4 overflow-hidden flex items-center justify-center">
//         <motion.div initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute inset-0 z-0">
//           <img src="https://images.unsplash.com/photo-1758274538961-fe8f1f24166f?q=80&w=3131&auto=format&fit=crop" alt="Luxury Architecture" className="w-full h-full object-cover opacity-30" />
//           <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/30" />
//         </motion.div>
//         <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
//           <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-6 block">Take the next step</span>
//           <h2 className="text-5xl md:text-7xl lg:text-8xl font-sans font-light tracking-tighter leading-tight cursor-pointer hover:text-gray-300 transition-colors">
//             Design your recovery.
//           </h2>
//         </motion.div>
//       </section>

//     </div>
//   );
// }
"use client";

import React, { useRef } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- Data Objects ---
const featuredPrograms = [
  {
    title: "Holistic Retreats",
    description: "Post-operative care harmonizing body and mind. Combine clinical oversight with serene environments.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Mineral Therapy",
    description: "Access world-class thermal baths historically proven to alleviate stress and reduce inflammation.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Executive Preventive",
    description: "Future-proof your health with high-tech screenings and bespoke longevity plans.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
  }
];

const processSteps = [
  { num: "01", title: "Clinical Consultation", desc: "A comprehensive assessment of your medical history, post-operative requirements, and personal wellness goals." },
  { num: "02", title: "Bespoke Itinerary", desc: "Our concierges design a tailored pathway blending necessary clinical oversight with restorative therapies." },
  { num: "03", title: "The Sanctuary", desc: "Arrive at your curated environment. Experience seamless integration of luxury hospitality and medical precision." },
  { num: "04", title: "Integrated Aftercare", desc: "Healing doesn't stop when you leave. We provide ongoing nutritional and cognitive protocols for your return home." }
];

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black font-sans text-gray-900 overflow-hidden selection:bg-gray-300 selection:text-black">
      
      {/* 1. IMMERSIVE HERO */}
      <section ref={heroRef} className="relative h-screen flex flex-col justify-center items-center text-center px-4 sm:px-8 lg:px-16 overflow-hidden bg-black">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: "easeOut" }} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=2000" 
            alt="Serene Wellness Retreat" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#faf9f6]" />
        </motion.div>

        <motion.div style={{ y: yParallax, opacity: opacityFade }} className="relative z-10 max-w-5xl pt-20">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="block text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/80 mb-6">
            Redefining Restoration
          </motion.span>
          
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif tracking-tighter text-white leading-[0.9] mb-6 md:mb-8">
            The Pinnacle of <br className="hidden sm:block" />
            <span className="italic font-light text-white/90">Clinical Wellness.</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="mt-6 md:mt-8 text-sm sm:text-base md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium px-4 md:px-0">
            Bridging the gap between medical precision and architectural serenity. A sanctuary designed for the executive lifestyle.
          </motion.p>
        </motion.div>

        <motion.button onClick={scrollDown} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }} className="absolute bottom-8 md:bottom-10 z-20 text-gray-500 hover:text-gray-800 transition-colors animate-bounce p-2">
          <ChevronDown size={32} strokeWidth={1} />
        </motion.button>
      </section>

      {/* 2. THE PHILOSOPHY (SEO Anchor) */}
      <section className="py-20 md:py-32 lg:py-48 px-4 sm:px-8 lg:px-16 bg-[#faf9f6] relative z-20">
        <div className="max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Sticky Left Column */}
          <div className="lg:w-5/12">
            <div className="lg:sticky lg:top-40">
              <span className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 md:mb-6 block">Our Philosophy</span>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-gray-900 tracking-tighter leading-[1.1]">
                Healing is not a destination. <br className="hidden md:block" />
                <span className="italic text-gray-500">It is a curated environment.</span>
              </h2>
            </div>
          </div>

          {/* Scrolling Right Column (SEO Text) */}
          <div className="lg:w-7/12 flex flex-col justify-center lg:pt-32">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}>
              <p className="text-lg sm:text-xl md:text-3xl text-gray-800 leading-relaxed mb-8 md:mb-12 font-serif">
                We believe that true recovery requires more than just world-class medical intervention. It requires an environment engineered for absolute peace, absolute privacy, and absolute physical restoration.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 md:mb-8">
                Our holistic recovery retreats merge post-operative care with five-star luxury hospitality. We remove the clinical sterility of standard recovery and replace it with thermal mineral therapy, personalized cellular nutrition, and cognitive resilience training. 
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                Whether you are recovering from a major procedure or future-proofing your health through executive preventive care, our clinical concierges manage every variable of your wellness journey.
              </p>
            </motion.div>
          </div>
          
        </div>
      </section>

      {/* 3. CURATED EXPERIENCES (Teaser) */}
      <section className="py-20 md:py-32 lg:py-48 px-4 sm:px-8 lg:px-16 bg-white border-t border-gray-100">
        <div className="max-w-[90rem] mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-8">
            <div>
              <span className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-3 md:mb-4 block">Specialized Pathways</span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-gray-900 tracking-tighter">Curated Experiences</h2>
            </div>
            <a href="/wellness" className="inline-flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors whitespace-nowrap">
              Explore All Programs <ArrowRight size={14} />
            </a>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredPrograms.map((pkg, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -8 }} className="group flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer">
                
                {/* Image Top Half */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 shrink-0">
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                
                {/* Text Content & Button Bottom Half */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-3 md:mb-4 tracking-tight">{pkg.title}</h3>
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 md:mb-8">{pkg.description}</p>
                  </div>
                  
                  {/* Action Button anchored to the bottom */}
                  <div className="mt-auto border-t border-gray-100 pt-5 md:pt-6">
                    <a 
                      href="/wellness" // Or route directly to an inquiry form/modal
                      className="inline-flex items-center text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-black group-hover:text-gray-500 transition-colors w-full"
                    >
                      Book Now 
                      <ArrowRight size={14} className="transform group-hover:translate-x-2 transition-transform duration-500 ease-out ml-auto" />
                    </a>
                  </div>
                </div>

              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* 4. THE SANCTUARIES (Visual Breaker) */}
      <section className="py-20 md:py-32 lg:py-40 bg-black text-white overflow-hidden">
        <div className="px-4 sm:px-8 lg:px-16 max-w-[90rem] mx-auto mb-10 md:mb-16">
          <span className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-3 md:mb-4 block">The Facilities</span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif tracking-tighter">Architectural Silence.</h2>
        </div>
        
        {/* Bulletproof Responsive Grid for Sanctuaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 sm:px-8 lg:px-16 max-w-[100rem] mx-auto">
          {/* Left Large Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-[50vh] md:h-[60vh] lg:h-[80vh] relative overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1730367019975-4ad8d9e14ef2?w=900&auto=format&fit=crop" alt="Spa Architecture" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute bottom-6 left-6 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">Thermal Pools</div>
          </motion.div>
          
          {/* Right Two Stacked Images */}
          <div className="grid grid-rows-2 gap-4 h-[60vh] md:h-[60vh] lg:h-[80vh]">
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="relative overflow-hidden group w-full h-full">
              <img src="https://images.unsplash.com/photo-1630443069393-3ed603e7f37a?q=80&w=2457&auto=format&fit=crop" alt="Private Villas" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute bottom-6 left-6 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">Private Villas</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }} className="relative overflow-hidden group w-full h-full">
              <img src="https://images.unsplash.com/photo-1628744876497-eb30460be9f6?w=900&auto=format&fit=crop" alt="IV Lounges" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute bottom-6 left-6 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">Clinical Lounges</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. THE CONCIERGE PROCESS */}
      <section className="py-20 md:py-32 lg:py-48 px-4 sm:px-8 lg:px-16 bg-[#faf9f6]">
        <div className="max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="lg:w-1/3">
            <span className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-3 md:mb-4 block">The Process</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 tracking-tighter mb-4 md:mb-6">Seamlessly Engineered.</h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">From the moment you inquire, our clinical coordinators manage every logistical and medical variable, allowing you to focus entirely on restoration.</p>
          </div>

          <div className="lg:w-2/3 flex flex-col">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}>
              {processSteps.map((step, index) => (
                <motion.div key={index} variants={fadeInUp} className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-12 py-8 md:py-10 border-t border-gray-200 group">
                  <span className="text-3xl md:text-4xl font-serif text-gray-300 group-hover:text-black transition-colors">{step.num}</span>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-gray-900 mb-2 md:mb-3">{step.title}</h3>
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL SOCIAL PROOF */}
      <section className="py-24 md:py-40 lg:py-56 bg-white text-center px-4 sm:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} viewport={{ once: true }} className="max-w-4xl lg:max-w-5xl mx-auto">
          <div className="text-gray-200 text-6xl md:text-8xl font-serif leading-none h-8 md:h-10 mx-auto w-max rotate-180 mb-6 md:mb-8">"</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-snug md:leading-tight tracking-tight mb-8 md:mb-12">
            "An absolute sanctuary. The clinical oversight was invisible yet omnipresent, allowing me to heal in pure architectural silence."
          </h2>
          <span className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">— A. Thompson, Executive</span>
        </motion.div>
      </section>

      {/* 7. MINIMALIST FINAL CTA */}
      <section className="relative py-32 md:py-48 lg:py-64 bg-black text-white text-center px-4 overflow-hidden flex items-center justify-center">
        <motion.div initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1758274538961-fe8f1f24166f?q=80&w=3131&auto=format&fit=crop" alt="Luxury Architecture" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/30" />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 md:mb-6 block">Take the next step</span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-sans font-light tracking-tighter leading-tight cursor-pointer hover:text-gray-300 transition-colors">
            Design your recovery.
          </h2>
        </motion.div>
      </section>

    </div>
  );
}