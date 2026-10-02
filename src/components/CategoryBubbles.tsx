import React, { useState } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { ShoppingBasket, Sparkles, Carrot, UtensilsCrossed, Package, Stethoscope, ShieldCheck, FolderPlus, HeartPulse, Pill, Candy, BadgePercent } from 'lucide-react';
import DoctorConsultationModal from './DoctorConsultationModal';
import AddPolicyModal from './AddPolicyModal';
import MedicalRecordsModal from './MedicalRecordsModal';
import PharmacyModal from './PharmacyModal';

interface CategoryConfig {
  name: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export default function CategoryBubbles() {
  const { selectedCategory, setSelectedCategory } = useApp();
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [pharmacyModalOpen, setPharmacyModalOpen] = useState(false);

  const categoriesList: CategoryConfig[] = [
    {
      name: 'All',
      label: 'All Items',
      icon: <ShoppingBasket className="w-4 h-4" />,
      color: 'from-orange-500 to-amber-500',
    },
    {
      name: 'cooked_food',
      label: 'Cooked Food & Steaks',
      icon: <UtensilsCrossed className="w-4 h-4" />,
      color: 'from-orange-600 to-amber-600',
    },
    {
      name: 'Dals & Pulses',
      label: 'Moong & Dals',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'from-amber-600 to-yellow-500',
    },
    {
      name: 'Grocery & Staples',
      label: 'Rice, Ghee & Grocery',
      icon: <Package className="w-4 h-4" />,
      color: 'from-yellow-500 to-amber-600',
    },
    {
      name: 'Chaat & Street Food',
      label: 'Chaat & Snacks',
      icon: <UtensilsCrossed className="w-4 h-4" />,
      color: 'from-rose-500 to-orange-500',
    },
    {
      name: 'Vegetables',
      label: 'Fresh Vegetables',
      icon: <Carrot className="w-4 h-4" />,
      color: 'from-emerald-600 to-teal-500',
    },
    {
      name: 'Mithai & Sweets',
      label: 'Mithai 30-40% OFF',
      icon: <Candy className="w-4 h-4" />,
      color: 'from-pink-600 to-orange-500',
    },
    {
      name: 'fashion',
      label: 'Fashion & Dress 👗 (Coming Soon)',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'from-purple-600 to-pink-500',
    },
    {
      name: 'furniture',
      label: 'Furniture & Living 🛋️ (Coming Soon)',
      icon: <Package className="w-4 h-4" />,
      color: 'from-indigo-600 to-blue-500',
    },
  ];

  const handleCategoryClick = (catName: string) => {
    playNotificationSound('click');
    setSelectedCategory(catName);
  };

  return (
    <div className="w-full space-y-5">
      {/* 1. Category Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Explore Categories &amp; Grocery Staples
          </h3>
          <span className="text-[11px] text-orange-500 font-bold dark:text-orange-400">
            Scroll to view all
          </span>
        </div>

        {/* Horizontal Scroller */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none px-1 max-w-full">
          {categoriesList.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-300 transform border shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r ' + cat.color + ' text-white border-transparent shadow-lg shadow-orange-500/30 ring-2 ring-orange-400/30 -translate-y-1 scale-[1.02]'
                    : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur border-slate-200/80 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-500/40 hover:-translate-y-0.5 hover:shadow-md text-slate-700 dark:text-slate-300'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat.icon}
                </div>
                <div className="flex flex-col text-left">
                  <span>{cat.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1b. 🍬 MITHAI USP — flashing bar above healthcare */}
      <button
        onClick={() => { playNotificationSound('click'); setSelectedCategory('Mithai & Sweets'); }}
        className="usp-flash relative w-full overflow-hidden rounded-2xl px-4 py-3 text-left shadow-lg shadow-orange-500/25 border border-amber-300/60"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-500 to-rose-500" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="sheen absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
        <div className="relative flex items-center gap-3 text-white">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur shrink-0 animate-bounce">
            <Candy className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-100 flex items-center gap-1.5">
              <BadgePercent className="w-3.5 h-3.5" /> Odisha's Best Mithai • Our #1 USP
            </p>
            <p className="text-sm sm:text-base font-black font-display leading-tight truncate sm:whitespace-normal">
              🍬 Mithai at 30–40% OFF Market Price — Tap to Shop!
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-white text-orange-600 shadow shrink-0">
            Shop Now →
          </span>
        </div>
      </button>

      {/* 2. Healthcare — animated tab strip (subtle, no priority banner) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <span className="relative flex items-center justify-center">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            </span>
            <span>Healthcare</span>
            {/* animated ECG line */}
            <svg className="w-16 h-4 text-rose-400/70" viewBox="0 0 64 16" fill="none" preserveAspectRatio="none">
              <path
                d="M0 8 H18 L22 8 L25 2 L29 14 L32 8 H40 L43 8 L45 5 L48 11 L50 8 H64"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                className="ecg-dash"
              />
            </svg>
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            Services Launching Soon
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-gradient-to-r from-rose-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-2">
          {/* soft animated sheen sweep */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <div className="sheen absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
          </div>
          {/* floating bg icons */}
          <Stethoscope className="float-slow pointer-events-none absolute -top-1 right-6 w-10 h-10 text-rose-200/60 dark:text-rose-300/10" />
          <ShieldCheck className="float-slower pointer-events-none absolute -bottom-2 left-1/3 w-9 h-9 text-teal-200/60 dark:text-teal-300/10" />

          <div className="relative flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-1">
            <button
              onClick={() => { playNotificationSound('click'); setDoctorModalOpen(true); }}
              className="tab-lift group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 bg-white/90 dark:bg-slate-800/90 border-rose-200/70 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-400/50 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md hover:shadow-rose-200/50"
            >
              <span className="icon-wiggle p-1.5 rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-sm shadow-rose-300/50">
                <Stethoscope className="w-4 h-4" />
              </span>
              <span>Doctor Consultation</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Coming Soon</span>
            </button>
            <button
              onClick={() => { playNotificationSound('click'); setPolicyModalOpen(true); }}
              className="tab-lift group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 bg-white/90 dark:bg-slate-800/90 border-sky-200/70 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-400/50 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md hover:shadow-sky-200/50"
            >
              <span className="icon-wiggle p-1.5 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-sm shadow-sky-300/50">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span>Buy Policy, Get Discount</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">RenewBuy Partner</span>
            </button>
            <button
              onClick={() => { playNotificationSound('click'); setPharmacyModalOpen(true); }}
              className="tab-lift group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 bg-white/90 dark:bg-slate-800/90 border-emerald-200/70 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-400/50 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md hover:shadow-emerald-200/50"
            >
              <span className="icon-wiggle p-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-300/50">
                <Pill className="w-4 h-4" />
              </span>
              <span>Pharmacy</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Coming Soon</span>
            </button>
            <button
              onClick={() => { playNotificationSound('click'); setRecordModalOpen(true); }}
              className="tab-lift group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 bg-white/90 dark:bg-slate-800/90 border-violet-200/70 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-400/50 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md hover:shadow-violet-200/50"
            >
              <span className="icon-wiggle p-1.5 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm shadow-violet-300/50">
                <FolderPlus className="w-4 h-4" />
              </span>
              <span>Medical Records</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Modals */}
      <DoctorConsultationModal isOpen={doctorModalOpen} onClose={() => setDoctorModalOpen(false)} />
      <AddPolicyModal isOpen={policyModalOpen} onClose={() => setPolicyModalOpen(false)} />
      <MedicalRecordsModal isOpen={recordModalOpen} onClose={() => setRecordModalOpen(false)} />
      <PharmacyModal isOpen={pharmacyModalOpen} onClose={() => setPharmacyModalOpen(false)} />
    </div>
  );
}
