import React from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { FOODMELA_POLICIES } from '../data/policies';
import { X, Phone, ShieldCheck, FileText, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';

export default function PolicyModal() {
  const { selectedPolicy, setSelectedPolicy } = useApp();

  if (!selectedPolicy) return null;

  const currentPolicy = FOODMELA_POLICIES[selectedPolicy] || FOODMELA_POLICIES['refund'];

  const policyTabs = [
    { key: 'refund', label: 'Refund Policy', emoji: '💸' },
    { key: 'terms', label: 'Terms of Service', emoji: '📜' },
    { key: 'privacy', label: 'Privacy Policy', emoji: '🔒' },
    { key: 'disclaimer', label: 'Food Safety & Disclaimer', emoji: '⚖️' },
    { key: 'shipping', label: 'Shipping & Delivery', emoji: '🛵' },
    { key: 'contact', label: 'Contact Support', emoji: '📞' },
    { key: 'about', label: 'About Us', emoji: '🍽️' },
    { key: 'partner', label: 'Partner With Us', emoji: '🤝' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-emerald-500/10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">{currentPolicy.emoji}</span>
            <div>
              <span className="text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 tracking-wider">
                Official FoodMela Policy
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display">
                {currentPolicy.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              playNotificationSound('remove');
              setSelectedPolicy(null);
            }}
            className="p-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Switcher Bar */}
        <div className="flex items-center gap-2 overflow-x-auto p-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 scrollbar-none shrink-0">
          {policyTabs.map((tab) => {
            const isSelected = selectedPolicy === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  playNotificationSound('click');
                  setSelectedPolicy(tab.key);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <p className="text-sm font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            {currentPolicy.tagline}
          </p>

          <div className="space-y-3">
            {currentPolicy.body.map((para, index) => (
              <div 
                key={index}
                className={`p-3.5 rounded-2xl ${
                  para.startsWith('1.') || para.startsWith('2.') || para.startsWith('3.') || para.startsWith('4.') || para.startsWith('5.') || para.startsWith('6.') || para.startsWith('7.') || para.startsWith('8.')
                    ? 'bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 font-medium'
                    : para.includes('•')
                      ? 'pl-6 text-slate-600 dark:text-slate-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 font-normal'
                }`}
              >
                <p>{para}</p>
              </div>
            ))}
          </div>

          {/* Grievance & Support Box */}
          <div className="mt-4 p-4 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Official Helpline & Support Desk
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Birmaharajpur, Subarnapur, Odisha - 767018
              </p>
              <p className="text-[11px] text-slate-500">
                Operating 9:00 AM – 10:00 PM, All 7 Days
              </p>
            </div>

            <a
              href="tel:8144503650"
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call +91 8144503650</span>
            </a>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>© 2026 FoodMela · foodmela.online</span>
          <button
            onClick={() => {
              playNotificationSound('remove');
              setSelectedPolicy(null);
            }}
            className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-bold text-slate-700 dark:text-slate-200 rounded-lg text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
