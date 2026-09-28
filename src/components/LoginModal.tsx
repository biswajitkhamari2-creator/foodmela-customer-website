import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Phone, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { apiClient } from '../api/apiClient';

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useApp();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1); // 1: Phone, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!showLoginModal) return null;

  const handleSendOTP = async (e: React.FormEvent) => {
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
      setStep(2);
    } else {
      setError(res.message);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4 || isNaN(Number(otp))) {
      setError('Please enter the 4-digit OTP code.');
      return;
    }
    setError('');
    setLoading(true);
    const res = await login(phone, otp);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setStep(1);
        setPhone('');
        setOtp('');
        setShowLoginModal(false);
      }, 1200);
    } else {
      setError(res.message || 'Verification failed. Try 1234.');
    }
  };

  const handleClose = () => {
    setStep(1);
    setPhone('');
    setOtp('');
    setError('');
    setShowLoginModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 transition-all transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Saffron & Emerald Accent Ring on Top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-yellow-500 to-emerald-500" />

        <div className="p-6 pt-8">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-500 mb-4 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white font-display">Welcome to Food Mela!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gourmet experience unlocked.</p>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <span className="text-xs uppercase font-semibold text-orange-600 dark:text-orange-400 tracking-wider">Premium Access</span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-display">Taste the Mela</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in with OTP to save addresses, order, and join Gold.</p>
              </div>

              {error && (
                <div className="p-3 mb-4 text-xs font-medium text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
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
                        className="w-full pl-14 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-slate-900 dark:text-white font-mono-numbers"
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
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Send One-Time Password'
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Enter OTP Code</label>
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline"
                      >
                        Change Number
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        maxLength={4}
                        placeholder="Enter 4-digit verification code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 text-center tracking-widest text-lg font-bold bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-slate-900 dark:text-white font-mono-numbers"
                        required
                        disabled={loading}
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    <span className="block mt-2 text-center text-xs text-slate-400">
                      We sent a code to <span className="font-mono-numbers font-medium text-slate-600 dark:text-slate-300">+91 {phone}</span>. Use <span className="font-semibold text-emerald-600">1234</span> for demo.
                    </span>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-orange-500/10 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Verify & Proceed'
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
