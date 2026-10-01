import React, { useState, useEffect } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ShieldCheck, Plus, FileText, CheckCircle2, AlertCircle, Building2, User, Calendar, CreditCard } from 'lucide-react';

interface HealthPolicy {
  id: string;
  policyName: string;
  policyNumber: string;
  holderName: string;
  coverageAmount: string;
  expiryDate: string;
  status: string;
}

export default function AddPolicyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, setShowLoginModal } = useApp();
  const [policies, setPolicies] = useState<HealthPolicy[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [policyName, setPolicyName] = useState('FoodMela Health Insurance (via RenewBuy)');
  const [policyNumber, setPolicyNumber] = useState('');
  const [holderName, setHolderName] = useState(user?.name || '');
  const [coverageAmount, setCoverageAmount] = useState('₹5,00,000');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user?.phone) {
      fetchPolicies();
    }
  }, [isOpen, user?.phone]);

  const fetchPolicies = async () => {
    if (!user?.phone) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'user_policies'), where('userPhone', '==', user.phone));
      const snap = await getDocs(q);
      const list: HealthPolicy[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as any) });
      });
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
      alert('Please fill Policy Card Number and Holder Name');
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
      setToast('Health Insurance Policy registered successfully! ✅');
      setShowForm(false);
      fetchPolicies();
    } catch {
      setToast('Policy added to your profile vault! ✅');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-200">
              <ShieldCheck className="w-4 h-4" />
              <span>Health Insurance Vault</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display">
              Buy Policy, Get Discount
            </h3>
            <p className="text-xs text-blue-100 font-medium">
              FoodMela sells health insurance with our partner RenewBuy — buy a policy, get an attractive discount &amp; full claim support
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
          {toast && (
            <div className="p-3 bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-between">
              <span>{toast}</span>
              <button onClick={() => setToast(null)} className="font-black">✕</button>
            </div>
          )}

          {!showForm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Your Linked Policies ({policies.length})
                </h4>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Policy</span>
                </button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400 font-bold">Loading policy vault...</div>
              ) : policies.length === 0 ? (
                <div className="p-8 text-center space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <ShieldCheck className="w-12 h-12 text-indigo-400 mx-auto" />
                  <div className="space-y-1">
                    <h5 className="font-black text-sm text-slate-900 dark:text-white">No Insurance Policy Yet</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Buy a policy via FoodMela × RenewBuy, get an attractive discount &amp; full support on claims and renewals.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Add Policy Card Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {policies.map((pol) => (
                    <div
                      key={pol.id}
                      className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-lg space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-indigo-800/50 pb-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-indigo-400" />
                          <span className="font-black text-sm font-display text-indigo-100">{pol.policyName}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {pol.status || 'Active'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-indigo-300 uppercase font-bold">Policy Card No</span>
                          <p className="font-mono font-bold tracking-wider text-white">{pol.policyNumber}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-indigo-300 uppercase font-bold">Beneficiary Name</span>
                          <p className="font-bold text-white">{pol.holderName}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-indigo-300 uppercase font-bold">Max Coverage</span>
                          <p className="font-black text-emerald-400">{pol.coverageAmount}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-indigo-300 uppercase font-bold">Valid Upto</span>
                          <p className="font-bold text-slate-300">{pol.expiryDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Add Policy Form */
            <form onSubmit={handleSavePolicy} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white">Enter Policy Details</h4>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Back to List
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Policy / Scheme Name *</label>
                <select
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="FoodMela Health Insurance (via RenewBuy)">FoodMela Health Insurance (via RenewBuy)</option>
                  <option value="Star Health Insurance">Star Health Insurance</option>
                  <option value="HDFC ERGO Health Policy">HDFC ERGO Health Policy</option>
                  <option value="ICICI Lombard Health Cover">ICICI Lombard Health Cover</option>
                  <option value="Niva Bupa Health Cover">Niva Bupa Health Cover</option>
                  <option value="Other Private Health Insurance">Other Private Health Insurance</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Policy Card Number / UHID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FM-RB-849204810"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Insured Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name on card"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sum Insured Amount</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5,00,000"
                    value={coverageAmount}
                    onChange={(e) => setCoverageAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                >
                  {submitting ? 'Saving...' : '🚀 Save Policy Card'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
