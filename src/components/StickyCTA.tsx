import { MessageCircle, Phone, FileText } from 'lucide-react';

export function StickyCTA() {
  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number
    window.open('https://wa.me/919799636757?text=Hi, I would like to inquire about MediVoyage services.', '_blank');
  };

  const handleCallClick = () => {
    window.location.href = 'tel:+919799636757';
  };

  // UPDATED: Now finds the form ID and scrolls to it
  const scrollToForm = () => {
    const element = document.getElementById('inquiry-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* DESKTOP: Floating Concierge Buttons (Sharp & Minimal) */}
      <div className="hidden md:flex fixed bottom-8 right-8 z-50 flex-col gap-3">
        
        {/* 1. WhatsApp / Chat (Secondary - Outline) */}
        <button
          onClick={handleWhatsAppClick}
          className="group relative flex items-center justify-end"
          aria-label="Chat on WhatsApp"
        >
          {/* Label (Sharp box) */}
          <span className="absolute right-16 bg-black text-white px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 font-medium text-xs whitespace-nowrap border border-white/20 tracking-wide pointer-events-none">
            Chat with Concierge
          </span>
          
          {/* Button Square */}
          <div className="w-12 h-12 bg-black border border-white/20 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:border-white">
            <MessageCircle className="w-5 h-5" />
          </div>
        </button>

        {/* 2. Phone / Call (Primary - Solid White) */}
        <button
          onClick={handleCallClick}
          className="group relative flex items-center justify-end"
          aria-label="Call Now"
        >
          <span className="absolute right-16 bg-white text-black px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 font-bold text-xs whitespace-nowrap tracking-wide pointer-events-none shadow-lg">
            Call Specialist
          </span>
          
          <div className="w-12 h-12 bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Phone className="w-5 h-5 fill-current" />
          </div>
        </button>
      </div>

      {/* MOBILE: Sticky Bottom Bar (Dark Glass & Sharp) */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 z-50 md:hidden pb-safe">
        <div className="px-4 py-4 flex gap-3">
          
          {/* Secondary: WhatsApp */}
          <button
            onClick={handleWhatsAppClick}
            className="flex-1 bg-transparent border border-white/20 text-white font-semibold py-3 px-4 active:bg-white/10 transition flex items-center justify-center gap-2 rounded-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm tracking-wide">WhatsApp</span>
          </button>

          {/* Primary: Get Quote (Leads to Form) */}
          <button
            onClick={scrollToForm}
            className="flex-[1.5] bg-white text-black font-bold py-3 px-4 shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95 transition-all flex items-center justify-center gap-2 rounded-sm"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm tracking-wide">Get Free Quote</span>
          </button>
          
        </div>
      </div>
    </>
  );
}