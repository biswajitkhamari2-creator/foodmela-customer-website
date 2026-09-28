import React, { useEffect, useState } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { X, ShieldCheck, CheckCircle2, Loader2, Sparkles, AlertCircle, Smartphone } from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

declare global {
  interface Window {
    phoneEmailListener?: (userObj: { user_json_url?: string }) => void;
  }
}

const PE_CLIENT_ID = '14442678863809499061';
const PE_WIDGET_SRC = 'https://www.phone.email/sign_in_button_v1.js';
const STEP_TIMEOUT_MS = 15000;

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out`)), ms)),
  ]);
}

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, setUser, setCurrentLocation } = useApp();
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState('');
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState('');

  // Register the official Phone.Email listener and load the script
  useEffect(() => {
    if (!showLoginModal) return;

    window.phoneEmailListener = (userObj: { user_json_url?: string }) => {
      if (userObj?.user_json_url) {
        void verifyWidgetUser(userObj.user_json_url);
      } else {
        setErr('Verification failed — phone.email did not confirm your number. Please try again.');
      }
    };

    if (!document.querySelector(`script[src="${PE_WIDGET_SRC}"]`)) {
      const s = document.createElement('script');
      s.src = PE_WIDGET_SRC;
      s.async = true;
      document.body.appendChild(s);
    }

    return () => {
      delete window.phoneEmailListener;
    };
  }, [showLoginModal]);

  const verifyWidgetUser = async (userJsonUrl: string) => {
    setBusy(true);
    setErr('');
    setStep('Confirming your number with Phone.Email…');

    let phone = '';
    try {
      const data = await withTimeout(
        apiClient.verifyPhoneEmail({ user_json_url: userJsonUrl }),
        STEP_TIMEOUT_MS,
        'Phone.Email verification'
      );

      phone = String(data.phone || '').replace(/[^0-9]/g, '').slice(-10);
      if (!data.success || phone.length < 10) {
        setErr('Verification failed — phone.email did not confirm your number. Please try again.');
        setBusy(false);
        setStep('');
        return;
      }

      if (data.apiToken) {
        try {
          localStorage.setItem('fm_api_token', data.apiToken);
          sessionStorage.setItem('fm_api_token', data.apiToken);
        } catch { /* ignore */ }
      }
    } catch {
      setErr('Could not reach verification server. Check your internet and try again.');
      setBusy(false);
      setStep('');
      return;
    }

    setStep('Looking up your Food Mela account…');
    setVerifiedPhone(phone);

    // 1. Check localStorage cached profile
    try {
      const cachedName = localStorage.getItem(`fm_user_name_${phone}`);
      const cachedAddr = localStorage.getItem(`fm_user_addr_${phone}`) || 'Birmaharajpur, Subarnapur, Odisha - 767018';
      if (cachedName) {
        completeLogin(phone, cachedName, cachedAddr);
        return;
      }
    } catch { /* ignore */ }

    // 2. Check Firestore users collection
    try {
      const snap = await Promise.race([
        getDoc(doc(db, 'users', phone)),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
      ]);
      if (snap && snap.exists()) {
        const d = snap.data() as Record<string, any>;
        const fullName = String(d.fullName || d.name || `${d.firstName || ''} ${d.lastName || ''}`).trim();
        const addr = String(d.deliveryAddress || d.address || 'Birmaharajpur, Subarnapur, Odisha - 767018').trim();
        if (fullName) {
          completeLogin(phone, fullName, addr);
          return;
        }
      }
    } catch { /* ignore */ }

    // 3. Check Backend user profile
    try {
      const res = await withTimeout(apiClient.userProfile(phone), STEP_TIMEOUT_MS, 'Backend profile');
      const u = (res.user || {}) as Record<string, any>;
      const fullName = String(u.fullName || u.name || '').trim();
      const addrs = Array.isArray(u.addresses) ? u.addresses : [];
      const addr = String(addrs[0]?.address || u.address || 'Birmaharajpur, Subarnapur, Odisha - 767018').trim();
      
      completeLogin(phone, fullName || `Customer (${phone.slice(-4)})`, addr);
    } catch {
      completeLogin(phone, `Customer (${phone.slice(-4)})`, 'Birmaharajpur, Subarnapur, Odisha - 767018');
    }
  };

  const completeLogin = (phone: string, name: string, address: string) => {
    playNotificationSound('success');
    setSuccess(true);
    setBusy(false);
    setStep('');

    const profile = {
      name,
      phone,
      address,
      addresses: [
        {
          id: 'addr_1',
          tag: 'Home' as const,
          addressLine: address,
          city: 'Birmaharajpur',
          isDefault: true,
        },
      ],
      isGoldMember: true,
      totalSaved: 380,
    };

    try {
      localStorage.setItem(`fm_user_name_${phone}`, name);
      localStorage.setItem(`fm_user_addr_${phone}`, address);
      localStorage.setItem('foodmela_user', JSON.stringify(profile));
      localStorage.setItem('foodmela_location', address);
    } catch { /* ignore */ }

    setUser(profile);
    setCurrentLocation(address);

    setTimeout(() => {
      setSuccess(false);
      setShowLoginModal(false);
    }, 1200);
  };

  const handleClose = () => {
    if (busy) return;
    setErr('');
    setStep('');
    setShowLoginModal(false);
  };

  if (!showLoginModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 transition-all transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Saffron & Emerald Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-yellow-500 to-emerald-500" />

        <div className="p-6 sm:p-8 pt-8">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white font-display">
                Verified Successfully!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged in as +91 {verifiedPhone}. Welcome to Food Mela!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Official OTP Verification</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                  Sign In with Phone.Email
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Instant, secure mobile verification without passwords. Same account as the Food Mela app.
                </p>
              </div>

              {err && (
                <div className="p-3.5 text-xs font-semibold text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-2xl border border-red-200 dark:border-red-900/30 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{err}</span>
                </div>
              )}

              {/* Official Phone.Email Button Widget */}
              <div className="py-4 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center space-y-3">
                <div 
                  className="flex justify-center transition-all min-h-[44px]"
                  style={{ opacity: busy ? 0.6 : 1, pointerEvents: busy ? 'none' : 'auto' }}
                >
                  <div className="pe_signin_button" data-client-id={PE_CLIENT_ID} />
                </div>

                {busy && (
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{step || 'Verifying OTP…'}</span>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="p-2 rounded-xl bg-slate-50/60 dark:bg-slate-800/30">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">⚡ Instant</span>
                  <span className="text-[9px] text-slate-400">1-Touch OTP</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50/60 dark:bg-slate-800/30">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">🛡️ Verified</span>
                  <span className="text-[9px] text-slate-400">Phone.Email</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50/60 dark:bg-slate-800/30">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">❤️ Birmaharajpur</span>
                  <span className="text-[9px] text-slate-400">Hyperlocal</span>
                </div>
              </div>

              <p className="text-center text-[10px] text-slate-400 leading-normal">
                By continuing you agree to Food Mela's Terms of Service &amp; Privacy Policy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
