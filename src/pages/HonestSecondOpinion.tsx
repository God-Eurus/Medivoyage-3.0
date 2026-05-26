import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useInView, animate as fmAnimate } from 'framer-motion';
import {
  Send, Shield, Lock, EyeOff, CheckCircle, ArrowRight,
  UploadCloud, X, FileText, AlertCircle, ShieldCheck, ServerCrash,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
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

// ── Trust badges ──────────────────────────────────────────────────────────────
const trustBadges = [
  {
    icon: <Lock className="w-5 h-5" />,
    title: '256-bit SSL',
    desc: 'All data is encrypted in transit and at rest.',
  },
  {
    icon: <EyeOff className="w-5 h-5" />,
    title: 'Doctors Only',
    desc: 'Your files are seen by our clinical team — no one else.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Never Shared',
    desc: 'Your case is never shared with your current doctor.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Delete Anytime',
    desc: 'Email us to have all your data permanently removed.',
  },
];

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
    title: 'Conservative Management',
    desc: 'Rest, ice, compression, and time — often the first and safest path.',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
  },
  {
    title: 'Medical Management',
    desc: 'Medications, injections, and targeted pharmacological protocols.',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
  },
  {
    title: 'Physiotherapy',
    desc: 'Hands-on rehabilitation with certified physiotherapists.',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  },
  {
    title: 'Lifestyle Intervention',
    desc: 'Structured nutrition, movement, and sleep protocol changes.',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
  },
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

  const inputClass = 'w-full bg-white border border-gray-200 px-4 py-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all placeholder-gray-400 rounded-lg';
  const labelClass = 'block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2';

  // ── Success state ────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#fdfaf5] font-manrope flex flex-col">
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

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#fdfaf5] pt-32 pb-0 px-6 overflow-hidden">

        {/* Headline + subtitle */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-black leading-[1.02] mb-6">
            We prescribe<br />
            40% less surgeries
          </h1>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-md mx-auto">
            Just because someone said you need surgery doesn't mean you really do.
          </p>
        </motion.div>

        {/* Hero image — couple */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="relative mt-12 max-w-4xl mx-auto"
        >
          <img
            src="https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njd8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D"
            alt=""
            className="w-full h-[420px] md:h-[520px] object-cover object-top"
            style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
          />

          {/* CTA — floating brand pill, anchored over image */}
          <button
            onClick={() => document.getElementById('opinion-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="absolute left-1/2 -translate-x-1/2 bottom-12 md:bottom-16 bg-brand-blue hover:bg-[#1565c0] text-white text-sm md:text-base font-semibold px-10 py-4 rounded-lg shadow-xl shadow-brand-blue/30 transition-all hover:-translate-y-0.5"
          >
            Get Honest Second Opinion
          </button>
        </motion.div>
      </section>

      {/* ── TRUST BADGES ─────────────────────────────────────────────────── */}
      <div className="bg-brand-navy">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustBadges.map((b) => (
            <div key={b.title} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-teal/15 text-brand-teal flex items-center justify-center shrink-0">{b.icon}</div>
              <div>
                <p className="text-white text-sm font-bold mb-1">{b.title}</p>
                <p className="text-gray-400 text-xs leading-snug">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS DASHBOARD ──────────────────────────────────────────────── */}
      <section className="bg-[#fdfaf5] py-24 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4 block">By The Numbers</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-gray-900 leading-[1.05]">The results speak<br />for themselves.</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── Left card — animated bar chart ─────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg p-10 shadow-xl shadow-gray-200/50 border border-gray-100"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Total Cases Reviewed</p>
              <p className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-10 tracking-tight leading-none">
                <AnimatedNumber to={2100} />
                <span className="text-brand-teal">+</span>
              </p>

              {/* Bar chart — animated growth */}
              <div className="flex items-end gap-2 mb-3" style={{ height: '140px' }}>
                {barData.map((bar, i) => (
                  <div key={bar.label} className="flex flex-col items-center gap-1 flex-1">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${bar.h * 1.5}px` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      className={`w-full rounded-t-md ${bar.highlight ? 'bg-gradient-to-t from-brand-blue to-[#3a8ee6] shadow-md shadow-brand-blue/30' : 'bg-gray-200'}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-end gap-2 mb-8">
                {barData.map((bar) => (
                  <div key={bar.label} className="flex-1 text-center">
                    <span className={`text-[10px] font-semibold ${bar.highlight ? 'text-brand-blue' : 'text-gray-400'}`}>
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-brand-blue/5 border border-brand-blue/15 rounded-lg px-4 py-3 mb-8">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-brand-blue">480 cases</span> reviewed in January — our highest month yet.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    <AnimatedNumber to={1240} /><span className="text-brand-teal">+</span>
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1.5">On-Ground Appointments</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    <AnimatedNumber to={860} /><span className="text-brand-teal">+</span>
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1.5">Video Consultations</p>
                </div>
              </div>
            </motion.div>

            {/* ── Right card — animated donut chart ──────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white rounded-lg p-10 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Surgery Avoidance Rate</p>
              <p className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-10 max-w-md tracking-tight">
                Almost half the time, surgery wasn't actually needed.
              </p>

              <div className="flex items-center gap-10 flex-1">
                {/* Animated donut SVG */}
                <div className="relative w-44 h-44 shrink-0">
                  <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                    <defs>
                      <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a7be2" />
                        <stop offset="100%" stopColor="#1ed8ca" />
                      </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="78" fill="none" stroke="#f1f4f8" strokeWidth="20" />
                    <motion.circle
                      cx="100" cy="100" r="78"
                      fill="none"
                      stroke="url(#donutGrad)"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeDasharray="490"
                      initial={{ strokeDashoffset: 490 }}
                      whileInView={{ strokeDashoffset: 284 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-none tracking-tight">
                        <AnimatedNumber to={42} />
                        <span className="text-2xl text-brand-teal">%</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-base text-gray-700 leading-relaxed font-medium">
                    of referred cases <span className="text-brand-blue font-bold">avoided surgery</span> after our review.
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mt-10 pt-6 border-t border-gray-100">
                Healthcare shouldn't jump to life‑altering decisions before asking better questions.
              </p>

              <button
                onClick={() => document.getElementById('opinion-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-6 inline-flex items-center gap-2 bg-brand-blue hover:bg-[#1565c0] text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-lg transition-all hover:-translate-y-0.5 shadow-md shadow-brand-blue/30 self-start"
              >
                Get an Honest Opinion
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── WORLD MAP ────────────────────────────────────────────────────── */}
      <section className="bg-[#fdfaf5] py-24 md:py-28 px-6 border-t border-[#ece4d4]">
        <div className="max-w-6xl mx-auto">

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4 block">Global Reach</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-gray-900 mb-4 leading-[1.05]">
              Turns out second guessing<br />is a good thing.
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">We got calls from around the world.</p>
          </motion.div>

          {/* Map container with real world-map image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative rounded-lg overflow-hidden bg-white shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            {/* World map image (relative aspect for dot positioning) */}
            <div className="relative w-full" style={{ aspectRatio: '2 / 1' }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1280px-World_map_-_low_resolution.svg.png"
                alt="World map"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'opacity(0.45) saturate(0)' }}
              />

              {/* Brand-coloured dot overlay (percentage positions) */}
              {[
                { name: 'North America', x: '21%', y: '38%' },
                { name: 'Europe',        x: '49%', y: '30%' },
                { name: 'Middle East',   x: '58%', y: '44%' },
                { name: 'India',         x: '68%', y: '50%' },
                { name: 'Australia',     x: '82%', y: '72%' },
              ].map((dot, i) => (
                <motion.div
                  key={dot.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5, ease: 'backOut' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: dot.x, top: dot.y }}
                >
                  {/* Outer pulse ring */}
                  <div className="absolute inset-0 rounded-full bg-brand-blue/30 animate-ping" style={{ width: '28px', height: '28px', left: '-14px', top: '-14px' }} />
                  {/* Glow */}
                  <div className="absolute rounded-full bg-brand-blue/20" style={{ width: '32px', height: '32px', left: '-16px', top: '-16px' }} />
                  {/* Solid dot */}
                  <div className="relative w-3.5 h-3.5 rounded-full bg-brand-blue ring-2 ring-white shadow-lg shadow-brand-blue/50" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Region legend */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-10">
            {['North America', 'Europe', 'Middle East', 'India', 'Australia'].map((region) => (
              <div key={region} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-blue ring-2 ring-brand-blue/20" />
                <span className="text-sm font-semibold text-gray-700">{region}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── TREATMENT ALTERNATIVES ───────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-28 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="mb-12 text-center"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4 block">Before Any Surgery</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-gray-900 leading-[1.05]">
              Everything we try<br />before surgery.
            </h2>
          </motion.div>

          <div className="overflow-x-auto pb-4 -mx-6 px-6" style={{ scrollbarWidth: 'none' }}>
            <div className="flex gap-6 w-max">
              {treatmentCards.map((card, idx) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.55 }}
                  className="relative w-72 h-96 rounded-lg overflow-hidden shrink-0 group cursor-pointer shadow-lg"
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="w-10 h-1 bg-brand-teal mb-3 rounded-full" />
                    <p className="text-white font-extrabold text-lg leading-tight mb-2">{card.title}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="mt-12 text-center"
          >
            <button
              onClick={() => document.getElementById('opinion-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-brand-blue hover:bg-[#1565c0] text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-lg transition-all hover:-translate-y-0.5 shadow-lg shadow-brand-blue/30"
            >
              Get an Honest Opinion
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

        </div>
      </section>

      {/* ── FORM ─────────────────────────────────────────────────────────── */}
      <section id="opinion-form" className="py-24 md:py-28 px-6 bg-[#fdfaf5]">
        <div className="max-w-3xl mx-auto">

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4 block">Submit Your Case</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900 mb-3 leading-[1.05]">Your case, in 2 minutes.</h2>
            <p className="text-gray-500 text-sm md:text-base">Fields marked <span className="text-brand-blue font-bold">*</span> are required.</p>
          </motion.div>

          {/* White card wrapper around form for visual lift */}
          <div className="bg-white rounded-lg shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Row 1: Name + Email ─────────────────────────────────── */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Your Name *</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Full name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputClass} />
              </div>
            </motion.div>

            {/* ── WhatsApp ────────────────────────────────────────────── */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <label className={labelClass}>WhatsApp Number <span className="text-gray-400 normal-case tracking-normal font-normal">(optional — for faster response)</span></label>
              <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                placeholder="+971 50 000 0000" className={inputClass} />
            </motion.div>

            {/* ── Diagnosis ───────────────────────────────────────────── */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <label className={labelClass}>What have you been diagnosed with? *</label>
              <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                placeholder="e.g. Herniated L4-L5 disc, Stage 2 Breast Cancer, Coronary artery disease…"
                className={inputClass} />
            </motion.div>

            {/* ── Treatment ───────────────────────────────────────────── */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <label className={labelClass}>What treatment has been recommended? *</label>
              <input value={treatment} onChange={e => setTreatment(e.target.value)}
                placeholder="e.g. Spinal surgery, Chemotherapy, Angioplasty, Total knee replacement…"
                className={inputClass} />
            </motion.div>

            {/* ── Questions ───────────────────────────────────────────── */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <label className={labelClass}>What do you want to know? *</label>
              <textarea rows={4} value={questions} onChange={e => setQuestions(e.target.value)}
                placeholder={"e.g. Is surgery really necessary at this stage?\nAre there non-surgical alternatives?\nIs this diagnosis correct given my symptoms?"}
                className={inputClass + ' resize-none'} />
            </motion.div>

            {/* ── File Upload ─────────────────────────────────────────── */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <label className={labelClass}>
                Upload Your Reports
                <span className="text-gray-400 normal-case tracking-normal font-normal ml-2">
                  — MRI, CT, blood tests, prescriptions (PDF, JPG, PNG · max {MAX_FILE_MB}MB each · up to {MAX_FILES} files)
                </span>
              </label>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-2 border-2 border-dashed rounded-lg cursor-pointer transition-all px-6 py-10 text-center ${
                  dragging
                    ? 'border-brand-blue bg-brand-blue/5'
                    : 'border-gray-300 bg-white hover:border-brand-blue/50 hover:bg-brand-blue/[0.02]'
                }`}
              >
                <UploadCloud className={`w-8 h-8 mx-auto mb-3 transition-colors ${dragging ? 'text-brand-blue' : 'text-gray-400'}`} />
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  {dragging ? 'Drop files here' : 'Drop files here, or click to browse'}
                </p>
                <p className="text-xs text-gray-400">Reports, scans, prescriptions, lab results</p>
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
                    className="mt-3 space-y-2"
                  >
                    {files.map((f, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2.5"
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
                          <X className="w-3.5 h-3.5" />
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
                  className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Submit ─────────────────────────────────────────────── */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="group w-full bg-brand-blue hover:bg-[#1565c0] text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_30px_-8px_rgba(26,123,226,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_rgba(26,123,226,0.5)]"
              >
                {status === 'submitting' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span className="text-xs uppercase tracking-widest">Uploading &amp; submitting…</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-widest">Submit for Second Opinion</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Inline trust line under button */}
              <div className="flex items-center justify-center gap-5 mt-4">
                <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Lock className="w-3 h-3 text-gray-400" /> SSL encrypted
                </span>
                <span className="w-px h-3 bg-gray-200" />
                <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <EyeOff className="w-3 h-3 text-gray-400" /> Doctors only
                </span>
                <span className="w-px h-3 bg-gray-200" />
                <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Shield className="w-3 h-3 text-gray-400" /> Never shared
                </span>
              </div>
            </motion.div>

          </form>
          </div>
        </div>
      </section>

      {/* ── PROMISE STRIP ────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-20 px-6 text-center border-t border-white/5 relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-teal mb-4">Our promise</p>
          <p className="text-white font-extrabold text-2xl md:text-3xl lg:text-4xl tracking-tight max-w-2xl mx-auto leading-tight">
            We have no reason to agree — or <span className="text-brand-teal">disagree</span> — with your doctor.
          </p>
          <p className="text-gray-400 text-sm md:text-base mt-5 max-w-lg mx-auto leading-relaxed">
            MediVoyage earns nothing based on which path you choose. That is what makes this genuinely honest.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
