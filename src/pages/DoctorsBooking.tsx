import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DOCTORS, type Doctor } from '../data/doctors';

// ── Calendly window type ─────────────────────────────────────────────────────
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

// ── Specialty filter chips ───────────────────────────────────────────────────
const SPECIALTY_FILTERS = [
  'All',
  'General Surgery',
  'Cardiology',
  'Obstetrics & Gynaecology',
  'Medical Oncology',
  'Anesthesia & Critical Care',
  'Anesthesia & Pain Management',
  'Fertility & IVF',
  'Orthopedics',
  'Dentistry',
];

// ── Time slots (mocked — in production this comes from Calendly availability) ─
const TIME_SLOTS = [
  '09:00 AM', '09:15 AM', '09:30 AM',
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:15 AM', '11:30 AM',
  '12:00 PM', '12:15 PM',
  '02:30 PM', '02:45 PM',
  '03:00 PM', '03:15 PM', '03:30 PM',
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getWeekDays(startDate: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatTimeShort(time: string): string {
  // "09:15 AM" → next-available format
  return time;
}

function formatNextAvailable(date: Date, time: string): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  return `${day} ${month} ${time}`;
}

function loadCalendlyScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') { resolve(false); return; }
    if (window.Calendly) { resolve(true); return; }
    if (!document.querySelector('link[href*="calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── NavProps shared by both views ────────────────────────────────────────────
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

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT — handles list / detail view switching internally
// ════════════════════════════════════════════════════════════════════════════
export default function DoctorsBooking(props: NavProps) {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [filter, setFilter] = useState<string>('All');

  // Detail-view state
  const [weekStart, setWeekStart] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'about' | 'hospital'>('about');

  const filteredDoctors = useMemo(
    () => (filter === 'All' ? DOCTORS : DOCTORS.filter((d) => d.filterTags.includes(filter))),
    [filter]
  );

  const openDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setView('detail');
    const today = new Date();
    setWeekStart(today);
    setSelectedDate(today);
    setSelectedTime('11:15 AM');
    setActiveTab('about');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const goBack = () => {
    setView('list');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleContinue = async () => {
    if (!selectedDoctor || !selectedTime) return;
    const loaded = await loadCalendlyScript();
    if (loaded && window.Calendly) {
      window.Calendly.initPopupWidget({ url: selectedDoctor.calendlyUrl });
    } else {
      window.open(selectedDoctor.calendlyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-white font-manrope flex flex-col">
      <Navbar {...props} />

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <ListView
              filter={filter}
              setFilter={setFilter}
              filteredDoctors={filteredDoctors}
              openDoctor={openDoctor}
            />
          </motion.div>
        ) : (
          selectedDoctor && (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <DetailView
                doctor={selectedDoctor}
                weekStart={weekStart}
                setWeekStart={setWeekStart}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onBack={goBack}
                onContinue={handleContinue}
              />
            </motion.div>
          )
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// LIST VIEW — specialty filter chips + 2-column doctor grid
// ════════════════════════════════════════════════════════════════════════════
interface ListViewProps {
  filter: string;
  setFilter: (s: string) => void;
  filteredDoctors: Doctor[];
  openDoctor: (doc: Doctor) => void;
}

function ListView({ filter, setFilter, filteredDoctors, openDoctor }: ListViewProps) {
  const filterScrollRef = useRef<HTMLDivElement>(null);

  const scrollFilters = (dir: 'left' | 'right') => {
    const node = filterScrollRef.current;
    if (!node) return;
    const amount = node.clientWidth * 0.6;
    node.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 pt-28 pb-20">

      {/* Filter chip row — chevrons live OUTSIDE the scroll container so they don't scroll with the chips */}
      <div className="flex items-center gap-2 mb-10">
        <button
          type="button"
          onClick={() => scrollFilters('left')}
          aria-label="Scroll filters left"
          className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>

        <div
          ref={filterScrollRef}
          className="flex items-center gap-2 overflow-x-auto pb-2 flex-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {SPECIALTY_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm font-medium px-5 py-2 rounded-full whitespace-nowrap transition-all shrink-0 ${
                filter === s
                  ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/30'
                  : 'border border-gray-200 text-gray-700 hover:border-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollFilters('right')}
          aria-label="Scroll filters right"
          className="w-9 h-9 rounded-full bg-brand-blue text-white flex items-center justify-center shrink-0 hover:bg-[#1565c0] transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Doctor cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} onSelect={() => openDoctor(doc)} />
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No doctors found for this specialty.
        </div>
      )}
    </div>
  );
}

// ── Doctor card ──────────────────────────────────────────────────────────────
interface DoctorCardProps {
  doctor: Doctor;
  onSelect: () => void;
}

function DoctorCard({ doctor, onSelect }: DoctorCardProps) {
  // Mock next-available slot (in production this comes from Calendly)
  const nextDate = new Date();
  const nextTime = ['09:00 AM', '09:15 AM', '11:15 AM', '03:15 PM'][doctor.id.length % 4];

  return (
    <div className="relative bg-[#f7f1e8] rounded-3xl overflow-hidden flex group cursor-pointer min-h-[440px] hover:shadow-xl hover:shadow-gray-300/50 transition-shadow" onClick={onSelect}>

      {/* Photo with gradient overlay */}
      <div className="relative w-[42%] shrink-0 overflow-hidden">
        <img src={doctor.photo} alt={doctor.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#f7f1e8]/40" />
      </div>

      {/* Info */}
      <div className="flex-1 p-8 pr-16 flex flex-col">
        <p className="text-xs md:text-sm text-gray-600 mb-2 leading-snug">{doctor.specialty}</p>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight mb-5">{doctor.name}</h3>

        <p className="text-base font-bold text-gray-900 mb-1.5">{doctor.years} Years</p>
        <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-auto">{doctor.qualifications}</p>

        {/* Book button */}
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="inline-flex items-center mt-6 self-start bg-brand-blue hover:bg-[#1565c0] text-white rounded-full overflow-hidden transition-colors shadow-md shadow-brand-blue/30"
        >
          <span className="px-4 py-2.5 text-xs md:text-sm font-semibold border-r border-white/30">
            {formatNextAvailable(nextDate, nextTime)}
          </span>
          <span className="px-4 py-2.5 text-xs md:text-sm font-bold">
            Book Now
          </span>
        </button>
      </div>

      {/* Top-right arrow button */}
      <button
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-brand-blue hover:bg-[#1565c0] text-white flex items-center justify-center transition-colors shadow-md shadow-brand-blue/30"
        aria-label="View doctor details"
      >
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DETAIL VIEW — Go back, doctor card, date picker, time slots, tabs, sticky bar
// ════════════════════════════════════════════════════════════════════════════
interface DetailViewProps {
  doctor: Doctor;
  weekStart: Date;
  setWeekStart: (d: Date) => void;
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;
  activeTab: 'about' | 'hospital';
  setActiveTab: (t: 'about' | 'hospital') => void;
  onBack: () => void;
  onContinue: () => void;
}

function DetailView({
  doctor, weekStart, setWeekStart, selectedDate, setSelectedDate,
  selectedTime, setSelectedTime, activeTab, setActiveTab, onBack, onContinue,
}: DetailViewProps) {
  const days = getWeekDays(weekStart);
  const currentMonth = weekStart.toLocaleDateString('en-US', { month: 'long' });

  const shiftWeek = (deltaDays: number) => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + deltaDays);
    setWeekStart(next);
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

  const isPastDay = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    return day < today;
  };

  return (
    <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 pt-24 pb-32">

      {/* Go back */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>

      {/* Doctor mini-card */}
      <div className="flex items-start gap-5 mb-12">
        <div className="w-20 h-20 rounded-full overflow-hidden shrink-0">
          <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">{doctor.specialty}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1.5">{doctor.name}</h1>
          <p className="text-base font-bold text-gray-900 mb-2">{doctor.years} Years</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {doctor.location}
          </p>
        </div>
      </div>

      {/* Select Date header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-500">Select Date</h2>
        <div className="flex items-center gap-3">
          <button onClick={() => shiftWeek(-7)} className="text-gray-500 hover:text-gray-900 transition-colors" aria-label="Previous week">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-base font-bold text-gray-900 min-w-[60px] text-center">{currentMonth}</span>
          <button onClick={() => shiftWeek(7)} className="text-gray-500 hover:text-gray-900 transition-colors" aria-label="Next week">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date pills */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {days.map((d) => {
          const past = isPastDay(d);
          const selected = isSameDay(d, selectedDate);
          return (
            <button
              key={d.toISOString()}
              disabled={past}
              onClick={() => setSelectedDate(d)}
              className={`flex flex-col items-center justify-center w-20 h-24 rounded-full transition-all shrink-0 ${
                selected
                  ? 'bg-gradient-to-b from-brand-navy to-brand-navy2 text-white shadow-lg shadow-brand-navy/30'
                  : past
                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                  : 'bg-white border border-gray-200 text-gray-900 hover:border-gray-400'
              }`}
            >
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold mb-1 ${
                  selected
                    ? 'bg-gradient-to-br from-brand-blue to-brand-teal text-white'
                    : past
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gray-100'
                }`}
              >
                {d.getDate()}
              </span>
              <span className={`text-xs font-medium ${past ? 'text-gray-300' : selected ? 'text-white/90' : 'text-gray-600'}`}>
                {d.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
            </button>
          );
        })}
      </div>

      {/* Time slot strip */}
      <div className="border-t border-gray-100 pt-1 mb-8">
        <div className="h-0.5 bg-gradient-to-r from-brand-blue to-brand-teal w-32 mb-5" />
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {TIME_SLOTS.map((time) => {
            const selected = selectedTime === time;
            return (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`text-sm font-semibold px-6 py-3 rounded-full transition-all shrink-0 ${
                  selected
                    ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      {/* About / Hospital tabs + content */}
      <div className="bg-[#f7f1e8] rounded-2xl px-8 py-10 mt-10">
        <div className="flex items-center gap-8 mb-6 border-b border-gray-300/50">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 text-base font-semibold transition-colors relative ${
              activeTab === 'about' ? 'text-brand-blue' : 'text-gray-500'
            }`}
          >
            About {doctor.name.split(' ').slice(0, 2).join(' ')}
            {activeTab === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('hospital')}
            className={`pb-3 text-base font-semibold transition-colors relative ${
              activeTab === 'hospital' ? 'text-brand-blue' : 'text-gray-500'
            }`}
          >
            {doctor.specialty.split(',')[0]} at {doctor.hospital.split(' ')[0]}
            {activeTab === 'hospital' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />
            )}
          </button>
        </div>

        {activeTab === 'about' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">About {doctor.name.replace('Dr. ', 'Dr. ').split(' ').slice(0, 3).join(' ')}</h3>
            <div className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {doctor.about}
            </div>
          </div>
        )}

        {activeTab === 'hospital' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{doctor.specialty.split(',')[0]} at {doctor.hospital}</h3>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {doctor.hospital} is a multi-specialty hospital offering comprehensive care across surgical and medical specialties. Patients consulting {doctor.name} have access to advanced operating theatres, imaging facilities and dedicated post-operative recovery suites — all coordinated by MediVoyage's medical concierge team.
            </p>
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 py-5 flex items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-none">{selectedTime || '—'}</p>
            <p className="text-xs text-gray-500 mt-1">
              {selectedDate.getDate()} {selectedDate.toLocaleDateString('en-US', { weekday: 'short' })}, {selectedDate.toLocaleDateString('en-US', { month: 'long' })} {selectedDate.getFullYear()}
            </p>
          </div>
          <button
            onClick={onContinue}
            disabled={!selectedTime}
            className="bg-brand-blue hover:bg-[#1565c0] text-white font-bold text-base px-12 py-4 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-blue/30 hover:-translate-y-0.5"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
