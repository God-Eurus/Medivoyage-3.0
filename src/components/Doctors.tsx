import { Stethoscope, MapPin, Award, ArrowRight } from 'lucide-react';

const doctors = [
  {
    name: 'Dr. Anjali Desai',
    specialty: 'Chief Cardiologist',
    experience: '18+ Years Exp.',
    hospital: 'Apollo Hospitals, Mumbai',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
    tags: ['Bypass Surgery', 'Angioplasty']
  },
  {
    name: 'Dr. Rajesh Kumar',
    specialty: 'Senior Orthopedic Surgeon',
    experience: '22+ Years Exp.',
    hospital: 'Fortis Healthcare, Delhi',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop',
    tags: ['Knee Replacement', 'Spine Surgery']
  },
  {
    name: 'Dr. Sarah Williams',
    specialty: 'Cosmetic Surgeon',
    experience: '12+ Years Exp.',
    hospital: 'Medanta, Gurgaon',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=800&auto=format&fit=crop',
    tags: ['Rhinoplasty', 'Liposuction']
  },
  {
    name: 'Dr. Michael Chen',
    specialty: 'Implantologist',
    experience: '15+ Years Exp.',
    hospital: 'Manipal Hospitals, Bangalore',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
    tags: ['Dental Implants', 'Smile Design']
  }
];

export function Doctors() {
  return (
    <section className="py-24 bg-gray-50 font-manrope">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-3 block">
            Our Medical Network
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-black mb-6 tracking-tight">
            Meet Our Top Specialists
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            We partner exclusively with JCI-accredited hospitals and doctors who are leaders in their field.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="group bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Experience Badge */}
                <div className="absolute top-3 right-3 bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-sm flex items-center gap-1.5 shadow-md">
                  <Award className="w-3 h-3 text-white" />
                  {doctor.experience}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                
                {/* Name & Specialty */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-black mb-1 group-hover:text-gray-700 transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope className="w-3 h-3" />
                    {doctor.specialty}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 mb-6">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-600 font-medium leading-tight">
                    {doctor.hospital}
                  </span>
                </div>

                {/* Tags (Procedures) */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {doctor.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] font-bold bg-gray-50 text-gray-600 px-2 py-1 border border-gray-100 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button className="group inline-flex items-center gap-2 text-sm font-bold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
            View All 500+ Doctors
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}