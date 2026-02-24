"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How do you handle medical visas and travel logistics?",
    answer: "Our dedicated concierge team manages the entire process. From fast-tracking medical visas to arranging private airport transfers and coordinating with your luxury accommodation, we ensure zero logistical friction."
  },
  {
    question: "Will I have clinical oversight after I leave the hospital?",
    answer: "Absolutely. We bridge the gap between hospital discharge and your flight home. You will be placed in a curated recovery environment with 24/7 nursing access, daily physician check-ins, and bespoke nutritional support."
  },
  {
    question: "Can my family or a companion travel with me?",
    answer: "Yes. We actively encourage companion travel. Our itineraries are designed to accommodate family members, ensuring they experience the same level of luxury hospitality, from adjoining private villas to curated local experiences while you rest."
  },
  {
    question: "How are the partner hospitals and surgeons vetted?",
    answer: "We operate an exclusive, closed-loop network. Every facility is internationally accredited (JCI), and every surgeon on our board has been rigorously vetted for their success rates, global training, and executive-level bedside manner."
  }
];

// Animation for the accordion content expanding/collapsing
const accordionVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

export function FaqSection() {
  // State to track which question is open. Null means all are closed.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 md:py-40 bg-white font-manrope overflow-hidden text-black border-t border-gray-100">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* --- LEFT SIDE: STICKY HEADER --- */}
        <div className="lg:w-1/3">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-40"
          >
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gray-400 block mb-6 md:mb-8">
              Inquiries
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter leading-[1.1] mb-6 md:mb-8">
              The <br className="hidden lg:block" />
              Details.
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium max-w-sm">
              Clarity is the first step of recovery. Everything you need to know about our global operations and clinical standards.
            </p>
          </motion.div>
        </div>

        {/* --- RIGHT SIDE: ACCORDION LIST --- */}
        <div className="lg:w-2/3">
          <div className="flex flex-col border-t border-black">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              
              return (
                <div 
                  key={index}
                  className="border-b border-gray-200"
                >
                  {/* The Question Button */}
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full py-8 md:py-10 flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                  >
                    <h3 className={`text-xl md:text-2xl font-extrabold tracking-tight pr-8 transition-colors duration-300 ${isOpen ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>
                      {faq.question}
                    </h3>
                    
                    {/* Minimalist Plus/Minus Icon */}
                    <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                      <span className="absolute w-full h-[2px] bg-black" />
                      <span className={`absolute w-full h-[2px] bg-black transition-transform duration-500 ease-out ${isOpen ? 'rotate-0' : 'rotate-90'}`} />
                    </div>
                  </button>

                  {/* The Answer Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={accordionVariants}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed font-medium pb-10 max-w-2xl">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}