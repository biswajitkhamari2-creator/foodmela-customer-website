import { CatalogItem, Coupon, Order, UserProfile, Rider } from '../types';

// Centralised configuration for Food Mela Backend API
const BASE_URL = (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || 'https://food-mela-backend.vercel.app').replace(/\/$/, '');

// EXACT products strictly from foodmela.online (7_Customer_Website/src/data/catalog.ts)
export const MOCK_CATALOG: CatalogItem[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // 1. VEGETABLES
  // ══════════════════════════════════════════════════════════════════════════
  {
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
  {
    id: 'vg2',
    name: 'Potato',
    category: 'Vegetables',
    categoryLabel: 'Vegetables',
    price: 30,
    originalPrice: 38,
    rating: 4.4,
    ratingCount: 1980,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Everyday potatoes, farm-fresh stock.',
    imageFallbackGradient: 'from-amber-600 via-yellow-600 to-stone-600',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '1 kg',
    restaurant: 'Fresh Sabzi Mandi',
  },
  {
    id: 'vg3',
    name: 'Onion',
    category: 'Vegetables',
    categoryLabel: 'Vegetables',
    price: 35,
    originalPrice: 45,
    rating: 4.3,
    ratingCount: 2200,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Sharp, juicy onions for tadka & salads.',
    imageFallbackGradient: 'from-purple-600 via-pink-600 to-amber-600',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '1 kg',
    restaurant: 'Fresh Sabzi Mandi',
  },
  {
    id: 'vg4',
    name: 'Brinjal (Baingan)',
    category: 'Vegetables',
    categoryLabel: 'Vegetables',
    price: 30,
    originalPrice: 40,
    rating: 4.5,
    ratingCount: 860,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: false,
    description: 'Glossy brinjals, perfect for bharta.',
    imageFallbackGradient: 'from-purple-800 via-indigo-700 to-violet-600',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '500g',
    restaurant: 'Fresh Sabzi Mandi',
  },
  {
    id: 'vg5',
    name: 'Cabbage (Pattagobi)',
    category: 'Vegetables',
    categoryLabel: 'Vegetables',
    price: 30,
    originalPrice: 40,
    rating: 4.4,
    ratingCount: 750,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: false,
    description: 'Crunchy cabbage for sabzi & rolls.',
    imageFallbackGradient: 'from-emerald-600 via-green-500 to-teal-600',
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '1 pc',
    restaurant: 'Fresh Sabzi Mandi',
  },
  {
    id: 'vg6',
    name: 'Cauliflower (Phoolgobi)',
    category: 'Vegetables',
    categoryLabel: 'Vegetables',
    price: 35,
    originalPrice: 45,
    rating: 4.6,
    ratingCount: 1100,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Tight white florets, farm-picked.',
    imageFallbackGradient: 'from-lime-600 via-emerald-500 to-amber-400',
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '1 pc',
    restaurant: 'Fresh Sabzi Mandi',
  },
  {
    id: 'vg7',
    name: 'Lady Finger (Bhindi)',
    category: 'Vegetables',
    categoryLabel: 'Vegetables',
    price: 40,
    originalPrice: 50,
    rating: 4.3,
    ratingCount: 920,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: false,
    description: 'Tender bhindi, no strings attached.',
    imageFallbackGradient: 'from-green-700 via-emerald-600 to-teal-500',
    image: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '500g',
    restaurant: 'Fresh Sabzi Mandi',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 2. FRUITS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fr1',
    name: 'Banana (Dozen)',
    category: 'Fruits',
    categoryLabel: 'Fruits',
    price: 50,
    originalPrice: 60,
    rating: 4.5,
    ratingCount: 1300,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Sweet, energy-packed — a dozen full.',
    imageFallbackGradient: 'from-yellow-400 via-amber-400 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '1 Dozen',
    restaurant: 'Fresh Fruit Corner',
  },
  {
    id: 'fr2',
    name: 'Apple',
    category: 'Fruits',
    categoryLabel: 'Fruits',
    price: 160,
    originalPrice: 200,
    rating: 4.6,
    ratingCount: 880,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Crisp, juicy apples, hand-picked.',
    imageFallbackGradient: 'from-red-600 via-rose-600 to-red-700',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '1 kg',
    restaurant: 'Fresh Fruit Corner',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 3. GROCERY & STAPLES
  // ══════════════════════════════════════════════════════════════════════════
  {
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
  {
    id: 'gr2',
    name: 'Refined Oil (Fortune)',
    category: 'Grocery',
    categoryLabel: 'Grocery',
    price: 145,
    originalPrice: 175,
    rating: 4.5,
    ratingCount: 3100,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Light refined oil for everyday cooking.',
    imageFallbackGradient: 'from-yellow-400 via-amber-500 to-orange-400',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '1 L',
    restaurant: 'Daily Grocery Store',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 4. DAIRY
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'da2',
    name: 'Paneer (Fresh)',
    category: 'Dairy',
    categoryLabel: 'Dairy',
    price: 80,
    originalPrice: 95,
    rating: 4.6,
    ratingCount: 1650,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Soft fresh paneer, made daily.',
    imageFallbackGradient: 'from-stone-100 via-white to-amber-100',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '200g',
    restaurant: 'Daily Dairy Store',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 5. EGGS & MEAT
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'em1',
    name: 'Farm Eggs',
    category: 'Eggs & Meat',
    categoryLabel: 'Eggs & Meat',
    price: 72,
    originalPrice: 85,
    rating: 4.7,
    ratingCount: 2800,
    prepTime: '15 min',
    isVeg: false,
    isBestseller: true,
    description: 'Protein-rich farm eggs.',
    imageFallbackGradient: 'from-amber-100 via-orange-100 to-amber-200',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '6 pcs',
    restaurant: 'Daily Grocery Store',
  },
  {
    id: 'em2',
    name: 'Chicken (Boneless)',
    category: 'Eggs & Meat',
    categoryLabel: 'Eggs & Meat',
    price: 320,
    originalPrice: 380,
    rating: 4.6,
    ratingCount: 1750,
    prepTime: '15 min',
    isVeg: false,
    isBestseller: true,
    description: 'Tender boneless chicken, cleaned fresh.',
    imageFallbackGradient: 'from-red-600 via-rose-500 to-red-700',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '1 kg',
    restaurant: 'Daily Grocery Store',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 6. COOKED FOOD
  // ══════════════════════════════════════════════════════════════════════════
  {
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
  {
    id: 'cf2',
    name: 'Paneer Butter Masala',
    category: 'Cooked Food',
    categoryLabel: 'Cooked Food',
    price: 180,
    originalPrice: 220,
    rating: 4.6,
    ratingCount: 2100,
    prepTime: '20 min',
    isVeg: true,
    isBestseller: true,
    description: 'Creamy tomato gravy with soft paneer cubes.',
    imageFallbackGradient: 'from-orange-500 via-red-500 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop',
    type: 'food',
    unit: '1 Bowl',
    restaurant: 'Food Mela Kitchen',
  },
  {
    id: 'cf3',
    name: 'Dal Makhani',
    category: 'Cooked Food',
    categoryLabel: 'Cooked Food',
    price: 150,
    originalPrice: 180,
    rating: 4.5,
    ratingCount: 1600,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: false,
    description: 'Slow-cooked black dal, rich and homely.',
    imageFallbackGradient: 'from-stone-700 via-amber-800 to-yellow-800',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop',
    type: 'food',
    unit: '1 Bowl',
    restaurant: 'Food Mela Kitchen',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 7. NON-VEG CURRIES
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'cf4',
    name: 'Mutton Curry',
    category: 'Non-Veg',
    categoryLabel: 'Non-Veg',
    price: 280,
    originalPrice: 340,
    rating: 4.7,
    ratingCount: 1900,
    prepTime: '30 min',
    isVeg: false,
    isBestseller: true,
    description: 'Hearty mutton curry, village-style spices.',
    imageFallbackGradient: 'from-red-800 via-amber-800 to-orange-800',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop',
    type: 'food',
    unit: '1 Bowl',
    restaurant: 'Food Mela Kitchen',
  },
  {
    id: 'cf5',
    name: 'Fish Curry',
    category: 'Non-Veg',
    categoryLabel: 'Non-Veg',
    price: 240,
    originalPrice: 290,
    rating: 4.6,
    ratingCount: 1250,
    prepTime: '20 min',
    isVeg: false,
    isBestseller: false,
    description: 'Tangy Odia-style fish curry, fresh catch.',
    imageFallbackGradient: 'from-orange-600 via-red-600 to-yellow-600',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    type: 'food',
    unit: '1 Bowl',
    restaurant: 'Food Mela Kitchen',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 8. SWEETS
  // ══════════════════════════════════════════════════════════════════════════
  {
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
  {
    id: 'sw2',
    name: 'Gulab Jamun (6 pcs)',
    category: 'Sweets',
    categoryLabel: 'Sweets',
    price: 70,
    originalPrice: 90,
    rating: 4.5,
    ratingCount: 2600,
    prepTime: '5 min',
    isVeg: true,
    isBestseller: true,
    description: 'Warm, soft dumplings in rose syrup.',
    imageFallbackGradient: 'from-amber-800 via-yellow-800 to-red-800',
    image: 'https://images.unsplash.com/photo-1625961332071-f1673bbc4e78?w=600&h=400&fit=crop',
    type: 'food',
    unit: '6 pcs',
    restaurant: 'Food Mela Sweets',
  },
  {
    id: 'sw3',
    name: 'Kheer (250ml)',
    category: 'Sweets',
    categoryLabel: 'Sweets',
    price: 60,
    originalPrice: 75,
    rating: 4.4,
    ratingCount: 1400,
    prepTime: '5 min',
    isVeg: true,
    isBestseller: false,
    description: 'Slow-simmered rice pudding, served fresh.',
    imageFallbackGradient: 'from-yellow-100 via-amber-100 to-yellow-200',
    image: 'https://files.catbox.moe/n9vchw.jpg',
    type: 'food',
    unit: '250ml',
    restaurant: 'Food Mela Sweets',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 9. SNACKS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'sn1',
    name: 'Samosa (4 pcs)',
    category: 'Snacks',
    categoryLabel: 'Snacks',
    price: 40,
    originalPrice: 50,
    rating: 4.5,
    ratingCount: 2900,
    prepTime: '10 min',
    isVeg: true,
    isBestseller: true,
    description: 'Crispy, golden, stuffed with spiced aloo.',
    imageFallbackGradient: 'from-amber-500 via-orange-500 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop',
    type: 'food',
    unit: '4 pcs',
    restaurant: 'Food Mela Snacks',
  },
  {
    id: 'sn2',
    name: 'Aloo Tikki (4 pcs)',
    category: 'Snacks',
    categoryLabel: 'Snacks',
    price: 50,
    originalPrice: 65,
    rating: 4.3,
    ratingCount: 1500,
    prepTime: '10 min',
    isVeg: true,
    isBestseller: false,
    description: 'Crisp outside, soft inside — chaat-style.',
    imageFallbackGradient: 'from-orange-600 via-amber-600 to-yellow-600',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop',
    type: 'food',
    unit: '4 pcs',
    restaurant: 'Food Mela Snacks',
  },
];

// Active Coupons List
export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'MELA50',
    discountType: 'percentage',
    value: 50,
    maxDiscount: 100,
    minOrderValue: 199,
    description: '50% OFF up to ₹100 on your gourmet food orders!',
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

// Helper for backend requests with auth token support
async function backendReq<T>(path: string, init?: RequestInit, auth = false): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    try {
      const t = localStorage.getItem('fm_api_token') || sessionStorage.getItem('fm_api_token');
      if (t) headers.Authorization = `Bearer ${t}`;
    } catch { /* ignore */ }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...init,
  });
  if (!res.ok) throw new Error(`Backend error ${res.status}`);
  return res.json() as Promise<T>;
}

export const apiClient = {
  // 1. Get food & grocery catalog items
  async getCatalog(): Promise<{ items: CatalogItem[]; categories: string[] }> {
    try {
      const response = await fetch(`${BASE_URL}/api/catalog`);
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          return data;
        }
      }
    } catch (e) {
      console.warn('Backend /api/catalog fallback to local app catalog.', e);
    }
    const categories = Array.from(new Set(MOCK_CATALOG.map((item) => item.category)));
    return { items: MOCK_CATALOG, categories };
  },

  // 2. Auth: Phone.Email OTP Verification (Exact same as foodmela.online)
  async verifyPhoneEmail(userJsonUrl: string): Promise<{
    success: boolean;
    phone: string;
    name: string | null;
    address?: string;
    jwt: string | null;
    apiToken?: string;
    profile?: UserProfile;
    error?: string;
  }> {
    try {
      const res = await backendReq<{
        success: boolean;
        phone: string;
        name: string | null;
        address?: string;
        jwt: string | null;
        apiToken?: string;
        error?: string;
      }>('/api/auth/phone-email/verify', {
        method: 'POST',
        body: JSON.stringify({ user_json_url: userJsonUrl }),
      });

      if (res.success && res.phone) {
        const cleanPhone = String(res.phone).replace(/[^0-9]/g, '').slice(-10);
        if (res.apiToken) {
          localStorage.setItem('fm_api_token', res.apiToken);
        }

        let fetchedName = res.name || 'Food Mela User';
        let fetchedAddress = res.address || '';
        try {
          const profileData = await backendReq<{ success: boolean; user: Record<string, unknown> }>(`/api/user/${cleanPhone}`);
          if (profileData && profileData.user) {
            fetchedName = (profileData.user.name as string) || fetchedName;
            fetchedAddress = (profileData.user.address as string) || fetchedAddress;
          }
        } catch { /* use existing */ }

        const profile: UserProfile = {
          phone: cleanPhone,
          name: fetchedName,
          email: `${cleanPhone}@foodmela.online`,
          isGoldMember: false,
          savedAddresses: fetchedAddress
            ? [{ id: 'addr_default', label: 'Home', addressLine: fetchedAddress, city: 'Birmaharajpur, Odisha' }]
            : [{ id: 'addr_1', label: 'Home', addressLine: 'Main Road, Birmaharajpur', city: 'Birmaharajpur, Odisha' }],
        };

        return { ...res, phone: cleanPhone, profile };
      }
      return { success: false, phone: '', name: null, jwt: null, error: res.error || 'Verification failed' };
    } catch (e: any) {
      console.error('Backend verifyPhoneEmail error:', e);
      return { success: false, phone: '', name: null, jwt: null, error: e.message || 'Verification connection failed' };
    }
  },

  // 3. Auth: Direct Phone OTP
  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/phone/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API send-otp fallback:', e);
    }
    return { success: true, message: 'OTP requested. (For demo enter 1234 or verify with Phone button)' };
  },

  async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; profile?: UserProfile; message?: string }> {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/phone/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.profile) return data;
      }
    } catch (e) {
      console.warn('API verify-otp fallback:', e);
    }

    if (otp === '1234' || otp.length === 4) {
      const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
      const profile: UserProfile = {
        phone: cleanPhone,
        name: 'Food Mela Member',
        email: `${cleanPhone}@foodmela.online`,
        isGoldMember: false,
        savedAddresses: [
          {
            id: 'addr_1',
            label: 'Home',
            addressLine: 'Main Road, Birmaharajpur',
            city: 'Birmaharajpur, Odisha',
          },
        ],
      };
      return { success: true, profile };
    }
    return { success: false, message: 'Incorrect OTP. Try 1234 or click Sign in with Phone.' };
  },

  // 4. Coupons: Validate coupon
  async applyCoupon(code: string, orderValue: number): Promise<{ success: boolean; coupon?: Coupon; message?: string }> {
    try {
      const response = await fetch(`${BASE_URL}/api/coupons/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderValue }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Backend coupon fallback', e);
    }

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

  // 5. Place Order: Sends directly to Food Mela Backend API
  async createOrder(orderData: Partial<Order>): Promise<{ success: boolean; order?: Order; message?: string }> {
    try {
      const backendPayload = {
        customerName: orderData.deliveryAddress || 'Food Mela Customer',
        phone: '9876543210',
        address: orderData.deliveryAddress || 'Birmaharajpur, Odisha',
        items: (orderData.items || []).map((i) => ({
          itemId: i.item.id,
          name: i.item.name,
          quantity: i.quantity,
          price: i.item.price,
          totalPrice: i.item.price * i.quantity,
        })),
        totalAmount: orderData.totalAmount || 0,
      };

      const res = await backendReq<{ success: boolean; order: any }>('/api/orders/place', {
        method: 'POST',
        body: JSON.stringify(backendPayload),
      });

      if (res && res.success && res.order) {
        const orderId = res.order.orderId || res.order.id || `MELA-${Math.floor(100000 + Math.random() * 900000)}`;
        const now = new Date().toISOString();
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
          deliveryAddress: orderData.deliveryAddress || 'Birmaharajpur, Odisha',
          paymentMethod: orderData.paymentMethod || 'UPI',
          createdAt: now,
          rider: {
            name: res.order.riderName || 'Rider Assigned',
            phone: '+91 98765 43210',
            vehicleNumber: 'OD-15-HA-8842',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            pin: res.order.deliveryOtp || String(Math.floor(1000 + Math.random() * 9000)),
            lat: 0.1,
            lng: 0.9,
          },
        };
        localStorage.setItem(`foodmela_order_${orderId}`, JSON.stringify(newOrder));
        localStorage.setItem('foodmela_active_order_id', orderId);
        this.startLocalRiderSimulation(orderId);
        return { success: true, order: newOrder };
      }
    } catch (e) {
      console.warn('Backend /api/orders/place offline, creating local order.', e);
    }

    const orderId = `MELA-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
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
      deliveryAddress: orderData.deliveryAddress || 'Birmaharajpur, Odisha',
      paymentMethod: orderData.paymentMethod || 'UPI',
      createdAt: now,
      rider: {
        name: 'Rahul Kumar',
        phone: '+91 98765 43210',
        vehicleNumber: 'OD-15-HA-8842',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        pin: String(Math.floor(1000 + Math.random() * 9000)),
        lat: 0.1,
        lng: 0.9,
      },
    };
    localStorage.setItem(`foodmela_order_${orderId}`, JSON.stringify(newOrder));
    localStorage.setItem('foodmela_active_order_id', orderId);
    this.startLocalRiderSimulation(orderId);
    return { success: true, order: newOrder };
  },

  // 6. Live order tracking
  async getOrderStatus(orderId: string): Promise<{ success: boolean; order?: Order }> {
    try {
      const res = await backendReq<{ success: boolean; order: any }>(`/api/orders/status/${encodeURIComponent(orderId)}`);
      if (res.success && res.order) {
        const rawStatus = String(res.order.status || '').toLowerCase();
        let status: Order['status'] = 'placed';
        if (rawStatus.includes('deliver')) status = 'delivered';
        else if (rawStatus.includes('out') || rawStatus.includes('transit')) status = 'out_for_delivery';
        else if (rawStatus.includes('accept') || rawStatus.includes('rider')) status = 'rider_assigned';
        else if (rawStatus.includes('prep') || rawStatus.includes('cook')) status = 'preparing';

        const order: Order = {
          id: res.order.orderId || orderId,
          items: [],
          status,
          statusTimestamps: { placed: res.order.createdAt || new Date().toISOString() },
          itemTotal: res.order.totalAmount || 0,
          deliveryFee: 0,
          taxes: 0,
          platformFee: 0,
          discountAmount: 0,
          totalAmount: res.order.totalAmount || 0,
          deliveryAddress: res.order.address || '',
          paymentMethod: 'UPI',
          createdAt: res.order.createdAt || new Date().toISOString(),
          rider: {
            name: res.order.riderName || 'Food Mela Rider',
            phone: '+91 98765 43210',
            vehicleNumber: 'OD-15-HA-8842',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            pin: res.order.deliveryOtp || '8842',
            lat: 0.5,
            lng: 0.5,
          },
        };
        return { success: true, order };
      }
    } catch { /* fallback */ }

    const orderJson = localStorage.getItem(`foodmela_order_${orderId}`);
    if (orderJson) {
      const order = JSON.parse(orderJson) as Order;
      return { success: true, order };
    }
    return { success: false };
  },

  // 7. Get user's past orders
  async getUserOrders(phone: string): Promise<Order[]> {
    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
      const res = await backendReq<{ success: boolean; orders: any[] }>(`/api/user/${encodeURIComponent(cleanPhone)}/orders`, undefined, true);
      if (res.success && Array.isArray(res.orders)) {
        return res.orders.map((o) => ({
          id: o.orderId || o.id,
          items: Array.isArray(o.items) ? o.items : [],
          status: 'delivered',
          statusTimestamps: { placed: o.createdAt || new Date().toISOString() },
          itemTotal: o.totalAmount || 0,
          deliveryFee: 0,
          taxes: 0,
          platformFee: 0,
          discountAmount: 0,
          totalAmount: o.totalAmount || 0,
          deliveryAddress: o.address || 'Delivered Address',
          paymentMethod: 'UPI',
          createdAt: o.createdAt || new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.warn('Backend user orders fetch:', e);
    }
    return [];
  },

  // Local live simulation
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
          localStorage.removeItem('foodmela_active_order_id');
        }
      } else if (order.status === 'delivered') {
        clearInterval(interval);
      }

      localStorage.setItem(`foodmela_order_${orderId}`, JSON.stringify(order));
      window.dispatchEvent(new CustomEvent('foodmela_order_update', { detail: { order } }));
    }, 6000);
  },
};
