import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useInView, animate as fmAnimate } from 'framer-motion';
import {
  Send, Shield, Lock, EyeOff, CheckCircle, ArrowRight,
  UploadCloud, X, FileText, AlertCircle, ServerCrash,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WorldMap } from '../components/ui/map';
import { supabase } from '../lib/supabase';

/*
  ── Supabase setup (run once in SQL Editor) ──────────────────────────────────

  create table second_opinions (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    whatsapp text,
    diagnosis text not null,
    treatment text not null,
    questions text not null,
    report_urls text[],
    created_at timestamp with time zone default now()
  );

  ── Storage bucket (Supabase dashboard → Storage → New bucket) ──────────────
  Bucket name : second-opinion-reports
  Public      : OFF  (private bucket — signed URLs only)

  Then add this RLS policy so anyone can upload:
  create policy "Allow anon uploads"
    on storage.objects for insert
    with check (bucket_id = 'second-opinion-reports');
*/

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

const ACCEPTED = '.pdf,.jpg,.jpeg,.png,.heic,.dcm';
const MAX_FILE_MB = 20;
const MAX_FILES = 6;
const BUCKET = 'second-opinion-reports';

type UploadedFile = { file: File; url?: string; error?: string; uploading: boolean };

// ── Stats section data ────────────────────────────────────────────────────────
const barData: { label: string; h: number; highlight?: boolean }[] = [
  { label: 'Jul', h: 28 }, { label: 'Aug', h: 36 }, { label: 'Sep', h: 42 },
  { label: 'Oct', h: 50 }, { label: 'Nov', h: 46 }, { label: 'Dec', h: 58 },
  { label: 'Jan', h: 85, highlight: true },
  { label: 'Feb', h: 68 }, { label: 'Mar', h: 70 }, { label: 'Apr', h: 63 }, { label: 'May', h: 74 },
];

const treatmentCards = [
  { 
    title: "Conservative Management", 
    desc: "Non-invasive route curated to focus on nutrition plans, lifestyle changes, and helping your body recover.", 
    img: "https://images.unsplash.com/photo-1675270690434-aa99f4871e8a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fG51dHJpdGlvbmlzdHxlbnwwfDB8MHx8fDI%3D"
  },
  { 
    title: "Medical Management", 
    desc: "Sometimes a thoughtful treatment plan and the right medication can solve more than surgery can.", 
    img: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRvY3RvcnxlbnwwfDB8MHx8fDI%3D" 
  },
  { 
    title: "Physiotherapy", 
    desc: "A team that looks at movement, pain management, and Physio sessions as recovery alternatives. With experienced doctors and a physiotherapy team.", 
    img: "https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGh5c2lvdGhlcmFweXxlbnwwfDB8MHx8fDI%3D" 
  },
  { 
    title: "Diagnostic Review", 
    desc: "A meticulous second review of your MRIs and X-rays to ensure the initial diagnosis didn't miss subtle alternatives.", 
    img: "https://images.unsplash.com/photo-1758691462493-120a069304e6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG1lZGljYWwlMjByZXBvcnR8ZW58MHwwfDB8fHwy"
  },
  { 
    title: "Targeted Injections", 
    desc: "Minimally invasive corticosteroid or gel injections designed to relieve severe joint inflammation without cutting.", 
    img: "https://images.unsplash.com/photo-1691139600731-7232eaa980c3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGluamVjdGlvbnxlbnwwfDB8MHx8fDI%3D" 
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// ── Animated counter — counts from 0 to `to` when scrolled into view ────────
function AnimatedNumber({ to, duration = 1.8, suffix = '' }: { to: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = fmAnimate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

export default function HonestSecondOpinion(props: NavProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [questions, setQuestions] = useState('');

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handling ────────────────────────────────────────────────────────
  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const next = Array.from(incoming)
      .slice(0, MAX_FILES - files.length)
      .filter(f => f.size <= MAX_FILE_MB * 1024 * 1024)
      .map(file => ({ file, uploading: false }));
    setFiles(prev => [...prev, ...next].slice(0, MAX_FILES));
  }, [files.length]);

  const removeFile = (idx: number) =>
    setFiles(prev => prev.filter((_, i) => i !== idx));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  // ── Upload one file to Supabase Storage ─────────────────────────────────
  const uploadFile = async (item: UploadedFile, idx: number): Promise<string | null> => {
    setFiles(prev => prev.map((f, i) => i === idx ? { ...f, uploading: true } : f));
    const ext = item.file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, item.file);
    if (error) {
      setFiles(prev => prev.map((f, i) => i === idx ? { ...f, uploading: false, error: error.message } : f));
      return null;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const url = data.publicUrl;
    setFiles(prev => prev.map((f, i) => i === idx ? { ...f, uploading: false, url } : f));
    return url;
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !diagnosis.trim() || !treatment.trim() || !questions.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');

    // Upload all files in parallel
    const urls: (string | null)[] = await Promise.all(
      files.map((f, i) => f.url ? Promise.resolve(f.url) : uploadFile(f, i))
    );
    const report_urls = urls.filter(Boolean) as string[];

    const { error } = await supabase.from('second_opinions').insert([{
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim() || null,
      diagnosis: diagnosis.trim(),
      treatment: treatment.trim(),
      questions: questions.trim(),
      report_urls,
    }]);

    if (error) {
      setStatus('error');
      setErrorMsg('Submission failed — please try again or WhatsApp us directly.');
    } else {
      setStatus('success');
    }
  };

  const inputClass = 'w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-3.5 text-gray-900 text-sm focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all placeholder:text-gray-400';
  const labelClass = 'block text-[11px] font-bold text-gray-900 uppercase tracking-wide mb-2.5';

  // ── Success state ────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white font-manrope flex flex-col">
        <Navbar {...props} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-32 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div className="inline-flex w-24 h-24 rounded-full bg-brand-blue items-center justify-center mb-7 shadow-xl shadow-brand-blue/30">
              <CheckCircle className="w-11 h-11 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tighter mb-3">Case Received</h2>
            <p className="text-gray-500 text-base max-w-sm mx-auto leading-relaxed mb-2">
              Our clinical team will review your case and send an honest, independent opinion to
            </p>
            <p className="font-bold text-brand-blue text-sm mb-10">{email}</p>
            <p className="text-xs text-gray-400 mb-8">Expected response: within 24–48 hours</p>
            <button
              onClick={() => {
                setName(''); setEmail(''); setWhatsapp('');
                setDiagnosis(''); setTreatment(''); setQuestions('');
                setFiles([]); setStatus('idle');
              }}
              className="text-xs font-bold uppercase tracking-widest border-2 border-brand-blue text-brand-blue px-7 py-3.5 rounded-lg hover:bg-brand-blue hover:text-white transition-all"
            >
              Submit Another Case
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-manrope">
      <Navbar {...props} />

      {/* ── HERO — full-image background with text overlaid ──────────────── */}
      <section className="relative min-h-screen overflow-hidden">

  {/* Full-bleed background image */}
  <div className="absolute inset-0 z-0">
    <img
      src="/hosbg.png"
      alt=""
      className="w-full h-full object-cover object-center"
    />
    {/* Dark gradient overlay for text legibility */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />
  </div>

  {/* Content Container */}
  <motion.div
    initial="hidden"
    animate="show"
    variants={fadeUp}
    // Updated classes here: flex-col, justify-between, and min-h-screen
    className="relative z-10 flex flex-col justify-between items-center min-h-screen max-w-4xl mx-auto text-center px-6 py-8 md:py-16"
  >
    {/* Top Text Group */}
    <div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] font-extrabold tracking-tight text-white leading-[1.02] mb-6 drop-shadow-lg">
        We prescribe<br />
        40% less surgeries
      </h1>
      <p className="text-white/90 text-sm md:text-lg leading-relaxed max-w-xl mx-auto drop-shadow">
        Just because someone said you need surgery doesn't mean you really do.
      </p>
    </div>

    {/* Bottom CTA */}
    <button
      onClick={() => document.getElementById('opinion-form')?.scrollIntoView({ behavior: 'smooth' })}
      className="inline-flex items-center gap-2 bg-brand-blue hover:bg-[#1565c0] text-white text-sm md:text-base font-semibold px-10 py-4 mt-12 rounded-lg shadow-xl shadow-brand-blue/40 transition-all hover:-translate-y-0.5"
    >
      Get Honest Second Opinion
      <ArrowRight className="w-4 h-4" />
    </button>
  </motion.div>
</section>

      {/* ── STATS DASHBOARD ──────────────────────────────────────────────── */}
     <section className="bg-[#fafbfb] py-10 md:py-16 px-6 overflow-hidden flex items-center min-h-[85vh]">
  <div className="max-w-7xl mx-auto w-full">

    {/* Minimalist Left-Aligned Header */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-12 md:mb-14 max-w-3xl"
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4 block">
        Our Impact
      </span>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.05]">
        Data-driven clarity.<br />
        <span className="text-gray-400">Proven outcomes.</span>
      </h2>
    </motion.div>

    {/* Seamless Grid layout (Blends into background) */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 relative">

      {/* Center divider line that draws itself vertically on desktop */}
      <motion.div 
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block absolute top-0 bottom-0 left-[58.333%] w-[1px] bg-gray-200 origin-top"
      />

      {/* ── Left Column — Cases & Minimalist Graph (Spans 7 cols) ── */}
      <div className="lg:col-span-7 lg:pr-20 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">Total Cases Reviewed</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl md:text-[6.5rem] font-light tracking-tighter text-gray-900 leading-none">
              <AnimatedNumber to={2100} />
            </span>
            <span className="text-3xl md:text-4xl text-brand-blue font-light">+</span>
          </div>
        </motion.div>

        {/* Minimalist ultra-thin bar graph */}
        <div className="mt-10">
          <div className="flex items-end gap-2 md:gap-4 h-24 md:h-28 border-b border-gray-200 pb-3">
            {barData.map((bar, i) => (
              <div key={bar.label} className="flex flex-col items-center justify-end flex-1 h-full">
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  whileInView={{ height: `${bar.h * 1.1}px`, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.3 + (i * 0.1), 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className={`w-[2px] rounded-full ${bar.highlight ? 'bg-brand-blue shadow-[0_0_8px_rgba(26,123,226,0.4)]' : 'bg-gray-300'}`}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 md:gap-4 mt-3">
            {barData.map((bar) => (
              <div key={bar.label} className="flex-1 text-center">
                <span className={`text-[8px] md:text-[9px] uppercase tracking-widest ${bar.highlight ? 'text-brand-blue font-semibold' : 'text-gray-400'}`}>
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal structural line drawing itself */}
        <motion.div 
           initial={{ scaleX: 0 }}
           whileInView={{ scaleX: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
           className="h-[1px] w-full bg-gray-200 origin-left mt-8 mb-6"
        />

        <div className="grid grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 }}>
            <p className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight"><AnimatedNumber to={1240} />+</p>
            <p className="text-[10px] text-gray-500 mt-2 tracking-wide uppercase">On-Ground Consults</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.7 }}>
            <p className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight"><AnimatedNumber to={860} />+</p>
            <p className="text-[10px] text-gray-500 mt-2 tracking-wide uppercase">Video Consults</p>
          </motion.div>
        </div>
      </div>

      {/* ── Right Column — Avoidance Rate (Spans 5 cols) ── */}
      <div className="lg:col-span-5 lg:pl-20 flex flex-col justify-center mt-12 lg:mt-0">
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 0.4 }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">Surgery Avoidance</p>
          
          <div className="text-[5.5rem] md:text-[6.5rem] font-light tracking-tighter text-gray-900 leading-none mb-4">
            <AnimatedNumber to={42} /><span className="text-3xl md:text-4xl text-gray-300 font-light">%</span>
          </div>

          {/* Animated gradient accent line replacing the donut chart */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-[2px] w-full bg-gradient-to-r from-brand-blue to-[#1ed8ca] origin-left mb-8"
          />

          <p className="text-lg md:text-xl font-light text-gray-600 leading-relaxed">
            Almost half of our reviewed cases resulted in <span className="font-medium text-gray-900">avoiding unnecessary surgery.</span>
          </p>

          <p className="text-xs text-gray-400 leading-relaxed mt-6">
            Healthcare shouldn't jump to life‑altering decisions before asking better questions.
          </p>
        </motion.div>

        {/* Minimalist CTA Link instead of a heavy button */}
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 1 }}
           className="mt-12"
        >
          <button
            onClick={() => document.getElementById('opinion-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-brand-blue transition-colors"
          >
            Request Second Opinion
            <motion.span
              className="block"
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </motion.span>
          </button>
        </motion.div>
      </div>

    </div>
  </div>
</section>

      {/* ── WORLD MAP ────────────────────────────────────────────────────── */}
      <section className="bg-white pt-4 pb-16 md:pt-8 md:pb-24 px-0 overflow-hidden">

        {/* ── FULL WIDTH DIVIDER LINE (matches treatment + form sections) ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-[1px] w-full bg-gray-200 mb-12 md:mb-16 origin-left"
        />

        <div className="max-w-6xl mx-auto px-6">

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4 block">Global Reach</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4 leading-[1.05]">
              Turns out second guessing<br />is a good thing.
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">We got calls from around the world.</p>
          </motion.div>

          {/* Animated dotted world map — curves originate worldwide and converge on Jaipur */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative rounded-lg overflow-hidden bg-white shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            <WorldMap
              lineColor="#1a7be2"
              theme="light"
              dots={[
                { start: { lat: 40.7128,   lng: -74.0060, label: 'New York' },   end: { lat: 26.9124, lng: 75.7873, label: 'Jaipur' } },
                { start: { lat: 51.5074,   lng:  -0.1278, label: 'London' },     end: { lat: 26.9124, lng: 75.7873, label: 'Jaipur' } },
                { start: { lat: 25.2048,   lng:  55.2708, label: 'Dubai' },      end: { lat: 26.9124, lng: 75.7873, label: 'Jaipur' } },
                { start: { lat: -33.8688,  lng: 151.2093, label: 'Sydney' },     end: { lat: 26.9124, lng: 75.7873, label: 'Jaipur' } },
                { start: { lat: 1.3521,    lng: 103.8198, label: 'Singapore' },  end: { lat: 26.9124, lng: 75.7873, label: 'Jaipur' } },
                { start: { lat: -23.5505,  lng: -46.6333, label: 'São Paulo' },  end: { lat: 26.9124, lng: 75.7873, label: 'Jaipur' } },
              ]}
            />
          </motion.div>

          {/* Origin city legend */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-10">
            {['New York', 'London', 'Dubai', 'Singapore', 'Sydney', 'São Paulo'].map((region) => (
              <div key={region} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-blue ring-2 ring-brand-blue/20" />
                <span className="text-sm font-semibold text-gray-700">{region}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── TREATMENT ALTERNATIVES ───────────────────────────────────────── */}
     <section className="bg-white pt-4 pb-16 md:pt-8 md:pb-24 font-['Manrope',_sans-serif] overflow-hidden">
  
  {/* ── FULL WIDTH DIVIDER LINE ── */}
  <motion.div 
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    className="h-[1px] w-full bg-gray-200 mb-8 md:mb-12 origin-left"
  />

  {/* Header Container */}
  <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      // ── MASSIVE SPACE ADDED BELOW TITLE (mb-20 md:mb-28) ──
      className="mb-20 md:mb-28"
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4 block">
        Before Any Surgery
      </span>
      <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight text-gray-900 leading-[1.1]">
        Everything We Try<br />Before Surgery
      </h2>
    </motion.div>
  </div>

  {/* Full-Bleed Horizontal Scroll Container */}
  <div 
    className="w-full overflow-x-auto snap-x snap-mandatory pb-8"
    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
  >
    <div className="flex gap-[12px] w-max">
      
      {/* ── BULLETPROOF LEFT SPACER ── 
          Physically forces empty space. It matches your text padding exactly:
          6 on mobile, 12 on tablet, 16 on desktop, and automatically calculates the gap on ultra-wide monitors (2xl).
      */}
      <div className="shrink-0 w-6 md:w-12 lg:w-16 2xl:w-[calc((100vw-1536px)/2+4rem)]" />

      {treatmentCards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.7, 
            delay: idx * 0.05, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="relative w-[85vw] sm:w-[400px] md:w-[460px] shrink-0 snap-center md:snap-start h-[420px] md:h-[500px] rounded-[8px] overflow-hidden group bg-gray-100"
        >
          {/* Background Image */}
          <img
            src={card.img}
            alt={card.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Card Content */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end">
            <h3 className="text-white font-medium text-xl md:text-[22px] leading-tight tracking-tight mb-2">
              {card.title}
            </h3>
            
            {/* FIXED HEIGHT CONTAINER locking the title alignment perfectly */}
            <div className="h-[85px] md:h-[105px]">
              <p className="text-white/80 text-sm md:text-[14px] leading-relaxed font-normal pr-2">
                {card.desc}
              </p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* ── BULLETPROOF RIGHT SPACER ── 
          Ensures the very last card has matching breathing room on the right edge.
      */}
      <div className="shrink-0 w-6 md:w-12 lg:w-16 2xl:w-[calc((100vw-1536px)/2+4rem)]" />

    </div>
  </div>

</section>

      {/* ── FORM ─────────────────────────────────────────────────────────── */}
      <section id="opinion-form" className="py-16 md:py-24 px-6 bg-white font-['Manrope',_sans-serif]">
  
  {/* ── FULL WIDTH DIVIDER LINE ── */}
  <motion.div 
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    className="h-[1px] w-full bg-gray-200 mb-12 md:mb-16 origin-left"
  />

  {/* Increased width to max-w-4xl */}
  <div className="max-w-4xl mx-auto">

    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4 block">Submit Your Case</span>
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-3 leading-[1.05]">
        Your case, in 2 minutes.
      </h2>
      <p className="text-gray-500 text-sm md:text-[15px]">
        Fields marked <span className="text-brand-blue font-bold">*</span> are required.
      </p>
    </motion.div>

    {/* Minimalist flat card wrapper */}
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-12">

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── Row 1: Name + Email ─────────────────────────────────── */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          <div>
            <label className={labelClass}>Your Name *</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="Full name" 
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" 
              className={inputClass}
            />
          </div>
        </motion.div>

        {/* ── WhatsApp ────────────────────────────────────────────── */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <label className={labelClass}>
            WhatsApp Number <span className="text-gray-400 normal-case tracking-normal font-medium">(optional — for faster response)</span>
          </label>
          <input 
            value={whatsapp} 
            onChange={e => setWhatsapp(e.target.value)}
            placeholder="+971 50 000 0000" 
            className={inputClass}
          />
        </motion.div>

        {/* ── Diagnosis ───────────────────────────────────────────── */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <label className={labelClass}>What have you been diagnosed with? *</label>
          <input 
            value={diagnosis} 
            onChange={e => setDiagnosis(e.target.value)}
            placeholder="e.g. Herniated L4-L5 disc, Stage 2 Breast Cancer, Coronary artery disease…"
            className={inputClass}
          />
        </motion.div>

        {/* ── Treatment ───────────────────────────────────────────── */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <label className={labelClass}>What treatment has been recommended? *</label>
          <input 
            value={treatment} 
            onChange={e => setTreatment(e.target.value)}
            placeholder="e.g. Spinal surgery, Chemotherapy, Angioplasty, Total knee replacement…"
            className={inputClass}
          />
        </motion.div>

        {/* ── Questions ───────────────────────────────────────────── */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <label className={labelClass}>What do you want to know? *</label>
          <textarea 
            rows={4} 
            value={questions} 
            onChange={e => setQuestions(e.target.value)}
            placeholder={"e.g. Is surgery really necessary at this stage?\nAre there non-surgical alternatives?\nIs this diagnosis correct given my symptoms?"}
            className={inputClass + ' resize-none'}
          />
        </motion.div>

        {/* ── File Upload ─────────────────────────────────────────── */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <label className={labelClass}>
            Upload Your Reports
            <span className="text-gray-400 normal-case tracking-normal font-medium ml-2">
              — MRI, CT, blood tests, prescriptions (PDF, JPG, PNG · max {MAX_FILE_MB}MB each · up to {MAX_FILES} files)
            </span>
          </label>

          {/* Minimal drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-2 border border-dashed rounded-lg cursor-pointer transition-all px-6 py-10 text-center ${
              dragging
                ? 'border-brand-blue bg-brand-blue/5'
                : 'border-gray-300 bg-gray-50/30 hover:border-brand-blue/50 hover:bg-gray-50'
            }`}
          >
            <UploadCloud className={`w-8 h-8 mx-auto mb-3 transition-colors ${dragging ? 'text-brand-blue' : 'text-gray-400'}`} />
            <p className="text-[13px] font-semibold text-gray-900 mb-1">
              {dragging ? 'Drop files here' : 'Drop files here, or click to browse'}
            </p>
            <p className="text-xs text-gray-500">Reports, scans, prescriptions, lab results</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED}
              className="hidden"
              onChange={e => addFiles(e.target.files)}
            />
          </div>

          {/* File list */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 space-y-2"
              >
                {files.map((f, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-lg px-4 py-3"
                  >
                    <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-700 font-medium flex-1 truncate">{f.file.name}</span>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {(f.file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                    {f.uploading && (
                      <svg className="w-3.5 h-3.5 animate-spin text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    )}
                    {f.url && <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                    {f.error && <ServerCrash className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                    <button type="button" onClick={() => removeFile(i)}
                      className="text-gray-300 hover:text-gray-600 transition-colors shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Error ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg px-4 py-3"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Submit ─────────────────────────────────────────────── */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="pt-4">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="group w-full bg-brand-blue hover:bg-[#1565c0] text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-brand-blue/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {status === 'submitting' ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-xs uppercase tracking-[0.15em]">Uploading &amp; submitting…</span>
              </>
            ) : (
              <>
                <span className="text-xs uppercase tracking-[0.15em]">Submit for Second Opinion</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Inline trust line under button */}
          <div className="flex items-center justify-center gap-5 mt-6">
            <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
              <Lock className="w-3.5 h-3.5 text-gray-400" /> SSL encrypted
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
              <EyeOff className="w-3.5 h-3.5 text-gray-400" /> Doctors only
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
              <Shield className="w-3.5 h-3.5 text-gray-400" /> Never shared
            </span>
          </div>
        </motion.div>

      </form>
    </div>
  </div>
</section>
      

      <Footer />
    </div>
  );
}
