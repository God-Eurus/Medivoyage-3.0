import { useState, useEffect } from 'react';
import { X, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function PopupForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', need: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Trigger the popup 2 seconds after mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('inquiries').insert([formData]);
      if (error) throw error;
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsVisible(false); // Close automatically after success
        setIsSuccess(false);
        setFormData({ name: '', phone: '', email: '', need: '' });
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 font-manrope">
      
      {/* Dark Backdrop (Click to close) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-md p-8 shadow-2xl rounded-sm transform transition-all duration-300 scale-100 animate-in fade-in zoom-in slide-in-from-bottom-4">
        
        {/* Close Button */}
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content */}
        {!isSuccess ? (
          <>
            <div className="text-center mb-8">
              <span className="text-gray-500 font-bold text-xs tracking-widest uppercase block mb-3">
                Limited Time Offer
              </span>
              <h2 className="text-3xl font-extrabold text-black">
                Get Your Free Quote
              </h2>
              <p className="text-gray-500 text-sm mt-3 font-medium">
                Speak to our specialists today. Priority response guaranteed.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors rounded-sm font-medium"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors rounded-sm font-medium"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors rounded-sm font-medium"
                />
              </div>
              <textarea
                rows={3}
                placeholder="How can we help you?"
                required
                value={formData.need}
                onChange={(e) => setFormData({...formData, need: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors resize-none rounded-sm font-medium"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white font-bold py-4 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-lg shadow-black/20"
              >
                {isSubmitting ? 'Sending...' : 'Get My Quote'}
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-extrabold text-black mb-2">Request Received!</h3>
            <p className="text-gray-500 text-sm font-medium">We will contact you shortly.</p>
          </div>
        )}

      </div>
    </div>
  );
}