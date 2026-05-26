"use client";

import React from 'react';
import { motion } from 'framer-motion';

// --- Premium Animation Variants (matched to PatientJourney) ---
const revealText = {
  hidden: { y: "120%", rotate: 2 },
  show: { y: "0%", rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const fadeUpSlow = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

// --- Partner hospital logos ---
// Swap `src` for your real logo asset paths. `name` is used as alt text.
const partners = [
  { name: "Apollo Hospitals", src: "/logos/h1.svg" },
  { name: "Fortis Healthcare", src: "/logos/h2.svg" },
  { name: "Max Healthcare", src: "/logos/h3.svg" },
  { name: "Medanta", src: "/logos/h4.svg" },
  { name: "Manipal Hospitals", src: "/logos/h5.svg" },
  { name: "Narayana Health", src: "/logos/h6.svg" },
  { name: "Artemis Hospitals", src: "/logos/h7.svg" },
  { name: "BLK-Max", src: "/logos/h8.svg" },
  { name: "BLK-Max", src: "/logos/h9.svg" },
  { name: "Apollo Hospitals", src: "/logos/h10.svg" },
  { name: "Fortis Healthcare", src: "/logos/h11.svg" },
  { name: "Max Healthcare", src: "/logos/h12.svg" },
  { name: "Medanta", src: "/logos/h13.svg" },
{ name: "Manipal Hospitals", src: "/logos/h14.svg" },
];

// A single row of logos. Rendered twice inside the track for a seamless loop.
function LogoRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="flex items-center gap-12 md:gap-20 pr-12 md:pr-20 shrink-0"
      aria-hidden={ariaHidden}
    >
      {partners.map((partner, i) => (
        <li key={`${partner.name}-${i}`} className="shrink-0">
          <img
            src={partner.src}
            alt={partner.name}
            className="h-11 md:h-18 w-auto object-contain transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-100 hover:grayscale-0"
            draggable={false}
          />
        </li>
      ))}
    </ul>
  );
}

export function PartnerMarquee() {
  return (
    <section className="py-12 md:py-16 bg-[#faf9f6] font-manrope overflow-hidden">
      <div className="w-full flex flex-col items-center">

        {/* --- HEADER --- */}
        <div className="text-center mb-10 md:mb-14 px-4">
          <motion.span
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUpSlow}
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gray-400 block mb-5 font-manrope"
          >
            Our Network
          </motion.span>

          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ staggerChildren: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black tracking-tighter leading-[1.05] font-manrope flex flex-wrap justify-center gap-x-3 md:gap-x-5"
          >
            <div className="overflow-hidden pb-2"><motion.div variants={revealText}>Trusted</motion.div></div>
            <div className="overflow-hidden pb-2"><motion.div variants={revealText} className="font-light text-gray-400">Partners.</motion.div></div>
          </motion.h2>
        </div>

        {/* --- MARQUEE --- */}
        {/* Edge fade masks via mask-image; pause on hover via group. */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpSlow}
          className="group relative w-full
                     [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]
                     [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            <LogoRow />
            <LogoRow ariaHidden />
          </div>
        </motion.div>

      </div>

      {/* Scoped keyframes — translates exactly one row width (-50% of the doubled track) */}
      <style>{`
        @keyframes partner-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: partner-marquee 35s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `}</style>
    </section>
  );
}