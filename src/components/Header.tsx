import React, { useState } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { MapPin, Search, ShoppingBag, Sun, Moon, User, Compass, Check, ChevronDown } from 'lucide-react';

export default function Header() {
  const {
    activeTab,
    setActiveTab,
    currentLocation,
    setCurrentLocation,
    cities,
    user,
    setShowLoginModal,
    itemCount,
    setCartDrawerOpen,
    darkMode,
    setDarkMode,
    setSelectedCategory,
    setSearchQuery,
  } = useApp();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [customAddress, setCustomAddress] = useState('');

  const handleCitySelect = (city: string) => {
    playNotificationSound('click');
    setCurrentLocation(`${city}, India`);
    localStorage.setItem('foodmela_location', `${city}, India`);
    setShowLocationModal(false);
  };

  const handleCustomAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAddress.trim()) {
      playNotificationSound('click');
      setCurrentLocation(customAddress);
      localStorage.setItem('foodmela_location', customAddress);
      setShowLocationModal(false);
      setCustomAddress('');
    }
  };

  const handleBrandClick = () => {
    playNotificationSound('click');
    setSelectedCategory('All');
    setSearchQuery('');
    setActiveTab('home');
  };

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}
      <header className="hidden md:block sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-orange-100/60 dark:border-slate-800 shadow-[0_8px_30px_-12px_rgba(249,115,22,0.25)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-6">
            <button 
              onClick={handleBrandClick}
              className="flex items-center gap-3 hover:opacity-95 transition-all group"
            >
              <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-500 shadow-lg shadow-orange-500/30 ring-1 ring-white/40 group-hover:scale-105 group-hover:rotate-3 transition-transform">
                <img
                  src="/food_mela_logo.png"
                  alt="Food Mela"
                  className="w-11 h-11 rounded-xl object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-500 to-emerald-500 leading-none">
                  Food Mela
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                  Birmaharajpur
                </span>
              </div>
            </button>

            {/* Location Pill */}
            <button
              onClick={() => { playNotificationSound('click'); setShowLocationModal(true); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-orange-500/30 transition-all text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="truncate max-w-[150px]">{currentLocation}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Zone 2: Navigation Links (Top Bar Contract: 4-6 links) */}
          <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <button
              onClick={() => { playNotificationSound('click'); setActiveTab('home'); setSelectedCategory('All'); }}
              className={`hover:text-orange-500 transition-colors whitespace-nowrap ${activeTab === 'home' ? 'text-orange-500 dark:text-orange-400' : ''}`}
            >
              Festive Feast
            </button>
            <button
              onClick={() => { playNotificationSound('click'); setActiveTab('home'); setSelectedCategory('Groceries'); }}
              className={`hover:text-emerald-500 transition-colors whitespace-nowrap ${activeTab === 'home' && 'Groceries' === 'Groceries' ? 'hover:text-emerald-500' : ''}`}
            >
              15-Min Groceries
            </button>
            <button
              onClick={() => { playNotificationSound('click'); setActiveTab('orders'); }}
              className={`hover:text-orange-500 transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'text-orange-500 dark:text-orange-400' : ''}`}
            >
              Live Tracking
            </button>
            <button
              onClick={() => { playNotificationSound('click'); setActiveTab('profile'); }}
              className={`hover:text-orange-500 transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'text-orange-500 dark:text-orange-400' : ''}`}
            >
              Gold Pass
            </button>
          </nav>

          {/* Zone 3: Interactive Action Controls */}
          <div className="flex items-center gap-4">
            
            {/* Search Trigger */}
            <button
              onClick={() => { playNotificationSound('click'); setActiveTab('search'); }}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all border border-slate-100 dark:border-slate-800"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => { playNotificationSound('click'); setDarkMode(!darkMode); }}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all border border-slate-100 dark:border-slate-800"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile / Login */}
            {user ? (
              <button
                onClick={() => { playNotificationSound('click'); setActiveTab('profile'); }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {user.name ? user.name[0] : 'F'}
                </div>
                <span className="max-w-[80px] truncate">{user.name || 'Profile'}</span>
              </button>
            ) : (
              <button
                onClick={() => { playNotificationSound('click'); setShowLoginModal(true); }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-[length:200%_100%] hover:bg-right text-white font-bold text-xs transition-all shadow-lg shadow-orange-500/30 active:scale-[0.98]"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Cart Icon with Live Badge count */}
            <button
              onClick={() => { playNotificationSound('click'); setCartDrawerOpen(true); }}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 hover:from-orange-600 hover:to-amber-500 dark:from-emerald-600 dark:to-teal-500 dark:hover:from-emerald-500 dark:hover:to-teal-400 text-white font-bold text-xs transition-all shadow-lg shadow-slate-900/20 hover:shadow-orange-500/30 active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bag</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px] font-mono-numbers font-black bg-orange-500 border-2 border-white dark:border-slate-900 rounded-full text-white animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </header>


      {/* ================= MOBILE STICKY HEADER ================= */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-3 h-14 flex items-center justify-between gap-2 max-w-full overflow-hidden">
        {/* Left: Location Pick */}
        <button
          onClick={() => { playNotificationSound('click'); setShowLocationModal(true); }}
          className="flex items-center gap-1.5 min-w-0 max-w-[140px] text-left shrink"
        >
          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Deliver to</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{currentLocation}</span>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
        </button>

        {/* Center: Brand logo & title */}
        <button
          onClick={handleBrandClick}
          className="flex items-center gap-2 shrink-0"
        >
          <img
            src="/food_mela_logo.png"
            alt="Food Mela"
            className="w-8 h-8 rounded-xl shadow-sm object-cover border border-orange-500/20"
          />
          <span className="text-base sm:text-lg font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-500 to-emerald-500">
            Food Mela
          </span>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={() => { playNotificationSound('click'); setDarkMode(!darkMode); }}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cart Bag */}
          <button
            onClick={() => { playNotificationSound('click'); setCartDrawerOpen(true); }}
            className="relative p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 flex items-center justify-center text-[8px] font-mono-numbers font-black bg-orange-500 text-white rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>


      {/* ================= LOCATION SELECTION MODAL / DROPDOWN ================= */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 transition-all p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Select Delivery City</h3>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                Close
              </button>
            </div>

            {/* Manual Address Input */}
            <form onSubmit={handleCustomAddressSubmit} className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Enter Custom Address</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. Sector 5, HSR Layout, Bengaluru"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-slate-900 dark:text-white"
                />
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  Locate
                </button>
              </div>
            </form>

            {/* Quick Cities Grid */}
            <div>
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Popular Cities</span>
              <div className="grid grid-cols-2 gap-2">
                {cities.map((city) => {
                  const isSelected = currentLocation.startsWith(city);
                  return (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected 
                          ? 'bg-orange-50/50 border-orange-500 text-orange-600 dark:bg-orange-950/20 dark:border-orange-500 dark:text-orange-400' 
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Compass className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-500' : 'text-slate-400'}`} />
                        <span>{city}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-orange-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
