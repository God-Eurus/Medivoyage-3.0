import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Hotel, Calendar, Users, MapPin, Search, Star,
  ArrowRight, Clock, Building2, Phone,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface NavProps {
  onHomeClick?: () => void;
  onTreatmentClick?: () => void;
  onAboutClick?: () => void;
  onWellnessClick?: () => void;
  onAIClick?: () => void;
  onSecondOpinionClick?: () => void;
  onTravelClick?: () => void;
  onDoctorsClick?: () => void;
  onSignOutClick?: () => void;
  onLoginClick?: () => void;
  userEmail?: string;
}

// ── Medical-tourism destinations ─────────────────────────────────────────────
const destinations = [
  { code: 'DEL', label: 'New Delhi, India',     country: 'India',     hospitals: ['Apollo Hospital', 'Medanta', 'Fortis Escorts'] },
  { code: 'BOM', label: 'Mumbai, India',         country: 'India',     hospitals: ['Kokilaben Hospital', 'Lilavati Hospital'] },
  { code: 'MAA', label: 'Chennai, India',        country: 'India',     hospitals: ['Apollo Chennai', 'MIOT International'] },
  { code: 'BLR', label: 'Bangalore, India',      country: 'India',     hospitals: ['Manipal Hospital', 'Narayana Health'] },
  { code: 'BKK', label: 'Bangkok, Thailand',     country: 'Thailand',  hospitals: ['Bumrungrad International', 'Bangkok Hospital'] },
  { code: 'IST', label: 'Istanbul, Turkey',      country: 'Turkey',    hospitals: ['Acibadem', 'Memorial Hospital'] },
  { code: 'SIN', label: 'Singapore',             country: 'Singapore', hospitals: ['Mount Elizabeth', 'Raffles Hospital'] },
  { code: 'MEX', label: 'Mexico City, Mexico',   country: 'Mexico',    hospitals: ['ABC Medical Center', 'Hospital Angeles'] },
];

const treatments = [
  'Cardiac Surgery',
  'Orthopedic Surgery',
  'Cancer Treatment',
  'Cosmetic Surgery',
  'Fertility Treatment',
  'Dental Care',
  'Eye Surgery',
  'Bariatric Surgery',
  'Spine Surgery',
  'Other',
];

// ── Mock flight options ──────────────────────────────────────────────────────
const mockFlights = [
  { airline: 'Emirates',       code: 'EK 502', depart: '08:45', arrive: '20:30',   duration: '7h 15m', stops: 'Non-stop',     price: 845 },
  { airline: 'Qatar Airways',  code: 'QR 654', depart: '14:20', arrive: '02:55+1', duration: '8h 35m', stops: '1 stop (DOH)', price: 720 },
  { airline: 'Air India',      code: 'AI 142', depart: '22:15', arrive: '12:40+1', duration: '7h 25m', stops: 'Non-stop',     price: 695 },
  { airline: 'Etihad',         code: 'EY 215', depart: '03:30', arrive: '18:10',   duration: '9h 40m', stops: '1 stop (AUH)', price: 780 },
];

// ── Mock hotel options ───────────────────────────────────────────────────────
const mockHotels = [
  {
    name: 'The Taj Palace',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80',
    rating: 4.8,
    distanceTo: 'Apollo Hospital',
    distanceKm: '2.1',
    amenities: ['Free Wifi', 'Breakfast', 'Pool', 'Spa'],
    price: 180,
    perks: 'Free airport shuttle',
  },
  {
    name: 'JW Marriott Aerocity',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
    rating: 4.7,
    distanceTo: 'Medanta',
    distanceKm: '1.5',
    amenities: ['Free Wifi', 'Gym', 'Restaurant', 'Spa'],
    price: 220,
    perks: 'Medical recovery suites',
  },
  {
    name: 'Hyatt Regency',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80',
    rating: 4.6,
    distanceTo: 'Fortis Escorts',
    distanceKm: '0.8',
    amenities: ['Free Wifi', 'Pool', 'Restaurant', 'Concierge'],
    price: 165,
    perks: 'Extended-stay discount',
  },
  {
    name: 'Hilton Garden Inn',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    rating: 4.5,
    distanceTo: 'Apollo Hospital',
    distanceKm: '3.4',
    amenities: ['Free Wifi', 'Breakfast', 'Gym', 'Parking'],
    price: 125,
    perks: 'Free cancellation',
  },
];

export default function TravelPlanner(props: NavProps) {
  const [from, setFrom]             = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate]   = useState('');
  const [returnDate, setReturnDate]   = useState('');
  const [travelers, setTravelers]     = useState(1);
  const [treatment, setTreatment]     = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading]         = useState(false);

  const selectedDest = destinations.find((d) => d.code === destination);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !destination || !departDate) return;
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white font-manrope flex flex-col">
      <Navbar {...props} />

      {/* ── HERO + SEARCH FORM ───────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-blue-50 via-white to-white pt-32 pb-14 px-6">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4">
            Medical Travel Planner
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-4 leading-[1.05]">
            Plan your <span className="text-brand-blue">medical journey</span>.
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Find the best flights and hotels near top-rated hospitals worldwide. Tell us where you're going — we'll handle the rest.
          </p>
        </div>

        {/* Search form card */}
        <form
          onSubmit={handleSearch}
          className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/60 p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* From */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g. New York"
                  className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue transition-colors"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue appearance-none bg-white transition-colors"
                >
                  <option value="">Select city</option>
                  {destinations.map((d) => (
                    <option key={d.code} value={d.code}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Depart */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Departure</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue transition-colors"
                />
              </div>
            </div>

            {/* Return */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Return</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue transition-colors"
                />
              </div>
            </div>

            {/* Travelers */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Travelers</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue appearance-none bg-white transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Treatment */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Treatment type <span className="font-normal text-gray-400 normal-case tracking-normal">(optional)</span></label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue appearance-none bg-white transition-colors"
                >
                  <option value="">Any treatment</option>
                  {treatments.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={!from.trim() || !destination || !departDate || loading}
                className="w-full bg-brand-blue hover:bg-[#1565c0] text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-blue/20"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Searching…
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Find Flights &amp; Hotels
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Selected destination hospital hint */}
          {selectedDest && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Hospitals in {selectedDest.label}:</span>
              {selectedDest.hospitals.map((h) => (
                <span key={h} className="bg-brand-blue/5 text-brand-blue px-2.5 py-1 rounded-full text-[11px] font-semibold">
                  {h}
                </span>
              ))}
            </div>
          )}
        </form>

        {/* Trust strip */}
        <div className="max-w-5xl mx-auto mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><Plane className="w-3 h-3" /> Best price guarantee</span>
          <span className="flex items-center gap-1.5"><Hotel className="w-3 h-3" /> Hospital-vetted hotels</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 24/7 concierge support</span>
        </div>
      </section>

      {/* ── RESULTS (flights + hotels) ───────────────────────────────────── */}
      <AnimatePresence>
        {showResults && selectedDest && (
          <motion.section
            id="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-gray-50 py-16 px-6 flex-1"
          >
            <div className="max-w-6xl mx-auto">

              {/* Summary header */}
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
                    Travel options for {selectedDest.label}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {from} → {selectedDest.code} · {departDate}{returnDate && ` – ${returnDate}`} · {travelers} {travelers === 1 ? 'traveler' : 'travelers'}{treatment && ` · ${treatment}`}
                  </p>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-sm text-brand-blue font-semibold hover:underline"
                >
                  Modify search
                </button>
              </div>

              {/* ── Flights ─────────────────────────────────────────────── */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <Plane className="w-5 h-5 text-brand-blue" />
                  <h3 className="text-xl font-extrabold text-gray-900">Recommended flights</h3>
                  <span className="text-xs text-gray-400 ml-2">{mockFlights.length} options</span>
                </div>

                <div className="space-y-3">
                  {mockFlights.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-brand-blue/40 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Airline */}
                        <div className="flex items-center gap-3 md:min-w-[170px]">
                          <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                            <Plane className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900">{f.airline}</p>
                            <p className="text-xs text-gray-400">{f.code}</p>
                          </div>
                        </div>

                        {/* Times */}
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-center">
                            <p className="text-xl font-extrabold text-gray-900">{f.depart}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{from || 'Origin'}</p>
                          </div>
                          <div className="flex-1 text-center">
                            <p className="text-[10px] text-gray-400 mb-1">{f.duration}</p>
                            <div className="border-t border-dashed border-gray-300 relative">
                              <Plane className="w-3 h-3 text-gray-400 absolute -top-1.5 left-1/2 -translate-x-1/2 bg-white px-0.5" />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">{f.stops}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-extrabold text-gray-900">{f.arrive}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{selectedDest.code}</p>
                          </div>
                        </div>

                        {/* Price + book */}
                        <div className="flex items-center gap-4 md:min-w-[200px] md:justify-end">
                          <div className="text-right">
                            <p className="text-2xl font-extrabold text-gray-900">${f.price}</p>
                            <p className="text-[10px] text-gray-400">per person</p>
                          </div>
                          <button className="bg-brand-blue hover:bg-[#1565c0] text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shrink-0">
                            Select <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── Hotels ──────────────────────────────────────────────── */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Hotel className="w-5 h-5 text-brand-blue" />
                  <h3 className="text-xl font-extrabold text-gray-900">Hotels near hospitals</h3>
                  <span className="text-xs text-gray-400 ml-2">{mockHotels.length} options</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockHotels.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={h.image}
                          alt={h.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {h.rating}
                        </span>
                      </div>
                      <div className="p-5">
                        <h4 className="font-extrabold text-base text-gray-900 mb-1">{h.name}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                          <MapPin className="w-3 h-3" />
                          {h.distanceKm} km from {h.distanceTo}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {h.amenities.map((a) => (
                            <span key={a} className="text-[10px] text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                              {a}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-brand-teal font-semibold mb-4">✓ {h.perks}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xl font-extrabold text-gray-900">
                              ${h.price}
                              <span className="text-xs font-normal text-gray-400">/night</span>
                            </p>
                          </div>
                          <button className="bg-brand-blue hover:bg-[#1565c0] text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors">
                            Book
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Concierge banner */}
              <div className="mt-12 bg-brand-navy text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-brand-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold mb-2">Need help coordinating?</h3>
                    <p className="text-gray-400 text-sm max-w-md">
                      Our medical travel concierge can book everything — flights, hotels, hospital coordination, visa, airport transfers — in one call.
                    </p>
                  </div>
                </div>
                <button className="bg-brand-teal hover:bg-brand-teal/90 text-brand-navy font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl shrink-0 transition-all">
                  Talk to concierge
                </button>
              </div>

            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
