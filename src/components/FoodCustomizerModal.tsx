import React, { useState, useEffect } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { X, Sparkles, ChefHat } from 'lucide-react';
import { SelectedCustomization } from '../types';

export default function FoodCustomizerModal() {
  const { customizingItem, setCustomizingItem, addToCart } = useApp();
  const [selections, setSelections] = useState<SelectedCustomization[]>([]);
  const [instructions, setInstructions] = useState('');

  // Auto-initialize default choices when the item changes
  useEffect(() => {
    if (customizingItem?.customizationOptions) {
      const defaults: SelectedCustomization[] = [];
      customizingItem.customizationOptions.forEach((opt) => {
        if (opt.type === 'radio' && opt.choices.length > 0) {
          defaults.push({
            optionName: opt.name,
            choiceName: opt.choices[0].name,
            price: opt.choices[0].price,
          });
        }
      });
      setSelections(defaults);
      setInstructions('');
    }
  }, [customizingItem]);

  if (!customizingItem) return null;

  const handleRadioSelect = (optionName: string, choiceName: string, price: number) => {
    playNotificationSound('click');
    setSelections((prev) => {
      const filtered = prev.filter((s) => s.optionName !== optionName);
      return [...filtered, { optionName, choiceName, price }];
    });
  };

  const handleCheckboxToggle = (optionName: string, choiceName: string, price: number) => {
    playNotificationSound('click');
    setSelections((prev) => {
      const exists = prev.find((s) => s.optionName === optionName && s.choiceName === choiceName);
      if (exists) {
        return prev.filter((s) => !(s.optionName === optionName && s.choiceName === choiceName));
      } else {
        return [...prev, { optionName, choiceName, price }];
      }
    });
  };

  // Compute live cumulative price
  const customizationsPrice = selections.reduce((sum, s) => sum + s.price, 0);
  const totalItemPrice = customizingItem.price + customizationsPrice;

  const handleConfirmAdd = () => {
    addToCart(customizingItem, selections, instructions);
    setCustomizingItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div 
        className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 transition-all flex flex-col max-h-[85vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Mesh Accent & Header */}
        <div className={`h-24 bg-gradient-to-r ${customizingItem.imageFallbackGradient} relative p-6 flex items-end justify-between`}>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-black uppercase text-white tracking-wider mb-1">
              {customizingItem.isVeg ? '🟢 Veg Only' : '🔴 Non-Veg'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white font-display tracking-tight leading-tight">
              {customizingItem.name}
            </h3>
          </div>
          <button 
            onClick={() => setCustomizingItem(null)}
            className="relative z-10 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Customization Groups */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {customizingItem.description}
          </div>

          {/* Options Renderer */}
          {customizingItem.customizationOptions?.map((opt) => (
            <div key={opt.name} className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/60 pb-1.5">
                <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{opt.name}</span>
                <span className="text-[10px] text-slate-400 font-medium font-mono-numbers">
                  {opt.type === 'radio' ? 'Select 1' : 'Optional'}
                </span>
              </div>

              <div className="space-y-2">
                {opt.choices.map((choice) => {
                  const isSelected = selections.some(
                    (s) => s.optionName === opt.name && s.choiceName === choice.name
                  );

                  return (
                    <button
                      key={choice.name}
                      onClick={() => 
                        opt.type === 'radio' 
                          ? handleRadioSelect(opt.name, choice.name, choice.price)
                          : handleCheckboxToggle(opt.name, choice.name, choice.price)
                      }
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected 
                          ? 'bg-orange-50/40 border-orange-500 text-orange-900 dark:bg-orange-950/20 dark:border-orange-500 dark:text-orange-400' 
                          : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-orange-500 text-orange-500' : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                        </div>
                        <span>{choice.name}</span>
                      </div>
                      {choice.price > 0 && (
                        <span className="font-mono-numbers font-black text-slate-600 dark:text-slate-400 text-xs">
                          +₹{choice.price}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special Cooking Instructions Box */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Special Cooking Instructions
            </label>
            <textarea
              placeholder="e.g. Please make it extra spicy, double-pack raita, or omit garlic..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full h-20 p-4 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-850 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-slate-850 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Bottom Total Price & Action Sticky Bar */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Price</span>
            <span className="text-xl font-mono-numbers font-black text-slate-900 dark:text-white">
              ₹{totalItemPrice}
            </span>
          </div>

          <button
            onClick={handleConfirmAdd}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-orange-500/10 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ChefHat className="w-4 h-4" />
            <span>Add Customization to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
}
