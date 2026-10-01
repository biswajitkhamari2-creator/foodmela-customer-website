import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CatalogItem, CartItem, Coupon, Order, UserProfile, SelectedCustomization } from '../types';
import { apiClient, submitPayUForm, MOCK_CATALOG, MOCK_COUPONS } from '../api/apiClient';
import { db } from '../firebase';
import { doc, onSnapshot, collection, query, where, setDoc, serverTimestamp } from 'firebase/firestore';

// Premium Audio Synthesis for App Sound Effects
export const playNotificationSound = (type: 'success' | 'click' | 'remove') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === 'success') {
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.23);
      gain2.gain.setValueAtTime(0.12, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.6);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'remove') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  } catch {
    // blocked until user interaction occurs
  }
};

interface AppContextType {
  catalog: CatalogItem[];
  categories: string[];
  loadingCatalog: boolean;

  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  dietaryFilter: 'all' | 'veg' | 'non-veg';
  setDietaryFilter: (filter: 'all' | 'veg' | 'non-veg') => void;
  ratingFilter: boolean;
  setRatingFilter: (r: boolean) => void;

  // Cart State
  cart: CartItem[];
  addToCart: (item: CatalogItem, selectedCustomizations?: SelectedCustomization[], instructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  deliveryFee: number;
  taxes: number;
  platformFee: number;
  discountAmount: number;
  grandTotal: number;

  // Coupon State
  appliedCoupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;

  // Location State
  currentLocation: string;
  setCurrentLocation: (loc: string) => void;
  cities: string[];

  // Auth State
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  login: (phone: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  toggleGoldClub: () => void;
  updateProfile: (newName: string, newAddress?: string) => Promise<boolean>;

  // Theme State
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;

  // Navigation State
  activeTab: 'home' | 'search' | 'orders' | 'profile' | 'cart';
  setActiveTab: (tab: 'home' | 'search' | 'orders' | 'profile' | 'cart') => void;

  // Policy Modal
  selectedPolicy: string | null;
  setSelectedPolicy: (policy: string | null) => void;

  // Order & Tracking State
  activeOrder: Order | null;
  setActiveOrder: (o: Order | null) => void;
  pastOrders: Order[];
  refreshOrders: () => Promise<void>;
  placeOrder: (paymentMethod: string, customAddress?: string) => Promise<boolean>;
  convertOrderToPrepaid: (orderId: string) => Promise<boolean>;
  reorder: (order: Order) => void;

  // Customization Modal
  customizingItem: CatalogItem | null;
  setCustomizingItem: (item: CatalogItem | null) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('foodmela_dark') === 'true';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('foodmela_cart');
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      // Strictly filter out any legacy ₹0 items or cooked food items
      return parsed.filter((ci) => {
        if (!ci.item || !ci.item.price || ci.item.price <= 0) return false;
        const cat = (ci.item.category || '').toLowerCase();
        return cat.includes('vegetable') || cat.includes('dal') || cat.includes('pulse');
      });
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('foodmela_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentLocation, setCurrentLocation] = useState<string>(() => {
    return localStorage.getItem('foodmela_location') || 'Birmaharajpur, Subarnapur, Odisha - 767018';
  });

  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'orders' | 'profile' | 'cart'>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [customizingItem, setCustomizingItem] = useState<CatalogItem | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Catalog State (Strictly Dals & Fresh Vegetables, No ₹0 items, No cooked food)
  const [catalog, setCatalog] = useState<CatalogItem[]>(MOCK_CATALOG);
  const [categories, setCategories] = useState<string[]>([
    'All',
    'Dals & Pulses',
    'Vegetables',
  ]);
  const [loadingCatalog, setLoadingCatalog] = useState<boolean>(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [ratingFilter, setRatingFilter] = useState(false);

  const cities = ['Birmaharajpur', 'Subarnapur', 'Bhubaneswar', 'Cuttack', 'Sambalpur', 'Rourkela', 'Balangir'];

  // Initialize Catalog
  useEffect(() => {
    const loadCatalog = async () => {
      setLoadingCatalog(true);
      const items = await apiClient.getCatalog();
      const validItems = items.filter((item) => {
        if (!item.price || item.price <= 0) return false;
        const cat = (item.category || '').toLowerCase();
        return cat.includes('vegetable') || cat.includes('dal') || cat.includes('pulse');
      });
      setCatalog(validItems);
      const uniqueCategories = Array.from(new Set(validItems.map((i) => i.category || 'Vegetables')));
      setCategories(['All', ...uniqueCategories]);
      setLoadingCatalog(false);
    };
    loadCatalog();
  }, []);

  // Sync Dark Mode
  useEffect(() => {
    localStorage.setItem('foodmela_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('foodmela_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync User to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('foodmela_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('foodmela_user');
    }
  }, [user]);

  // Refresh Orders from Backend
  const refreshOrders = useCallback(async () => {
    if (!user || !user.phone) {
      setPastOrders([]);
      return;
    }
    try {
      const orders = await apiClient.getUserOrders(user.phone);
      if (orders && orders.length > 0) {
        setPastOrders(orders);
        const latestActive = orders.find((o) => o.status !== 'delivered');
        if (latestActive) {
          setActiveOrder(latestActive);
        }
      }
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshOrders();
    }
  }, [user, refreshOrders]);

  // ── REAL-TIME 2-WAY PROFILE SYNC (APP ↔ WEBSITE) ──
  useEffect(() => {
    if (!user || !user.phone) return;
    const cleanPhone = user.phone.replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length < 10) return;

    // Listen to Firestore users/{cleanPhone} in real time
    const unsub = onSnapshot(doc(db, 'users', cleanPhone), (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data() as Record<string, any>;
        const liveName = String(d.fullName || d.name || `${d.firstName || ''} ${d.lastName || ''}`).trim();
        const liveAddr = String(d.deliveryAddress || d.address || '').trim();

        if (liveName && liveName !== user.name) {
          console.log('🔄 [LiveSync] Name updated from mobile app/cloud:', liveName);
          setUser((prev) => {
            if (!prev) return prev;
            const updated = {
              ...prev,
              name: liveName,
              address: liveAddr || prev.address,
            };
            try {
              localStorage.setItem('foodmela_user', JSON.stringify(updated));
              localStorage.setItem(`fm_user_name_${cleanPhone}`, liveName);
              if (liveAddr) localStorage.setItem(`fm_user_addr_${cleanPhone}`, liveAddr);
            } catch { /* ignore */ }
            return updated;
          });
        }
      }
    }, (err) => {
      console.warn('[LiveSync] Profile listener error:', err);
    });

    return () => unsub();
  }, [user?.phone, user?.name]);

  // ── REAL-TIME 2-WAY ORDERS SYNC (APP ↔ WEBSITE) ──
  useEffect(() => {
    if (!user || !user.phone) return;
    const cleanPhone = user.phone.replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length < 10) return;

    // Listen to orders where customerPhone == cleanPhone
    const q = query(
      collection(db, 'orders'),
      where('customerPhone', '==', cleanPhone)
    );

    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        void refreshOrders();
      }
    }, (err) => {
      console.warn('[LiveSync] Orders listener notice:', err);
    });

    return () => unsub();
  }, [user?.phone, refreshOrders]);

  // ── 2-WAY PROFILE UPDATE (WEBSITE → FIRESTORE + BACKEND → APP) ──
  const updateProfile = async (newName: string, newAddress?: string): Promise<boolean> => {
    if (!user || !user.phone) return false;
    const cleanPhone = user.phone.replace(/[^0-9]/g, '').slice(-10);
    const trimmedName = newName.trim();
    if (!trimmedName) return false;

    const trimmedAddr = newAddress?.trim() || user.address || 'Birmaharajpur, Subarnapur, Odisha - 767018';

    // 1. Update local state immediately
    const updated = {
      ...user,
      name: trimmedName,
      address: trimmedAddr,
    };
    setUser(updated);
    try {
      localStorage.setItem('foodmela_user', JSON.stringify(updated));
      localStorage.setItem(`fm_user_name_${cleanPhone}`, trimmedName);
      localStorage.setItem(`fm_user_addr_${cleanPhone}`, trimmedAddr);
    } catch { /* ignore */ }

    // 2. Write to Firestore users/{cleanPhone} so Mobile App picks it up INSTANTLY (< 1s)
    try {
      await setDoc(doc(db, 'users', cleanPhone), {
        phone: cleanPhone,
        name: trimmedName,
        fullName: trimmedName,
        deliveryAddress: trimmedAddr,
        address: trimmedAddr,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore profile update notice:', e);
    }

    // 3. Push to backend /api/user/:phone/profile
    try {
      await apiClient.updateProfile(cleanPhone, { name: trimmedName, address: trimmedAddr });
    } catch (e) {
      console.warn('Backend profile update notice:', e);
    }

    playNotificationSound('success');
    return true;
  };

  // Cart Calculations
  const cartTotal = cart.reduce((total, item) => {
    const customPrice = item.selectedCustomizations.reduce((acc, c) => acc + c.price, 0);
    return total + (item.item.price + customPrice) * item.quantity;
  }, 0);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isGold = user?.isGoldMember || false;
  const deliveryFee = (isGold || cartTotal >= 299) ? 0 : 39;
  const platformFee = 7;
  const taxes = Math.round(cartTotal * 0.05);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      const calculated = (cartTotal * appliedCoupon.discountValue) / 100;
      discountAmount = appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const goldSavings = isGold ? Math.round(cartTotal * 0.10) : 0;
  const grandTotal = Math.max(0, cartTotal + deliveryFee + taxes + platformFee - discountAmount - goldSavings);

  // Cart Handlers
  const addToCart = (
    item: CatalogItem,
    selectedCustomizations: SelectedCustomization[] = [],
    instructions?: string
  ) => {
    // Strictly prevent ₹0 or invalid items or non-allowed items from entering cart
    if (!item || !item.price || item.price <= 0) return;
    const cat = (item.category || '').toLowerCase();
    if (!cat.includes('vegetable') && !cat.includes('dal') && !cat.includes('pulse')) return;

    playNotificationSound('click');
    setCart((prevCart) => {
      const customKey = [
        item.id,
        ...selectedCustomizations.map((c) => `${c.optionName}:${c.choiceName}`).sort(),
      ].join('|');

      const existingIndex = prevCart.findIndex((ci) => {
        const ciKey = [
          ci.item.id,
          ...ci.selectedCustomizations.map((c) => `${c.optionName}:${c.choiceName}`).sort(),
        ].join('|');
        return ciKey === customKey;
      });

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [
        ...prevCart,
        {
          id: customKey,
          item,
          quantity: 1,
          selectedCustomizations,
          instructions,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    playNotificationSound('remove');
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    playNotificationSound('click');
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('foodmela_cart');
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const coupon = MOCK_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) {
      setCouponError('Invalid coupon code. Try FEAST50 or MELA70.');
      playNotificationSound('remove');
      return false;
    }
    if (cartTotal < coupon.minOrderValue) {
      setCouponError(`Add items worth ₹${coupon.minOrderValue - cartTotal} more to apply ${coupon.code}`);
      playNotificationSound('remove');
      return false;
    }
    setAppliedCoupon(coupon);
    setCouponError(null);
    playNotificationSound('success');
    return true;
  };

  const removeCoupon = () => {
    playNotificationSound('remove');
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Auth Handlers
  const login = async (phone: string, otp: string) => {
    const res = await apiClient.verifyOTP(phone, otp);
    if (res.success && res.user) {
      setUser(res.user);
      setShowLoginModal(false);
      playNotificationSound('success');
      await refreshOrders();
      return { success: true };
    }
    return { success: false, message: res.message };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('foodmela_user');
    localStorage.removeItem('fm_api_token');
    setActiveOrder(null);
    setPastOrders([]);
  };

  const toggleGoldClub = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    const updated = { ...user, isGoldMember: !user.isGoldMember };
    setUser(updated);
    playNotificationSound('success');
  };

  // Place order to backend & Firestore or redirect to PayU for online payment
  const placeOrder = async (paymentMethod: string, customAddress?: string): Promise<boolean> => {
    if (cart.length === 0) return false;

    if (!user) {
      setShowLoginModal(true);
      return false;
    }

    const deliveryAddress = customAddress || user.address || currentLocation || 'Birmaharajpur, Subarnapur, Odisha - 767018';

    // ─── 1. REAL PAYU ONLINE PAYMENT REDIRECT (UPI & CARD) ─────────────────────
    if (paymentMethod === 'UPI' || paymentMethod === 'CARD') {
      const itemsSummary = cart.map((ci) => `${ci.quantity}x ${ci.item.name}`).join(', ');
      
      const payuRes = await apiClient.initiatePayU({
        customerName: user.name || 'Food Mela Customer',
        phone: user.phone,
        email: user.email || '',
        address: deliveryAddress,
        items: itemsSummary,
        totalAmount: grandTotal,
      });

      if (payuRes.success && payuRes.payuUrl && payuRes.fields) {
        playNotificationSound('success');
        // Instantly submit POST form to PayU gateway server
        submitPayUForm(payuRes.payuUrl, payuRes.fields);
        return true;
      }
    }

    // ─── 2. CASH ON DELIVERY (COD) OR FALLBACK ─────────────────────────────────
    const payload = {
      customerName: user.name || 'Food Mela Customer',
      phone: user.phone,
      address: deliveryAddress,
      items: cart.map((ci) => ({
        itemId: ci.item.id,
        name: ci.item.name,
        quantity: ci.quantity,
        price: ci.item.price,
        unit: ci.item.unit || '',
        totalPrice: ci.item.price * ci.quantity,
      })),
      totalAmount: grandTotal,
      subtotal: cartTotal,
      deliveryFee,
      discount: discountAmount + goldSavings,
      promoCode: appliedCoupon?.code || (isGold ? 'MELA_GOLD' : ''),
      taxes,
      platformFee,
      paymentMethod,
    };

    const res = await apiClient.placeOrder(payload);
    if (res.success) {
      playNotificationSound('success');
      clearCart();
      await refreshOrders();
      setActiveTab('orders');
      return true;
    }
    return false;
  };

  const convertOrderToPrepaid = async (orderId: string): Promise<boolean> => {
    const res = await apiClient.convertCodToPrepaid(orderId);
    if (res.success) {
      playNotificationSound('success');
      await refreshOrders();
      return true;
    }
    return false;
  };

  const reorder = (order: Order) => {
    order.items.forEach((ci) => {
      addToCart(ci.item, ci.selectedCustomizations);
    });
    setCartDrawerOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        catalog,
        categories,
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
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        deliveryFee,
        taxes,
        platformFee,
        discountAmount,
        grandTotal,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        currentLocation,
        setCurrentLocation,
        cities,
        user,
        setUser,
        showLoginModal,
        setShowLoginModal,
        login,
        logout,
        toggleGoldClub,
        updateProfile,
        darkMode,
        setDarkMode,
        activeTab,
        setActiveTab,
        selectedPolicy,
        setSelectedPolicy,
        activeOrder,
        setActiveOrder,
        pastOrders,
        refreshOrders,
        placeOrder,
        convertOrderToPrepaid,
        reorder,
        customizingItem,
        setCustomizingItem,
        cartDrawerOpen,
        setCartDrawerOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
