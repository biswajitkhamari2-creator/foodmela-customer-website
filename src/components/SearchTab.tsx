import React from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { Search, Sparkles, ChefHat, AlertCircle } from 'lucide-react';
import CatalogGrid from './CatalogGrid';

export default function SearchTab() {
  const { searchQuery, setSearchQuery, categories, setSelectedCategory, selectedCategory } = useApp();

  const handleQuickTagClick = (catName: string) => {
    playNotificationSound('click');
    setSelectedCategory(catName);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Centered Search Hero Title */}
      <div className="text-center max-w-lg mx-auto space-y-2 py-4">
        <h3 className="text-2xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-500 to-emerald-500 tracking-tight">
          Savor Something Special
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
          Search across 100+ gourmet local outlets, fresh hydroponic grocery hubs, and artisanal sweet boutique chefs instantly.
        </p>
      </div>

      {/* Main Search Input Box */}
      <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search for Royal Biryani, Paneer gravies, Amul Butter..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        {searchQuery && (
          <button
            onClick={() => { playNotificationSound('remove'); setSearchQuery(''); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-orange-500"
          >
            Clear
          </button>
        )}
      </div>

      {/* Hot Tag Suggestions (Anti-pill unboxed styled buttons) */}
      <div className="max-w-xl mx-auto space-y-2">
        <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
          Popular Search Terms
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.slice(1).map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleQuickTagClick(cat)}
                className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-white border-transparent'
                    : 'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-850 my-2" />

      {/* Embedded results grid */}
      <CatalogGrid />
    </div>
  );
}
