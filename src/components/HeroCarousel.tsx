import React, { useState, useEffect } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { ArrowRight, Clock, ShieldCheck, Zap, Star, Bike, BadgePercent } from 'lucide-react';

interface PromoSlide {
  id: string;
  eyebrow: string;
  titleA: string;
  titleB: string;
  description: string;
  ctaText: string;
  image: string;
  stat1: string;
  stat1Label: string;
  stat2: string;
  stat2Label: string;
  coupon?: string;
  action: () => void;
}

export default function HeroCarousel() {
  const { toggleGoldClub, user, setActiveTab, applyCoupon, setSelectedCategory } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides: PromoSlide[] = [
    {
      id: 'slide_1',
      eyebrow: 'Mela Gold Pass · Free Delivery',
      titleA: 'Farm-Fresh Groceries,',
      titleB: 'Delivered in 15 Minutes',
      description: 'Bhaja Moong, unpolished dals & morning-harvest vegetables at wholesale prices — straight from Odisha farmers to your doorstep in Birmaharajpur.',
      ctaText: user?.isGoldMember ? 'Gold Active — Shop Now' : 'Unlock Gold Pass Free',
      image: '/hero-food.jpg',
      stat1: '15 min',
      stat1Label: 'Avg delivery',
      stat2: '4.8★',
      stat2Label: '12k+ ratings',
      action: () => toggleGoldClub(),
    },
    {
      id: 'slide_2',
      eyebrow: '100% Pure Harvest · Code MELA50',
      titleA: 'Pure Odia Bhaja Moong',
      titleB: '& Unpolished Dals',
      description: 'Zero adulteration, aromatic grains packed hygienically. Apply MELA50 at checkout and save a flat ₹50 on dals today.',
      ctaText: 'Shop Dals — Save ₹50',
      image: '/hero-food.jpg',
      stat1: '₹50 OFF',
      stat1Label: 'With MELA50',
      stat2: '100%',
      stat2Label: 'Unpolished',
      coupon: 'MELA50',
      action: () => {
        applyCoupon('MELA50');
        setSelectedCategory('Dals');
        setActiveTab('home');
      },
    },
    {
      id: 'slide_3',
      eyebrow: 'Hyperlocal Dispatch · Live GPS',
      titleA: 'Morning-Harvest Vegetables',
      titleB: 'At Your Doorstep',
      description: 'Crisp potatoes, fresh tomatoes, cauliflower & greens in sealed eco-packs — track your rider live from shop to door.',
      ctaText: 'Order Vegetables Now',
      image: '/hero-rider.jpg',
      stat1: '15 min',
      stat1Label: 'Guaranteed',
      stat2: 'Live',
      stat2Label: 'GPS tracking',
      action: () => {
        setSelectedCategory('Vegetables');
        setActiveTab('home');
      },
    },
  ];

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
    <div className="rise-in relative w-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(249,115,22,0.35)] ring-1 ring-orange-500/20">
      <div className="relative min-h-[420px] sm:min-h-[440px] md:min-h-[460px] overflow-hidden bg-slate-950">
        {slides.map((slide, index) => {
          const isActive = index === activeSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              {/* Full-bleed food photo */}
              <img
                src={slide.image}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              />
              {/* Readability overlays: dark left gradient + bottom fade */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/10" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/90 to-transparent" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-center p-6 sm:p-10 md:p-12 max-w-2xl">
                <span className="inline-flex w-fit items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/40 backdrop-blur-md text-amber-200 text-[11px] font-black uppercase tracking-wider">
                  <BadgePercent className="w-3.5 h-3.5" />
                  {slide.eyebrow}
                </span>

                <h2 className="mt-4 text-3xl sm:text-5xl font-black font-display tracking-tight leading-[1.05] text-white drop-shadow-lg">
                  {slide.titleA}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200">
                    {slide.titleB}
                  </span>
                </h2>

                <p className="mt-3 text-sm sm:text-base text-white/80 font-medium leading-relaxed max-w-lg">
                  {slide.description}
                </p>

                {/* Trust row */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-bold text-white/85">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" /> 100% Quality Checked
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-300" /> COD Available
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-300" /> Live in Birmaharajpur
                  </span>
                </div>

                {/* CTA + stats */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => { playNotificationSound('click'); slide.action(); }}
                    className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.7)] active:scale-[0.97] shadow-xl shadow-orange-950/50"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-5">
                    <div>
                      <p className="text-xl sm:text-2xl font-black text-white font-display leading-none flex items-center gap-1">
                        {index === 0 && <Bike className="w-5 h-5 text-amber-300" />}
                        {index === 1 && <Star className="w-5 h-5 text-amber-300 fill-amber-300" />}
                        {slide.stat1}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/60 mt-1">{slide.stat1Label}</p>
                    </div>
                    <div className="w-px h-9 bg-white/20" />
                    <div>
                      <p className="text-xl sm:text-2xl font-black text-white font-display leading-none">{slide.stat2}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/60 mt-1">{slide.stat2Label}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots + slide counter */}
      <div className="absolute bottom-5 left-6 sm:left-10 md:left-12 flex items-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeSlide ? 'w-8 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <div className="absolute bottom-4 right-6 z-20 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white/80 text-[10px] font-black tracking-wider">
        {activeSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
