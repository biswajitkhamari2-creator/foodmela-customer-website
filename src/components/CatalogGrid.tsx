import React from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { CatalogItem } from '../types';
import { Star, Clock, ShoppingCart, ToggleLeft, ToggleRight, Sparkles, ChefHat, Carrot, AlertCircle } from 'lucide-react';

export default function CatalogGrid() {
  const {
    catalog,
    loadingCatalog,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    dietaryFilter,
    setDietaryFilter,
    ratingFilter,
    setRatingFilter,
    cart,
    addToCart,
    updateQuantity,
    setCustomizingItem,
  } = useApp();

  // Filter Catalog Items
  const filteredCatalog = catalog.filter((item) => {
    // 0. Strict Positive Price (No ₹0 items) & Allowed Categories (No Cooked Food)
    if (!item.price || item.price <= 0) return false;
    const cat = (item.category || '').toLowerCase();
    const isAllowed = cat.includes('vegetable') || cat.includes('dal') || cat.includes('pulse');
    if (!isAllowed) return false;

    // 1. Category Filter
    if (selectedCategory !== 'All') {
      if (item.category !== selectedCategory) return false;
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchCat = item.category.toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    // 3. Dietary Filter (All, Veg, Non-Veg Tab)
    if (dietaryFilter === 'veg' && !item.isVeg) return false;
    if (dietaryFilter === 'non-veg' && item.isVeg) return false;

    // 4. Rating Filter
    if (ratingFilter && item.rating < 4.7) return false;

    return true;
  });

  const handleAddClick = (item: CatalogItem) => {
    if (item.customizationOptions && item.customizationOptions.length > 0) {
      setCustomizingItem(item);
    } else {
      addToCart(item);
    }
  };

  const getCartQuantity = (itemId: string) => {
    // Find aggregate count of this item (all customization versions combined)
    const matches = cart.filter((ci) => ci.item.id === itemId);
    return matches.reduce((sum, ci) => sum + ci.quantity, 0);
  };

  const handleDecreaseQuantity = (itemId: string) => {
    // Find first cart item with this itemId to reduce quantity
    const matches = cart.filter((ci) => ci.item.id === itemId);
    if (matches.length > 0) {
      // If there are multiple customizations, decrease the first one
      updateQuantity(matches[0].id, -1);
    }
  };

  const handleIncreaseQuantity = (itemId: string) => {
    const matches = cart.filter((ci) => ci.item.id === itemId);
    if (matches.length > 0) {
      updateQuantity(matches[0].id, 1);
    } else {
      // Safeguard
      const item = catalog.find((i) => i.id === itemId);
      if (item) handleAddClick(item);
    }
  };

  const getCuisineIcon = (catName: string) => {
    const c = (catName || '').toLowerCase();
    if (c.includes('dal') || c.includes('pulse')) return '🌾';
    if (c.includes('vegetable')) return '🥦';
    return '🌱';
  };

  if (loadingCatalog) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold tracking-wide">Loading fresh produce &amp; dals...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Filter Controls / Quick Switches */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-sm max-w-full overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
          {/* Segmented Dietary Filter Tabs */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-1 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700 shrink-0">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'veg', label: 'Veg', dotColor: 'bg-emerald-500' },
              { id: 'non-veg', label: 'Non-Veg', dotColor: 'bg-red-500' },
            ].map((diet) => {
              const isSelected = dietaryFilter === diet.id;
              return (
                <button
                  key={diet.id}
                  onClick={() => { playNotificationSound('click'); setDietaryFilter(diet.id as any); }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected 
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm border border-slate-100/40 dark:border-slate-800/40' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {diet.dotColor && (
                    <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${diet.dotColor} ${isSelected ? 'animate-pulse' : ''}`} />
                  )}
                  <span>{diet.label}</span>
                </button>
              );
            })}
          </div>

          {/* Rating 4.7+ Toggle */}
          <button
            onClick={() => { playNotificationSound('click'); setRatingFilter(!ratingFilter); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-black transition-all whitespace-nowrap shrink-0 ${
              ratingFilter 
                ? 'bg-orange-50 border-orange-500 text-orange-700 dark:bg-orange-950/20 dark:border-orange-500 dark:text-orange-400' 
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Elite (4.7+)</span>
          </button>
        </div>

        {/* Dynamic Items Counter */}
        <span className="text-[11px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 font-mono-numbers text-right">
          {filteredCatalog.length} gourmet dishes
        </span>
      </div>

      {/* Grid Container */}
      {filteredCatalog.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <AlertCircle className="w-10 h-10 text-orange-500/80 mb-3" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">No dishes match your filters</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Try clearing your search query, changing your Veg/Non-Veg tab, or resetting filters to discover the mela menu!</p>
          <button
            onClick={() => {
              playNotificationSound('click');
              setDietaryFilter('all');
              setRatingFilter(false);
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalog.map((item) => {
            const qty = getCartQuantity(item.id);
            const isGrocery = item.type === 'grocery';

            return (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-850 hover:border-orange-500/15 dark:hover:border-orange-500/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Image Block with Custom Gradients Fallback */}
                <div className="relative h-44 w-full overflow-hidden shrink-0">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.imageFallbackGradient} opacity-90`} />
                  
                  {/* Subtle Grid overlay for luxury pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:14px_24px]" />
                  
                  {/* Centralized High Contrast Emoji / Icon Graphic */}
                  <div className="absolute inset-0 flex items-center justify-center text-6xl transform group-hover:scale-110 transition-transform duration-500 pointer-events-none select-none">
                    {getCuisineIcon(item.category)}
                  </div>

                  {/* Corner Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {/* Veg/Non-veg small block */}
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border border-slate-100 dark:border-slate-800">
                      <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-[9px] font-black uppercase text-slate-800 dark:text-slate-200 tracking-wide">
                        {item.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </span>

                    {/* Bestseller Badge */}
                    {item.isBestseller && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[8px] uppercase tracking-wider shadow-sm animate-pulse">
                        <Sparkles className="w-2.5 h-2.5 fill-current" />
                        <span>Bestseller</span>
                      </span>
                    )}
                  </div>

                  {/* Preparation Time / Delivery Indicator */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center gap-1 text-[10px] font-bold">
                    <Clock className="w-3 h-3 text-yellow-300" />
                    <span>{item.prepTime}</span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-50 dark:border-slate-800 flex items-center gap-1 text-[10px] font-mono-numbers font-black shadow-md">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span>{item.rating}</span>
                    <span className="text-slate-400 font-medium">({item.ratingCount})</span>
                  </div>
                </div>

                {/* Card Information Section */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    {/* Restaurant / Store metadata as clean unboxed text (anti-pill) */}
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      <span>{item.restaurant || 'Food Mela Special'}</span>
                      {item.unit && (
                        <>
                          <span aria-hidden="true">•</span>
                          <span className="text-orange-500 dark:text-orange-400 font-mono-numbers">{item.unit}</span>
                        </>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white font-display tracking-tight leading-tight line-clamp-1">
                      {item.name}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Pricing and Action Counter */}
                  <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/60 pt-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-mono-numbers font-black text-slate-900 dark:text-white">
                        ₹{item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs font-mono-numbers text-slate-400 dark:text-slate-500 line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Add-to-cart or Customization Trigger */}
                    {qty > 0 ? (
                      <div className="flex items-center bg-orange-500 dark:bg-emerald-600 rounded-xl shadow-md p-0.5">
                        <button
                          onClick={() => { playNotificationSound('remove'); handleDecreaseQuantity(item.id); }}
                          className="w-8 h-8 flex items-center justify-center text-white hover:bg-black/5 font-extrabold text-sm rounded-lg active:scale-90 transition-all"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-white font-mono-numbers font-black text-xs">
                          {qty}
                        </span>
                        <button
                          onClick={() => { playNotificationSound('click'); handleIncreaseQuantity(item.id); }}
                          className="w-8 h-8 flex items-center justify-center text-white hover:bg-black/5 font-extrabold text-sm rounded-lg active:scale-90 transition-all"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { playNotificationSound('click'); handleAddClick(item); }}
                        className="px-4 py-2 bg-slate-50 hover:bg-orange-500 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 dark:hover:text-white text-orange-500 dark:text-emerald-400 font-black text-xs uppercase tracking-wider rounded-xl border border-slate-200/50 dark:border-slate-800/80 hover:border-transparent transition-all shadow-sm active:scale-95"
                      >
                        + Add {item.customizationOptions ? 'Custom' : ''}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
