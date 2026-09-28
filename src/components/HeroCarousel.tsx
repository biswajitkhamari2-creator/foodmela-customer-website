import React, { useState, useEffect } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { Sparkles, ArrowRight, Zap, ShieldAlert, Award } from 'lucide-react';

interface PromoSlide {
  id: string;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  gradient: string;
  action: () => void;
  accentIcon: React.ReactNode;
}

export default function HeroCarousel() {
  const { toggleGoldClub, user, setActiveTab, applyCoupon } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides: PromoSlide[] = [
    {
      id: 'slide_1',
      badge: 'Festive Special',
      title: 'Food Mela Gold Pass',
      description: 'Get Flat 15% Off menu prices and Free Delivery on every single order. No limits.',
      ctaText: user?.isGoldMember ? 'You are a Gold Member!' : 'Join Gold Club for Free',
      gradient: 'from-orange-600 via-amber-500 to-red-600',
      accentIcon: <Award className="w-10 h-10 text-yellow-300 animate-bounce" />,
      action: () => {
        toggleGoldClub();
      },
    },
    {
      id: 'slide_2',
      badge: 'Special discount',
      title: 'Flat 50% Off Feast',
      description: 'Order your favorite mutton biryani, paneer gravies or sweets. Use coupon code MELA50.',
      ctaText: 'Apply Code MELA50',
      gradient: 'from-emerald-700 via-teal-600 to-emerald-500',
      accentIcon: <Sparkles className="w-10 h-10 text-emerald-200 animate-pulse" />,
      action: () => {
        applyCoupon('MELA50');
      },
    },
    {
      id: 'slide_3',
      badge: 'Express Delivery',
      title: 'Super-Fast 15-Min Delivery',
      description: 'Craving street chaat or running out of butter? Handed over in 15 mins, fresh or free.',
      ctaText: 'Explore Menu',
      gradient: 'from-blue-700 via-indigo-600 to-violet-700',
      accentIcon: <Zap className="w-10 h-10 text-yellow-400 animate-pulse" />,
      action: () => {
        setActiveTab('home');
      },
    },
  ];

  // Auto transition slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSlideChange = (index: number) => {
    playNotificationSound('click');
    setActiveSlide(index);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-950/40 p-1">
      {/* Dynamic Slide Container */}
      <div 
        className="relative h-[240px] sm:h-[280px] md:h-[320px] rounded-2xl overflow-hidden transition-all duration-500 bg-gradient-to-br"
      >
        {slides.map((slide, index) => {
          const isActive = index === activeSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 p-6 sm:p-10 md:p-12 flex flex-col justify-between transition-all duration-700 ${
                isActive 
                  ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto' 
                  : 'opacity-0 translate-x-8 scale-95 pointer-events-none'
              } bg-gradient-to-r ${slide.gradient}`}
            >
              {/* Saffron Mesh Background Ornaments */}
              <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
              <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-40 shrink-0 hidden sm:block">
                {slide.accentIcon}
              </div>

              {/* Slide Content */}
              <div className="max-w-xl space-y-2 sm:space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase text-white tracking-widest">
                  <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                  {slide.badge}
                </span>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-display tracking-tight text-wrap leading-tight">
                  {slide.title}
                </h2>
                
                <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed max-w-md">
                  {slide.description}
                </p>
              </div>

              <div>
                <button
                  onClick={() => { playNotificationSound('click'); slide.action(); }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-50 font-extrabold text-xs sm:text-sm transition-all transform hover:translate-x-1 active:scale-[0.97] shadow-lg shadow-black/10"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 rounded-full transition-all ${
              index === activeSlide ? 'w-6 bg-white' : 'w-2 bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
