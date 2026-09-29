import React, { useState, useEffect, useRef } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { X, CheckCircle2, Loader2, Sparkles, AlertCircle, Phone, ArrowRight, ShieldCheck, ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

declare global {
  interface Window {
    phoneEmailListener?: (userObj: { user_json_url?: string; user_phone_number?: string; user_country_code?: string }) => void;
  }
}

const PE_CLIENT_ID = '14442678863809499061';
const PE_WIDGET_SRC = 'https://www.phone.email/sign_in_button_v1.js';
const STEP_TIMEOUT_MS = 20000;

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out`)), ms)),
  ]);
}

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, setUser, setCurrentLocation, refreshOrders } = useApp();
  
  // 'input' | 'waiting' | 'success'
  const [currentStep, setCurrentStep] = useState<'input' | 'waiting' | 'success'>('input');
  const [directPhone, setDirectPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [stepLabel, setStepLabel] = useState('');
  const [err, setErr] = useState('');
  const [verifiedName, setVerifiedName] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');

  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (showLoginModal && currentStep === 'input') {
      setTimeout(() => phoneInputRef.current?.focus(), 150);
    }
  }, [showLoginModal, currentStep]);

  // Load official Phone.Email script and listen for verified callbacks
  useEffect(() => {
    if (!showLoginModal) return;

    // Handler for Phone.Email callback
    const handlePhoneEmailSuccess = (userObj: { user_json_url?: string }) => {
      if (userObj?.user_json_url) {
        void verifyWithBackend(userObj.user_json_url);
      } else {
        setErr('Real OTP verification was not completed. Please try again.');
        setBusy(false);
        setStepLabel('');
      }
    };

    window.phoneEmailListener = handlePhoneEmailSuccess;

    // Window message listener as primary/fallback for postMessage
    const onWindowMessage = (event: MessageEvent) => {
      if (event.origin === 'https://auth.phone.email') {
        const d = event.data;
        if (d && (d.flag_phone === '1' || d.flag_phone === 1) && d.user_json_url) {
          void verifyWithBackend(d.user_json_url);
        }
      }
    };
    window.addEventListener('message', onWindowMessage);

    // Inject Phone.Email script if not present
    if (!document.querySelector(`script[src="${PE_WIDGET_SRC}"]`)) {
      const s = document.createElement('script');
      s.src = PE_WIDGET_SRC;
      s.async = true;
      document.body.appendChild(s);
    }

    return () => {
      window.removeEventListener('message', onWindowMessage);
      delete window.phoneEmailListener;
    };
  }, [showLoginModal]);

  // Reset state when closing modal
  useEffect(() => {
    if (!showLoginModal) {
      setCurrentStep('input');
      setDirectPhone('');
      setErr('');
      setStepLabel('');
      setBusy(false);
    }
  }, [showLoginModal]);

  const handleClearPhone = () => {
    setDirectPhone('');
    setErr('');
    phoneInputRef.current?.focus();
  };

  // Open the official Phone.Email secure authentication popup window with prefilled phone
  const openPhoneEmailPopup = (phoneToUse: string) => {
    const cleanPhone = phoneToUse.replace(/[^0-9]/g, '').slice(-10);
    const currUrl = window.location.origin;
    const phoneParam = cleanPhone ? `&user_phone_no=${cleanPhone}` : '';
    const authUrl = `https://auth.phone.email/log-in?client_id=${PE_CLIENT_ID}&auth_type=8&origin=${encodeURIComponent(currUrl)}${phoneParam}`;
    
    const w = 500;
    const h = 580;
    const top = Math.max(0, (window.screen.height - h) / 2);
    const left = Math.max(0, (window.screen.width - w) / 2);

    const win = window.open(
      authUrl,
      'peLoginWindow',
      `toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=${w},height=${h},top=${top},left=${left}`
    );

    if (win) {
      try { win.focus(); } catch { /* ignore */ }
    }
  };

  const handleSendRealOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = directPhone.replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setErr('Please enter a valid 10-digit mobile number.');
      return;
    }

    setErr('');
    setCurrentStep('waiting');
    openPhoneEmailPopup(cleanPhone);
    playNotificationSound('click');
  };

  // Verify the Phone.Email user_json_url with Food Mela Backend
  const verifyWithBackend = async (userJsonUrl: string) => {
    setBusy(true);
    setErr('');
    setStepLabel('Verifying real SMS OTP with Phone.Email…');

    let phone = '';
    let registeredName = '';

    try {
      const data = await withTimeout(
        apiClient.verifyPhoneEmail({ user_json_url: userJsonUrl }),
        STEP_TIMEOUT_MS,
        'Phone.Email verification'
      );

      phone = String(data.phone || '').replace(/[^0-9]/g, '').slice(-10);
      registeredName = String(data.name || '').trim();

      if (!data.success || phone.length < 10) {
        setErr('Real OTP verification failed. Please try again.');
        setBusy(false);
        setStepLabel('');
        return;
      }

      if (data.apiToken) {
        try {
          localStorage.setItem('fm_api_token', data.apiToken);
          sessionStorage.setItem('fm_api_token', data.apiToken);
        } catch { /* ignore */ }
      }
    } catch {
      setErr('Could not reach verification server. Please check your internet connection.');
      setBusy(false);
      setStepLabel('');
      return;
    }

    setVerifiedPhone(phone);
    await lookupAndComplete(phone, registeredName);
  };

  const lookupAndComplete = async (phone: string, fallbackName?: string) => {
    setStepLabel('Loading your Food Mela profile & orders…');

    let fullName = fallbackName || '';
    let address = 'Birmaharajpur, Subarnapur, Odisha - 767018';

    // 1. Check Backend profile API
    try {
      const res = await withTimeout(apiClient.userProfile(phone), STEP_TIMEOUT_MS, 'Backend profile');
      if (res && res.user) {
        const u = res.user as Record<string, any>;
        if (!fullName) {
          fullName = String(u.fullName || u.name || '').trim();
        }
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

    setVerifiedName(fullName);

    // Ensure backend token is minted & stored
    try {
      await apiClient.phoneLogin(phone, fullName, address);
    } catch { /* ignore */ }

    completeLogin(phone, fullName, address);
  };

  const completeLogin = async (phone: string, name: string, address: string) => {
    playNotificationSound('success');
    setCurrentStep('success');
    setBusy(false);
    setStepLabel('');

    const defaultAddrs = [
      {
        id: 'addr_1',
        tag: 'Home' as const,
        label: 'Home' as const,
        addressLine: address,
        city: 'Birmaharajpur',
        isDefault: true,
      },
    ];

    const profile = {
      name,
      phone,
      address,
      addresses: defaultAddrs,
      savedAddresses: defaultAddrs,
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
      setShowLoginModal(false);
      setCurrentStep('input');
    }, 1200);
  };

  const handleClose = () => {
    if (busy) return;
    setErr('');
    setStepLabel('');
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
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500" />

        <div className="p-6 sm:p-8 pt-8">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* STEP: SUCCESS */}
          {currentStep === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white font-display">
                Real OTP Verified!
              </h3>
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                {verifiedName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connected securely as +91 {verifiedPhone}
              </p>
            </div>
          )}

          {/* STEP: INPUT MOBILE NUMBER */}
          {currentStep === 'input' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Real SMS OTP Verification</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                  Sign In to Food Mela
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Enter your mobile number to receive a real SMS OTP code directly on your phone.
                </p>
              </div>

              {err && (
                <div className="p-3.5 text-xs font-semibold text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-2xl border border-red-200 dark:border-red-900/30 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{err}</span>
                </div>
              )}

              <form onSubmit={handleSendRealOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mobile Number
                    </label>
                    {directPhone.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearPhone}
                        className="text-[11px] font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-xs font-black text-slate-400 select-none">
                      +91
                    </span>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit number"
                      value={directPhone}
                      onChange={(e) => {
                        setDirectPhone(e.target.value.replace(/\D/g, ''));
                        if (err) setErr('');
                      }}
                      disabled={busy}
                      className="pe_phone_number w-full pl-14 pr-12 py-3.5 text-sm font-bold bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-750 rounded-2xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-slate-900 dark:text-white transition-all shadow-inner"
                      required
                    />
                    
                    {/* Clear Button (X) inside input */}
                    {directPhone.length > 0 ? (
                      <button
                        type="button"
                        onClick={handleClearPhone}
                        className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        title="Clear input"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : (
                      <Phone className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none" />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy || directPhone.length < 10}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 hover:from-orange-600 hover:to-emerald-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Send Real SMS OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Official Phone.Email 1-Touch Button Container (styled cleanly) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block text-center">
                  Or 1-Tap Phone.Email Verification
                </span>
                <div 
                  className="flex justify-center transition-all min-h-[44px]"
                  style={{ opacity: busy ? 0.6 : 1, pointerEvents: busy ? 'none' : 'auto' }}
                >
                  <div className="pe_signin_button" data-client-id={PE_CLIENT_ID} />
                </div>
              </div>
            </div>
          )}

          {/* STEP: WAITING FOR REAL SMS OTP VERIFICATION */}
          {currentStep === 'waiting' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => { setCurrentStep('input'); setErr(''); setBusy(false); }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-orange-500 transition-colors mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change number</span>
                </button>
                <div className="w-14 h-14 mx-auto bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center text-emerald-500 shadow-md">
                  <ShieldCheck className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                  Verify SMS Code
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  A secure verification window has opened for <strong className="text-slate-900 dark:text-white">+91 {directPhone}</strong>. Enter the real SMS code sent to your phone.
                </p>
              </div>

              {err && (
                <div className="p-3.5 text-xs font-semibold text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-2xl border border-red-200 dark:border-red-900/30 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{err}</span>
                </div>
              )}

              {busy ? (
                <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 flex items-center justify-center gap-3 text-orange-700 dark:text-orange-300">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-xs font-bold">{stepLabel || 'Verifying real OTP…'}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => openPhoneEmailPopup(directPhone)}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Re-open OTP Window</span>
                  </button>

                  <div className="flex justify-center">
                    <div className="pe_signin_button" data-client-id={PE_CLIENT_ID} />
                  </div>
                </div>
              )}

              <p className="text-center text-[10px] text-slate-400 leading-relaxed">
                Once you enter the SMS code in the Phone.Email window, you will be automatically signed in.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
