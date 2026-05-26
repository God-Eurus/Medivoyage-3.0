import { useState } from 'react';
import {
  Stethoscope, CheckCircle2, Shield, Zap, Brain, Heart,
  Activity, ArrowRight, Lock, AlertCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// ── Razorpay types ──────────────────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}
interface RazorpayInstance { open(): void; }

// ── Config — replace with your Razorpay Key ID ──────────────────────────────
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID ?? 'YOUR_RAZORPAY_KEY_ID';
const PRICE_USD = 9;
// Razorpay amounts are in the smallest currency unit.
// For USD: cents (9 USD = 900 cents). For INR: paise (₹9 = 900 paise).
const AMOUNT_CENTS = PRICE_USD * 100;
const CURRENCY = 'USD';

// ── Load Razorpay script ────────────────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Features list ───────────────────────────────────────────────────────────
const features = [
  { icon: <Brain className="w-4 h-4 text-purple-500" />, label: 'AI health chatbot, 24/7' },
  { icon: <Activity className="w-4 h-4 text-teal-500" />, label: 'Symptom checker & first aid' },
  { icon: <Heart className="w-4 h-4 text-rose-500" />, label: '20+ medical topic categories' },
  { icon: <Stethoscope className="w-4 h-4 text-blue-500" />, label: 'Medical tourism guidance' },
  { icon: <Zap className="w-4 h-4 text-amber-500" />, label: 'Instant, detailed responses' },
  { icon: <Shield className="w-4 h-4 text-green-500" />, label: 'Lifetime access — pay once' },
];

interface PaymentPageProps {
  onSuccess: () => void;
  onHomeClick?: () => void;
}

export default function PaymentPage({ onSuccess, onHomeClick }: PaymentPageProps) {
  const { user, refreshAccess } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paid, setPaid] = useState(false);

  const handlePayment = async () => {
    setError('');
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError('Could not load the payment gateway. Please check your connection and try again.');
      setLoading(false);
      return;
    }

    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: AMOUNT_CENTS,
      currency: CURRENCY,
      name: 'MediVoyage',
      description: 'MediVoyage AI — Lifetime Access',
      prefill: { email: user?.email ?? '' },
      theme: { color: '#0d9488' },
      handler: async (response: RazorpayResponse) => {
        // Mark user as paid in Supabase user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            has_paid: true,
            payment_id: response.razorpay_payment_id,
            paid_at: new Date().toISOString(),
            amount_usd: PRICE_USD,
          },
        });

        if (updateError) {
          setError('Payment received but failed to activate access. Contact support with your payment ID: ' + response.razorpay_payment_id);
          setLoading(false);
          return;
        }

        await refreshAccess();
        setPaid(true);
        setTimeout(onSuccess, 1800);
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    // loading remains true until handler fires or modal dismissed
  };

  if (paid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-brand-teal" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Payment Successful!</h2>
          <p className="text-gray-500 text-sm">Activating your MediVoyage AI access…</p>
          <div className="w-8 h-1 bg-brand-teal rounded-full animate-pulse mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <button onClick={onHomeClick} className="text-lg font-extrabold tracking-tight select-none">
          <span className="text-gray-500">MY </span>
          <span className="text-black">MEDIVOYAGE</span>
        </button>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <Lock className="w-3.5 h-3.5" />
          Secure Checkout
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              One-time payment — Lifetime Access
            </span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-br from-brand-blue to-[#1565c0] px-6 pt-8 pb-6 text-white text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm mb-3">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight">MediVoyage AI</h1>
              <p className="text-blue-100 text-xs mt-1">Personal Health Intelligence</p>
              <div className="mt-5 flex items-end justify-center gap-1">
                <span className="text-4xl font-extrabold">$9</span>
                <span className="text-blue-200 text-sm mb-1">one-time</span>
              </div>
            </div>

            {/* Features */}
            <div className="px-6 py-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Everything included</p>
              <ul className="space-y-3">
                {features.map((f) => (
                  <li key={f.label} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      {f.icon}
                    </div>
                    <span className="text-sm text-gray-700">{f.label}</span>
                    <CheckCircle2 className="w-4 h-4 text-brand-teal ml-auto shrink-0" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-gray-100" />

            {/* Payment section */}
            <div className="px-6 py-5">
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2.5 mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="text-xs text-gray-500 mb-3 text-center">
                Signed in as <span className="font-semibold text-gray-700">{user?.email}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-[#1565c0] active:bg-[#1255a0] text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-brand-blue/20"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Opening payment…
                  </>
                ) : (
                  <>
                    Pay $9 — Get Lifetime Access
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  Secure payment
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  Razorpay encrypted
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal" />
                  No hidden fees
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Powered by{' '}
            <span className="font-semibold text-gray-500">Razorpay</span>. Your payment info is never stored by MediVoyage.
          </p>
        </div>
      </div>
    </div>
  );
}
