import React, { useState } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Stethoscope, Video, PhoneCall, MessageSquare, ShieldCheck, Star, Clock, User, CheckCircle2, ArrowRight } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  degree: string;
  specialty: string;
  experience: string;
  rating: number;
  consultations: number;
  fee: number;
  avatar: string;
  available: boolean;
}

const DOCTORS: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Rajesh Kumar Mishra',
    degree: 'MD (Internal Medicine), MBBS',
    specialty: 'General Physician & Fever Expert',
    experience: '14 Years Exp.',
    rating: 4.9,
    consultations: 4200,
    fee: 99,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop',
    available: true,
  },
  {
    id: 'doc2',
    name: 'Dr. Sunita Pattnaik',
    degree: 'MBBS, DCH (Child Health)',
    specialty: 'Pediatrician & Child Specialist',
    experience: '10 Years Exp.',
    rating: 4.9,
    consultations: 3100,
    fee: 149,
    avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78c91?w=300&h=300&fit=crop',
    available: true,
  },
  {
    id: 'doc3',
    name: 'Dr. Alok Mohanty',
    degree: 'BAMS (Ayurvedacharya)',
    specialty: 'Ayurveda, Digestion & Lifestyle',
    experience: '12 Years Exp.',
    rating: 4.8,
    consultations: 2800,
    fee: 99,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop',
    available: true,
  },
  {
    id: 'doc4',
    name: 'Dr. Priyadarshini Sahoo',
    degree: 'MD (Gynecology), DGO',
    specialty: 'Women Health & Gynecologist',
    experience: '15 Years Exp.',
    rating: 5.0,
    consultations: 5400,
    fee: 149,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop',
    available: true,
  },
];

export default function DoctorConsultationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, setShowLoginModal } = useApp();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [consultType, setConsultType] = useState<'video' | 'audio' | 'chat'>('video');
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientAge, setPatientAge] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onClose();
      setShowLoginModal(true);
      return;
    }
    if (!selectedDoctor) return;
    if (!patientName.trim() || !patientAge.trim() || !symptoms.trim()) {
      alert('Please fill in Patient Name, Age and Symptoms.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'doctor_consultations'), {
        userId: user.phone,
        userName: patientName.trim(),
        userPhone: user.phone,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        fee: selectedDoctor.fee,
        consultType,
        patientAge,
        symptoms: symptoms.trim(),
        status: 'calling',
        createdAt: serverTimestamp(),
      });
      playNotificationSound('success');
      setSuccessMsg(`Request received! FoodMela is connecting you to ${selectedDoctor.name} — the doctor will call +91 ${user.phone} within 2 minutes. For urgent help call 81445 03650. 📞`);
    } catch {
      setSuccessMsg('Consultation request registered! Doctor hotline will dial your phone shorty.');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-200">
              <Stethoscope className="w-4 h-4" />
              <span>Food Mela Healthcare 24x7</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display">
              Consult Doctor via FoodMela
            </h3>
            <p className="text-xs text-teal-100 font-medium">
              FoodMela connects you to verified doctors — Video, Audio or Chat. FoodMela × RenewBuy health insurance assistance available.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white font-black flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {successMsg ? (
            <div className="p-8 text-center space-y-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-xl font-black text-slate-900 dark:text-white">Consultation Booked Successfully!</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-md mx-auto">
                {successMsg}
              </p>
              <div className="pt-4 flex gap-3 justify-center">
                <button
                  onClick={() => { setSuccessMsg(null); setSelectedDoctor(null); }}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
                >
                  Book Another Consultation
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          ) : !selectedDoctor ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black uppercase text-slate-400 tracking-wider">
                  Available Doctors Online Now (24x7)
                </h4>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  4 Doctors Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DOCTORS.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-teal-500 dark:hover:border-teal-400 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="flex gap-3">
                      <img src={doc.avatar} alt={doc.name} className="w-14 h-14 rounded-2xl object-cover shadow-md" />
                      <div>
                        <h5 className="font-black text-sm text-slate-900 dark:text-white font-display group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {doc.name}
                        </h5>
                        <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400">{doc.specialty}</p>
                        <p className="text-[10px] text-slate-400">{doc.degree} • {doc.experience}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-black text-amber-500 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {doc.rating}
                          </span>
                          <span className="text-[10px] text-slate-400">({doc.consultations}+ calls)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Consultation Fee</span>
                        <p className="text-sm font-black text-slate-900 dark:text-white">₹{doc.fee}</p>
                      </div>
                      <button
                        onClick={() => { playNotificationSound('click'); setSelectedDoctor(doc); }}
                        className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                      >
                        <span>Consult Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleBook} className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                <div className="flex items-center gap-3">
                  <img src={selectedDoctor.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h5 className="font-black text-xs text-slate-900 dark:text-white">{selectedDoctor.name}</h5>
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">{selectedDoctor.specialty}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white underline"
                >
                  Change Doctor
                </button>
              </div>

              {/* Consultation Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Select Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'video', label: 'Video Call', icon: <Video className="w-4 h-4" /> },
                    { id: 'audio', label: 'Audio Call', icon: <PhoneCall className="w-4 h-4" /> },
                    { id: 'chat', label: 'Live Chat', icon: <MessageSquare className="w-4 h-4" /> },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setConsultType(m.id as any)}
                      className={`p-3 rounded-xl border text-xs font-black flex flex-col items-center gap-1.5 transition-all ${
                        consultType === m.id
                          ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {m.icon}
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Patient Age &amp; Gender *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 32 Yrs, Male"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Symptoms / Concern *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe your health symptoms (e.g. Fever since 2 days, stomach pain, cold & cough)..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Consultation Fee</span>
                  <p className="text-lg font-black text-teal-600 dark:text-teal-400">₹{selectedDoctor.fee}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(null)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-teal-600/20 active:scale-95 transition-all"
                  >
                    {submitting ? 'Connecting...' : `Pay ₹${selectedDoctor.fee} & Connect 24x7`}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
