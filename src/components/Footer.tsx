import React from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { ShieldCheck, Phone, Heart, Award, ArrowRight, Instagram, Facebook, Twitter, Youtube, Sparkles } from 'lucide-react';

export default function Footer() {
  const { setSelectedPolicy, setActiveTab, user, setShowLoginModal } = useApp();

  const openPolicy = (policyKey: string) => {
    playNotificationSound('click');
    setSelectedPolicy(policyKey);
  };

  return (
    <footer className="mt-16 border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
      {/* Top Banner CTA */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 py-6 px-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-black tracking-wide uppercase">
              <Sparkles className="w-3 h-3" /> Mela Fiesta Live
            </span>
            <h3 className="text-lg sm:text-xl font-black font-display tracking-tight">
              Craving fresh farm groceries or gourmet treats?
            </h3>
            <p className="text-xs text-orange-100 font-medium">
              Free instant delivery on orders above ₹299 across Birmaharajpur.
            </p>
          </div>
          <button
            onClick={() => {
              playNotificationSound('click');
              if (!user) setShowLoginModal(true);
              else setActiveTab('home');
            }}
            className="px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center gap-2 shrink-0"
          >
            <span>{user ? 'Explore Fresh Catalog' : 'Login & Order Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-orange-500/20">
                F
              </div>
              <span className="text-xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-500 to-emerald-500">
                Food Mela
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your neighbourhood mela — farm-fresh vegetables, dairy, pantry staples, and regional sweets delivered straight to your doorstep in minutes.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Phone className="w-3.5 h-3.5 text-orange-500" />
              <span>Helpline: </span>
              <a href="tel:8144503650" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
                +91 8144503650
              </a>
            </div>
          </div>

          {/* Col 2: Legal & Trust Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-display">
              Trust & Legal Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => openPolicy('refund')} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span>💸</span> Refund & Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('terms')} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span>📜</span> Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('privacy')} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span>🔒</span> Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('disclaimer')} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span>⚖️</span> Food Safety & Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('shipping')} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span>🛵</span> Shipping & Delivery Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-display">
              Company & Help
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => openPolicy('about')} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span>🍽️</span> About FoodMela
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('contact')} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span>📞</span> Help & Customer Support
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('partner')} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span>🤝</span> Partner With Us (Merchants & Riders)
                </button>
              </li>
              <li>
                <a href="/admin" target="_blank" rel="noreferrer" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span>⚙️</span> Admin Portal Login
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Service Area */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-display">
              Service Location
            </h4>
            <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1.5">
              <p className="font-bold text-slate-900 dark:text-white">📍 Birmaharajpur Operational Hub</p>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                Subarnapur, Odisha - 767018.<br />
                Delivery Hours: 7:00 AM – 10:30 PM.
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
                Direct Helpline: <a href="tel:8144503650" className="text-orange-600 dark:text-orange-400 font-bold">+91 8144503650</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 text-center sm:text-left">
          <p>© 2026 FoodMela (foodmela.online). All Rights Reserved. Digital Hyperlocal Delivery Intermediary.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => openPolicy('terms')} className="hover:underline">Terms</button>
            <span>·</span>
            <button onClick={() => openPolicy('privacy')} className="hover:underline">Privacy</button>
            <span>·</span>
            <button onClick={() => openPolicy('refund')} className="hover:underline">Refunds</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
