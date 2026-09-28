import React, { useState, useEffect } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { X, Phone, Lock, CheckCircle2, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { apiClient } from '../api/apiClient';

const PE_CLIENT_ID = '14442678863809499061';
const PE_WIDGET_SRC = 'https://www.phone.email/sign_in_button_v1.js';

interface PeWidgetUser {
  user_json_url?: string;
  user_country_code?: string;
  user_phone_number?: string;
  user_first_name?: string;
  user_last_name?: string;
}

declare global {
  interface Window {
    phoneEmailListener?: (userObj: PeWidgetUser) => void;
  }
}

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, loginWithPhoneEmail, loginWithPhone } = useApp();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualStep, setManualStep] = useState<1 | 2>(1); // 1: Phone, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Load official Phone.Email OTP widget script and register listener
  useEffect(() => {
    if (!showLoginModal) return;

    window.phoneEmailListener = async (userObj: PeWidgetUser) => {
      if (userObj?.user_json_url) {
        setLoading(true);
        setError('');
        setStatusMsg('Verifying OTP with Food Mela server…');
        
        try {
          const res = await loginWithPhoneEmail(userObj.user_json_url);
          setLoading(false);
          if (res.success) {
            playNotificationSound('success');
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              setShowLoginModal(false);
            }, 1200);
          } else {
            setError(res.message || 'OTP verification failed. Please try again.');
          }
        } catch (err: any) {
          setLoading(false);
          setError(err.message || 'Network error verifying OTP.');
        }
      } else {
        setError('Verification failed — phone.email did not return confirmation.');
      }
    };

    // Dynamically insert or reload the phone.email widget
    if (!document.querySelector(`script[src="${PE_WIDGET_SRC}"]`)) {
      const s = document.createElement('script');
      s.src = PE_WIDGET_SRC;
      s.async = true;
      document.body.appendChild(s);
    } else {
      // Re-trigger widget parsing if script already loaded
      try {
        if ((window as any).phoneEmailInit) {
          (window as any).phoneEmailInit();
        }
      } catch { /* ignore */ }
    }

    return () => {
      delete window.phoneEmailListener;
    };
  }, [showLoginModal, loginWithPhoneEmail, setShowLoginModal]);

  if (!showLoginModal) return null;

  const handleManualSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10 || isNaN(Number(phone))) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    const res = await apiClient.sendOTP(phone);
    setLoading(false);
    if (res.success) {
      setManualStep(2);
    } else {
      setError(res.message);
    }
  };

  const handleManualVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4 || isNaN(Number(otp))) {
      setError('Please enter the 4-digit OTP code.');
      return;
    }
    setError('');
    setLoading(true);
    const res = await loginWithPhone(phone, otp);
    setLoading(false);
    if (res.success) {
      playNotificationSound('success');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setManualStep(1);
        setPhone('');
        setOtp('');
        setShowLoginModal(false);
      }, 1200);
    } else {
      setError(res.message || 'Verification failed. Try 1234.');
    }
  };

  const handleClose = () => {
    setManualStep(1);
    setPhone('');
    setOtp('');
    setError('');
    setStatusMsg('');
    setShowManualForm(false);
    setShowLoginModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 transition-all transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500" />

        <div className="p-6 pt-7">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-500 mb-4 animate-bounce shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white font-display">Welcome to Food Mela!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Verified with Food Mela Backend Server.</p>
            </div>
          ) : (
            <div>
              {/* Header Title */}
              <div className="mb-5 text-center">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>Food Mela Official Auth</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">
                  Sign in with OTP
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Same login as <span className="font-semibold text-orange-600 dark:text-orange-400">foodmela.online</span> for live orders, addresses & Gold rewards.
                </p>
              </div>

              {/* Status or Error Notifications */}
              {statusMsg && !error && (
                <div className="p-3 mb-4 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              {error && (
                <div className="p-3 mb-4 text-xs font-medium text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              {/* Official Phone.Email OTP Widget (Same as foodmela.online) */}
              {!showManualForm ? (
                <div className="space-y-4">
                  <div className="p-5 bg-gradient-to-br from-slate-50 to-orange-50/40 dark:from-slate-800/40 dark:to-orange-950/20 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-3">
                      Click the official phone verification button below to receive an instant SMS / WhatsApp OTP:
                    </p>

                    {/* Official Phone.Email Button Element */}
                    <div className="flex justify-center py-2 min-h-[44px]">
                      <div
                        className="pe_signin_button"
                        data-client-id={PE_CLIENT_ID}
                        data-phone-input-placeholder="Enter mobile number"
                        data-button-text="Sign In with Phone Number"
                      ></div>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mt-3 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>256-bit encrypted phone verification</span>
                    </div>
                  </div>

                  {/* Alternative Manual Option */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setShowManualForm(true)}
                      className="text-xs font-semibold text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 transition-colors"
                    >
                      Or sign in with direct 10-digit number & OTP &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {manualStep === 1 ? (
                    <form onSubmit={handleManualSendOTP} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Mobile Number</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">+91</span>
                          <input 
                            type="tel" 
                            maxLength={10}
                            placeholder="Enter 10-digit phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            className="w-full pl-14 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white font-mono-numbers"
                            required
                            disabled={loading}
                          />
                          <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-orange-500/10 active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send One-Time Password'}
                      </button>

                      <div className="text-center pt-1">
                        <button
                          type="button"
                          onClick={() => setShowManualForm(false)}
                          className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                        >
                          &larr; Back to Phone.Email Button
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleManualVerifyOTP} className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Enter OTP Code</label>
                          <button 
                            type="button"
                            onClick={() => setManualStep(1)}
                            className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline"
                          >
                            Change Number
                          </button>
                        </div>
                        <div className="relative">
                          <input 
                            type="text" 
                            maxLength={4}
                            placeholder="Enter 4-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-3 text-center tracking-widest text-lg font-bold bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white font-mono-numbers"
                            required
                            disabled={loading}
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                        <span className="block mt-2 text-center text-xs text-slate-400">
                          We sent a code to <span className="font-mono-numbers font-medium text-slate-600 dark:text-slate-300">+91 {phone}</span>. (Demo code: <span className="font-semibold text-emerald-600">1234</span>)
                        </span>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-orange-500/10 active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Proceed'}
                      </button>

                      <div className="text-center pt-1">
                        <button
                          type="button"
                          onClick={() => setShowManualForm(false)}
                          className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                        >
                          &larr; Back to Phone.Email Button
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
