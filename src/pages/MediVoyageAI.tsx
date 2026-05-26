import React, { useState, useRef, useEffect } from 'react';
import {
  Shield, CheckCircle2, ArrowRight, ArrowLeft, EyeOff, Stethoscope,
  RefreshCw, Zap, Sparkles, Check,
  ClipboardList, Globe, Plus, Plane, MapPin, User,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import Orb from '../components/Orb';
import { useAuth } from '../context/AuthContext';

interface NavProps {
  onHomeClick?: () => void;
  onTreatmentClick?: () => void;
  onAboutClick?: () => void;
  onWellnessClick?: () => void;
  onAIClick?: () => void;
  onUpgradeClick?: () => void;
  onSecondOpinionClick?: () => void;
  onTravelClick?: () => void;
  onDoctorsClick?: () => void;
  onSignOutClick?: () => void;
  onLoginClick?: () => void;
  userEmail?: string;
}

const trustBadges = [
  { icon: Shield,       label: 'HIPAA Compliant' },
  { icon: EyeOff,       label: 'Anonymous' },
  { icon: CheckCircle2, label: 'Doctor-reviewed and audited' },
];

// ── Specialty quick-start chips (shown above the input before chat starts) ──
const quickStartTopics = [
  { label: 'Symptom check',      prompt: 'I have a symptom I want to understand — let me describe it.' },
  { label: 'Medication question', prompt: 'I have a question about a medication I take.' },
  { label: 'Diabetes',            prompt: 'Help me understand my diabetes management.' },
  { label: 'Heart health',        prompt: 'I want to understand my heart health and blood pressure.' },
  { label: 'Mental wellness',     prompt: "I'd like to talk about how I've been feeling lately." },
  { label: 'Sleep',               prompt: "I've been having trouble sleeping. What should I do?" },
];

// ── localStorage keys for chat persistence (Doctronic-style "remembers you") ─
const STORAGE_KEYS = {
  messages: 'mv-ai-messages',
  consent:  'mv-ai-consent',
} as const;

// ── "Learn more about your health" article cards ─────────────────────────────
const learnArticles = [
  {
    title: 'Understanding GLP-1 Medications for Weight Management',
    desc: "Explore the transformative potential of GLP-1 medications like Ozempic, Wegovy, and Saxenda with MediVoyage's comprehensive guide.",
    cta: 'Learn about GLP-1s',
    img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=400&fit=crop&q=80',
  },
  {
    title: 'AI-Powered OBGYN & Gynecologic Consultations',
    desc: "Get fast, personalized guidance for menstrual health, pregnancy support, UTIs, and reproductive care with MediVoyage's advanced AI.",
    cta: 'Get an OBGYN consult',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80',
  },
  {
    title: 'How Our AI Symptom Checker Transforms Healthcare',
    desc: "Experience healthcare reimagined with MediVoyage's advanced AI symptom checker — combining cutting-edge artificial intelligence with clinical accuracy.",
    cta: 'Check your symptoms',
    img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400&h=400&fit=crop&q=80',
  },
  {
    title: 'Transform Your Healthcare Experience with AI Primary Care',
    desc: "Experience the future of healthcare with MediVoyage's advanced AI primary care services — combining cutting-edge artificial intelligence with personalized care.",
    cta: 'What is AI Primary Care?',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80',
  },
];

// ── Doctor testimonial + roster data ─────────────────────────────────────────
const doctorQuotes = [
  {
    quote: "I love being able to connect almost instantly to people from all over the country. Both the AI intake and the ability to get care from anywhere saves patients loads of time, trouble, and expense.",
    author: "Dr. Jeffrey Jones, MD",
  },
  {
    quote: "The AI handles the routine intake brilliantly, so by the time I'm on the call, I can focus entirely on the patient — not paperwork.",
    author: "Dr. Rajiv Patel, MD",
  },
  {
    quote: "What surprises me is how accurate the symptom triage is. It catches red flags that even seasoned clinicians sometimes miss in a quick first read.",
    author: "Dr. Barry Pevner, MD",
  },
  {
    quote: "MediVoyage lets me reach patients in rural areas who'd otherwise drive hours for a 15-minute consultation. That's transformative.",
    author: "Dr. Scott Jensen, MD",
  },
];

// ── Primary care use-case cards (moving carousel) ────────────────────────────
const primaryCareCards = [
  {
    title: 'Preparing for a doctor visit',
    chip: 'Summarize my health history for my doctor',
    desc: "Generate questions or get up to speed on your health before you step into your doctor's office.",
    img: 'https://images.unsplash.com/photo-1581952976147-5a2d15560349?w=600&q=80',
    chipPos: 'top-5 right-4',
  },
  {
    title: 'Finding peace of mind',
    chip: 'I have a symptom, is it serious?',
    desc: 'Answer 2am health concerns or get quick access to medical answers in a pinch.',
    img: 'https://images.unsplash.com/photo-1606060040726-faedb9c63462?w=600&q=80',
    chipPos: 'top-5 left-1/2 -translate-x-1/2',
  },
  {
    title: 'Understanding a diagnosis',
    chip: 'What does this mean for my day-to-day life?',
    desc: 'No need to wait for office hours, speak to MediVoyage when you need answers for free.',
    img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80',
    chipPos: 'top-12 right-4',
  },
  {
    title: 'Managing chronic illness',
    chip: 'Help me track my symptoms over time',
    desc: 'MediVoyage remembers you and your history, and is your partner on your journey.',
    img: 'https://images.unsplash.com/photo-1581579438747-104c53e7c64a?w=600&q=80',
    chipPos: 'top-5 right-4',
  },
  {
    title: 'Navigating healthcare',
    chip: 'Refill my prescription',
    desc: 'Prescription refills, finding a specialist near you, or ordering a lab test — MediVoyage is here to help.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    chipPos: 'top-5 left-4',
  },
  {
    title: 'Mental wellness check-ins',
    chip: 'I want to talk about how I\'ve been feeling',
    desc: 'Private, judgment-free conversations about stress, anxiety, sleep, and emotional health.',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80',
    chipPos: 'top-5 right-4',
  },
];

const doctorRoster = [
  {
    name: 'Dr. Jeffrey Jones, MD',
    specialty: 'Emergency medicine',
    school: 'Indiana University School of Medicine',
    years: 22,
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=faces&q=80',
  },
  {
    name: 'Dr. Rajiv Patel, MD',
    specialty: 'Internal Medicine, Urgent Care, Hospital Medicine, Cardiovascular Disease',
    school: 'Indiana-Purdue IUPUI',
    years: 25,
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=faces&q=80',
  },
  {
    name: 'Dr. Barry Pevner, MD',
    specialty: 'Internal Medicine',
    school: 'Hahnemann University/Drexel Internal Medicine',
    years: 25,
    img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=faces&q=80',
  },
  {
    name: 'Dr. Scott Jensen, MD',
    specialty: 'Family Medicine and Integrative Medicine',
    school: 'Medical College of Wisconsin',
    years: 24,
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=faces&q=80',
  },
  {
    name: 'Dr. Octavio Frank Neri, MD',
    specialty: 'Family Medicine and Integrative Medicine',
    school: 'New York Medical College, Metropolitan Hospital, NY',
    years: 20,
    img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=faces&q=80',
  },
];

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

// ── Simple medical knowledge base — keyword matcher ──────────────────────────
function getResponse(query: string): string {
  const q = query.toLowerCase().trim();

  if (/heart attack|stroke|severe bleeding|can'?t breathe|unconscious|suicid|chest pain.*(arm|jaw|sweat)|seizure/i.test(q)) {
    return "🚨 This sounds like a medical emergency. Please call your local emergency number immediately — 911 (US), 999 (UK), 112 (EU), or 102/108 (India). Do not wait.";
  }
  if (q.includes('headache') || q.includes('migraine')) {
    return "Most headaches are tension or migraine and resolve with rest. Try: hydrate well, dim the lights, and take ibuprofen (400mg) or acetaminophen (500mg). 🚩 See a doctor urgently if: sudden 'thunderclap' onset, fever with stiff neck, vision changes, weakness on one side, or confusion.";
  }
  if (q.includes('fever') || q.includes('temperature')) {
    return "A fever is usually a sign your body is fighting infection. Adults: rest, fluids, and acetaminophen or ibuprofen for comfort. See a doctor if temp stays above 103°F (39.4°C), lasts more than 3 days, or comes with stiff neck, severe headache, rash, or breathing trouble.";
  }
  if (q.includes('cough') || q.includes('cold') || q.includes('flu') || q.includes('sore throat')) {
    return "Most coughs and colds are viral and resolve in 7–10 days. Try honey + warm water, saline gargle, steam inhalation, and rest. See a doctor if cough lasts >3 weeks, you cough up blood, have shortness of breath, or fever over 102°F that doesn't break.";
  }
  if (q.includes('back pain') || q.includes('back hurt') || q.includes('pulled') || q.includes('lifting')) {
    return "Acute back pain from lifting is usually a muscle strain. Treatment: ice for 48 hours then heat, OTC ibuprofen, and gentle movement (avoid bed rest beyond 1–2 days). 🚩 See a doctor if: numbness or tingling in legs, loss of bladder/bowel control, weakness, or pain that radiates below the knee.";
  }
  if (q.includes('stomach') || q.includes('nausea') || q.includes('vomit') || q.includes('diarrhea') || q.includes('belly')) {
    return "Most GI upsets are viral or food-related and resolve in 24–72 hours. Stay hydrated with small sips of water or ORS. BRAT diet: bananas, rice, applesauce, toast. See a doctor if: blood in stool/vomit, severe dehydration, fever >102°F, or symptoms lasting >3 days.";
  }
  if (q.includes('blood pressure') || q.includes('bp') || q.includes('hypertension')) {
    return "Normal BP is under 120/80. 130–139/80–89 is elevated, 140+/90+ is Stage 1 Hypertension. Reduce sodium (<2g/day), exercise 30 min/day, lose excess weight, limit alcohol. If readings stay above 140/90, talk to a doctor — common first-line meds are amlodipine, lisinopril, or losartan.";
  }
  if (q.includes('diabetes') || q.includes('blood sugar') || q.includes('insulin') || q.includes('a1c')) {
    return "Normal fasting glucose is 70–99 mg/dL. 100–125 is prediabetes, 126+ is diabetes. HbA1c <5.7% is normal, 5.7–6.4 prediabetes, 6.5+ diabetes. Management: low-carb diet, 150 min exercise/week, weight loss. Common meds: metformin first-line, then GLP-1 agonists, SGLT2 inhibitors, or insulin.";
  }
  if (q.includes('anxiety') || q.includes('depress') || q.includes('panic') || q.includes('stress') || q.includes('mental')) {
    return "Anxiety and depression are common and treatable. Evidence-based: cognitive behavioral therapy (CBT), regular exercise, sleep hygiene, and sometimes SSRIs like sertraline or escitalopram. Try 4-7-8 breathing for panic (inhale 4s, hold 7s, exhale 8s). 🚩 If you have thoughts of self-harm, please call 988 (US), Samaritans 116 123 (UK), or iCall +91-9152987821 (India).";
  }
  if (q.includes('sleep') || q.includes('insomnia') || q.includes("can't sleep")) {
    return "Aim for 7–9 hours. Sleep hygiene: consistent schedule, no screens 1hr before bed, cool dark room (65–68°F), no caffeine after noon. For chronic insomnia, CBT-I is more effective than sleeping pills. Short-term, melatonin 0.5–3mg, 30 min before bed can help.";
  }
  if (q.includes('cholesterol') || q.includes('ldl') || q.includes('hdl') || q.includes('triglyceride')) {
    return "Target LDL <100 mg/dL, HDL >40 (men) / >50 (women), Triglycerides <150. Reduce saturated fat, increase fiber, exercise. If LDL stays high or you have other risk factors, statins (atorvastatin, rosuvastatin) are first-line and very effective.";
  }
  if (q.includes('medication') || q.includes('medicine') || q.includes('drug') || q.includes('side effect') || q.includes('dosage')) {
    return "Always take medications as prescribed. Never share prescription medications. Common interactions: NSAIDs + blood thinners = bleeding risk; statins + grapefruit = increased side effects; SSRIs + tramadol = serotonin syndrome. For specific dosage or side effects, consult your pharmacist.";
  }
  if (q.includes('diet') || q.includes('nutrition') || q.includes('eat') || q.includes('weight loss') || q.includes('protein')) {
    return "For most adults: Mediterranean-style diet wins — vegetables, fruits, whole grains, fish, olive oil, nuts. Protein target: 0.8–1.2 g/kg body weight (more if active). For weight loss, a 500 kcal/day deficit gives ~1 lb/week. Skip ultra-processed foods, sugary drinks, and excessive refined carbs.";
  }
  if (q.includes('exercise') || q.includes('workout') || q.includes('fitness') || q.includes('gym')) {
    return "WHO recommends 150 min moderate or 75 min vigorous aerobic activity per week + 2 strength sessions. Beginners: start with brisk walking 30 min × 5 days, add bodyweight squats, push-ups, planks. Strength training preserves muscle mass and boosts metabolism long-term.";
  }
  if (q.includes('pregnan') || q.includes('period') || q.includes('menstrual') || q.includes('pms')) {
    return "Pregnancy basics: take folic acid 400–800mcg daily even before conception, avoid alcohol/smoking/raw fish/unpasteurized cheese. First prenatal visit ideally 8–10 weeks. For irregular or painful periods, track cycles for 3 months and discuss with a gynecologist — could be PCOS, endometriosis, or thyroid related.";
  }
  if (q.includes('rash') || q.includes('itch') || q.includes('skin') || q.includes('acne') || q.includes('eczema')) {
    return "Acne: gentle cleanser, benzoyl peroxide 2.5% + adapalene 0.1% gel; if severe, see a dermatologist. Eczema: moisturize 2–3x daily with thick cream (CeraVe, Vanicream), topical hydrocortisone 1% for flare-ups. For new rashes with fever, blistering, or rapidly spreading — see a doctor today.";
  }
  if (q.includes('medivoyage') || q.includes('medical tourism') || q.includes('treatment abroad') || q.includes('india treatment')) {
    return "MediVoyage helps international patients access world-class care in India at 1/10th the cost of Western countries. We partner with JCI-accredited hospitals (Apollo, Fortis, Medanta, Manipal). We handle visa, travel, accommodation, hospital coordination, and follow-up. Click 'Book Now' on the homepage or fill the inquiry form for a free quote.";
  }
  if (q.includes('cancer') || q.includes('tumor') || q.includes('chemo') || q.includes('oncolog')) {
    return "Cancer treatment depends heavily on type, stage, and patient health — surgery, chemotherapy, radiation, immunotherapy, and targeted therapy are all options. Get a second opinion before major treatment decisions. Key screening: colonoscopy from 45, mammogram from 40–50, low-dose CT for smokers 50+, Pap smear from 21.";
  }
  if (q.includes('vitamin') || q.includes('supplement') || q.includes('mineral')) {
    return "Most healthy adults eating a varied diet don't need supplements. Common deficiencies worth checking: Vitamin D (600–800 IU daily), B12 (especially vegans/older adults), iron (especially menstruating women), and omega-3s. Skip mega-doses — fat-soluble vitamins (A, D, E, K) can build up to toxic levels.";
  }
  if (/^(hi|hello|hey|yo|sup|greetings)/i.test(q)) {
    return "Hi! I'm MediVoyage AI. I can help with symptoms, medications, conditions, nutrition, mental health, or medical tourism questions. What's on your mind today?";
  }
  if (q.includes('thank')) {
    return "You're welcome! Stay healthy. Feel free to ask anything else — and remember, for anything urgent or unclear, please see a real doctor.";
  }
  return "I can help with a wide range of health topics — symptoms, medications, conditions, nutrition, mental health, and medical tourism. Could you share a bit more detail? For example: \"I've had a headache for 2 days\" or \"My blood pressure was 145/92.\" ⚠️ For emergencies, always call your local emergency number.";
}

export default function MediVoyageAI({
  onHomeClick, onTreatmentClick, onAboutClick, onWellnessClick, onAIClick,
  onUpgradeClick, onSecondOpinionClick, onTravelClick, onDoctorsClick,
  onSignOutClick, onLoginClick, userEmail,
}: NavProps) {
  const { hasAccess } = useAuth();

  const [heroInput, setHeroInput] = useState('');
  // Hydrate chat history from localStorage so users return to ongoing conversations
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.messages);
      return saved ? (JSON.parse(saved) as ChatMessage[]) : [];
    } catch {
      return [];
    }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Floating chat input (appears when hero is scrolled out of view)
  const [floatingInput, setFloatingInput] = useState('');
  const [showFloating, setShowFloating] = useState(false);

  // Consent flow — persisted so the user only agrees once, ever
  const [consentGiven, setConsentGiven] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEYS.consent) === 'true';
  });
  const [showConsent, setShowConsent] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const [agreed, setAgreed] = useState(false);

  // Persist chat history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (messages.length > 0) {
      window.localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.messages);
    }
  }, [messages]);

  // Persist consent so we never re-prompt on subsequent visits
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (consentGiven) {
      window.localStorage.setItem(STORAGE_KEYS.consent, 'true');
    }
  }, [consentGiven]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Watch hero visibility — show floating chat when hero is NOT in view
  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloating(!entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hasStarted = messages.length > 0;

  useEffect(() => {
    if (hasStarted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping, hasStarted]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setHeroInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: getResponse(trimmed) }]);
      setIsTyping(false);
    }, 700 + Math.random() * 600);
  };

  // ── Consent-gated chat entry ────────────────────────────────────────────
  // The very first message routes the user to the consent screen.
  // After they agree, the pending message is sent automatically.
  const requestChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!consentGiven) {
      setPendingMessage(trimmed);
      setShowConsent(true);
      setHeroInput('');
      setFloatingInput('');
      return;
    }
    sendMessage(trimmed);
  };

  const handleConsentAgree = () => {
    if (!agreed) return;
    setConsentGiven(true);
    setShowConsent(false);
    if (pendingMessage) {
      const msg = pendingMessage;
      setPendingMessage('');
      // Give the chat panel a tick to render before sending
      setTimeout(() => sendMessage(msg), 100);
    }
  };

  const handleConsentCancel = () => {
    setShowConsent(false);
    setPendingMessage('');
    setAgreed(false);
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestChat(heroInput);
  };

  const resetChat = () => {
    setMessages([]);
    setHeroInput('');
    setConsentGiven(false);
    setAgreed(false);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.messages);
      window.localStorage.removeItem(STORAGE_KEYS.consent);
    }
  };

  // Floating chat → routes through the same consent gate
  const handleFloatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = floatingInput.trim();
    if (!text) return;
    if (!consentGiven) {
      requestChat(text);
      return;
    }
    heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => sendMessage(text), 250);
    setFloatingInput('');
  };

  // ── MAIN AI PAGE (default render) ───────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfc]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>

      <Navbar
        onHomeClick={onHomeClick}
        onTreatmentClick={onTreatmentClick}
        onAboutClick={onAboutClick}
        onWellnessClick={onWellnessClick}
        onAIClick={onAIClick}
        onSecondOpinionClick={onSecondOpinionClick}
        onTravelClick={onTravelClick}
        onDoctorsClick={onDoctorsClick}
        onSignOutClick={onSignOutClick}
        onLoginClick={onLoginClick}
        userEmail={userEmail}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-12 overflow-hidden">

        {/* ── Free-floating Orb — positioned behind the chat area, no bounded container ── */}
        <div
          className="pointer-events-none absolute inset-x-0 flex justify-center"
          style={{ top: '58%', transform: 'translateY(-30%)' }}
          aria-hidden="true"
        >
          <div style={{ width: '640px', height: '640px', position: 'relative' }}>
            <Orb hue={150} hoverIntensity={0.5} rotateOnHover backgroundColor="#fdfdfc" />
          </div>
        </div>

        {/* Radial mask — fades the orb softly into the cream background on all sides */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 32% 30% at 50% 70%, transparent 0%, transparent 55%, #fdfdfc 92%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-5xl mx-auto w-full">

          {/* Headline */}
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] text-gray-900 leading-[1.05] tracking-tight mb-6">
            <em className="italic font-normal">The</em> medical intelligence<br />
            that's <em className="italic font-normal">always</em> on call.
          </h1>

          <p className="text-gray-700 text-sm md:text-base font-medium mb-10 max-w-2xl mx-auto">
            Chat free with our Medical AI anytime. Video chat a real physician for $9/visit.
          </p>

          {/* Divider with "Built by experts from" */}
          <div className="relative flex items-center justify-center w-full max-w-3xl mx-auto mb-6">
            <div className="absolute w-full border-t border-dashed border-gray-300" />
            <span className="relative bg-[#fdfdfc] px-4 font-playfair italic text-sm text-gray-600">
              Built by experts from
            </span>
          </div>

          {/* Partner logos — sit on top of the orb, always readable */}
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:gap-x-10 mb-12">
            <span className="font-serif text-xs md:text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> HARVARD
              <span className="font-normal text-[9px] lowercase tracking-normal text-gray-600 ml-0.5">medical<br/>school</span>
            </span>
            <span className="font-sans text-lg md:text-xl font-extrabold text-gray-800 tracking-tighter">UCSF</span>
            <span className="font-serif text-sm md:text-base font-bold text-[#002d72] flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full border border-[#002d72] flex items-center justify-center"><span className="w-1.5 h-1.5 bg-[#002d72]" /></span>
              JOHNS HOPKINS
            </span>
            <span className="font-serif text-base md:text-lg text-[#8C1515] tracking-tight italic">Stanford</span>
            <span className="font-serif text-xs md:text-sm font-semibold text-[#011F5B]">Penn Medicine</span>
            <span className="font-sans text-xs md:text-sm font-bold text-gray-800 leading-tight">
              UChicago<br/>Medicine
            </span>
          </div>

          {/* ── Chat area — no bounded container, content sits on the orb naturally ── */}
          <div className="flex flex-col items-center w-full max-w-2xl mx-auto">

              {/* Messages list — only renders once conversation starts */}
              {hasStarted && (
                <div className="w-full mb-3 max-h-[340px] overflow-y-auto bg-white/85 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm p-4 space-y-3 text-left">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {msg.role === 'bot' && (
                        <div className="w-7 h-7 rounded-full bg-[#d9f576] flex items-center justify-center shrink-0">
                          <Stethoscope className="w-3.5 h-3.5 text-gray-800" />
                        </div>
                      )}
                      <div className={`max-w-[80%] px-3.5 py-2 text-xs md:text-sm leading-relaxed rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-[#2563eb] text-white rounded-tr-sm'
                          : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#d9f576] flex items-center justify-center shrink-0">
                        <Stethoscope className="w-3.5 h-3.5 text-gray-800" />
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* "What brings you in?" lime pill — only shown before chat starts */}
              {!hasStarted && (
                <div className="self-start ml-4 md:ml-10 mb-2">
                  <span className="bg-[#d9f576] text-gray-900 text-sm font-bold px-4 py-2 rounded-full shadow-sm block">
                    What brings you in?
                  </span>
                </div>
              )}

              {/* Specialty quick-start chips — Doctronic-style topic entry points */}
              {!hasStarted && (
                <div className="w-full flex flex-wrap items-center justify-center gap-1.5 mb-3">
                  {quickStartTopics.map((topic) => (
                    <button
                      key={topic.label}
                      type="button"
                      onClick={() => requestChat(topic.prompt)}
                      className="text-[11px] font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-gray-400 hover:bg-white px-3 py-1.5 rounded-full transition-colors shadow-sm"
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Status row when chat is active — "Free · Unlimited" + Reset */}
              {hasStarted && (
                <div className="w-full flex items-center justify-between mb-2 px-2">
                  <span className="bg-[#d9f576] text-gray-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    Free · Unlimited
                  </span>
                  <button
                    onClick={resetChat}
                    className="text-[11px] font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                </div>
              )}

              {/* Pill-shaped input form — always open, chat is fully free */}
              <form
                onSubmit={handleHeroSubmit}
                className="w-full bg-white shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] rounded-full pl-6 pr-1.5 py-1.5 flex items-center border border-gray-100"
              >
                <input
                  type="text"
                  value={heroInput}
                  onChange={(e) => setHeroInput(e.target.value)}
                  placeholder={
                    hasStarted
                      ? 'Ask a follow-up…'
                      : 'When should I go to urgent care for the flu?'
                  }
                  disabled={isTyping}
                  className="flex-1 py-2.5 text-sm md:text-base text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none disabled:opacity-60"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!heroInput.trim() || isTyping}
                  className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-full flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm shrink-0"
                >
                  {hasStarted ? 'Send' : 'Get started'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Trust badges — icon chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                {trustBadges.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-800 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm"
                  >
                    <Icon className="w-3.5 h-3.5 text-gray-700" />
                    {label}
                  </span>
                ))}
              </div>
          </div>
        </div>
      </section>

      {/* ── BUILT BY PHYSICIANS ──────────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-28 px-6 border-t border-gray-100 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* ── LEFT: copy + decorative elements ────────────────────────── */}
          <div className="relative">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug max-w-md tracking-tight">
              MediVoyage is built by physicians and trained on real medical evidence, pairing the best of AI and human expertise.
            </p>

            {/* Physician avatars + check */}
            <div className="flex items-center gap-3 mt-12">
              <div className="flex -space-x-3">
                {[
                  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=faces&q=80',
                  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&h=120&fit=crop&crop=faces&q=80',
                  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&h=120&fit=crop&crop=faces&q=80',
                  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=faces&q=80',
                  'https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=120&h=120&fit=crop&crop=faces&q=80',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                ))}
              </div>
              <div className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm ml-1">
                <Check className="w-4 h-4 text-gray-700" strokeWidth={2.5} />
              </div>
            </div>

            {/* Dashed connecting curve */}
            <svg className="mt-8 ml-4 w-32 h-12" viewBox="0 0 120 50" fill="none" aria-hidden="true">
              <path d="M 5,8 Q 50,55 115,30" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
            </svg>

            {/* Circular spinning badge */}
            <div className="relative w-44 h-44 -mt-1">
              <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e9d5ff" />
                    <stop offset="50%" stopColor="#fce7e7" />
                    <stop offset="100%" stopColor="#d1fae5" />
                  </linearGradient>
                  <path
                    id="circlePath"
                    d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
                  />
                </defs>
                <circle cx="100" cy="100" r="95" fill="url(#ringGrad)" />
                <circle cx="100" cy="100" r="63" fill="#ffffff" />
                <text
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="2.5"
                  fill="#374151"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  <textPath href="#circlePath" startOffset="0">
                    AVAILABLE IN ALL 50 STATES + DC ✦ BOARD-CERTIFIED PHYSICIAN ✦
                  </textPath>
                </text>
              </svg>

              {/* Center icon — person + heart */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                  className="w-10 h-10"
                  viewBox="0 0 36 36"
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="14" cy="13" r="3.5" />
                  <path d="M 7.5,24 c 0,-3 3,-5 6.5,-5 c 3.5,0 6.5,2 6.5,5" />
                  <path
                    d="M 25,17 c -0.9,-0.9 -2.5,-0.3 -2.5,1 c 0,1 1.25,2.1 2.5,3 c 1.25,-0.9 2.5,-2 2.5,-3 c 0,-1.3 -1.6,-1.9 -2.5,-1 z"
                    fill="#1f2937"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* ── RIGHT: physician photo with overlapping patient card ────── */}
          <div className="relative">
            {/* Main physician photo */}
            <div className="rounded-3xl overflow-hidden shadow-xl shadow-gray-200/60">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=900&q=80"
                alt="Physician on a teleconsultation call"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>

            {/* Overlapping patient photo */}
            <div className="absolute -bottom-10 -left-6 sm:-left-12 lg:-left-16 w-40 sm:w-48 lg:w-52 rounded-2xl overflow-hidden shadow-2xl border-[5px] border-white">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80"
                alt="Patient on a video call from home"
                className="w-full aspect-[3/4] object-cover"
              />
            </div>
          </div>

        </div>

        {/* Slow-spin animation keyframe */}
        <style>{`
          @keyframes spin-slow { to { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin-slow 22s linear infinite; transform-origin: center; }
        `}</style>
      </section>

      {/* ── AI + HUMAN DOCTORS ───────────────────────────────────────────── */}
      <section className="bg-[#e8f5e3] py-24 md:py-28 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT: copy ──────────────────────────────────────────────── */}
          <div className="space-y-7 max-w-md">
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 leading-[1.15] tracking-tight">
              Intelligent AI for quick, accurate responses.{' '}
              <span className="text-[#2563eb]">Human doctors</span> when you need them
            </h2>

            <div className="border-t border-dashed border-gray-400/70 max-w-xs" />

            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              By the time you meet one of our doctors, they already know your history, your symptoms, and what you need. Less time explaining. More time getting better. Or take everything to your preferred in-person doctor for a more efficient appointment.
            </p>

            <p className="text-sm md:text-base text-gray-900 font-medium pt-2">
              Video visits with real doctors for{' '}
              <span className="text-[#2563eb] font-bold">$39/visit</span>
            </p>
          </div>

          {/* ── RIGHT: phone + supporting photos + floating chips ───────── */}
          <div className="relative h-[560px] md:h-[600px] w-full">

            {/* Background photo — man with beanie, left of phone */}
            <div className="absolute left-0 sm:left-4 top-20 w-36 sm:w-44 h-52 sm:h-60 rounded-2xl overflow-hidden shadow-xl -rotate-[5deg] z-0">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Background photo — woman on yellow chair, right of phone */}
            <div className="absolute right-0 sm:right-4 top-6 w-36 sm:w-44 h-52 sm:h-60 rounded-2xl overflow-hidden shadow-xl rotate-[5deg] z-0">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* ── iPhone mockup ─────────────────────────────────────────── */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[260px] md:w-[280px] z-10">
              <div className="relative bg-gray-900 rounded-[44px] p-2 shadow-2xl shadow-gray-400/40">
                <div className="relative bg-gray-200 rounded-[36px] overflow-hidden aspect-[9/19.5]">

                  {/* Physician on call (background image) */}
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80"
                    alt="Dr. Willow Crest on video call"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[100px] h-[26px] bg-black rounded-full z-30" />

                  {/* Status bar */}
                  <div className="absolute top-0 inset-x-0 flex justify-between items-center px-6 pt-3 text-[10px] font-semibold text-white drop-shadow z-20">
                    <span>9:41</span>
                    <span className="flex items-center gap-1">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="6" width="2" height="4" rx="0.5"/><rect x="4" y="4" width="2" height="6" rx="0.5"/><rect x="8" y="2" width="2" height="8" rx="0.5"/><rect x="12" y="0" width="2" height="10" rx="0.5"/></svg>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M7,9 a1,1 0 0 1 0,0 Z" fill="currentColor"/><path d="M3,5 c2,-2 6,-2 8,0"/><path d="M1,3 c3,-3 9,-3 12,0"/></svg>
                      <svg width="18" height="10" viewBox="0 0 18 10" fill="currentColor"><rect x="0.5" y="0.5" width="14" height="9" rx="2" stroke="currentColor" fill="none"/><rect x="2" y="2" width="11" height="6" rx="1"/><rect x="15" y="3.5" width="1.5" height="3" rx="0.5"/></svg>
                    </span>
                  </div>

                  {/* Call info banner */}
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-gray-900/85 backdrop-blur-sm rounded-2xl px-4 py-2 z-20 min-w-[180px]">
                    <p className="text-white text-[12px] font-bold leading-tight">Dr. Willow Crest, MD</p>
                    <p className="text-gray-300 text-[10px]">Call: Flu symptoms</p>
                  </div>

                  {/* Picture-in-picture (patient) */}
                  <div className="absolute bottom-16 right-3 w-16 h-20 rounded-lg overflow-hidden border-2 border-white shadow-lg z-20">
                    <img
                      src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=80"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Home indicator bar */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-1 bg-white/80 rounded-full z-20" />
                </div>
              </div>
            </div>

            {/* ── Floating chips ────────────────────────────────────────── */}
            {/* Top chip */}
            <div className="absolute top-16 left-2 sm:left-6 z-20 bg-[#d9f576] px-3 py-2 rounded-xl shadow-md shadow-gray-300/40 flex items-center gap-2">
              <ClipboardList className="w-3.5 h-3.5 text-gray-800 shrink-0" strokeWidth={2.2} />
              <span className="text-xs font-bold text-gray-900 whitespace-nowrap">Board-certified physicians.</span>
            </div>

            {/* Middle-right chip */}
            <div className="absolute top-1/2 -translate-y-4 right-0 sm:right-2 z-20 bg-[#d9f576] px-3 py-2 rounded-xl shadow-md shadow-gray-300/40 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-gray-800 shrink-0" strokeWidth={2.2} fill="currentColor" />
              <span className="text-xs font-bold text-gray-900 whitespace-nowrap">Doctors supported by medical AI.</span>
            </div>

            {/* Bottom chip */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 bg-[#d9f576] px-3 py-2 rounded-xl shadow-md shadow-gray-300/40 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-gray-800 shrink-0" strokeWidth={2.2} />
              <span className="text-xs font-bold text-gray-900 whitespace-nowrap">Available across all 50 states + DC</span>
            </div>

          </div>
        </div>
      </section>

      {/* ── DOCTOR TESTIMONIAL + ROSTER ──────────────────────────────────── */}
      {/* Top: quote carousel card. Bottom: 5-card doctor roster grid.       */}
      <section className="bg-[#fdfdfc] py-20 md:py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── Quote carousel card ─────────────────────────────────────── */}
          <div className="bg-[#faf7ee] border border-[#e8e0d4] rounded-3xl px-8 md:px-12 py-10 md:py-12">
            <blockquote className="font-playfair italic text-xl md:text-2xl lg:text-[1.7rem] text-gray-900 leading-snug max-w-3xl">
              &ldquo;{doctorQuotes[quoteIdx].quote}&rdquo;
            </blockquote>

            <div className="border-t border-dashed border-gray-300 my-6 max-w-3xl" />

            <div className="flex items-center justify-between gap-4 max-w-3xl">
              <p className="font-bold text-gray-900 text-sm md:text-base">
                {doctorQuotes[quoteIdx].author}
              </p>

              {/* Carousel controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuoteIdx((quoteIdx - 1 + doctorQuotes.length) % doctorQuotes.length)}
                  className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
                  aria-label="Previous quote"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  {doctorQuotes.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setQuoteIdx(i)}
                      aria-label={`Show quote ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === quoteIdx ? 'w-6 bg-gray-900' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setQuoteIdx((quoteIdx + 1) % doctorQuotes.length)}
                  className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
                  aria-label="Next quote"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Doctor roster — 5 cards ─────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {doctorRoster.map((doc) => (
              <div
                key={doc.name}
                className="bg-[#faf7ee] border border-[#e8e0d4] rounded-3xl p-6 flex flex-col items-center text-center"
              >
                {/* Portrait */}
                <div className="w-28 h-28 rounded-2xl overflow-hidden mb-4 shrink-0">
                  <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
                </div>

                {/* Name */}
                <p className="font-bold text-gray-900 text-sm leading-tight mb-2">{doc.name}</p>

                {/* Specialty */}
                <p className="text-xs text-gray-600 leading-relaxed mb-5 min-h-[3rem]">
                  {doc.specialty}
                </p>

                {/* Dashed divider */}
                <div className="border-t border-dashed border-gray-300 w-full mb-4" />

                {/* School chip */}
                <span className="bg-[#e8f5e3] text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-2 leading-tight">
                  {doc.school}
                </span>

                {/* Years chip */}
                <span className="bg-[#e8f5e3] text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {doc.years} years of exp
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIMARY CARE THAT DOES IT ALL (moving carousel) ──────────────── */}
      {/* Header (split title + description) + infinite horizontal marquee. */}
      <section className="bg-[#fdfdfc] py-20 md:py-24 overflow-hidden">

        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-end mb-8">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-[2.75rem] text-gray-900 leading-[1.1] tracking-tight">
            Primary care that does it <em className="italic">all</em>
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            From the sniffles to the serious. Check a symptom. Refill a prescription. Get a referral. Understand a diagnosis. MediVoyage handles your full primary care, 24/7.
          </p>
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="border-t border-gray-200" />
        </div>

        {/* Moving carousel — duplicated cards for seamless loop */}
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-4 animate-marquee-x w-max">
            {[...primaryCareCards, ...primaryCareCards].map((card, i) => (
              <div key={i} className="shrink-0 w-[280px] md:w-[300px]">
                {/* Photo + chip overlay */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span
                    className={`absolute ${card.chipPos} bg-[#d9f576] text-gray-900 text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-md max-w-[80%] whitespace-normal leading-snug text-center`}
                  >
                    {card.chip}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg text-gray-900 mb-2 px-1">{card.title}</h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed px-1">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee keyframes */}
        <style>{`
          @keyframes marquee-x {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .animate-marquee-x {
            animation: marquee-x 60s linear infinite;
          }
          .animate-marquee-x:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* ── UTAH PARTNERSHIP BANNER ──────────────────────────────────────── */}
      <section className="bg-[#f1efe6] py-16 px-6 border-y border-[#e8e0d4]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8">

          {/* Stylized state seal */}
          <div className="shrink-0">
            <svg viewBox="0 0 120 120" className="w-24 h-24" aria-hidden="true">
              <defs>
                <path id="utah-curve" d="M 60,60 m -48,0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0" />
                <path id="utah-curve-bottom" d="M 60,60 m -48,0 a 48,48 0 1,0 96,0" />
              </defs>
              <circle cx="60" cy="60" r="56" fill="none" stroke="#374151" strokeWidth="1.5" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="#374151" strokeWidth="0.4" />
              <text fontSize="6" fontWeight="600" fill="#374151" letterSpacing="1">
                <textPath href="#utah-curve" startOffset="2">
                  THE GREAT SEAL OF THE STATE OF UTAH ★
                </textPath>
              </text>
              {/* Beehive (Utah state symbol) */}
              <g transform="translate(45,46)" stroke="#374151" strokeWidth="0.8" fill="none">
                <ellipse cx="15" cy="22" rx="14" ry="2.5" />
                <ellipse cx="15" cy="18" rx="12.5" ry="2.5" />
                <ellipse cx="15" cy="14" rx="10.5" ry="2.5" />
                <ellipse cx="15" cy="10" rx="8" ry="2.5" />
                <ellipse cx="15" cy="6" rx="5.5" ry="2.5" />
                <ellipse cx="15" cy="2.5" rx="3" ry="2" />
              </g>
              <text x="60" y="100" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#374151">1896</text>
            </svg>
          </div>

          {/* Copy */}
          <div className="text-center sm:text-left">
            <p className="text-sm md:text-base text-gray-800 font-medium max-w-md">
              Partnered with the state of Utah to make it the easiest state in America to refill your prescriptions.
            </p>
            <p className="text-xs md:text-sm text-gray-700 mt-3 flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[#2563eb]">◆</span>
              The first AI <em className="italic text-[#2563eb] font-semibold">trusted</em> to refill prescriptions
              <span className="text-[#2563eb]">◆</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── LEARN MORE ABOUT YOUR HEALTH (blog grid) ─────────────────────── */}
      <section className="bg-[#fdfdfc] py-20 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="font-playfair italic text-3xl md:text-4xl text-gray-900 tracking-tight">
              Learn more about your health
            </h2>
            <a
              href="#blog"
              onClick={(e) => e.preventDefault()}
              className="border border-gray-300 hover:border-gray-500 rounded-full px-5 py-2 text-sm font-semibold text-gray-900 transition-colors"
            >
              Our blog
            </a>
          </div>

          {/* Dashed divider */}
          <div className="border-t border-dashed border-gray-300 mb-10" />

          {/* Articles 2x2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-10">
            {learnArticles.map((article) => (
              <div key={article.title} className="flex gap-5">
                <img
                  src={article.img}
                  alt=""
                  className="w-36 h-36 md:w-44 md:h-44 rounded-2xl object-cover shrink-0"
                />
                <div className="flex flex-col">
                  <h3 className="font-bold text-base md:text-lg text-gray-900 leading-snug mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {article.desc}
                  </p>
                  <button className="self-start bg-white border border-gray-200 hover:border-gray-400 rounded-full px-4 py-2 text-sm font-semibold text-gray-900 transition-colors">
                    {article.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI MEDICAL CONCIERGE (premium $9 upgrade) ────────────────────── */}
      {/* Chat is always free; this section is the paid upgrade — only shown to free users */}
      {!hasAccess && (
        <section className="bg-white px-6 py-20 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">

            {/* Section heading */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 leading-snug">
              Our <span className="text-[#2563eb]">AI-powered medical concierge</span> which provides
            </h2>

            {/* 3-card grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

              {/* ── Card 1: Teleconsultations ─────────────────────────── */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
                <div className="h-2 bg-[#0b1a35]" />
                <div className="p-8 flex flex-col items-center text-center flex-1">
                  {/* Illustration */}
                  <div className="w-44 h-44 rounded-full bg-[#eef4ff] flex items-center justify-center mb-8 relative">
                    <div className="relative">
                      <div className="w-32 h-20 bg-white rounded-md shadow-md border border-[#2563eb]/30 overflow-hidden">
                        <div className="h-3 bg-[#2563eb] flex items-center px-1.5 gap-0.5">
                          <div className="w-1 h-1 rounded-full bg-white/60" />
                          <div className="w-1 h-1 rounded-full bg-white/60" />
                          <div className="w-1 h-1 rounded-full bg-white/60" />
                        </div>
                        <div className="flex gap-1.5 p-1.5 h-[calc(100%-12px)]">
                          <div className="flex-1 bg-[#e0f5f0] rounded-sm relative flex items-end justify-center pb-0.5">
                            <div className="w-3 h-3 rounded-full bg-[#1ed8ca]" />
                          </div>
                          <div className="flex-1 bg-[#e0eaff] rounded-sm relative flex items-end justify-center pb-0.5">
                            <div className="w-3 h-3 rounded-full bg-[#2563eb]" />
                          </div>
                        </div>
                      </div>
                      <div className="w-36 h-1 bg-gray-300 rounded-b-md -mx-2 mt-0.5" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-[#2563eb] flex items-center justify-center">
                        <Plus className="w-3 h-3 text-[#2563eb]" strokeWidth={3} />
                      </div>
                    </div>
                  </div>

                  <p className="text-base text-gray-800 font-medium leading-relaxed">
                    <span className="text-[#2563eb] font-bold">Teleconsultations</span> with top specialists and <span className="text-[#2563eb] font-bold">fixed-price procedure booking</span>
                  </p>
                </div>
              </div>

              {/* ── Card 2: AI patient triage + doctor matching ────────── */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
                <div className="h-2 bg-[#2563eb]" />
                <div className="p-8 flex flex-col items-center text-center flex-1">
                  {/* Illustration */}
                  <div className="w-44 h-44 rounded-full bg-[#eaf6f3] flex items-center justify-center mb-8 relative">
                    <div className="relative w-32 h-32">
                      {/* Connecting lines */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128" aria-hidden="true">
                        <line x1="20" y1="20" x2="64" y2="64" stroke="#94a3b8" strokeWidth="1" />
                        <line x1="108" y1="20" x2="64" y2="64" stroke="#94a3b8" strokeWidth="1" />
                        <line x1="20" y1="108" x2="64" y2="64" stroke="#94a3b8" strokeWidth="1" />
                        <line x1="108" y1="108" x2="64" y2="64" stroke="#94a3b8" strokeWidth="1" />
                      </svg>
                      {/* Corner avatars */}
                      <div className="absolute top-0 left-0 w-8 h-8 rounded-full border-2 border-[#2563eb] bg-white flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-[#2563eb]" />
                      </div>
                      <div className="absolute top-0 right-0 w-8 h-8 rounded-full border-2 border-[#1ed8ca] bg-white flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-[#1ed8ca]" />
                      </div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 rounded-full border-2 border-[#2563eb] bg-white flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-[#2563eb]" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 border-[#1ed8ca] bg-white flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-[#1ed8ca]" />
                      </div>
                      {/* Central AI hub */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#1ed8ca]/50 flex items-center justify-center">
                          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1565c0] flex items-center justify-center shadow-lg">
                            <span className="text-white text-xs font-bold tracking-wide">AI</span>
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-[#2563eb] flex items-center justify-center">
                              <Plus className="w-2 h-2 text-[#2563eb]" strokeWidth={4} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-base text-gray-800 font-medium leading-relaxed">
                    AI-driven <span className="text-[#2563eb] font-bold">patient triage</span> and intelligent <span className="text-[#2563eb] font-bold">doctor matchmaking, coordination and data keeping</span>
                  </p>
                </div>
              </div>

              {/* ── Card 3: Personalized travel + care itineraries ─────── */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
                <div className="h-2 bg-[#1ed8ca]" />
                <div className="p-8 flex flex-col items-center text-center flex-1">
                  {/* Illustration */}
                  <div className="w-44 h-44 rounded-full bg-[#eef4ff] flex items-center justify-center mb-8 relative">
                    <div className="relative">
                      <div className="w-28 h-32 bg-white rounded-lg shadow-md border-2 border-[#2563eb]/20 overflow-hidden">
                        <div className="bg-[#2563eb]/10 px-2 py-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#2563eb]">Itinerary</span>
                        </div>
                        <div className="p-2 space-y-1.5">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <div className={`w-2.5 h-2.5 rounded-full flex items-center justify-center ${i < 4 ? 'bg-[#1ed8ca]' : 'border border-gray-300 bg-white'}`}>
                                {i < 4 && <Check className="w-1.5 h-1.5 text-white" strokeWidth={4} />}
                              </div>
                              <div className="h-1 bg-gray-200 flex-1 rounded" />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Plane top right */}
                      <div className="absolute -top-2 -right-3 w-9 h-9 rounded-full bg-white border-2 border-[#1ed8ca]/60 flex items-center justify-center shadow-md">
                        <Plane className="w-4 h-4 text-[#1ed8ca]" />
                      </div>
                      {/* Map pin bottom right */}
                      <div className="absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-[#2563eb]" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  <p className="text-base text-gray-800 font-medium leading-relaxed">
                    Personalized travel, and care itineraries for <span className="text-[#2563eb] font-bold">seamless experience</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-r from-[#eef4ff] via-white to-[#eaf6f3] border border-gray-200 rounded-2xl px-8 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#2563eb]/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#2563eb]" />
                </div>
                <div className="text-left">
                  <p className="text-lg md:text-xl font-extrabold text-gray-900 leading-tight">
                    Unlock the full medical concierge for <span className="text-[#2563eb]">$9</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    One-time payment · Lifetime access · No subscription · Chat stays free forever
                  </p>
                </div>
              </div>

              <button
                onClick={onUpgradeClick}
                className="shrink-0 inline-flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-widest px-7 py-4 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-[#2563eb]/30"
              >
                Unlock for $9 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* ── CONSENT POPUP (compact modal, shown on the very first message) ── */}
      {showConsent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleConsentCancel}
            aria-hidden="true"
          />

          {/* Modal card */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Before we begin</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              MediVoyage AI gives general health info — it isn't medical advice. For emergencies, call your local emergency number.
            </p>

            <label className="flex items-start gap-2.5 cursor-pointer mb-5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#2563eb] shrink-0"
              />
              <span className="text-xs text-gray-700 leading-relaxed">
                I understand and agree to the <a className="text-[#2563eb] underline font-semibold">Terms</a> &amp; <a className="text-[#2563eb] underline font-semibold">Privacy Policy</a>.
              </span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConsentCancel}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold text-sm px-4 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConsentAgree}
                disabled={!agreed}
                className="flex-1 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors"
              >
                Start chat <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING CHAT INPUT (appears when hero is off-screen) ────────── */}
      <div
        className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 transition-all duration-300 ${
          showFloating
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <form
          onSubmit={handleFloatingSubmit}
          className="bg-white rounded-full shadow-2xl shadow-gray-900/10 border border-gray-200 flex items-center pl-6 pr-1.5 py-1.5"
        >
          <input
            type="text"
            value={floatingInput}
            onChange={(e) => setFloatingInput(e.target.value)}
            placeholder="Ask about your health…"
            className="flex-1 py-2.5 text-sm md:text-base text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!floatingInput.trim()}
            className="bg-[#2563eb] hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send to chat"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
