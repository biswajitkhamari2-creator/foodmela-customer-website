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
import { Compass, Search, ShoppingBag, User, Home, Sparkles, Lock, ArrowRight, ShieldCheck, Phone, Smartphone, Mail } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

function MaintenanceGate({ children }: { children: React.ReactNode }) {
  // Website maintenance is live on foodmela.online.
  // Bypass with ?preview=1 for internal review/testing.
  const [maintenanceEnabled, setMaintenanceEnabled] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined' && (window.location.search.includes('preview=1') || window.location.search.includes('bypass=1'))) {
      return false;
    }
    return true;
  });

  React.useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, 'app_settings', 'website_maintenance'), (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          if (typeof d.enabled === 'boolean') {
            setMaintenanceEnabled(d.enabled);
          }
        }
      }, () => { /* fail-safe: keep maintenance enabled */ });
      return () => unsub();
    } catch { /* ignore */ }
  }, []);

  if (typeof window !== 'undefined' && (window.location.search.includes('preview=1') || window.location.search.includes('bypass=1'))) {
    return <>{children}</>;
  }

  if (maintenanceEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100 dark:from-slate-950 dark:via-slate-900 dark:to-orange-950/40 flex items-center justify-center p-4 sm:p-6 text-slate-900 dark:text-white font-sans">
        <div className="w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-orange-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
          {/* Decorative soft glow */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-48 h-48 bg-orange-400/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl" />

          {/* Logo & Brand Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 shadow-inner">
              <img
                src="/food_mela_logo.png"
                alt="Food Mela"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-md object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600">
                Food Mela
              </h1>
              <p className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mt-0.5">
                Daily Essentials • Delivered Happier
              </p>
            </div>
          </div>

          {/* Maintenance Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 border border-orange-200 dark:border-orange-800/80 text-orange-700 dark:text-orange-300 text-xs font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Website Maintenance • ୱେବସାଇଟ୍ ମେଣ୍ଟେନାନ୍ସ</span>
          </div>

          {/* Main Titles */}
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white leading-tight">
              We're Working on Something New!
            </h2>
            <p className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400">
              (ଆମେ କିଛି ନୂଆ ନେଇ ଆସୁଛୁ ✨)
            </p>
          </div>

          {/* Odia Notice & Explanatory Box */}
          <div className="bg-amber-500/10 dark:bg-slate-800/70 border border-amber-500/20 dark:border-slate-700 rounded-2xl p-4 sm:p-5 text-left space-y-3">
            <p className="text-sm sm:text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
              ଆମ Website ବର୍ତ୍ତମାନ Maintenance ରେ ଅଛି। କିନ୍ତୁ ଚିନ୍ତା କରିବାର କୌଣସି କାରଣ ନାହିଁ—<strong>ଆମ Mobile App ସମ୍ପୂର୍ଣ୍ଣ ଠିକ୍ ଭାବେ କାମ କରୁଛି!</strong>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Our website is currently undergoing planned maintenance as we make exciting improvements for you. You don't have to wait—continue placing orders seamlessly on our mobile app.
            </p>
          </div>

          {/* Call to action for App */}
          <div className="space-y-3 pt-1">
            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
              ନିରବଚ୍ଛିନ୍ନ ସେବା ପାଇବା ପାଇଁ ଏବେ ହିଁ ଆମ App Download କରନ୍ତୁ:
            </p>

            <a
              href="https://play.google.com/store/apps/details?id=com.foodmela.in"
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-600/30 active:scale-98 transition-all flex items-center justify-center gap-3 no-underline"
            >
              <Smartphone className="w-5 h-5 shrink-0" />
              <span>Download FoodMela on Google Play</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          </div>

          {/* Help & Support Footer */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-orange-500" />
                Customer Care:
                <a href="tel:8144503650" className="text-orange-600 dark:text-orange-400 font-bold hover:underline ml-0.5">
                  +91 8144503650
                </a>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-orange-500" />
                <a href="mailto:support@foodmela.online" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
                  support@foodmela.online
                </a>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              📍 Birmaharajpur Express Delivery • Subarnapur, Odisha
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function AppContent() {
  const { activeTab, setActiveTab, user, itemCount, setCartDrawerOpen, setShowLoginModal, clearCart, refreshOrders } = useApp();
  const [paymentNotice, setPaymentNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const search = window.location.search;
      const path = window.location.pathname;
      const params = new URLSearchParams(search);

      if (path === '/admin' || path.startsWith('/admin/')) {
        window.location.href = 'https://food-mela-admin.vercel.app';
        return;
      }

      if (params.get('paid') === '1' || path.includes('/track/')) {
        clearCart();
        setActiveTab('orders');
        refreshOrders();
        window.history.replaceState({}, '', '/');
      } else if (params.get('payment_error')) {
        const err = params.get('payment_error');
        setPaymentNotice(`Online payment notice: ${decodeURIComponent(err || 'Payment was not completed')}. You can re-try or select Cash on Delivery.`);
        setCartDrawerOpen(true);
        window.history.replaceState({}, '', '/');
      }
    } catch { /* ignore */ }
  }, []);

  const renderActiveTab = () => {
    // 🔒 Login Barrier Enforced: Guest visitors are shown an inviting login barrier
    if (!user && (activeTab === 'orders' || activeTab === 'profile')) {
      return (
        <div className="max-w-lg mx-auto py-12 px-6 text-center space-y-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase text-orange-600 dark:text-orange-400 tracking-wider">
              Protected Member Section
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              Sign In to View {activeTab === 'orders' ? 'Live Orders & History' : 'Your Profile & Addresses'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              Please enter your 10-digit mobile number to verify via OTP and access your live orders, invoices, and past history.
            </p>
          </div>

          <button
            onClick={() => {
              playNotificationSound('click');
              setShowLoginModal(true);
            }}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Login with Mobile OTP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Promo Hero Carousel Banner */}
            <HeroCarousel />
            
            {/* Category Bubbles horizontally scrollable list */}
            <CategoryBubbles />
            
            {/* Catalog list or Login Barrier */}
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

              {!user ? (
                /* Unauthenticated Guest Barrier Card */
                <div className="p-8 sm:p-12 text-center space-y-5 bg-gradient-to-b from-orange-500/5 via-amber-500/5 to-white dark:to-slate-900 rounded-3xl border border-orange-500/20 shadow-sm">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-2xl shadow-md">
                    🔒
                  </div>
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h4 className="text-xl font-black text-slate-900 dark:text-white font-display">
                      Login to Explore Catalog &amp; Place Orders
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      All verified fresh vegetables and pure unpolished dals are accessible after a quick 1-touch OTP login.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      playNotificationSound('click');
                      setShowLoginModal(true);
                    }}
                    className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md shadow-orange-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Sign In with OTP Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Authenticated Catalog Grid */
                <CatalogGrid />
              )}
            </div>
          </div>
        );
      case 'search':
        return !user ? (
          <div className="max-w-md mx-auto py-12 px-6 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <span className="text-4xl">🔍</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Search requires Login</h4>
            <p className="text-xs text-slate-400">Please sign in with OTP to search items in Birmaharajpur.</p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow"
            >
              Sign In
            </button>
          </div>
        ) : (
          <SearchTab />
        );
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
    <div className="min-h-screen pb-20 md:pb-0 text-slate-900 dark:text-white transition-colors duration-300 flex flex-col justify-between overflow-x-hidden max-w-full w-full">
      
      <div className="w-full max-w-full overflow-x-hidden">
        {/* 1. Top Promotion Bar */}
        <div className="shimmer-gold text-slate-950 text-[10px] sm:text-[11px] font-black py-1.5 px-2 sm:px-4 text-center truncate tracking-wide">
          🎉 <span>Food Mela Online · 100% Farm Fresh Delivery in Birmaharajpur · Code <strong>FEAST50</strong> for ₹50 OFF</span>
        </div>

        {paymentNotice && (
          <div className="bg-red-500 text-white text-xs font-bold py-2 px-4 flex items-center justify-between">
            <span>⚠️ {paymentNotice}</span>
            <button onClick={() => setPaymentNotice(null)} className="ml-2 font-black text-sm">✕</button>
          </div>
        )}

        {/* 2. Header & Location Bar Navigation */}
        <Header />

        {/* 3. Main Layout Container Content Viewport */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 md:py-8 w-full overflow-x-hidden">
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
          { id: 'orders', label: 'Orders & Live', icon: <Compass className="w-5 h-5" /> },
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

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Food Mela UI Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl text-center space-y-4 border border-slate-200 dark:border-slate-800">
            <span className="text-5xl select-none">🍲</span>
            <h3 className="text-xl font-bold font-display">Something went slightly off</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your bag items are safe. Tap below to reload the app seamlessly.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
            >
              Reload Food Mela
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppProvider>
      <MaintenanceGate>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </MaintenanceGate>
    </AppProvider>
  );
}
