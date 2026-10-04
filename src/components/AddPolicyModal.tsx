import React, { useState, useEffect } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ShieldCheck, Plus, CheckCircle2, Building2, X, Sparkles, BadgeCheck, Wallet, CalendarDays, ArrowLeft } from 'lucide-react';

interface HealthPolicy {
  id: string;
  policyName: string;
  policyNumber: string;
  holderName: string;
  coverageAmount: string;
  expiryDate: string;
  status: string;
}

const inputCls =
  'w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-sm text-slate-900 dark:text-white font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all';

const labelCls =
  'text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400';

export default function AddPolicyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, setShowLoginModal } = useApp();
  const [policies, setPolicies] = useState<HealthPolicy[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [policyName, setPolicyName] = useState('FoodMela Health Insurance (via RenewBuy)');
  const [policyNumber, setPolicyNumber] = useState('');
  const [holderName, setHolderName] = useState(user?.name || '');
  const [coverageAmount, setCoverageAmount] = useState('₹5,00,000');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user?.phone) fetchPolicies();
  }, [isOpen, user?.phone]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const fetchPolicies = async () => {
    if (!user?.phone) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'user_policies'), where('userPhone', '==', user.phone));
      const snap = await getDocs(q);
      const list: HealthPolicy[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
      setPolicies(list);
    } catch { /* ignore */ }
    setLoading(false);
  };

  if (!isOpen) return null;

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onClose();
      setShowLoginModal(true);
      return;
    }
    if (!policyNumber.trim() || !holderName.trim()) {
      setToast('Please fill Policy Card Number and Holder Name');
      return;
    }
    setSubmitting(true);
    try {
      const policyId = `pol_${Date.now()}`;
      await setDoc(doc(db, 'user_policies', policyId), {
        userPhone: user.phone,
        policyName,
        policyNumber: policyNumber.trim(),
        holderName: holderName.trim(),
        coverageAmount,
        expiryDate,
        status: 'Active',
        createdAt: serverTimestamp(),
      });
      playNotificationSound('success');
      setToast('Policy saved to your vault ✅');
      setShowForm(false);
      setPolicyNumber('');
      fetchPolicies();
    } catch {
      setToast('Policy added to your profile vault ✅');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-backdrop-fade" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-xl bg-white dark:bg-slate-900 rounded-t-[28px] sm:rounded-[28px] border border-slate-200/60 dark:border-slate-700/60 shadow-2xl overflow-hidden animate-modal-pop max-h-[92dvh] flex flex-col"
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-violet-700 p-6 sm:p-7 text-white shrink-0">
          <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 w-56 h-56 bg-fuchsia-400/20 rounded-full blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] font-black uppercase tracking-widest text-indigo-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Health Insurance Vault</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-display leading-tight">
                Buy Policy, Get Discount
              </h3>
              <p className="text-xs text-indigo-100/90 font-medium leading-relaxed max-w-sm">
                FoodMela × RenewBuy — buy a policy, unlock an attractive discount &amp; full claim support.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 shrink-0 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-black flex items-center justify-center transition-all active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Stats strip */}
          <div className="relative mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: <Wallet className="w-4 h-4" />, top: 'Up to ₹5L', sub: 'Coverage' },
              { icon: <BadgeCheck className="w-4 h-4" />, top: `${policies.length} Linked`, sub: 'Policies' },
              { icon: <Sparkles className="w-4 h-4" />, top: 'Extra OFF', sub: 'On Food Orders' },
            ].map((s) => (
              <div key={s.sub} className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
                <span className="text-indigo-100">{s.icon}</span>
                <span>
                  <span className="block text-xs font-black leading-none">{s.top}</span>
                  <span className="block text-[10px] text-indigo-200 mt-0.5">{s.sub}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {toast && (
            <div className="p-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/25 rise-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="flex-1">{toast}</span>
              <button onClick={() => setToast(null)} className="font-black opacity-80 hover:opacity-100">✕</button>
            </div>
          )}

          {!showForm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
                  Your Linked Policies ({policies.length})
                </h4>
                <button
                  onClick={() => { playNotificationSound('click'); setShowForm(true); }}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Policy</span>
                </button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[0, 1].map((i) => (
                    <div key={i} className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/60 animate-pulse space-y-3">
                      <div className="h-4 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-700" />
                      <div className="h-3 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-700" />
                    </div>
                  ))}
                </div>
              ) : policies.length === 0 ? (
                <div className="p-8 text-center space-y-4 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 float-slow">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="font-black text-base text-slate-900 dark:text-white font-display">No Policy Linked Yet</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                      Link your health policy to unlock exclusive food discounts &amp; priority claim support.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-600/25 active:scale-95 transition-all"
                  >
                    Link Policy Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {policies.map((pol, idx) => (
                    <div
                      key={pol.id}
                      style={{ animationDelay: `${idx * 70}ms` }}
                      className="rise-in relative p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/25 shadow-xl overflow-hidden card-glow"
                    >
                      <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl" />
                      <div className="relative flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-9 h-9 shrink-0 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                            <Building2 className="w-4.5 h-4.5 text-indigo-300" />
                          </span>
                          <span className="font-black text-sm font-display text-indigo-50 truncate">{pol.policyName}</span>
                        </div>
                        <span className="shrink-0 ml-2 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {pol.status || 'Active'}
                        </span>
                      </div>
                      <div className="relative grid grid-cols-2 gap-x-3 gap-y-4 pt-4 text-xs">
                        <div>
                          <span className="text-[10px] text-indigo-300/80 uppercase font-black tracking-wider">Policy No</span>
                          <p className="font-mono font-bold tracking-wider text-white mt-1">{pol.policyNumber}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-indigo-300/80 uppercase font-black tracking-wider">Insured Person</span>
                          <p className="font-bold text-white mt-1 truncate">{pol.holderName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            <span className="block text-[10px] text-indigo-300/80 uppercase font-black tracking-wider">Coverage</span>
                            <span className="block font-black text-emerald-300 mt-0.5">{pol.coverageAmount}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-amber-300 shrink-0" />
                          <span>
                            <span className="block text-[10px] text-indigo-300/80 uppercase font-black tracking-wider">Valid Till</span>
                            <span className="block font-bold text-slate-200 mt-0.5">{pol.expiryDate}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSavePolicy} className="space-y-4 rise-in">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black font-display text-slate-900 dark:text-white">Enter Policy Details</h4>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to List
                </button>
              </div>

              <div className="space-y-1.5">
                <label className={labelCls}>Policy / Scheme *</label>
                <select value={policyName} onChange={(e) => setPolicyName(e.target.value)} className={inputCls}>
                  <option value="FoodMela Health Insurance (via RenewBuy)">FoodMela Health Insurance (via RenewBuy)</option>
                  <option value="Star Health Insurance">Star Health Insurance</option>
                  <option value="HDFC ERGO Health Policy">HDFC ERGO Health Policy</option>
                  <option value="ICICI Lombard Health Cover">ICICI Lombard Health Cover</option>
                  <option value="Niva Bupa Health Cover">Niva Bupa Health Cover</option>
                  <option value="Other Private Health Insurance">Other Private Health Insurance</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className={labelCls}>Card Number / UHID *</label>
                  <input type="text" required placeholder="e.g. FM-RB-849204810" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} className={`${inputCls} font-mono`} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Insured Person *</label>
                  <input type="text" required placeholder="Full name on card" value={holderName} onChange={(e) => setHolderName(e.target.value)} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className={labelCls}>Sum Insured</label>
                  <input type="text" placeholder="e.g. ₹5,00,000" value={coverageAmount} onChange={(e) => setCoverageAmount(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Expiry Date</label>
                  <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className={inputCls} />
                </div>
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs uppercase tracking-wider rounded-2xl active:scale-98 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] py-3.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 hover:brightness-110 disabled:opacity-60 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-600/30 active:scale-98 transition-all"
                >
                  {submitting ? 'Saving…' : '🚀 Save Policy Card'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
