import React, { useState, useRef, useEffect } from 'react';
import {
  Shield, CheckCircle2, ArrowRight, ArrowLeft, EyeOff, Stethoscope,
  RefreshCw, Zap, Sparkles, Check,
  ClipboardList, Globe, Plus, Plane, MapPin, User, CheckCircle, Mic, Phone, Video, Wifi, Battery
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MeshGradient } from '@paper-design/shaders-react';
import { useAuth } from '../context/AuthContext';
import { motion,AnimatePresence } from "framer-motion";

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
    img: 'https://images.unsplash.com/photo-1589279003513-467d320f47eb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZG9jdG9yJTIwdmlzaXR8ZW58MHwwfDB8fHwy',
    chipPos: 'top-5 right-4',
  },
  {
    title: 'Finding peace of mind',
    chip: 'I have a symptom, is it serious?',
    desc: 'Answer 2am health concerns or get quick access to medical answers in a pinch.',
    img: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fG1lZGl0YXRpb258ZW58MHwwfDB8fHwy',
    chipPos: 'top-5 left-1/2 -translate-x-1/2',
  },
  {
    title: 'Understanding a diagnosis',
    chip: 'What does this mean for my day-to-day life?',
    desc: 'No need to wait for office hours, speak to MediVoyage when you need answers for free.',
    img: 'https://images.unsplash.com/photo-1631217872822-1c2546d6b864?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dW5kZXJzdGFuZGluZyUyMGRpYWdub3Npc3xlbnwwfDB8MHx8fDI%3D',
    chipPos: 'top-12 right-4',
  },
  {
    title: 'Managing chronic illness',
    chip: 'Help me track my symptoms over time',
    desc: 'MediVoyage remembers you and your history, and is your partner on your journey.',
    img: 'https://images.unsplash.com/photo-1758691462568-252f83aae3c8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFuYWdpbmclMjBpbGxuZXNzfGVufDB8MHwwfHx8Mg%3D%3D',
    chipPos: 'top-5 right-4',
  },
  {
    title: 'Navigating healthcare',
    chip: 'Refill my prescription',
    desc: 'Prescription refills, finding a specialist near you, or ordering a lab test — MediVoyage is here to help.',
    img: 'https://images.unsplash.com/photo-1652787545245-5e39748cdf97?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fE5hdmlnYXRpbmclMjBoZWFsdGglMjBjYXJlfGVufDB8MHwwfHx8Mg%3D%3D',
    chipPos: 'top-5 left-4',
  },
  {
    title: 'Mental wellness check-ins',
    chip: 'I want to talk about how I\'ve been feeling',
    desc: 'Private, judgment-free conversations about stress, anxiety, sleep, and emotional health.',
    img: 'https://images.unsplash.com/photo-1739285388427-d6f85d12a8fc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGhlYWx0aCUyMGNoZWNrdXB8ZW58MHwwfDB8fHwy',
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

useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % doctorQuotes.length);
    }, 5000); 
    
    return () => clearInterval(timer);
  }, [doctorQuotes.length]);

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
    <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden font-['Manrope',_sans-serif]">

  {/* ── Animated mesh-gradient shader background ── */}
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    <MeshGradient
      width={1920}
      height={1080}
      colors={['#1a7be2', '#74b3f0', '#1ed8ca', '#aeefe7', '#fdf6e3', '#ffe5d4']}
      distortion={0.9}
      swirl={0.55}
      grainMixer={0}
      grainOverlay={0}
      speed={0.35}
      offsetX={0.1}
      style={{ width: '100%', height: '100%' }}
    />
    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
  </div>

  {/* ── Main Expanded Wrapper ── */}
  <div className="relative z-10 w-full max-w-[1100px] mx-auto flex flex-col items-center">

    {/* Headline */}
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-5xl md:text-6xl lg:text-[72px] font-medium tracking-tighter text-gray-900 leading-[1.05] mb-6"
    >
      The medical intelligence<br />
      <span className="text-gray-400">always on call.</span>
    </motion.h1>

    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="text-gray-500 text-base md:text-lg font-normal mb-12 max-w-xl mx-auto"
    >
      Chat free with our Medical AI anytime. Video chat a real physician for $9/visit.
    </motion.p>

    {/* ── Chat Area (Constrained width for readability) ── */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center w-full max-w-3xl mx-auto"
    >
      {/* Messages list */}
      {hasStarted && (
        <div className="w-full mb-4 max-h-[400px] overflow-y-auto bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-5 space-y-4 text-left shadow-sm">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.role === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                  <Stethoscope className="w-4 h-4 text-[#1a7be2]" />
                </div>
              )}
              <div className={`max-w-[85%] px-5 py-3 text-[14px] leading-relaxed ${
                msg.role === 'user'
                  // Updated to Brand Blue
                  ? 'bg-[#1a7be2] text-white rounded-3xl rounded-tr-sm font-medium shadow-md shadow-[#1a7be2]/20'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-3xl rounded-tl-sm shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                <Stethoscope className="w-4 h-4 text-[#1a7be2]" />
              </div>
              <div className="bg-white border border-gray-100 rounded-3xl rounded-tl-sm px-5 py-4 flex gap-1.5 items-center shadow-sm">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Status row when chat is active */}
      {hasStarted && (
        <div className="w-full flex items-center justify-between mb-3 px-3">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
            Free · Unlimited
          </span>
          <button
            onClick={resetChat}
            className="text-[11px] font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      )}

      {/* Sleek Input Form */}
      <form
        onSubmit={handleHeroSubmit}
        className="w-full bg-white/90 backdrop-blur-md rounded-full pl-6 pr-1.5 py-1.5 flex items-center border border-gray-200 shadow-sm focus-within:border-[#1a7be2]/40 focus-within:ring-4 focus-within:ring-[#1a7be2]/10 transition-all"
      >
        <input
          type="text"
          value={heroInput}
          onChange={(e) => setHeroInput(e.target.value)}
          placeholder={
            hasStarted
              ? 'Ask a follow-up…'
              : 'What brings you in today?'
          }
          disabled={isTyping}
          className="flex-1 py-3 text-sm md:text-base text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none disabled:opacity-60"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!heroInput.trim() || isTyping}
          // Updated to Brand Gradient
          className="bg-gradient-to-r from-[#1a7be2] to-[#1ed8ca] hover:opacity-90 text-white font-bold text-sm px-6 py-3.5 rounded-full flex items-center gap-2 transition-all disabled:opacity-50 shrink-0 shadow-md shadow-[#1a7be2]/20"
        >
          {hasStarted ? 'Send' : 'Start Chat'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick-start chips */}
      {!hasStarted && (
        <div className="w-full flex flex-wrap items-center justify-center gap-2 mt-6">
          {quickStartTopics.map((topic) => (
            <button
              key={topic.label}
              type="button"
              onClick={() => requestChat(topic.prompt)}
              // Added Brand Color to Hover State
              className="text-[12px] font-medium text-gray-600 bg-white/60 backdrop-blur-sm border border-gray-200 hover:border-[#1a7be2] hover:text-[#1a7be2] px-4 py-2 rounded-full transition-all"
            >
              {topic.label}
            </button>
          ))}
        </div>
      )}

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-5 mt-8 opacity-60">
        {trustBadges.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600"
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </span>
        ))}
      </div>
    </motion.div>

    
    {/* ── PREMIUM PLAN MARKETING — Dark Gradient Glass Card ── */}
   

  </div>
</section>

      {/* ── BUILT BY PHYSICIANS ──────────────────────────────────────────── */}
      <section className="bg-[#f8fafc] py-12 md:py-20 px-4 md:px-8 lg:px-10 font-['Manrope',_sans-serif] overflow-hidden">
  <div className="max-w-[1280px] mx-auto">

    {/* ── Section Header (Cascading fade-up) ── */}
    <motion.div 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.15 } } 
      }}
      className="text-center max-w-4xl mx-auto mb-16 md:mb-24"
    >
      <motion.span 
        variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
        className="text-[#1a7be2] text-[10px] font-bold uppercase tracking-[0.3em] block mb-4"
      >
        The MediVoyage Standard
      </motion.span>
      
      {/* ── FIXED: Removed lg:whitespace-nowrap so it wraps naturally ── */}
      <motion.h2 
  variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
  className="text-4xl md:text-5xl lg:text-[56px] font-medium text-gray-900 leading-[1.05] tracking-tighter mb-8 w-full"
>
  Built by doctors.{" "}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a7be2] to-[#1ed8ca]">
    Powered by intelligence.
  </span>
</motion.h2>
      
      <motion.p 
        variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
        className="text-gray-500 text-[14px] md:text-[15px] font-medium leading-relaxed max-w-2xl mx-auto"
      >
        We pair the absolute best of artificial intelligence with board-certified human expertise, ensuring every recommendation is rooted in real, peer-reviewed medical science.
      </motion.p>
    </motion.div>

    {/* ── Bento Box Grid (Orchestrated Stagger) ── */}
    <motion.div 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.15 } }
      }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
    >

      {/* 1. TALL LEFT CARD: The Medical Brain (Dark Mode) */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 40, scale: 0.98 },
          show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
        }}
        whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
        className="md:col-span-1 md:row-span-2 relative bg-[#09090b] rounded-[12px] p-5 md:p-6 overflow-hidden flex flex-col justify-between min-h-[380px] md:min-h-[420px] border border-gray-800 shadow-xl group"
      >
        {/* Ambient glows that intensify on hover */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#1a7be2] rounded-full blur-[100px] opacity-20 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-10 h-10 rounded-[8px] bg-white/10 border border-white/20 flex items-center justify-center mb-5 backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
            <Sparkles className="w-4 h-4 text-[#1ed8ca]" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-3 leading-snug">
            Evidence-Based AI
          </h3>
          <p className="text-gray-400 text-[13px] leading-relaxed font-light">
            Our medical engine doesn't hallucinate. It is strictly trained on millions of peer-reviewed journals, global clinical guidelines, and real-world medical evidence to provide safe, accurate triage.
          </p>
        </div>

        {/* Fluid AI Processing Animation */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 h-16 flex items-end justify-between gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
          {[35, 60, 40, 85, 55, 100, 65, 90, 45, 75].map((height, i) => (
            <motion.div 
              key={i}
              animate={{ height: [`${height}%`, `${Math.max(15, height - 30)}%`, `${height}%`] }}
              transition={{ duration: 2.5 + (i * 0.15), repeat: Infinity, ease: "easeInOut" }}
              className="flex-1 bg-gradient-to-t from-[#1a7be2] to-[#1ed8ca] rounded-t-[2px] opacity-80"
            />
          ))}
        </div>
      </motion.div>

      {/* 2. WIDE TOP RIGHT CARD: Human Network (Image Focused) */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 40, scale: 0.98 },
          show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
        }}
        whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
        className="md:col-span-2 relative bg-gray-900 rounded-[12px] overflow-hidden min-h-[260px] md:min-h-[280px] shadow-sm group"
      >
        <img
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200"
          alt="Doctors collaborating"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-[1.5s] ease-out opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/60 to-transparent" />
        
        <div className="relative z-10 p-5 md:p-6 h-full flex flex-col justify-center max-w-sm">
          <div className="w-fit bg-white/10 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-[6px] text-[9px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2 transition-transform duration-500 group-hover:translate-x-1">
            <CheckCircle className="w-3 h-3 text-[#1ed8ca]" /> Human Verified
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-3 leading-snug">
            Board-Certified Network
          </h3>
          <p className="text-gray-300 text-[13px] leading-relaxed font-light">
            AI is powerful, but humans are irreplaceable. Every complex case can be instantly escalated to licensed physicians across all 50 states.
          </p>
        </div>
      </motion.div>

      {/* 3. BOTTOM MIDDLE CARD: Security (Clean White) */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 40, scale: 0.98 },
          show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
        }}
        whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
        className="md:col-span-1 bg-white rounded-[12px] p-5 md:p-6 border border-gray-200 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-shadow duration-300"
      >
        <div>
          <div className="w-10 h-10 rounded-[8px] bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-[#1a7be2]/5 group-hover:border-[#1a7be2]/20 group-hover:scale-110">
            <Shield className="w-4 h-4 text-gray-700 group-hover:text-[#1a7be2] transition-colors duration-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-2">
            Bank-Level Privacy
          </h3>
          <p className="text-gray-500 text-[13px] leading-relaxed font-medium">
            100% HIPAA compliant. Your health data is encrypted end-to-end and strictly confidential. It never leaves the vault.
          </p>
        </div>
      </motion.div>

      {/* 4. BOTTOM RIGHT CARD: Speed (Clean White) */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 40, scale: 0.98 },
          show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
        }}
        whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
        className="md:col-span-1 bg-white rounded-[12px] p-5 md:p-6 border border-gray-200 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-shadow duration-300"
      >
        <div>
          <div className="w-10 h-10 rounded-[8px] bg-[#1a7be2]/5 border border-[#1a7be2]/10 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110">
            <Zap className="w-4 h-4 text-[#1a7be2]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-2">
            Zero Wait Times
          </h3>
          <p className="text-gray-500 text-[13px] leading-relaxed font-medium">
            World-class medical intelligence and concierge care, available to you 24/7 without the waiting room.
          </p>
        </div>
      </motion.div>

    </motion.div>
  </div>
</section>

      {/* ── AI + HUMAN DOCTORS ───────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-32 px-6 md:px-12 lg:px-16 font-['Manrope',_sans-serif] overflow-hidden">
  <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">

    {/* ── LEFT: Ultra-Minimalist Editorial Typography ── */}
    <motion.div 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.15 } }
      }}
      className="lg:col-span-5 xl:col-span-4 flex flex-col items-start"
    >
      <motion.p 
        variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
        className="text-[#1a7be2] text-[10px] font-bold uppercase tracking-[0.25em] mb-6"
      >
        Seamless Transition
      </motion.p>

      <motion.h2 
        variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
        className="text-4xl md:text-5xl lg:text-[56px] font-medium text-gray-900 leading-[1.05] tracking-tighter mb-8"
      >
        Intelligent AI.<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a7be2] to-[#1ed8ca]">
          Human doctors.
        </span>
      </motion.h2>

      <motion.p 
        variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
        className="text-gray-500 text-[15px] md:text-base leading-relaxed font-light mb-12 max-w-md"
      >
        By the time you meet one of our doctors, they already know your history, your symptoms, and exactly what you need. Less time explaining. More time getting better.
      </motion.p>

      {/* Animated Typographic Feature List */}
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
        className="w-full border-t border-gray-200 pt-8 space-y-2 mb-12"
      >
        {[
          { num: "01", title: "Board-certified network", desc: "Licensed human physicians ready to take over." },
          { num: "02", title: "AI-assisted handoff", desc: "Your entire triage summary is instantly shared." },
          { num: "03", title: "Nationwide coverage", desc: "Available across all 50 states + DC." }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ x: 8, backgroundColor: "rgba(249, 250, 251, 1)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex gap-6 items-start p-4 -ml-4 rounded-xl cursor-default"
          >
            <span className="text-gray-300 font-medium text-sm tracking-wider mt-0.5">{feature.num}</span>
            <div>
              <h4 className="text-gray-900 font-medium text-base mb-1">{feature.title}</h4>
              <p className="text-gray-500 text-sm font-light">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Minimalist Pricing Lockup */}
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
        className="flex items-baseline gap-3 px-4 md:px-0"
      >
        <span className="text-4xl font-medium text-gray-900 tracking-tight">$9</span>
        <span className="text-gray-500 text-sm font-medium tracking-wide">/ flat rate video visit</span>
      </motion.div>
    </motion.div>

    {/* ── RIGHT: Animated Laptop Mockup with Live Video ── */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="lg:col-span-7 xl:col-span-8 relative w-full pt-10 lg:pt-0"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-gradient-to-br from-gray-50 to-gray-100 rounded-[60px] -z-10" />

      {/* Floating Typographic Handoff Element */}
      <motion.div 
        initial={{ opacity: 0, x: -30, scale: 0.9 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.7 }}
        className="absolute -top-6 left-4 lg:left-10 z-30 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[8px] py-3 px-5 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.12)]"
      >
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1a7be2] mb-1">AI Handoff</p>
        <p className="text-[13px] font-medium text-gray-900">Notes securely sent to Doctor</p>
      </motion.div>

      {/* Laptop Frame with Continuous Float */}
      <motion.div 
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="relative w-full max-w-3xl mx-auto z-20"
      >
        
        <div className="relative bg-[#111111] p-2 md:p-3 rounded-t-[20px] md:rounded-t-[28px] rounded-b-none border border-gray-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
          
          <div className="absolute top-1.5 md:top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full z-30" />

          {/* Screen Display */}
          <div className="relative bg-black rounded-[10px] md:rounded-[16px] overflow-hidden aspect-[16/10]">
            
            {/* ── DOCTOR LIVE VIDEO INTEGRATION ── */}
            <motion.div
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              >
                {/* Your provided Pexels Doctor Video */}
                <source src="/stock.mp4" type="video/mp4" />
              </video>
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Top Bar with Live Audio Visualizer */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-4 left-6 right-6 flex justify-between items-center z-20"
            >
              <div className="flex items-center gap-3">
                <span className="text-white text-[11px] font-medium tracking-wide">Secure Line</span>
                
                {/* ── Animated Audio Visualizer ── */}
                <div className="flex items-end gap-[2px] h-2.5">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ["30%", "100%", "40%", "80%", "30%"] }}
                      transition={{ repeat: Infinity, duration: 0.8 + i * 0.15, ease: "easeInOut" }}
                      className="w-0.5 bg-[#1ed8ca] rounded-full"
                    />
                  ))}
                </div>
              </div>
              <span className="text-white text-[11px] font-medium tracking-wide">02:14</span>
            </motion.div>

            {/* Caller Info */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute bottom-6 left-6 md:left-8 z-20"
            >
              <p className="text-white text-lg md:text-xl font-medium tracking-tight mb-1 drop-shadow-sm">Dr. Willow Crest</p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1ed8ca] animate-pulse shadow-[0_0_8px_#1ed8ca]" />
                <p className="text-white/80 text-xs font-medium tracking-wide">Internal Medicine</p>
              </div>
            </motion.div>

            {/* ── PATIENT PIP VIDEO (Replaced Image with Video) ── */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.8 }}
              className="absolute top-6 right-6 w-24 md:w-36 aspect-video rounded-[8px] md:rounded-[12px] overflow-hidden shadow-2xl z-20 ring-1 ring-white/20 bg-gray-900"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="w-full h-full"
              >
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover scale-110"
                >
                  {/* Replace this with a patient stock video URL of your choice */}
                  <source src="/pip.mp4" type="video/mp4" />
                </video>
              </motion.div>
            </motion.div>

            {/* Animated Controls */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute bottom-6 right-6 md:right-8 flex items-center gap-2 z-20"
            >
              <motion.button whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-md text-white text-[11px] md:text-[12px] font-medium px-4 py-2 rounded-[8px] border border-white/10 transition-colors hover:bg-white/20">
                Mute
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-md text-white text-[11px] md:text-[12px] font-medium px-4 py-2 rounded-[8px] border border-white/10 transition-colors hover:bg-white/20">
                Stop Video
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} className="bg-red-500 text-white text-[11px] md:text-[12px] font-medium px-5 py-2 rounded-[8px] transition-colors hover:bg-red-600 shadow-lg shadow-red-500/20">
                End Call
              </motion.button>
            </motion.div>

          </div>
        </div>

        {/* Laptop Base */}
        <div className="relative h-3 md:h-4 w-[104%] -ml-[2%] bg-gradient-to-b from-[#e5e5e5] to-[#c4c4c4] rounded-b-[12px] rounded-t-sm shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex justify-center border border-gray-300">
          <div className="w-16 md:w-24 h-1 md:h-1.5 bg-gray-400/60 rounded-b-md" />
        </div>

      </motion.div>
    </motion.div>

  </div>
</section>

      {/* ── DOCTOR TESTIMONIAL + ROSTER ──────────────────────────────────── */}
      {/* Top: quote carousel card. Bottom: 5-card doctor roster grid.       */}
    <section className="bg-white pt-12 md:pt-16 pb-24 md:pb-32 px-6 overflow-hidden">
  <div className="max-w-[1280px] mx-auto space-y-20 md:space-y-24">

    {/* ── Minimalist Quote Carousel ── */}
    <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
      
      {/* Sleek Typographic Overline */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-[#1a7be2] text-[10px] font-bold uppercase tracking-[0.3em] mb-10"
      >
        Words from our Physicians
      </motion.p>

      {/* ── FIXED HEIGHT & 3D STAGE FOR QUOTES ── */}
      <div 
        className="relative w-full flex items-center justify-center min-h-[280px] sm:min-h-[220px] md:min-h-[180px]"
        style={{ perspective: "1200px" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIdx}
            initial={{ opacity: 0, rotateX: 45, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, rotateX: 0, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, rotateX: -45, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute flex flex-col items-center w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            <blockquote className="font-['Playfair_Display',_serif] text-2xl md:text-3xl lg:text-4xl text-gray-900 leading-relaxed mb-8 w-full">
              {doctorQuotes[quoteIdx].quote}
            </blockquote>
            
            <p className="font-['Oswald',_sans-serif] font-medium text-gray-900 text-sm md:text-base uppercase tracking-[0.2em]">
              {doctorQuotes[quoteIdx].author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sleek Controls */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 1.2 }}
        className="flex items-center gap-6 mt-6 md:mt-10"
      >
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setQuoteIdx((quoteIdx - 1 + doctorQuotes.length) % doctorQuotes.length)}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#1a7be2] transition-colors duration-500"
          aria-label="Previous quote"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </motion.button>

        <div className="flex items-center gap-2.5">
          {doctorQuotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setQuoteIdx(i)}
              aria-label={`Show quote ${i + 1}`}
              className={`h-[2px] rounded-full transition-all duration-700 ease-out ${
                i === quoteIdx 
                  ? 'w-8 bg-gradient-to-r from-[#1a7be2] to-[#1ed8ca]' 
                  : 'w-3 bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setQuoteIdx((quoteIdx + 1) % doctorQuotes.length)}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#1a7be2] transition-colors duration-500"
          aria-label="Next quote"
        >
          <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
        </motion.button>
      </motion.div>
    </div>

    {/* ── Minimalist Doctor Roster (3D Grid) ── */}
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 pt-12 md:pt-16 border-t border-gray-100"
      style={{ perspective: "1500px" }}
    >
      {doctorRoster.map((doc, i) => (
        <motion.div
          key={doc.name}
          initial={{ opacity: 0, rotateX: -30, y: 40, scale: 0.9, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.05, transition: { duration: 0.5, ease: "easeOut" } }}
          className="group flex flex-col items-center text-center cursor-default"
          style={{ transformStyle: "preserve-3d" }}
        >
          
          {/* Portrait with Always-Moving Gradient Border */}
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full mb-6 p-[2px] overflow-hidden flex items-center justify-center shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] group-hover:shadow-[0_25px_40px_-15px_rgba(26,123,226,0.2)] transition-shadow duration-500">
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#1a7be2,#1ed8ca,#1a7be2)] opacity-80"
            />
            
            <div className="relative w-full h-full rounded-full overflow-hidden bg-white border-[3px] border-white z-10">
              <img
                src={doc.img}
                alt={doc.name}
                className="w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110"
              />
            </div>
          </div>

          {/* ── REDUCED Typographic Info Lockup ── */}
          <h4 className="font-['Oswald',_sans-serif] text-lg font-medium text-gray-900 tracking-wider uppercase mb-1 transition-colors duration-700 group-hover:text-[#1a7be2]">
            {doc.name}
          </h4>
          
          <p className="font-['Playfair_Display',_serif] text-[15px] text-gray-500 italic transition-colors duration-700 group-hover:text-[#1a7be2]">
            {doc.specialty}
          </p>
          
        </motion.div>
      ))}
    </div>

  </div>
</section>


      {/* ── PRIMARY CARE THAT DOES IT ALL (moving carousel) ──────────────── */}
      {/* Header (split title + description) + infinite horizontal marquee. */}
      

<section className="bg-white pt-12 md:pt-16 pb-24 md:pb-32 overflow-hidden font-['Manrope',_sans-serif]">
      
      {/* ── Animated Full-Length Divider (Moved to Top) ── */}
      <motion.div 
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-px bg-gray-200 mb-16 md:mb-20 origin-left"
      />

      {/* ── Header: Split Editorial Layout ── */}
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 md:mb-24">
        
        {/* Left: Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col items-start"
        >
          <p className="text-[#1a7be2] text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            Comprehensive Coverage
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-medium text-gray-900 leading-[1.05] tracking-tighter">
            Primary care that does it{" "}
            <span className="font-['Playfair_Display',_serif] italic text-transparent bg-clip-text bg-gradient-to-r from-[#1a7be2] to-[#1ed8ca] pr-2">
              all.
            </span>
          </h2>
        </motion.div>

        {/* Right: Description */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 pb-2"
        >
          <p className="text-gray-500 text-[15px] md:text-base leading-relaxed font-light max-w-md">
            From the sniffles to the serious. Check a symptom. Refill a prescription. Get a referral. Understand a diagnosis. MediVoyage handles your full primary care, 24/7.
          </p>
        </motion.div>
      </div>

      {/* ── Infinite Marquee Carousel (Auto-Moving) ── */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="relative w-full overflow-hidden pb-10"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
      >
        {/* The animate-marquee-x class drives the motion. It pauses on hover. */}
        <div className="flex gap-4 md:gap-6 animate-marquee-x w-max hover:[animation-play-state:paused]">
          
          {/* Duplicated array to create a seamless infinite loop */}
          {[...primaryCareCards, ...primaryCareCards].map((card, i) => (
            <div key={i} className="group shrink-0 w-[280px] md:w-[360px] flex flex-col gap-4 cursor-pointer">
              
              {/* Image Container (12px rounded corners) */}
              <div className="relative aspect-[3/4] rounded-[12px] overflow-hidden bg-gray-50 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.05)]">
                <img
                  src={card.img}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
                />
                
                {/* Glassmorphism Tag */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-white/50 px-3 py-1.5 rounded-full shadow-sm transition-transform duration-500 group-hover:translate-y-[-2px]">
                  <span className="text-[#1a7be2] text-[9px] font-bold uppercase tracking-widest block mt-[1px]">
                    {card.chip}
                  </span>
                </div>
              </div>

              {/* Typographic Text Lockup */}
              <div className="px-1 mt-1 md:mt-2">
                <h3 className="font-['Oswald',_sans-serif] text-xl md:text-2xl text-gray-900 tracking-wider uppercase mb-1.5 transition-colors duration-500 group-hover:text-[#1a7be2]">
                  {card.title}
                </h3>
                <p className="text-[13px] md:text-[14px] text-gray-500 leading-relaxed font-light transition-colors duration-500 group-hover:text-gray-900">
                  {card.desc}
                </p>
              </div>

            </div>
          ))}

        </div>
      </motion.div>

      {/* ── Marquee CSS Keyframes ── */}
      <style>{`
        @keyframes marquee-x {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee-x {
          animation: marquee-x 40s linear infinite;
        }
      `}</style>
      
    </section>

      {/* ── UTAH PARTNERSHIP BANNER ──────────────────────────────────────── */}
     <section className="bg-white py-20 md:py-28 px-6 border-y border-gray-100 overflow-hidden font-['Manrope',_sans-serif]">
      <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">

        {/* ── Rotating Minimalist Rajasthan State Seal ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative shrink-0 flex items-center justify-center"
        >
          {/* Subtle glowing aura behind the seal */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1a7be2]/10 to-[#1ed8ca]/10 blur-2xl rounded-full scale-150" />
          
          <svg viewBox="0 0 120 120" className="w-32 h-32 md:w-40 md:h-40 relative z-10" aria-hidden="true">
            <defs>
              <path id="raj-curve" d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" />
              <linearGradient id="seal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a7be2" />
                <stop offset="100%" stopColor="#1ed8ca" />
              </linearGradient>
            </defs>

            {/* Rotating Outer Text */}
            <motion.g 
              animate={{ rotate: 360 }} 
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="origin-center"
            >
              <circle cx="60" cy="60" r="56" fill="none" stroke="#f3f4f6" strokeWidth="1" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2 3" />
              <text fontSize="6.5" fontWeight="500" fill="#9ca3af" letterSpacing="2.5" className="font-['Oswald',_sans-serif] uppercase">
                <textPath href="#raj-curve" startOffset="4">
                  GOVERNMENT OF RAJASTHAN ★ MEDICAL DEPT ★ 
                </textPath>
              </text>
            </motion.g>

            {/* Static Inner Emblem: Minimalist Jharokha (Arch) & Sun */}
            <g transform="translate(0, 1)" stroke="#111827" strokeWidth="1.2" fill="none">
              {/* Outer double arch */}
              <path d="M 38,76 V 52 C 38,40 48,32 60,26 C 72,32 82,40 82,52 V 76 Z" />
              {/* Inner arch */}
              <path d="M 46,76 V 58 C 46,50 52,44 60,38 C 68,44 74,50 74,58 V 76 Z" strokeWidth="0.8" />
              {/* Ground line */}
              <path d="M 32,76 H 88" strokeWidth="1.5" />
            </g>

            {/* AI/Tech Accent inside the traditional arch */}
            <circle cx="60" cy="62" r="4.5" fill="url(#seal-grad)" />

            <text x="60" y="94" textAnchor="middle" fontSize="6.5" fontWeight="400" fill="#6b7280" className="font-['Oswald',_sans-serif] tracking-[0.3em]">
              1949
            </text>
          </svg>
        </motion.div>

        {/* ── Elegant Typographic Copy ── */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center md:text-left flex flex-col items-center md:items-start"
        >
          <p className="font-['Playfair_Display',_serif] text-2xl md:text-[28px] lg:text-[32px] text-gray-900 leading-tight mb-4 max-w-lg">
            Partnered with the Government of Rajasthan to build India’s most accessible digital healthcare network.
          </p>
          
          <div className="flex items-center gap-3 mt-2">
            <span className="w-8 h-[1px] bg-gradient-to-r from-[#1a7be2] to-[#1ed8ca] hidden sm:block" />
            <p className="font-['Oswald',_sans-serif] text-[13px] md:text-[14px] text-gray-500 uppercase tracking-widest">
              The first AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a7be2] to-[#1ed8ca] font-medium">trusted</span> to bridge urban & rural care
            </p>
            <span className="w-8 h-[1px] bg-gradient-to-l from-[#1a7be2] to-[#1ed8ca] hidden sm:block" />
          </div>
        </motion.div>

      </div>
    </section>

      {/* ── LEARN MORE ABOUT YOUR HEALTH (blog grid) ─────────────────────── */}
      <section className="bg-white pt-12 md:pt-16 pb-16 md:pb-24 overflow-hidden font-['Manrope',_sans-serif]">
      <div className="max-w-[1280px] mx-auto px-4">

        {/* ── Header Row (Pushed close to the border, with extra space below) ── */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16 md:mb-20">
          
          {/* Left: Heading Lockup */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start"
          >
            <p className="text-[#1a7be2] text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
              Medical Journal
            </p>
            <h2 className="text-3xl md:text-5xl font-medium text-gray-900 leading-[1.05] tracking-tighter">
              Learn more about your{" "}
              <span className="font-['Playfair_Display',_serif] italic text-transparent bg-clip-text bg-gradient-to-r from-[#1a7be2] to-[#1ed8ca] pr-2">
                health.
              </span>
            </h2>
          </motion.div>

          {/* Right: View All Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href="#blog"
              onClick={(e) => e.preventDefault()}
              className="group flex items-center gap-2 text-[13px] font-bold text-gray-900 uppercase tracking-widest hover:text-[#1a7be2] transition-colors duration-300 pb-2"
            >
              Our Blog
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>

        {/* ── Compact 4-Column Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {learnArticles.map((article, i) => (
            <motion.div 
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col cursor-pointer"
            >
              
              {/* Image Container (Exactly 12px rounded corners) */}
              <div className="relative w-full aspect-[4/3] rounded-[12px] overflow-hidden bg-gray-50 mb-5 shadow-[0_5px_15px_-5px_rgba(0,0,0,0.05)]">
                <img
                  src={article.img}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
              </div>

              {/* Text Content */}
              <div className="flex flex-col pr-2">
                <h3 className="font-['Oswald',_sans-serif] text-lg md:text-xl text-gray-900 tracking-wide uppercase mb-2 transition-colors duration-500 group-hover:text-[#1a7be2] leading-snug">
                  {article.title}
                </h3>
                
                <p className="text-[13px] md:text-[14px] text-gray-500 leading-relaxed font-light line-clamp-3 mb-4">
                  {article.desc}
                </p>

                {/* Minimalist Action Link */}
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-900 tracking-wide transition-colors duration-500 group-hover:text-[#1a7be2] mt-auto">
                  {article.cta || "Read Article"}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
     
<section className="bg-white pt-16 md:pt-24 pb-24 md:pb-32 px-4 md:px-6 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <div className="relative bg-[#09090b] rounded-[24px] md:rounded-[32px] p-8 md:p-12 lg:p-16 shadow-2xl overflow-hidden text-left border border-white/10">
            
            {/* Ambient Brand Glows */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-[#1a7be2] rounded-full blur-[150px] opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-[#1ed8ca] rounded-full blur-[150px] opacity-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12 lg:mb-16 border-b border-white/10 pb-12 lg:pb-16">
              
              {/* ── The Pitch ── */}
              <div className="max-w-2xl">
                <span className="text-[#1ed8ca] text-[10px] font-bold uppercase tracking-[0.3em] block mb-5">
                  Premium Access
                </span>
                
                <h3 className="font-['Oswald',_sans-serif] text-4xl md:text-5xl lg:text-[56px] text-white tracking-wide mb-6 leading-[1.1] uppercase">
                  Concierge medicine.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500">Nine dollars a year.</span>
                </h3>
                
                <p className="font-['Playfair_Display',_serif] text-gray-300 text-lg md:text-xl font-light leading-relaxed max-w-lg italic">
                  Skip the waitlists. Unlock instant specialist matching, fixed-price procedures, and priority global care for less than a dollar a month.
                </p>
              </div>

              {/* ── The Call to Action ── */}
              <div className="flex flex-col items-start lg:items-end shrink-0">
                <button
                  onClick={onUpgradeClick}
                  className="group bg-white hover:bg-gray-200 text-black font-['Oswald',_sans-serif] font-medium text-[15px] uppercase tracking-[0.15em] px-10 py-4 rounded-full transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.02]"
                >
                  Upgrade Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-gray-500 text-[11px] mt-4 uppercase tracking-[0.15em] font-semibold">
                  Cancel anytime. No hidden fees.
                </p>
              </div>
            </div>

            {/* ── The Features Grid ── */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              
              {/* Feature 1 */}
              <div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5 transition-colors duration-500 hover:bg-[#1a7be2]/20 hover:border-[#1a7be2]/50">
                  <Stethoscope className="w-4 h-4 text-[#1a7be2]" />
                </div>
                <h4 className="font-['Oswald',_sans-serif] text-white text-xl uppercase tracking-wider mb-3">Priority Specialists</h4>
                <p className="font-['Playfair_Display',_serif] text-gray-400 text-[15px] leading-relaxed pr-4">
                  Connect instantly with top-tier specialists and secure fixed-price procedure bookings worldwide.
                </p>
              </div>

              {/* Feature 2 */}
              <div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5 transition-colors duration-500 hover:bg-[#1ed8ca]/20 hover:border-[#1ed8ca]/50">
                  <Zap className="w-4 h-4 text-[#1ed8ca]" />
                </div>
                <h4 className="font-['Oswald',_sans-serif] text-white text-xl uppercase tracking-wider mb-3">AI Matchmaking</h4>
                <p className="font-['Playfair_Display',_serif] text-gray-400 text-[15px] leading-relaxed pr-4">
                  Intelligent doctor matchmaking, precision symptom triage, and secure, centralized data keeping.
                </p>
              </div>

              {/* Feature 3 */}
              <div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5 transition-colors duration-500 hover:bg-white/20 hover:border-white/50">
                  <Plane className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-['Oswald',_sans-serif] text-white text-xl uppercase tracking-wider mb-3">Global Itineraries</h4>
                <p className="font-['Playfair_Display',_serif] text-gray-400 text-[15px] leading-relaxed pr-4">
                  Personalized travel and comprehensive care itineraries mapped out for a seamless global experience.
                </p>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </section>
           

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
