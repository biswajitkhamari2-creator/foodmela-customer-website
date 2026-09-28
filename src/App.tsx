/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp, playNotificationSound } from './context/AppContext';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import CategoryBubbles from './components/CategoryBubbles';
import CatalogGrid from './components/CatalogGrid';
import CartDrawer from './components/CartDrawer';
import LoginModal from './components/LoginModal';
import FoodCustomizerModal from './components/FoodCustomizerModal';
import LiveTracker from './components/LiveTracker';
import ProfileView from './components/ProfileView';
import SearchTab from './components/SearchTab';
import PolicyModal from './components/PolicyModal';
import Footer from './components/Footer';
import { Compass, Search, ShoppingBag, User, Home, Sparkles } from 'lucide-react';

function AppContent() {
  const { activeTab, setActiveTab, user, itemCount, setCartDrawerOpen, setShowLoginModal } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Promo Hero Carousel Banner */}
            <HeroCarousel />
            
            {/* Category Bubbles horizontally scrollable list */}
            <CategoryBubbles />
            
            {/* Catalog list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Verified Farm Fresh &amp; Essentials</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display uppercase tracking-tight">
                    Food Mela Fresh Bazaar
                  </h3>
                </div>
                <div className="text-xs font-bold text-slate-400">
                  Birmaharajpur Express
                </div>
              </div>
              <CatalogGrid />
            </div>
          </div>
        );
      case 'search':
        return <SearchTab />;
      case 'orders':
        return <LiveTracker />;
      case 'profile':
        return <ProfileView />;
      case 'cart':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <span className="text-5xl select-none">🛒</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display">Manage your Order Items</h4>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Open the Sliding gourmet bag panel to check price breakdowns, apply discount codes, and choose instant payment.
            </p>
            <button
              onClick={() => { playNotificationSound('click'); setCartDrawerOpen(true); }}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Open Checkout Bag
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 flex flex-col justify-between">
      
      <div>
        {/* 1. Top Promotion Bar */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 text-white text-[11px] font-bold py-1 px-4 text-center">
          🎉 <span>Food Mela Online · 100% Farm Fresh Delivery across Birmaharajpur · Use code <strong>FEAST50</strong> for ₹50 OFF</span>
        </div>

        {/* 2. Header & Location Bar Navigation */}
        <Header />

        {/* 3. Main Layout Container Content Viewport */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          {renderActiveTab()}
        </main>
      </div>

      {/* 4. Desktop & Mobile Footer with Trust & Policies */}
      <Footer />

      {/* 5. Bottom Mobile Sticky Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 h-16 px-4 flex items-center justify-around pb-safe">
        {[
          { id: 'home', label: 'Bazaar', icon: <Home className="w-5 h-5" /> },
          { id: 'search', label: 'Search', icon: <Search className="w-5 h-5" /> },
          { id: 'orders', label: 'Tracking', icon: <Compass className="w-5 h-5" /> },
          { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { playNotificationSound('click'); setActiveTab(tab.id as any); }}
              className={`flex flex-col items-center justify-center py-2 px-3 transition-colors ${
                isActive 
                  ? 'text-orange-500 dark:text-orange-400' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.icon}
              <span className="text-[9px] font-black tracking-tight mt-1 uppercase">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 6. Sliding Checkout Bag Drawers, Customizer, Modals */}
      <CartDrawer />
      <FoodCustomizerModal />
      <LoginModal />
      <PolicyModal />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
