import { Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function BottomInquiry() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate submission
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="inquiry-form" className="py-24 bg-gray-100 flex justify-center items-center font-manrope">
      
      {/* Container */}
      <div className="max-w-5xl w-full mx-4 sm:mx-6 lg:mx-8">
        
        {/* Card */}
        <div className="bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col md:flex-row min-h-[500px]">
          
          {/* LEFT: Image Section */}
          <div className="md:w-5/12 relative min-h-[300px] md:min-h-full">
            <img 
              src="./formtwo.jpg" 
              alt="Medical Consultant" 
              className="absolute inset-0 w-full h-full object-cover object-center" 
            />
            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            
            {/* Overlaid Text */}
            <div className="absolute bottom-8 left-8 text-white z-10">
              <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Direct Access</p>
              <p className="text-xl font-serif leading-tight">Speak with a Medical Coordinator today.</p>
            </div>
          </div>

          {/* RIGHT: Form Section */}
          <div className="md:w-7/12 p-8 lg:p-12 flex flex-col justify-center bg-white">
            
            {!submitted ? (
              <>
                <div className="mb-10">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Concierge Support
                  </span>
                  <h3 className="text-3xl font-extrabold text-black mb-3 tracking-tight">
                    Start Your Conversation
                  </h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-md">
                    Have specific questions about treatments or travel logistics? Get a personalized response within 60 minutes.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Inputs */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-gray-50 border-b-2 border-gray-100 px-4 py-3 text-sm font-medium text-black focus:outline-none focus:border-black focus:bg-white transition-all rounded-none placeholder-transparent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">Phone</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full bg-gray-50 border-b-2 border-gray-100 px-4 py-3 text-sm font-medium text-black focus:outline-none focus:border-black focus:bg-white transition-all rounded-none placeholder-transparent"
                      />
                    </div>
                  </div>

                  {/* Message Box */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">How can we help?</label>
                    <textarea 
                      rows={3}
                      required
                      className="w-full bg-gray-50 border-b-2 border-gray-100 px-4 py-3 text-sm font-medium text-black focus:outline-none focus:border-black focus:bg-white transition-all resize-none rounded-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button className="group w-full bg-black text-white font-bold py-4 shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mt-4">
                    <span className="uppercase tracking-widest text-xs">Send Request</span>
                    <Send className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
                  </button>

                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Message Sent</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  Our coordinator will contact you shortly via WhatsApp or Email.
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}