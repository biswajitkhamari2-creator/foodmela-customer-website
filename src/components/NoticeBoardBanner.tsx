import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { X, Sparkles, AlertTriangle, AlertCircle, Info, Gift, ChevronRight } from 'lucide-react';

export interface CustomerNotice {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'offer' | 'emergency' | 'celebration';
  badge?: string;
  icon?: string;
  isActive: boolean;
  isSticky?: boolean;
  actionText?: string;
  actionUrl?: string;
  updatedAt?: unknown;
}

export default function NoticeBoardBanner({ className = '' }: { className?: string }) {
  const [notice, setNotice] = useState<CustomerNotice | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const q = query(collection(db, 'app_notices'), where('isActive', '==', true));
      const unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          // Take the latest updated or created active notice
          const docs = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<CustomerNotice, 'id'>),
          }));
          const top = docs[0];
          setNotice(top);
          // Check if already dismissed in this session
          const dismissedId = sessionStorage.getItem('foodmela_dismissed_notice');
          if (dismissedId === top.id && !top.isSticky) {
            setDismissed(true);
          } else {
            setDismissed(false);
          }
        } else {
          setNotice(null);
        }
      }, (err) => {
        console.error('Notice listener error:', err);
      });
      return () => unsub();
    } catch { /* ignore */ }
  }, []);

  if (!notice || !notice.isActive || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    if (!notice.isSticky) {
      sessionStorage.setItem('foodmela_dismissed_notice', notice.id);
    }
  };

  const getTheme = () => {
    switch (notice.type) {
      case 'alert':
        return {
          bg: 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600',
          badgeBg: 'bg-black/30 border-white/20 text-white',
          border: 'border-amber-400/40',
          shadow: 'shadow-amber-500/20',
          icon: <AlertTriangle className="w-5 h-5 text-amber-200" />,
        };
      case 'emergency':
        return {
          bg: 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-700',
          badgeBg: 'bg-black/40 border-white/30 text-white',
          border: 'border-red-400/50',
          shadow: 'shadow-red-500/25',
          icon: <AlertCircle className="w-5 h-5 text-red-100 animate-pulse" />,
        };
      case 'offer':
        return {
          bg: 'bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600',
          badgeBg: 'bg-black/25 border-white/20 text-white',
          border: 'border-orange-300/40',
          shadow: 'shadow-orange-500/25',
          icon: <Gift className="w-5 h-5 text-amber-100" />,
        };
      case 'celebration':
        return {
          bg: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600',
          badgeBg: 'bg-black/25 border-white/20 text-white',
          border: 'border-emerald-300/40',
          shadow: 'shadow-emerald-500/25',
          icon: <Sparkles className="w-5 h-5 text-emerald-100" />,
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900',
          badgeBg: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
          border: 'border-indigo-500/40',
          shadow: 'shadow-indigo-500/20',
          icon: <Info className="w-5 h-5 text-indigo-300" />,
        };
    }
  };

  const theme = getTheme();

  return (
    <div className={`w-full transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${className}`}>
      <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 ${theme.bg} text-white shadow-xl ${theme.shadow} border ${theme.border}`}>
        {/* Soft background aura */}
        <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-2xl" />

        <div className="flex items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
            {/* Icon */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white/15 backdrop-blur-md shadow-inner shrink-0 text-xl sm:text-2xl flex items-center justify-center">
              {notice.icon || theme.icon}
            </div>

            {/* Message Body */}
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-widest border ${theme.badgeBg}`}>
                  {notice.badge || 'NOTICE'}
                </span>
                <h4 className="text-sm sm:text-base font-black tracking-tight truncate max-w-full">
                  {notice.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed max-w-3xl">
                {notice.message}
              </p>
            </div>
          </div>

          {/* Action / Dismiss buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {notice.actionText && (
              <a
                href={notice.actionUrl || '#'}
                className="hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs shadow-md active:scale-95 transition-all whitespace-nowrap"
              >
                <span>{notice.actionText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            )}

            {!notice.isSticky && (
              <button
                onClick={handleDismiss}
                title="Dismiss Notice"
                className="p-1.5 sm:p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Action Link */}
        {notice.actionText && (
          <div className="mt-3 pt-2.5 border-t border-white/15 sm:hidden flex justify-end">
            <a
              href={notice.actionUrl || '#'}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow"
            >
              <span>{notice.actionText}</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
