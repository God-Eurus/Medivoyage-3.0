"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Stethoscope, Zap, Shield, Brain, Activity, Heart } from 'lucide-react';

interface AICtaProps {
  onAIClick?: () => void;
}

// ── Sample chat messages for the live preview mockup ──────────────────────────
const chatPreview = [
  {
    role: 'user',
    text: "I've had a throbbing headache for 2 days. Should I be worried?",
  },
  {
    role: 'bot',
    text: "A 2-day headache warrants attention. Key red flags: sudden severe onset, fever with stiff neck, or vision changes. Most likely it's a tension or migraine headache. Hydrate well, rest in a dark room, and try ibuprofen. If it persists past 3 days — see a doctor.",
  },
  {
    role: 'user',
    text: "What about my blood pressure — it was 145/92 yesterday.",
  },
  {
    role: 'bot',
    text: "145/92 is Stage 1 Hypertension. Reduce sodium, exercise 30 min/day, and avoid alcohol. Book a check-up — your doctor may start medication if lifestyle changes aren't enough.",
  },
];

const stats = [
  { value: '20+', label: 'Medical Topics', icon: <Brain className="w-5 h-5" /> },
  { value: '24/7', label: 'Always Available', icon: <Zap className="w-5 h-5" /> },
  { value: '$9', label: 'Lifetime Access', icon: <Shield className="w-5 h-5" /> },
];

const topics = [
  { icon: <Heart className="w-3.5 h-3.5" />, label: 'Cardiology' },
  { icon: <Brain className="w-3.5 h-3.5" />, label: 'Mental Health' },
  { icon: <Activity className="w-3.5 h-3.5" />, label: 'Nutrition' },
  { icon: <Stethoscope className="w-3.5 h-3.5" />, label: 'Symptoms' },
  { icon: <Shield className="w-3.5 h-3.5" />, label: 'First Aid' },
  { icon: <Zap className="w-3.5 h-3.5" />, label: 'Diabetes' },
];

// ── Animations ────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const slideIn = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: 'easeOut' } },
};

export function AICta({ onAIClick }: AICtaProps) {
  return (
    <section className="relative bg-brand-navy overflow-hidden font-manrope py-28 md:py-40 px-6 md:px-12 lg:px-20">

      {/* ── Ambient glow blobs ───────────────────────────────────────────── */}
      <div className="pointer-events-none absolute top-[-10%] left-[-5%] w-[50vw] h-[50vh] rounded-full bg-brand-teal/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vh] rounded-full bg-brand-blue/10 blur-[100px]" />

      <div className="relative z-10 max-w-[90rem] mx-auto">

        {/* ── Two-column layout ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── LEFT: Copy ───────────────────────────────────────────────── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {/* Label */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-teal mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                MediVoyage AI — Now Live
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.04] mb-6"
            >
              Your personal
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-blue to-brand-teal">
                health doctor.
              </span>
              <br />
              <span className="text-gray-500 font-light">Any question.</span>
            </motion.h2>

            {/* Sub-copy */}
            <motion.p
              variants={fadeUp}
              className="text-gray-400 text-sm md:text-base leading-relaxed font-medium max-w-md mb-10"
            >
              Get instant, detailed answers on symptoms, conditions, medications, nutrition, and medical tourism — from an AI trained on medical knowledge and backed by the MediVoyage clinical network.
            </motion.p>

            {/* Topic chips */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-12">
              {topics.map((t) => (
                <span
                  key={t.label}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 border border-white/10 bg-white/5 px-3 py-1.5 rounded-full"
                >
                  <span className="text-brand-teal">{t.icon}</span>
                  {t.label}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 border border-white/5 bg-white/3 px-3 py-1.5 rounded-full">
                +14 more
              </span>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-3 gap-4 mb-12"
            >
              {stats.map((s) => (
                <div key={s.label} className="border border-white/10 bg-white/5 rounded-xl p-4">
                  <div className="text-brand-teal mb-2">{s.icon}</div>
                  <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{s.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={onAIClick}
                className="group relative inline-flex items-center gap-3 bg-brand-blue hover:bg-[#1565c0] text-white font-extrabold text-sm uppercase tracking-widest px-8 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-8px_rgba(26,123,226,0.6)] overflow-hidden"
              >
                <span className="relative z-10">Try MediVoyage AI</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                {/* Shine sweep */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </button>

              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">$9 — one-time payment</span>
                <span className="text-gray-500 text-xs">Lifetime access. No subscription. No hidden fees.</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Chat mockup ───────────────────────────────────────── */}
          <motion.div
            variants={slideIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="hidden lg:block"
          >
            {/* Device frame */}
            <div className="relative rounded-2xl border border-white/10 bg-brand-navy2 shadow-2xl shadow-black/60 overflow-hidden">

              {/* Window chrome */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-brand-navy">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1 ml-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">MediVoyage AI</span>
                  </div>
                </div>
                <Stethoscope className="w-4 h-4 text-brand-teal" />
              </div>

              {/* Chat messages */}
              <div className="px-5 py-6 space-y-4 min-h-[420px]">
                {chatPreview.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.18 + 0.3, duration: 0.5 }}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      msg.role === 'bot'
                        ? 'bg-brand-teal/20 border border-brand-teal/30 text-brand-teal'
                        : 'bg-white/10 border border-white/10 text-gray-300'
                    }`}>
                      {msg.role === 'bot' ? <Stethoscope className="w-3.5 h-3.5" /> : 'U'}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[78%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed font-medium ${
                      msg.role === 'user'
                        ? 'bg-white/10 text-gray-200 rounded-tr-sm'
                        : 'bg-brand-teal/10 border border-brand-teal/20 text-gray-300 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator (always visible as decoration) */}
                <div className="flex gap-2.5 items-end">
                  <div className="w-7 h-7 rounded-full bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-3.5 h-3.5 text-brand-teal" />
                  </div>
                  <div className="bg-brand-teal/10 border border-brand-teal/20 rounded-xl rounded-tl-sm px-3.5 py-3">
                    <div className="flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="px-5 pb-5">
                <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <span className="text-xs text-gray-600 flex-1">Ask a health question…</span>
                  <div className="w-6 h-6 rounded-lg bg-brand-blue/20 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-brand-blue" />
                  </div>
                </div>
              </div>

              {/* Bottom glow */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-teal/5 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-brand-blue text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 shadow-lg shadow-brand-blue/30">
              Live Preview
            </div>
          </motion.div>

        </div>

        {/* ── Bottom divider line ───────────────────────────────────────────── */}
        <div className="mt-24 pt-10 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs font-medium">
            ⚠️ MediVoyage AI provides general health information — not a substitute for professional medical advice.
          </p>
          <button
            onClick={onAIClick}
            className="text-brand-teal hover:text-brand-teal text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors"
          >
            Access the AI
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
