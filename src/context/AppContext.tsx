import React, { createContext, useContext, useState, useEffect } from 'react';
import { CatalogItem, CartItem, Coupon, Order, UserProfile, SelectedCustomization } from '../types';
import { apiClient } from '../api/apiClient';

// Premium Audio Synthesis for App Sound Effects (Haptic UI Dings & Order Success Chimes)
export const playNotificationSound = (type: 'success' | 'click' | 'remove') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === 'success') {
      // Elegant dual-bell gourmet chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.23); // C6
      gain2.gain.setValueAtTime(0.12, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.6);
    } else if (type === 'click') {
      // Light tactile click
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
      // Muted drop click
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
  } catch (e) {
    console.warn('Browser AudioContext blocked until user interaction occurs', e);
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

  // Checkout Calculations
  deliveryFee: number;
  taxes: number;
  platformFee: number;
  discountAmount: number;
  grandTotal: number;

  // Coupons State
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

  // Order & Tracking State
  activeOrder: Order | null;
  setActiveOrder: (o: Order | null) => void;
  pastOrders: Order[];
  placeOrder: (paymentMethod: string) => Promise<boolean>;
  reorder: (order: Order) => void;

  // Customization Modal
  customizingItem: CatalogItem | null;
  setCustomizingItem: (item: CatalogItem | null) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('foodmela_dark') === 'true';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('foodmela_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('foodmela_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentLocation, setCurrentLocation] = useState<string>(() => {
    return localStorage.getItem('foodmela_location') || 'Indiranagar, Bengaluru';
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);

  // Navigation and UI
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'orders' | 'profile' | 'cart'>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [customizingItem, setCustomizingItem] = useState<CatalogItem | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Catalog State
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState<boolean>(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [ratingFilter, setRatingFilter] = useState(false);

  const cities = ['Bengaluru', 'Mumbai', 'New Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];

  // Initialize Catalog
  useEffect(() => {
    const loadCatalog = async () => {
      setLoadingCatalog(true);
      const res = await apiClient.getCatalog();
      setCatalog(res.items);
      setCategories(['All', ...res.categories]);
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

  // Load Past & Active Orders on start
  useEffect(() => {
    const loadOrders = () => {
      const past: Order[] = [];
      const activeId = localStorage.getItem('foodmela_active_order_id');
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('foodmela_order_')) {
          try {
            const order = JSON.parse(localStorage.getItem(key)!) as Order;
            if (order.id === activeId) {
              setActiveOrder(order);
              // Re-start simulation if it is currently active
              if (order.status !== 'delivered') {
                apiClient.startLocalRiderSimulation(order.id);
              }
            } else {
              past.push(order);
            }
          } catch (e) {
            console.error('Error parsing stored order', e);
          }
        }
      }
      
      // Sort past orders by creation time descending
      past.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPastOrders(past);
    };

    loadOrders();
  }, []);

  // Listen to order updates from the background simulation
  useEffect(() => {
    const handleOrderUpdate = (event: Event) => {
      const updatedOrder = (event as CustomEvent).detail.order as Order;
      const activeId = localStorage.getItem('foodmela_active_order_id');
      
      if (updatedOrder.id === activeId) {
        setActiveOrder(updatedOrder);
        if (updatedOrder.status === 'delivered') {
          // Play chime when driver arrives!
          playNotificationSound('success');
          // Update past orders list
          setPastOrders((prev) => [updatedOrder, ...prev]);
        }
      }
    };

    window.addEventListener('foodmela_order_update', handleOrderUpdate);
    return () => window.removeEventListener('foodmela_order_update', handleOrderUpdate);
  }, []);

  // Compute Cart Statistics
  const cartTotal = cart.reduce((total, item) => {
    const customPrice = item.selectedCustomizations.reduce((acc, c) => acc + c.price, 0);
    return total + (item.item.price + customPrice) * item.quantity;
  }, 0);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout pricing model based on user and club configurations
  // 1. Delivery Fee: ₹39 (Free for Gold Club Members or orders > ₹499)
  const isGold = user?.isGoldMember || false;
  const deliveryFee = (isGold || cartTotal > 499) ? 0 : 39;

  // 2. Platform Fee: Fixed flat ₹5 (discounted to ₹0 for gold)
  const platformFee = isGold ? 0 : 5;

  // 3. Taxes and Restaurant GST: 18% of cart total
  const taxes = Math.round(cartTotal * 0.05); // 5% GST for standard Indian food delivery

  // 4. Coupon discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      const calculated = (cartTotal * appliedCoupon.value) / 100;
      discountAmount = appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  // Double check minimum thresholds
  useEffect(() => {
    if (appliedCoupon && cartTotal < appliedCoupon.minOrderValue) {
      setAppliedCoupon(null);
      setCouponError(`Coupon removed: requires ₹${appliedCoupon.minOrderValue} minimum order value.`);
    }
  }, [cartTotal, appliedCoupon]);

  // 5. Grand Total (Gold club member automatically gets an extra 20% flat food discount if no coupon, or combined)
  const goldSavings = isGold ? Math.round(cartTotal * 0.15) : 0; // Flat 15% off menu items for gold
  const grandTotal = Math.max(0, cartTotal + deliveryFee + taxes + platformFee - discountAmount - goldSavings);

  // Cart Handlers
  const addToCart = (
    item: CatalogItem,
    selectedCustomizations: SelectedCustomization[] = [],
    instructions?: string
  ) => {
    playNotificationSound('click');
    setCart((prevCart) => {
      // Generate unique cart item key from customizations to handle duplicate items with different options separately
      const customKey = [
        item.id,
        ...selectedCustomizations.map((c) => `${c.optionName}:${c.choiceName}`).sort()
      ].join('|');

      const existingIndex = prevCart.findIndex((ci) => {
        const ciKey = [
          ci.item.id,
          ...ci.selectedCustomizations.map((c) => `${c.optionName}:${c.choiceName}`).sort()
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
    setCart((prev) => prev.filter((ci) => ci.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    playNotificationSound('click');
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.id === cartItemId) {
            const newQ = ci.quantity + delta;
            return { ...ci, quantity: newQ };
          }
          return ci;
        })
        .filter((ci) => ci.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon apply
  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    const res = await apiClient.applyCoupon(code, cartTotal);
    if (res.success && res.coupon) {
      setAppliedCoupon(res.coupon);
      playNotificationSound('success');
      return true;
    } else {
      setCouponError(res.message || 'Error applying coupon.');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Auth Handlers
  const login = async (phone: string, otp: string) => {
    const res = await apiClient.verifyOTP(phone, otp);
    if (res.success && res.profile) {
      setUser(res.profile);
      setShowLoginModal(false);
      playNotificationSound('success');
      return { success: true };
    }
    return { success: false, message: res.message };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('foodmela_user');
    // Clear active order references too if any
    localStorage.removeItem('foodmela_active_order_id');
    setActiveOrder(null);
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

  // Create active order
  const placeOrder = async (paymentMethod: string): Promise<boolean> => {
    if (cart.length === 0) return false;

    // Force login if guest
    if (!user) {
      setShowLoginModal(true);
      return false;
    }

    const orderData: Partial<Order> = {
      items: cart,
      itemTotal: cartTotal,
      deliveryFee,
      taxes,
      platformFee,
      discountAmount: discountAmount + (isGold ? goldSavings : 0),
      totalAmount: grandTotal,
      deliveryAddress: user.savedAddresses[0]?.addressLine || 'Indiranagar, Bengaluru',
      paymentMethod,
    };

    const res = await apiClient.createOrder(orderData);
    if (res.success && res.order) {
      playNotificationSound('success');
      setActiveOrder(res.order);
      clearCart();
      setActiveTab('orders'); // Jump to live tracker
      return true;
    }
    return false;
  };

  const reorder = (order: Order) => {
    order.items.forEach((ci) => {
      addToCart(ci.item, ci.selectedCustomizations, ci.instructions);
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
        discountAmount: discountAmount + goldSavings,
        grandTotal,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        currentLocation,
        setCurrentLocation,
        cities,
        user,
        showLoginModal,
        setShowLoginModal,
        login,
        logout,
        toggleGoldClub,
        darkMode,
        setDarkMode,
        activeTab,
        setActiveTab,
        activeOrder,
        setActiveOrder,
        pastOrders,
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
