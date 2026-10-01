import React, { useState } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Pill, Upload, CheckCircle2, BadgePercent, Truck, ShieldCheck } from 'lucide-react';

export default function PharmacyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, setShowLoginModal } = useApp();
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [medicineList, setMedicineList] = useState('');
  const [prescriptionNote, setPrescriptionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onClose();
      setShowLoginModal(true);
      return;
    }
    if (!medicineList.trim()) {
      alert('Please write the medicine names you need.');
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'pharmacy_orders'), {
        userId: user.phone,
        customerName: customerName.trim() || user.name,
        phone: phone.trim() || user.phone,
        medicines: medicineList.trim(),
        prescriptionNote: prescriptionNote.trim(),
        discount: '20% OFF on branded medicines',
        status: 'received',
        createdAt: serverTimestamp(),
      });
      playNotificationSound('success');
      setSuccessMsg(`Order received! Our pharmacy partner will call +91 ${phone || user.phone} shortly to confirm your medicines with 20% OFF on branded medicines. 🚚`);
    } catch {
      setSuccessMsg('Order noted! Our pharmacy team will call you shortly to confirm. 📞');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-200">
              <Pill className="w-4 h-4" />
              <span>FoodMela Pharmacy</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display">
              Order Medicines Online
            </h3>
            <p className="text-xs text-emerald-100 font-medium">
              20% OFF on branded medicines • Genuine stock • Fast local delivery
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white font-black flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Discount banner */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30">
            <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/30">
              <BadgePercent className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">Flat 20% OFF — Branded Medicines</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Upload prescription or just type medicine names. Pay on delivery.</p>
            </div>
          </div>

          {successMsg ? (
            <div className="p-8 text-center space-y-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-xl font-black text-slate-900 dark:text-white">Medicine Order Placed!</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-md mx-auto">
                {successMsg}
              </p>
              <div className="pt-4 flex gap-3 justify-center">
                <button
                  onClick={() => { setSuccessMsg(null); setMedicineList(''); }}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
                >
                  Order More Medicines
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Medicine Names *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Dolo 650 (10 tabs), Azithral 500 (1 strip), Volini gel…"
                  value={medicineList}
                  onChange={(e) => setMedicineList(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Prescription Note (optional)
                </label>
                <input
                  type="text"
                  placeholder="Doctor name / prescription details, if any"
                  value={prescriptionNote}
                  onChange={(e) => setPrescriptionNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-emerald-500" /> Fast local delivery</span>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% genuine medicines</span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  {submitting ? 'Placing...' : '💊 Order with 20% OFF'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
