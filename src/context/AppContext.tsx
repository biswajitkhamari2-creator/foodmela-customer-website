import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CatalogItem, CartItem, Coupon, Order, UserProfile, SelectedCustomization } from '../types';
import { apiClient } from '../api/apiClient';

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
  } catch (e) {
    console.warn('AudioContext pending user interaction', e);
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
  loginWithPhoneEmail: (userJsonUrl: string) => Promise<{ success: boolean; message?: string }>;
  loginWithPhone: (phone: string, otp: string) => Promise<{ success: boolean; message?: string }>;
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
  // Customization Modal
  customizingItem: CatalogItem | null;
  setCustomizingItem: (item: CatalogItem | null) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;

  // Policy Modal
  selectedPolicy: string | null;
  setSelectedPolicy: (policy: string | null) => void;
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
    const saved = localStorage.getItem('foodmela_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentLocation, setCurrentLocation] = useState<string>(() => {
    return localStorage.getItem('foodmela_location') || 'Birmaharajpur, Subarnapur, Odisha';
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
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

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

  // Sample Past Orders Generator (used ONLY if no orders are available)
  // Sample Past Orders Generator (used ONLY if no orders are available)
  const getSampleOrders = (): Order[] => {
    const now = Date.now();
    return [
      {
        id: 'FM-984210',
        items: [
          {
            id: 'sample_item_1',
            item: {
              id: 'cf1',
              name: 'Chicken Biryani',
              category: 'Cooked Food',
              categoryLabel: 'Cooked Food',
              price: 220,
              originalPrice: 260,
              rating: 4.8,
              ratingCount: 3200,
              prepTime: '25 min',
              isVeg: false,
              isBestseller: true,
              description: 'Fragrant dum-style biryani with tender chicken pieces.',
              imageFallbackGradient: 'from-amber-600 via-orange-600 to-red-600',
              image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop',
              type: 'food',
              unit: '1 Plate',
              restaurant: 'Food Mela Kitchen',
            },
            quantity: 2,
            selectedCustomizations: [],
          },
          {
            id: 'sample_item_2',
            item: {
              id: 'sw1',
              name: 'Rasgulla (6 pcs)',
              category: 'Sweets',
              categoryLabel: 'Sweets',
              price: 80,
              originalPrice: 100,
              rating: 4.7,
              ratingCount: 3400,
              prepTime: '5 min',
              isVeg: true,
              isBestseller: true,
              description: 'Spongy, syrupy — the pride of Odisha & Bengal.',
              imageFallbackGradient: 'from-amber-200 via-yellow-300 to-amber-400',
              image: 'https://images.unsplash.com/photo-1601303516534-61dcef5bc3c5?w=600&h=400&fit=crop',
              type: 'food',
              unit: '6 pcs',
              restaurant: 'Food Mela Sweets',
            },
            quantity: 1,
            selectedCustomizations: [],
          },
        ],
        status: 'delivered',
        statusTimestamps: {
          placed: new Date(now - 86400000 * 2).toISOString(),
          preparing: new Date(now - 86400000 * 2 + 300000).toISOString(),
          rider_assigned: new Date(now - 86400000 * 2 + 600000).toISOString(),
          out_for_delivery: new Date(now - 86400000 * 2 + 900000).toISOString(),
          delivered: new Date(now - 86400000 * 2 + 1800000).toISOString(),
        },
        itemTotal: 520,
        deliveryFee: 0,
        taxes: 26,
        platformFee: 0,
        discountAmount: 50,
        totalAmount: 496,
        deliveryAddress: 'Main Road, Birmaharajpur, Odisha',
        paymentMethod: 'UPI / Online Payment',
        rider: {
          name: 'Rahul Kumar',
          phone: '+91 98765 43210',
          vehicleNumber: 'OD 15 HA 8842',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
          pin: '4821',
          lat: 0.5,
          lng: 0.5,
        },
        createdAt: new Date(now - 86400000 * 2).toISOString(),
      },
      {
        id: 'FM-751930',
        items: [
          {
            id: 'sample_item_3',
            item: {
              id: 'vg1',
              name: 'Fresh Tomato',
              category: 'Vegetables',
              categoryLabel: 'Vegetables',
              price: 40,
              originalPrice: 50,
              rating: 4.6,
              ratingCount: 1420,
              prepTime: '15 min',
              isVeg: true,
              isBestseller: true,
              description: 'Firm, ripe tomatoes for curries & salads.',
              imageFallbackGradient: 'from-red-600 via-rose-500 to-amber-500',
              image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=600&h=400&fit=crop',
              type: 'grocery',
              unit: '1 kg',
              restaurant: 'Fresh Sabzi Mandi',
            },
            quantity: 2,
            selectedCustomizations: [],
          },
          {
            id: 'sample_item_4',
            item: {
              id: 'gr1',
              name: 'Basmati Rice (India Gate)',
              category: 'Grocery',
              categoryLabel: 'Grocery',
              price: 180,
              originalPrice: 220,
              rating: 4.7,
              ratingCount: 2400,
              prepTime: '15 min',
              isVeg: true,
              isBestseller: true,
              description: 'Long-grain basmati for perfect pulao.',
              imageFallbackGradient: 'from-amber-200 via-yellow-100 to-amber-300',
              image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop',
              type: 'grocery',
              unit: '1 kg',
              restaurant: 'Daily Grocery Store',
            },
            quantity: 1,
            selectedCustomizations: [],
          },
        ],
        status: 'delivered',
        statusTimestamps: {
          placed: new Date(now - 86400000 * 5).toISOString(),
          preparing: new Date(now - 86400000 * 5 + 300000).toISOString(),
          rider_assigned: new Date(now - 86400000 * 5 + 600000).toISOString(),
          out_for_delivery: new Date(now - 86400000 * 5 + 900000).toISOString(),
          delivered: new Date(now - 86400000 * 5 + 1800000).toISOString(),
        },
        itemTotal: 260,
        deliveryFee: 39,
        taxes: 13,
        platformFee: 5,
        discountAmount: 0,
        totalAmount: 317,
        deliveryAddress: 'Main Road, Birmaharajpur, Odisha',
        paymentMethod: 'Cash on Delivery (COD)',
        rider: {
          name: 'Santosh Jena',
          phone: '+91 98123 45678',
          vehicleNumber: 'OD 15 AB 1234',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          pin: '1920',
          lat: 0.5,
          lng: 0.5,
        },
        createdAt: new Date(now - 86400000 * 5).toISOString(),
      },
    ];
  };

  // Sync User to LocalStorage and fetch server orders
  useEffect(() => {
    if (user) {
      localStorage.setItem('foodmela_user', JSON.stringify(user));
      // Load real orders from backend
      apiClient.getUserOrders(user.phone).then((serverOrders) => {
        if (serverOrders.length > 0) {
          setPastOrders(serverOrders);
        }
      });
    } else {
      localStorage.removeItem('foodmela_user');
    }
  }, [user]);

  // Load Past & Active Orders on start (Add sample history ONLY if not available)
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
      
      // If and only if no orders are available, provide realistic sample past orders
      if (past.length === 0 && !activeId) {
        const samples = getSampleOrders();
        samples.forEach((sample) => {
          localStorage.setItem(`foodmela_order_${sample.id}`, JSON.stringify(sample));
        });
        past.push(...samples);
      }

      past.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPastOrders(past);
    };

    loadOrders();
  }, []);

  // Listen to order updates from backend simulation
  useEffect(() => {
    const handleOrderUpdate = (event: Event) => {
      const updatedOrder = (event as CustomEvent).detail.order as Order;
      const activeId = localStorage.getItem('foodmela_active_order_id');
      
      if (updatedOrder.id === activeId) {
        setActiveOrder(updatedOrder);
        if (updatedOrder.status === 'delivered') {
          playNotificationSound('success');
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

  const isGold = user?.isGoldMember || false;
  const deliveryFee = (isGold || cartTotal > 499) ? 0 : 39;
  const platformFee = isGold ? 0 : 5;
  const taxes = Math.round(cartTotal * 0.05);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      const calculated = (cartTotal * appliedCoupon.value) / 100;
      discountAmount = appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  useEffect(() => {
    if (appliedCoupon && cartTotal < appliedCoupon.minOrderValue) {
      setAppliedCoupon(null);
      setCouponError(`Coupon removed: requires ₹${appliedCoupon.minOrderValue} minimum order value.`);
    }
  }, [cartTotal, appliedCoupon]);

  const goldSavings = isGold ? Math.round(cartTotal * 0.15) : 0;
  const grandTotal = Math.max(0, cartTotal + deliveryFee + taxes + platformFee - discountAmount - goldSavings);

  const addToCart = (
    item: CatalogItem,
    selectedCustomizations: SelectedCustomization[] = [],
    instructions?: string
  ) => {
    playNotificationSound('click');
    setCart((prevCart) => {
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

  // Auth: Official Phone.Email verification
  const loginWithPhoneEmail = useCallback(async (userJsonUrl: string) => {
    const res = await apiClient.verifyPhoneEmail(userJsonUrl);
    if (res.success && res.profile) {
      setUser(res.profile);
      setShowLoginModal(false);
      playNotificationSound('success');
      return { success: true };
    }
    return { success: false, message: res.error || 'Verification failed.' };
  }, []);

  // Auth: Phone/OTP direct
  const loginWithPhone = useCallback(async (phone: string, otp: string) => {
    const res = await apiClient.verifyOTP(phone, otp);
    if (res.success && res.profile) {
      setUser(res.profile);
      setShowLoginModal(false);
      playNotificationSound('success');
      return { success: true };
    }
    return { success: false, message: res.message };
  }, []);

  const login = loginWithPhone;

  const logout = () => {
    setUser(null);
    localStorage.removeItem('foodmela_user');
    localStorage.removeItem('fm_api_token');
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

  const placeOrder = async (paymentMethod: string): Promise<boolean> => {
    if (cart.length === 0) return false;

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
      deliveryAddress: user.savedAddresses[0]?.addressLine || currentLocation || 'Indiranagar, Bengaluru',
      paymentMethod,
    };

    const res = await apiClient.createOrder(orderData);
    if (res.success && res.order) {
      playNotificationSound('success');
      setActiveOrder(res.order);
      clearCart();
      setActiveTab('orders');
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
        loginWithPhoneEmail,
        loginWithPhone,
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
        selectedPolicy,
        setSelectedPolicy,
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
