import { CatalogItem, Coupon, Order, UserProfile, Rider } from '../types';

// Centralised configuration for API base URL
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://foodmela.online/api').replace(/\/$/, '');

// Static Mock Catalog Items
export const MOCK_CATALOG: CatalogItem[] = [
  // --- FOODS ---
  // Biryani Category
  {
    id: 'food_1',
    name: 'Royal Lucknowi Mutton Biryani',
    category: 'Biryani',
    price: 389,
    originalPrice: 489,
    rating: 4.8,
    ratingCount: 1420,
    prepTime: '25 min',
    isVeg: false,
    isBestseller: true,
    description: 'Slow-cooked fragrant basmati rice with tender mutton pieces infused with royal spices, mace, and vetiver water, served with rich mint raita.',
    imageFallbackGradient: 'from-amber-600 via-orange-500 to-red-600',
    type: 'food',
    restaurant: 'Dastarkhwan-E-Awadh',
    customizationOptions: [
      {
        name: 'Portion Size',
        type: 'radio',
        choices: [
          { name: 'Regular (Serves 1)', price: 0 },
          { name: 'Double (Serves 2-3)', price: 180 },
        ],
      },
      {
        name: 'Choice of Raita',
        type: 'radio',
        choices: [
          { name: 'Mint Raita', price: 0 },
          { name: 'Burani Garlic Raita', price: 20 },
          { name: 'No Raita', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'food_2',
    name: 'Sufiyana Paneer Dum Biryani',
    category: 'Biryani',
    price: 299,
    originalPrice: 349,
    rating: 4.6,
    ratingCount: 840,
    prepTime: '20 min',
    isVeg: true,
    isBestseller: false,
    description: 'Rich white-spiced fragrant rice loaded with creamy marinated paneer cubes, fresh green peas, saffron, and cream.',
    imageFallbackGradient: 'from-amber-500 via-yellow-400 to-emerald-600',
    type: 'food',
    restaurant: 'The Biryani Durbar',
    customizationOptions: [
      {
        name: 'Spice Level',
        type: 'radio',
        choices: [
          { name: 'Mild & Fragrant', price: 0 },
          { name: 'Classic Medium', price: 0 },
          { name: 'Hot Szechuan Touch', price: 15 },
        ],
      },
    ],
  },

  // North Indian Category
  {
    id: 'food_3',
    name: 'Paneer Butter Masala & Garlic Naan Feast',
    category: 'North Indian',
    price: 319,
    originalPrice: 399,
    rating: 4.9,
    ratingCount: 3110,
    prepTime: '20 min',
    isVeg: true,
    isBestseller: true,
    description: 'Rich, smooth, velvety cashew and tomato gravy with soft paneer chunks. Accompanied by two butter-soaked fresh Garlic Naans.',
    imageFallbackGradient: 'from-orange-500 via-red-500 to-yellow-500',
    type: 'food',
    restaurant: 'Pind Balluchi Express',
    customizationOptions: [
      {
        name: 'Extra Gravy',
        type: 'checkbox',
        choices: [
          { name: 'Add Extra Gravy Bowl', price: 60 },
          { name: 'Extra Butter Dollop', price: 20 },
        ],
      },
    ],
  },
  {
    id: 'food_4',
    name: 'Amritsari Dal Makhani (Slow Cooked)',
    category: 'North Indian',
    price: 229,
    originalPrice: 269,
    rating: 4.7,
    ratingCount: 1950,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Black lentils slow-cooked overnight for 18 hours over charcoal embers, finished with real churned white butter and cream.',
    imageFallbackGradient: 'from-neutral-800 via-orange-950 to-red-905',
    type: 'food',
    restaurant: 'Sher-E-Punjab',
  },

  // Sweets & Mithai Category
  {
    id: 'food_5',
    name: 'Premium Artisanal Kaju Katli Gold',
    category: 'Sweets & Mithai',
    price: 449,
    originalPrice: 599,
    rating: 4.9,
    ratingCount: 2210,
    prepTime: '10 min',
    isVeg: true,
    isBestseller: true,
    description: 'Luxury diamond-cut cashew fudge made with premium Goan cashews, minimal sugar, and topped with 100% pure edible silver leaf.',
    imageFallbackGradient: 'from-slate-100 via-amber-100 to-yellow-200',
    type: 'food',
    unit: '250g Box',
    restaurant: 'Haldiram’s Boutique',
  },
  {
    id: 'food_6',
    name: 'Moist Saffron Angoori Gulab Jamun',
    category: 'Sweets & Mithai',
    price: 189,
    originalPrice: 229,
    rating: 4.8,
    ratingCount: 1540,
    prepTime: '10 min',
    isVeg: true,
    isBestseller: true,
    description: 'Bite-sized soft milk solid dumplings soaked in cardamom and Kashmiri saffron sugar syrup. Served warm (6 pieces).',
    imageFallbackGradient: 'from-orange-600 via-red-600 to-amber-700',
    type: 'food',
    unit: '6 pcs',
    restaurant: 'Kanhaiya Sweets Since 1952',
  },

  // Street Food Category
  {
    id: 'food_7',
    name: 'Dahi Bhalla Samosa Chaat Platter',
    category: 'Street Food',
    price: 159,
    originalPrice: 199,
    rating: 4.7,
    ratingCount: 2890,
    prepTime: '12 min',
    isVeg: true,
    isBestseller: true,
    description: 'Crispy potato samosas crushed and layered with soft lentil dumplings, cold spiced yogurt, spicy mint chutney, tangy sweet tamarind, and sev.',
    imageFallbackGradient: 'from-yellow-500 via-red-500 to-emerald-600',
    type: 'food',
    restaurant: 'Chaat Bazaar',
  },
  {
    id: 'food_8',
    name: 'Street Special Chilli Paneer Dry',
    category: 'Street Food',
    price: 249,
    originalPrice: 299,
    rating: 4.5,
    ratingCount: 960,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: false,
    description: 'Indo-Chinese street side preparation. Crisp fried paneer cubes tossed with spring onion, bell peppers, soy sauce, and fiery green chilies.',
    imageFallbackGradient: 'from-emerald-800 via-red-700 to-neutral-900',
    type: 'food',
    restaurant: 'Chinatown Express',
  },

  // Beverages Category
  {
    id: 'food_9',
    name: 'Alphonso Mango Lassi (Thick)',
    category: 'Beverages',
    price: 119,
    originalPrice: 149,
    rating: 4.8,
    ratingCount: 1320,
    prepTime: '8 min',
    isVeg: true,
    isBestseller: true,
    description: 'Thick, creamy, churned yogurt drink sweetened with fresh, aromatic Alphonso mango pulp and saffron.',
    imageFallbackGradient: 'from-amber-400 via-orange-400 to-yellow-500',
    type: 'food',
    unit: '300ml Glass',
    restaurant: 'The Lassi Bar',
  },

  // --- GROCERIES ---
  // Fruits & Vegetables Category
  {
    id: 'grocery_1',
    name: 'Organic Shimla Royal Apples',
    category: 'Groceries',
    price: 179,
    originalPrice: 220,
    rating: 4.7,
    ratingCount: 450,
    prepTime: '15 min',
    isVeg: true,
    description: 'Crisp, sweet, and highly nutritious fresh red apples hand-plucked from organic orchards in Shimla.',
    imageFallbackGradient: 'from-red-600 via-red-500 to-rose-400',
    type: 'grocery',
    unit: '1 kg (4-5 pcs)',
    restaurant: 'Mela Fresh Farms',
  },
  {
    id: 'grocery_2',
    name: 'Hydroponic Baby Spinach Leaves',
    category: 'Groceries',
    price: 49,
    originalPrice: 65,
    rating: 4.9,
    ratingCount: 890,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Pre-washed, chemical-free baby spinach leaves rich in iron and minerals. Directly sourced from tech-enabled hydroponic farms.',
    imageFallbackGradient: 'from-emerald-700 via-green-500 to-teal-600',
    type: 'grocery',
    unit: '200g Pack',
    restaurant: 'Mela Fresh Farms',
  },

  // Dairy & Spices Category
  {
    id: 'grocery_3',
    name: 'Amul Gold Premium Pasteurized Butter',
    category: 'Groceries',
    price: 275,
    originalPrice: 285,
    rating: 4.9,
    ratingCount: 5200,
    prepTime: '15 min',
    isVeg: true,
    description: 'The taste of India. Classic salted cream butter, rich in flavor, perfect for cooking, baking, and spreading on warm naans.',
    imageFallbackGradient: 'from-yellow-400 via-amber-300 to-yellow-100',
    type: 'grocery',
    unit: '500g Pack',
    restaurant: 'Mela Supermarket',
  },
  {
    id: 'grocery_4',
    name: 'Malai Paneer Block (Fresh)',
    category: 'Groceries',
    price: 90,
    originalPrice: 105,
    rating: 4.8,
    ratingCount: 1840,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Super soft and creamy malai paneer block made with pasteurized milk. Melt-in-your-mouth texture with high protein content.',
    imageFallbackGradient: 'from-slate-100 via-slate-200 to-neutral-100',
    type: 'grocery',
    unit: '200g Pack',
    restaurant: 'Mela Supermarket',
  },
];

// Mock Coupons list
export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'MELA50',
    discountType: 'percentage',
    value: 50,
    minOrderValue: 199,
    maxDiscount: 120,
    description: '50% OFF on your premium order up to ₹120!',
  },
  {
    code: 'GOLD20',
    discountType: 'percentage',
    value: 20,
    minOrderValue: 299,
    description: '20% OFF flat with no upper cap for our food connoisseurs!',
  },
  {
    code: 'FESTIVE100',
    discountType: 'fixed',
    value: 100,
    minOrderValue: 499,
    description: 'Flat ₹100 discount on big festive family gatherings!',
  },
];

// Helper to sleep / simulate latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiClient = {
  // 1. Get food & grocery catalog items
  async getCatalog(): Promise<{ items: CatalogItem[]; categories: string[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/catalog`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API /catalog failed or offline, returning mock data.', e);
    }
    // Mock Fallback
    await delay(350);
    const categories = Array.from(new Set(MOCK_CATALOG.map((item) => item.category)));
    return { items: MOCK_CATALOG, categories };
  },

  // 2. Auth: Send OTP
  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/phone/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API send-otp failed, falling back to mock behavior.', e);
    }
    await delay(600);
    return { success: true, message: 'Mock OTP sent successfully. (Use code: 1234)' };
  },

  // 3. Auth: Verify OTP
  async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; profile?: UserProfile; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/phone/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API verify-otp failed, falling back to mock behavior.', e);
    }

    await delay(700);
    if (otp === '1234') {
      const profile: UserProfile = {
        phone,
        name: 'Gourmet Lover',
        email: 'gourmet.lover@foodmela.online',
        isGoldMember: false,
        savedAddresses: [
          {
            id: 'addr_1',
            label: 'Home',
            addressLine: 'Apt 402, Golden Spires, Saffron Hills',
            city: 'Bengaluru',
          },
          {
            id: 'addr_2',
            label: 'Work',
            addressLine: '9th Floor, Emerald Tech Park, Outer Ring Road',
            city: 'Bengaluru',
          },
        ],
      };
      return { success: true, profile };
    }
    return { success: false, message: 'Incorrect OTP. Please use 1234 to verify.' };
  },

  // 4. Coupons: Validate coupon
  async applyCoupon(code: string, orderValue: number): Promise<{ success: boolean; coupon?: Coupon; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/coupons/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderValue }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API apply-coupon failed, falling back to local verification.', e);
    }

    await delay(300);
    const coupon = MOCK_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code. Try MELA50, GOLD20, or FESTIVE100.' };
    }
    if (orderValue < coupon.minOrderValue) {
      return {
        success: false,
        message: `Min. order value for ${coupon.code} is ₹${coupon.minOrderValue}. Add ₹${coupon.minOrderValue - orderValue} more.`,
      };
    }
    return { success: true, coupon };
  },

  // 5. Place order
  async createOrder(orderData: Partial<Order>): Promise<{ success: boolean; order?: Order; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API create-order failed, falling back to mock tracking generator.', e);
    }

    await delay(1200);

    const orderId = `MELA-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
    
    // Create detailed mock rider
    const mockRider: Rider = {
      name: 'Rahul Kumar',
      phone: '+91 98765 43210',
      vehicleNumber: 'KA-03-HA-8842',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', // safe avatar placeholder with standard alt
      pin: String(Math.floor(1000 + Math.random() * 9000)),
      lat: 0.1,
      lng: 0.9,
    };

    const newOrder: Order = {
      id: orderId,
      items: orderData.items || [],
      status: 'placed',
      statusTimestamps: { placed: now },
      itemTotal: orderData.itemTotal || 0,
      deliveryFee: orderData.deliveryFee || 0,
      taxes: orderData.taxes || 0,
      platformFee: orderData.platformFee || 0,
      discountAmount: orderData.discountAmount || 0,
      totalAmount: orderData.totalAmount || 0,
      deliveryAddress: orderData.deliveryAddress || 'Home Address',
      paymentMethod: orderData.paymentMethod || 'UPI',
      rider: mockRider,
      createdAt: now,
    };

    // Save this order in local storage to simulate persistence
    localStorage.setItem(`foodmela_order_${orderId}`, JSON.stringify(newOrder));
    localStorage.setItem('foodmela_active_order_id', orderId);

    // Initialize simulation process in background
    this.startLocalRiderSimulation(orderId);

    return { success: true, order: newOrder };
  },

  // 6. Get live order tracking details
  async getOrderStatus(orderId: string): Promise<{ success: boolean; order?: Order }> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Local storage fallback
    }

    const orderJson = localStorage.getItem(`foodmela_order_${orderId}`);
    if (orderJson) {
      const order = JSON.parse(orderJson) as Order;
      return { success: true, order };
    }
    return { success: false };
  },

  // Simulate rider GPS & status progression locally (15-20s cycles for testing fast transitions)
  startLocalRiderSimulation(orderId: string) {
    let ticks = 0;
    const interval = setInterval(() => {
      const orderJson = localStorage.getItem(`foodmela_order_${orderId}`);
      if (!orderJson) {
        clearInterval(interval);
        return;
      }

      const order = JSON.parse(orderJson) as Order;
      const now = new Date().toISOString();

      if (order.status === 'placed') {
        order.status = 'preparing';
        order.statusTimestamps.preparing = now;
      } else if (order.status === 'preparing') {
        order.status = 'rider_assigned';
        order.statusTimestamps.rider_assigned = now;
      } else if (order.status === 'rider_assigned') {
        order.status = 'out_for_delivery';
        order.statusTimestamps.out_for_delivery = now;
        if (order.rider) {
          order.rider.lat = 0.2;
          order.rider.lng = 0.8;
        }
      } else if (order.status === 'out_for_delivery') {
        ticks += 1;
        if (order.rider) {
          // Progress rider position closer to destination (0.8, 0.2)
          order.rider.lat = 0.2 + (0.6 * ticks) / 4;
          order.rider.lng = 0.8 - (0.6 * ticks) / 4;
        }

        if (ticks >= 4) {
          order.status = 'delivered';
          order.statusTimestamps.delivered = now;
          if (order.rider) {
            order.rider.lat = 0.8;
            order.rider.lng = 0.2;
          }
          clearInterval(interval);
          // Clean up active order identifier
          localStorage.removeItem('foodmela_active_order_id');
        }
      } else if (order.status === 'delivered') {
        clearInterval(interval);
      }

      localStorage.setItem(`foodmela_order_${orderId}`, JSON.stringify(order));
      
      // Dispatch a storage event or a custom window event so any listening React hooks immediately update!
      window.dispatchEvent(new CustomEvent('foodmela_order_update', { detail: { order } }));
    }, 6000); // Transitions occur every 6 seconds for dynamic visuals during demo!
  },
};
