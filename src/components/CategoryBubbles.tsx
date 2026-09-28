import React from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { UtensilsCrossed, Carrot, Apple, ShoppingCart, Milk, Egg, ChefHat, Flame, Candy, Coffee } from 'lucide-react';

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
      label: 'All Products',
      icon: <UtensilsCrossed className="w-4 h-4" />,
      color: 'from-orange-500 to-amber-500',
    },
    {
      name: 'Vegetables',
      label: 'Vegetables',
      icon: <Carrot className="w-4 h-4" />,
      color: 'from-emerald-600 to-green-500',
    },
    {
      name: 'Fruits',
      label: 'Fruits',
      icon: <Apple className="w-4 h-4" />,
      color: 'from-rose-500 to-red-500',
    },
    {
      name: 'Grocery',
      label: 'Grocery',
      icon: <ShoppingCart className="w-4 h-4" />,
      color: 'from-amber-600 to-yellow-500',
    },
    {
      name: 'Dairy',
      label: 'Dairy',
      icon: <Milk className="w-4 h-4" />,
      color: 'from-sky-500 to-blue-500',
    },
    {
      name: 'Eggs & Meat',
      label: 'Eggs & Meat',
      icon: <Egg className="w-4 h-4" />,
      color: 'from-amber-700 to-red-600',
    },
    {
      name: 'Cooked Food',
      label: 'Cooked Food',
      icon: <ChefHat className="w-4 h-4" />,
      color: 'from-orange-600 to-amber-600',
    },
    {
      name: 'Non-Veg',
      label: 'Non-Veg',
      icon: <Flame className="w-4 h-4" />,
      color: 'from-red-600 to-rose-600',
    },
    {
      name: 'Sweets',
      label: 'Sweets',
      icon: <Candy className="w-4 h-4" />,
      color: 'from-pink-500 to-rose-400',
    },
    {
      name: 'Snacks',
      label: 'Snacks',
      icon: <Coffee className="w-4 h-4" />,
      color: 'from-yellow-600 to-amber-600',
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
          foodmela.online Categories
        </h3>
        <span className="text-xs text-orange-500 font-bold dark:text-orange-400">
          Scroll to view all
        </span>
      </div>

      {/* Horizontal Scroller */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-1">
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
