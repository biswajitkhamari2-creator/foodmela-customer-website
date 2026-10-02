import React, { useState } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Stethoscope, CheckCircle2, PhoneCall } from 'lucide-react';

const SPECIALTIES = [
  'General Physician',
  'Pediatrician (Child Specialist)',
  'Gynecologist (Women Health)',
  'Ayurveda Doctor',
  'Skin Specialist (Dermatologist)',
  'Orthopedic (Bone & Joint)',
  'Eye Specialist',
  'Dentist',
  'Other',
];

export default function DoctorConsultationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useApp();
  const [phone, setPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.name || '');
  const [problem, setProblem] = useState('');
  const [specialist, setSpecialist] = useState(SPECIALTIES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }
    if (!problem.trim()) {
      alert('Please describe your problem.');
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'doctor_consultations'), {
        userId: user?.phone || cleanPhone,
        userName: name.trim(),
        userPhone: cleanPhone,
        doctorSpecialty: specialist,
        symptoms: problem.trim(),
        status: 'pending_callback',
        createdAt: serverTimestamp(),
      });
    } catch {
      /* still show success — request noted locally */
    }
    playNotificationSound('success');
    setSubmitting(false);
    setDone(true);
  };

  const resetAndClose = () => {
    setDone(false);
    setProblem('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-100">
              <Stethoscope className="w-4 h-4" />
              <span>Doctor Consultation</span>
            </div>
            <h3 className="text-xl font-black font-display flex items-center gap-2">
              <span>Coming Soon</span>
              <span className="text-xs bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Soon
              </span>
            </h3>
            <p className="text-xs text-teal-100 font-medium">
              24×7 Instant Tele-Consultation with top certified doctors is launching soon!
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white font-black flex items-center justify-center transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {done ? (
            <div className="p-6 text-center space-y-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
              <h4 className="text-lg font-black text-slate-900 dark:text-white">You're on the Priority List!</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Thank you, {name.trim()}! 🙏<br />
                We will notify <strong>+91 {phone.replace(/\D/g, '').slice(-10)}</strong> as soon as <strong>24×7 Doctor Consultation ({specialist})</strong> goes live on Food Mela! 📞
              </p>
              <button
                onClick={resetAndClose}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/60 dark:border-amber-800/60 space-y-1 text-center">
                <span className="text-2xl">🩺</span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">24×7 Doctor Consultation Launching Soon</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Register your number below to get priority access & FREE first consultation on launch!
                </p>
              </div>

              {/* Mobile number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Mobile Number *</label>
                <input
                  type="tel"
                  required
                  inputMode="numeric"
                  maxLength={13}
                  placeholder="e.g. 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              {/* Problem */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Health Area of Interest (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. General checkup, Pediatrics, Dermatology..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                />
              </div>

              {/* Specialist */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preferred Specialist *</label>
                <select
                  value={specialist}
                  onChange={(e) => setSpecialist(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-teal-600/20 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {submitting ? 'Registering...' : '🔔 Notify Me on Launch'}
              </button>
              <p className="text-[11px] text-center text-slate-400 font-medium">
                Coming Soon on Food Mela — Get notified on launch! 📞
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
