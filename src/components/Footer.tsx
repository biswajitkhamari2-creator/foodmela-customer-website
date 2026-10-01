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
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-500 to-emerald-600 py-8 px-4 text-white shadow-inner">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.25),transparent_50%)]" />
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
            <div className="flex items-center gap-2.5">
              <img
                src="/food_mela_logo.png"
                alt="Food Mela"
                className="w-10 h-10 rounded-2xl shadow-md object-cover"
              />
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

        {/* Discreet Legal Entity & Regulatory Notes */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <details className="text-[11px] text-slate-400 group cursor-pointer text-center sm:text-left">
            <summary className="hover:text-slate-600 dark:hover:text-slate-300 font-medium select-none list-none inline-flex items-center gap-1.5 transition-colors">
              <span>📋 Legal Entity &amp; Regulatory Notes</span>
              <span className="text-[10px] text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-1">
              <p>
                <strong className="text-slate-700 dark:text-slate-300">Legal Business Name:</strong> SIDHESWAR ENTERPRISES · <strong className="text-slate-700 dark:text-slate-300">MSME Udyam:</strong> UDYAM-OD-29-0025578 · <strong className="text-slate-700 dark:text-slate-300">Trade Name:</strong> FoodMela
              </p>
              <p>
                Operational Base: Birmaharajpur, Subarnapur, Odisha – 767018 | Helpline: +91 8144503650 | Email: support@foodmela.online
              </p>
            </div>
          </details>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 text-center sm:text-left">
          <p>© 2026 FoodMela (Operated by SIDHESWAR ENTERPRISES) · foodmela.online. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/terms.html" target="_blank" rel="noreferrer" className="hover:underline">Terms</a>
            <span>·</span>
            <a href="/privacy.html" target="_blank" rel="noreferrer" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="/contact.html" target="_blank" rel="noreferrer" className="hover:underline">Contact &amp; Grievance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
