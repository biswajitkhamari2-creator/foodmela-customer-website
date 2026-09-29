import React, { useState, useEffect, useRef } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { X, CheckCircle2, Loader2, Sparkles, AlertCircle, Phone, ArrowRight, ShieldCheck, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const STEP_TIMEOUT_MS = 15000;

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out`)), ms)),
  ]);
}

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, setUser, setCurrentLocation, refreshOrders } = useApp();
  
  // Steps: 'phone' | 'otp' | 'success'
  const [currentStep, setCurrentStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [directPhone, setDirectPhone] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [stepLabel, setStepLabel] = useState('');
  const [err, setErr] = useState('');
  const [verifiedName, setVerifiedName] = useState('');

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus input on step change
  useEffect(() => {
    if (showLoginModal) {
      if (currentStep === 'phone') {
        setTimeout(() => phoneInputRef.current?.focus(), 150);
      } else if (currentStep === 'otp') {
        setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
      }
    }
  }, [showLoginModal, currentStep]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset state when opening/closing modal
  useEffect(() => {
    if (!showLoginModal) {
      setCurrentStep('phone');
      setDirectPhone('');
      setOtpCode(['', '', '', '']);
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = directPhone.replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setErr('Please enter a valid 10-digit mobile number.');
      return;
    }

    setBusy(true);
    setErr('');
    setStepLabel('Sending OTP code…');

    try {
      const res = await apiClient.sendOTP(cleanPhone);
      if (res && !res.success) {
        setErr(res.message || 'Failed to send OTP.');
        setBusy(false);
        setStepLabel('');
        return;
      }
    } catch {
      // Continue to OTP step
    }

    setBusy(false);
    setStepLabel('');
    setCountdown(30);
    setOtpCode(['', '', '', '']);
    setCurrentStep('otp');
    playNotificationSound('click');
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || busy) return;
    const cleanPhone = directPhone.replace(/[^0-9]/g, '').slice(-10);
    setBusy(true);
    setErr('');
    setStepLabel('Resending verification code…');

    try {
      await apiClient.sendOTP(cleanPhone);
    } catch { /* ignore */ }

    setBusy(false);
    setStepLabel('');
    setCountdown(30);
    playNotificationSound('click');
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = digit;
    setOtpCode(newOtp);
    setErr('');

    // Advance focus
    if (digit && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 4 filled
    if (digit && index === 3 && newOtp.every(d => d !== '')) {
      void handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (!pasted) return;

    const newOtp = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtpCode(newOtp);
    if (pasted.length === 4) {
      void handleVerifyOtp(pasted);
    } else {
      otpInputRefs.current[pasted.length]?.focus();
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const fullOtp = codeToVerify || otpCode.join('');
    if (fullOtp.length !== 4) {
      setErr('Please enter the 4-digit OTP code.');
      return;
    }

    const cleanPhone = directPhone.replace(/[^0-9]/g, '').slice(-10);
    setBusy(true);
    setErr('');
    setStepLabel('Verifying OTP code…');

    try {
      const res = await apiClient.verifyOTP(cleanPhone, fullOtp);
      if (!res.success) {
        setErr(res.message || 'Invalid OTP. Please enter 1234.');
        setBusy(false);
        setStepLabel('');
        return;
      }
    } catch {
      // Offline / fallback allowed for demo
    }

    await lookupAndComplete(cleanPhone);
  };

  const lookupAndComplete = async (phone: string) => {
    setStepLabel('Loading your profile & order history…');

    let fullName = '';
    let address = 'Birmaharajpur, Subarnapur, Odisha - 767018';

    // 1. Check Backend profile API
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
      setCurrentStep('phone');
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
                Welcome back!
              </h3>
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                {verifiedName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged in successfully with +91 {directPhone.slice(-10)}
              </p>
            </div>
          )}

          {/* STEP: PHONE ENTRY */}
          {currentStep === 'phone' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Instant OTP Login</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                  Welcome to Food Mela
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Enter your 10-digit mobile number to access fresh catalog, live tracking &amp; order history.
                </p>
              </div>

              {err && (
                <div className="p-3.5 text-xs font-semibold text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-2xl border border-red-200 dark:border-red-900/30 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{err}</span>
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-4">
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
                      className="w-full pl-14 pr-12 py-3.5 text-sm font-bold bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-750 rounded-2xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-slate-900 dark:text-white transition-all shadow-inner"
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
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  {busy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{stepLabel || 'Sending OTP…'}</span>
                    </>
                  ) : (
                    <>
                      <span>Get OTP Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure OTP authentication powered by Food Mela</span>
                </p>
              </div>
            </div>
          )}

          {/* STEP: OTP ENTRY */}
          {currentStep === 'otp' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => { setCurrentStep('phone'); setErr(''); }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-orange-500 transition-colors mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change number</span>
                </button>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                  Verify OTP
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enter the 4-digit code sent to <strong className="text-slate-900 dark:text-white">+91 {directPhone}</strong>
                </p>
              </div>

              {err && (
                <div className="p-3.5 text-xs font-semibold text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-2xl border border-red-200 dark:border-red-900/30 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{err}</span>
                </div>
              )}

              {/* 4-digit OTP Input Boxes */}
              <div className="flex justify-center gap-3">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    disabled={busy}
                    className="w-14 h-14 text-center text-xl font-black bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-slate-900 dark:text-white shadow-inner transition-all"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-slate-400">
                  Demo OTP: <strong className="text-orange-600 dark:text-orange-400 font-bold">1234</strong>
                </span>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || busy}
                  className="font-bold text-orange-600 dark:text-orange-400 disabled:text-slate-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${busy ? 'animate-spin' : ''}`} />
                  <span>{countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={busy || otpCode.some(d => !d)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{stepLabel || 'Verifying…'}</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Verify &amp; Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
