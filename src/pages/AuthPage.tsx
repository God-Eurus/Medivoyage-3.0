import React, { useState } from 'react';
import { Stethoscope, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  onSuccess: () => void;
  onHomeClick?: () => void;
}

export default function AuthPage({ onSuccess, onHomeClick }: AuthPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setInfo('Account created! Check your email to confirm, then sign in.');
        setMode('signin');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        onSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg.replace('Invalid login credentials', 'Incorrect email or password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <button
          onClick={onHomeClick}
          className="text-lg font-extrabold tracking-tight select-none"
        >
          <span className="text-gray-500">MY </span>
          <span className="text-black">MEDIVOYAGE</span>
        </button>
        <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Secure Portal</span>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Icon + heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-blue text-white mb-4 shadow-lg shadow-teal-200">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {mode === 'signin'
                ? 'Sign in to access MediVoyage AI'
                : 'Join MediVoyage and get AI health guidance'}
            </p>
          </div>

          {/* Tab switch */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              onClick={() => { setMode('signin'); setError(''); setInfo(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signin' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setInfo(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-3 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Info */}
            {info && (
              <div className="bg-blue-50 border border-brand-blue/30 text-brand-blue text-sm rounded-xl px-3 py-2.5">
                {info}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-[#1565c0] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing, you agree to MediVoyage's{' '}
            <span className="underline cursor-pointer hover:text-gray-600">Terms</span> and{' '}
            <span className="underline cursor-pointer hover:text-gray-600">Privacy Policy</span>.
          </p>

          {/* What you get */}
          <div className="mt-8 p-4 bg-blue-50 border border-brand-blue/10 rounded-2xl">
            <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-2">What you get</p>
            <ul className="space-y-1.5">
              {[
                '24/7 AI health assistant',
                'Answers on 20+ medical topics',
                'Symptom checker & first aid guide',
                'Medical tourism guidance',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-brand-blue">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
