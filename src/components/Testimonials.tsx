import { useState } from 'react';
import { X, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Suvarcha Kalra',
    handle: 'UAE, Dubai',
    image: './suvarcha.jpeg',
    text: "Dr. Maharwal explained everything via video call before I even booked my procedure. My dental appointment & procedure was good and pain free and the nursing staff was incredibly attentive"
  },
  {
    name: 'Shivam Aangan',
    handle: 'Torronto, Canada',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    text: "While visiting India for a wedding, I was referred to MediVoyage by a friend and it turned out to be the best decision. The team ensured that my hospital in-time and out-time for both the consultation and MRI were under 90 minutes. "
  },
  {
    name: 'Heena Arora',
    handle: 'Zambia, Africa',
    image: './lady.jpg',
    text: "Very prompt and professional consultation. The team handled my respiratory treatment with utmost care. The follow-up post treatment was excellent too. Highly recommend Medivoyage"
  }
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Card Component to avoid duplication
  const TestimonialCard = ({ data, index, isMobile }: { data: typeof testimonials[0], index: number, isMobile?: boolean }) => (
    <div
      className={`bg-gray-50 text-black p-10 rounded-sm relative group shadow-lg flex flex-col justify-between min-h-[320px] border border-gray-100 ${
        !isMobile ? 'opacity-0 animate-fade-in-up' : 'animate-fade-in'
      }`}
      style={!isMobile ? { animationDelay: `${index * 200}ms` } : {}}
    >
      <div>
        {/* Top Row: Avatar + Name + Close Icon */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <img
              src={data.image}
              alt={data.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
            />
            <div className="leading-tight">
              <h3 className="font-bold text-base text-black flex items-center gap-2">
                {data.name}
                
              </h3>
              <p className="text-sm text-gray-500 font-medium">{data.handle}</p>
            </div>
          </div>
          
        </div>
        <p className="text-gray-600 text-base leading-relaxed font-medium">
          {data.text}
        </p>
      </div>
    </div>
  );

  return (
    <section className="pt-24 pb-40 bg-white font-manrope overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-24 md:mb-32 opacity-0 animate-fade-in-up">
          <h2 className="text-5xl lg:text-6xl font-extrabold text-black mb-6 tracking-tight">
            Read what people are saying
          </h2>
          <p className="text-gray-500 font-medium text-xl">
            Real feedback from patients using our global medical network.
          </p>
        </div>

        {/* --- MOBILE LAYOUT (Carousel) --- */}
        <div className="md:hidden">
          <div className="relative">
            {/* Display Active Card */}
            <TestimonialCard 
              data={testimonials[activeIndex]} 
              index={activeIndex} 
              isMobile={true} 
            />

            {/* Navigation Arrows */}
            <div className="flex justify-center items-center gap-6 mt-10">
              <button 
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === activeIndex ? 'bg-black w-4' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* --- DESKTOP LAYOUT (Grid) --- */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              data={testimonial} 
              index={index} 
            />
          ))}
        </div>

      </div>

      {/* CSS for Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
}