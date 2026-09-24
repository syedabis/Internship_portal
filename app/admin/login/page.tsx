'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAILS = ['abis@datacrumbs.org'];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('abis@datacrumbs.org');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!ADMIN_EMAILS.includes(cleanEmail)) {
      setErrorMsg(`Access Denied: "${cleanEmail}" is not authorized as an administrator.`);
      return;
    }

    setLoading(true);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: 'Admin User',
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      } else if (data.session) {
        router.replace('/admin');
      } else {
        // Fallback login if user exists
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });
        if (signInError) {
          setErrorMsg(signInError.message);
          setLoading(false);
        } else {
          router.replace('/admin');
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg('Invalid password. If you haven\'t created your account yet, switch to "Create Admin Password" below.');
        } else {
          setErrorMsg(error.message);
        }
        setLoading(false);
      } else {
        router.replace('/admin');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#091715] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Textured Glows */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/progress_card_bg.jpeg')" }}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0e2420] border border-[#1e4841] rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1.5 pt-2">
            <span>Cortexa</span>
            <span className="text-emerald-400 font-mono">AI</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wide">
              Admin
            </span>
          </h1>

          <p className="text-xs text-[#829e98] leading-relaxed">
            {isSignUp ? 'Create your password for administrator access' : 'Enter your credentials to access the Admin Control Center'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-tight font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#829e98] uppercase tracking-wider block">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5c7973]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abis@datacrumbs.org"
                className="w-full pl-10 pr-4 py-3 bg-[#091715] border border-[#1b433c] rounded-xl text-xs text-white placeholder-[#5c7973] focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#829e98] uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5c7973]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-10 py-3 bg-[#091715] border border-[#1b433c] rounded-xl text-xs text-white placeholder-[#5c7973] focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5c7973] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 pt-3"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>{isSignUp ? 'Create Admin Account & Log In' : 'Sign In to Admin Panel'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="pt-2 text-center text-xs text-[#829e98] space-y-2 border-t border-[#183933]">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            className="text-emerald-400 font-semibold hover:underline"
          >
            {isSignUp ? 'Already set your password? Sign In' : 'First time? Set your password here'}
          </button>

          <div>
            <a href="/" className="text-[11px] text-[#5c7973] hover:text-slate-300 transition-colors">
              ← Return to Student Portal
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
