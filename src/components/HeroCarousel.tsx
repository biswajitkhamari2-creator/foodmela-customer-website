import React, { useState, useEffect } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { Sparkles, ArrowRight, Zap, Award, ShieldCheck, Clock, CheckCircle2, Flame, Heart } from 'lucide-react';

interface PromoSlide {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  highlight: string;
  description: string;
  ctaText: string;
  gradient: string;
  glowColor: string;
  action: () => void;
  floatingPill: string;
}

export default function HeroCarousel() {
  const { toggleGoldClub, user, setActiveTab, applyCoupon, setSelectedCategory } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides: PromoSlide[] = [
    {
      id: 'slide_1',
      badge: '👑 MELA GOLD PASS',
      badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-300/30',
      title: 'Save Flat 15% On Dals & Vegetables',
      highlight: 'Free Delivery Across Birmaharajpur',
      description: 'Get farm-fresh Bhaja Moong, unpolished toor & daily greens at direct wholesale pricing with zero delivery fee.',
      ctaText: user?.isGoldMember ? 'Gold Membership Active ✨' : 'Unlock Gold Pass for Free',
      gradient: 'from-orange-600 via-rose-600 to-amber-600',
      glowColor: 'rgba(249, 115, 22, 0.4)',
      floatingPill: '⚡ 15-Min Instant Hub',
      action: () => {
        toggleGoldClub();
      },
    },
    {
      id: 'slide_2',
      badge: '🌾 100% PURE HARVEST',
      badgeColor: 'bg-emerald-400/20 text-emerald-200 border-emerald-300/30',
      title: 'Pure Odia Bhaja Moong & Fresh Dals',
      highlight: 'Directly From Odisha Farmers',
      description: 'Zero adulteration, unpolished, aromatic grains packaged under strict hygiene standards. Use coupon MELA50.',
      ctaText: 'Explore Dals & Save Flat ₹50',
      gradient: 'from-emerald-700 via-teal-700 to-emerald-900',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      floatingPill: '🌱 100% Farm Fresh',
      action: () => {
        applyCoupon('MELA50');
        setSelectedCategory('Dals');
        setActiveTab('home');
      },
    },
    {
      id: 'slide_3',
      badge: '⚡ HYPERLOCAL DISPATCH',
      badgeColor: 'bg-blue-400/20 text-blue-200 border-blue-300/30',
      title: 'Fresh Vegetables At Your Doorstep',
      highlight: 'Within 15 Minutes Guaranteed',
      description: 'Daily morning harvest: crisp potatoes, fresh tomatoes, cauliflower & greens delivered in sealed eco-packs.',
      ctaText: 'Order Daily Vegetables',
      gradient: 'from-indigo-800 via-purple-700 to-slate-900',
      glowColor: 'rgba(99, 102, 241, 0.4)',
      floatingPill: '🛵 Live GPS Tracking',
      action: () => {
        setSelectedCategory('Vegetables');
        setActiveTab('home');
      },
    },
  ];

  // Auto transition slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSlideChange = (index: number) => {
    playNotificationSound('click');
    setActiveSlide(index);
  };

  return (
    <div className="rise-in relative w-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-slate-900 shadow-[0_30px_60px_-15px_rgba(249,115,22,0.35)] border border-white/10 ring-1 ring-orange-500/20">
      
      {/* Dynamic Slide Container */}
      <div className="relative min-h-[340px] sm:min-h-[380px] md:min-h-[420px] overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === activeSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 p-6 sm:p-10 md:p-12 flex flex-col justify-between transition-all duration-700 ${
                isActive 
                  ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto' 
                  : 'opacity-0 translate-x-12 scale-95 pointer-events-none'
              } bg-gradient-to-br ${slide.gradient}`}
            >
              {/* Background 3D Ambient Ornaments & Mesh Light */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-3/5 pointer-events-none opacity-40 blur-3xl"
                style={{ background: slide.glowColor }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

              {/* Main Bento Split: Left Content + Right 3D Logo Hero */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1">
                
                {/* Left 7 Columns: Text, Value Props & CTA */}
                <div className="md:col-span-7 space-y-3 sm:space-y-4 text-white">
                  
                  {/* Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-[11px] font-black uppercase tracking-wider shadow-sm ${slide.badgeColor}`}>
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
                      <span>{slide.badge}</span>
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-white/90">
                      <Clock className="w-3 h-3 text-emerald-300" />
                      <span>Live in Birmaharajpur</span>
                    </span>
                  </div>

                  {/* Title & Slogan */}
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-[1.1] text-white drop-shadow-sm">
                      {slide.title}
                    </h2>
                    <p className="text-base sm:text-xl font-extrabold text-amber-200/90 font-display">
                      {slide.highlight}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-white/85 font-medium leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-none">
                    {slide.description}
                  </p>

                  {/* Value Highlights Pill Row */}
                  <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-white/90">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Positive Rates
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" /> 100% Quality Checked
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-orange-300" /> COD Available
                    </span>
                  </div>

                  {/* CTA Action Button */}
                  <div className="pt-2 sm:pt-4">
                    <button
                      onClick={() => { playNotificationSound('click'); slide.action(); }}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-300 via-white to-amber-200 text-slate-950 hover:brightness-110 font-black text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.5)] active:scale-[0.97] shadow-xl shadow-black/25 ring-1 ring-white/60 group"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Right 5 Columns: Big 3D Logo Showcase */}
                <div className="hidden md:flex md:col-span-5 items-center justify-center relative">
                  
                  {/* Floating Halo Glow */}
                  <div className="absolute w-64 h-64 rounded-full bg-white/20 blur-2xl animate-pulse pointer-events-none" />
                  
                  {/* Center Big 3D Logo Card */}
                  <div className="relative group/logo">
                    
                    {/* 3D Glassmorphism Frame */}
                    <div className="relative p-3 rounded-[2.5rem] bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl shadow-black/40 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500">
                      <img
                        src="/food_mela_logo.png"
                        alt="Food Mela"
                        className="w-48 h-48 sm:w-56 sm:h-56 rounded-[2rem] object-cover shadow-2xl"
                      />
                      
                      {/* Floating 3D Pill Top Right */}
                      <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1 animate-bounce">
                        <Flame className="w-3 h-3 text-red-700 fill-red-700" />
                        <span>Mela Fiesta</span>
                      </div>

                      {/* Floating 3D Pill Bottom Left */}
                      <div className="absolute -bottom-3 -left-3 px-3.5 py-1.5 rounded-xl bg-slate-950/90 text-white border border-white/20 font-bold text-[10px] shadow-lg flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>{slide.floatingPill}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Slide Indicators & Navigation Bar */}
      <div className="absolute bottom-4 left-6 sm:left-10 flex items-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeSlide ? 'w-8 bg-white shadow-md' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
