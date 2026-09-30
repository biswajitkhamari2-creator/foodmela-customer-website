import React from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { ShoppingBasket, Sparkles, Carrot } from 'lucide-react';

interface CategoryConfig {
  name: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export default function CategoryBubbles() {
  const { selectedCategory, setSelectedCategory } = useApp();

  const categoriesList: CategoryConfig[] = [
    {
      name: 'All',
      label: 'All Items',
      icon: <ShoppingBasket className="w-4 h-4" />,
      color: 'from-orange-500 to-amber-500',
    },
    {
      name: 'Dals & Pulses',
      label: 'Moong & Dals',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'from-amber-600 to-yellow-500',
    },
    {
      name: 'Vegetables',
      label: 'Fresh Vegetables',
      icon: <Carrot className="w-4 h-4" />,
      color: 'from-emerald-600 to-teal-500',
    },
  ];

  const handleCategoryClick = (catName: string) => {
    playNotificationSound('click');
    setSelectedCategory(catName);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Explore Farm Vegetables &amp; Dals
        </h3>
        <span className="text-xs text-orange-500 font-bold dark:text-orange-400">
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
              className={`flex items-center gap-2.5 px-4.5 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-300 transform border shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r ' + cat.color + ' text-white border-transparent shadow-lg shadow-orange-500/10 -translate-y-0.5'
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
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
  );
}
