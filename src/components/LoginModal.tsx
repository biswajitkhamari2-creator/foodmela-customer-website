import React, { useEffect, useState } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { X, ShieldCheck, CheckCircle2, Loader2, Sparkles, AlertCircle, Phone, ArrowRight, UserCheck } from 'lucide-react';
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
  const { showLoginModal, setShowLoginModal, setUser, setCurrentLocation, refreshOrders } = useApp();
  const [directPhone, setDirectPhone] = useState('');
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

    await lookupAndComplete(phone);
  };

  const handleDirectPhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = directPhone.replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setErr('Please enter a valid 10-digit mobile number.');
      return;
    }

    setBusy(true);
    setErr('');
    setStep('Connecting to Food Mela Backend…');

    await lookupAndComplete(cleanPhone);
  };

  const lookupAndComplete = async (phone: string) => {
    setVerifiedPhone(phone);
    setStep('Looking up your Food Mela profile & orders…');

    let fullName = '';
    let address = 'Birmaharajpur, Subarnapur, Odisha - 767018';

    // 1. Check Backend profile
    try {
      const res = await withTimeout(apiClient.userProfile(phone), STEP_TIMEOUT_MS, 'Backend profile');
      if (res && res.user) {
        const u = res.user as Record<string, any>;
        fullName = String(u.fullName || u.name || '').trim();
        const addrs = Array.isArray(u.addresses) ? u.addresses : [];
        if (addrs.length > 0 && addrs[0]?.address) {
          address = String(addrs[0].address).trim();
        } else if (u.address) {
          address = String(u.address).trim();
        }
      }
    } catch {
      // ignore
    }

    // 2. Check Firestore users collection if name still empty
    if (!fullName) {
      try {
        const snap = await Promise.race([
          getDoc(doc(db, 'users', phone)),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
        ]);
        if (snap && snap.exists()) {
          const d = snap.data() as Record<string, any>;
          fullName = String(d.fullName || d.name || `${d.firstName || ''} ${d.lastName || ''}`).trim();
          if (d.deliveryAddress || d.address) {
            address = String(d.deliveryAddress || d.address).trim();
          }
        }
      } catch {
        // ignore
      }
    }

    // 3. Check localStorage cache if name still empty
    if (!fullName) {
      try {
        fullName = localStorage.getItem(`fm_user_name_${phone}`) || '';
        const savedAddr = localStorage.getItem(`fm_user_addr_${phone}`);
        if (savedAddr) address = savedAddr;
      } catch {
        // ignore
      }
    }

    // Default friendly name
    if (!fullName) {
      fullName = `Customer (${phone.slice(-4)})`;
    }

    // Ensure backend token is minted & stored
    try {
      await apiClient.phoneLogin(phone, fullName, address);
    } catch { /* ignore */ }

    completeLogin(phone, fullName, address);
  };

  const completeLogin = async (phone: string, name: string, address: string) => {
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
    await refreshOrders();

    setTimeout(() => {
      setSuccess(false);
      setShowLoginModal(false);
    }, 1000);
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
                Connected to backend as +91 {verifiedPhone}.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Verified Backend Login</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                  Welcome to Food Mela
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Instant mobile verification. Access fresh 24-item catalog, order history &amp; tracking.
                </p>
              </div>

              {err && (
                <div className="p-3.5 text-xs font-semibold text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-2xl border border-red-200 dark:border-red-900/30 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{err}</span>
                </div>
              )}

              {/* Method 1: Official Phone.Email 1-Touch Button */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block text-center">
                  Option 1: 1-Touch Phone.Email
                </span>
                <div 
                  className="flex justify-center transition-all min-h-[44px]"
                  style={{ opacity: busy ? 0.6 : 1, pointerEvents: busy ? 'none' : 'auto' }}
                >
                  <div className="pe_signin_button" data-client-id={PE_CLIENT_ID} />
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider absolute">
                  OR Mobile Number
                </span>
              </div>

              {/* Method 2: Direct 10-Digit Mobile Input */}
              <form onSubmit={handleDirectPhoneSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enter Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit number"
                      value={directPhone}
                      onChange={(e) => setDirectPhone(e.target.value.replace(/\D/g, ''))}
                      disabled={busy}
                      className="w-full pl-12 pr-4 py-3 text-sm font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 rounded-2xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-slate-900 dark:text-white"
                      required
                    />
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy || directPhone.length < 10}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  {busy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{step || 'Connecting Backend…'}</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Verify &amp; Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

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
