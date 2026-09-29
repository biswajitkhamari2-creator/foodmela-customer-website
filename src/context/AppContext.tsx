import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CatalogItem, CartItem, Coupon, Order, UserProfile, SelectedCustomization } from '../types';
import { apiClient, MOCK_CATALOG, MOCK_COUPONS } from '../api/apiClient';

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
    const saved = localStorage.getItem('foodmela_cart');
    return saved ? JSON.parse(saved) : [];
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

  // Catalog State
  const [catalog, setCatalog] = useState<CatalogItem[]>(MOCK_CATALOG);
  const [categories, setCategories] = useState<string[]>([
    'All',
    'Vegetables',
    'Fruits',
    'Dairy & Staples',
    'Energy & Breakfast',
    'Quick Munch & Chips',
    'Regional Sweets',
    'Snacks & Bakery',
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
      setCatalog(items);
      const uniqueCategories = Array.from(new Set(items.map((i) => i.category || 'Grocery')));
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

  // Place order to backend & Firestore
  const placeOrder = async (paymentMethod: string, customAddress?: string): Promise<boolean> => {
    if (cart.length === 0) return false;

    if (!user) {
      setShowLoginModal(true);
      return false;
    }

    const deliveryAddress = customAddress || user.address || currentLocation || 'Birmaharajpur, Subarnapur, Odisha - 767018';

    const payload = {
      customerName: user.name || 'Food Mela Customer',
      phone: user.phone,
      address: deliveryAddress,
      items: cart.map((ci) => ({
        itemId: ci.item.id,
        name: ci.item.name,
        quantity: ci.quantity,
        price: ci.item.price,
        totalPrice: ci.item.price * ci.quantity,
      })),
      totalAmount: grandTotal,
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
