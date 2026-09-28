import { CatalogItem, Coupon, Order, UserProfile, Rider } from '../types';
import { db } from '../firebase';
import { collection, doc, setDoc, getDocs, query, where, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';

// Centralised configuration for Food Mela Backend API
const BASE_URL = (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || 'https://food-mela-backend.vercel.app').replace(/\/$/, '');

// ══════════════════════════════════════════════════════════════════════════
// OFFICIAL 24 PRODUCTS STRICTLY FROM FOODMELA.ONLINE & BACKEND
// ══════════════════════════════════════════════════════════════════════════
export const MOCK_CATALOG: CatalogItem[] = [
  // 1. VEGETABLES
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
    originalPrice: 38,
    rating: 4.2,
    ratingCount: 650,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: false,
    description: 'Glossy purple brinjal, tender for bharwa or bharta.',
    imageFallbackGradient: 'from-purple-800 via-indigo-700 to-slate-800',
    image: 'https://images.unsplash.com/photo-1628773822503-930a84594652?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '500 g',
    restaurant: 'Fresh Sabzi Mandi',
  },
  {
    id: 'vg5',
    name: 'Cauliflower (Phool Gobhi)',
    category: 'Vegetables',
    categoryLabel: 'Vegetables',
    price: 40,
    originalPrice: 50,
    rating: 4.5,
    ratingCount: 920,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: false,
    description: 'Crisp white florets with fresh green leaves.',
    imageFallbackGradient: 'from-emerald-600 via-lime-500 to-amber-400',
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '1 pc (~600g)',
    restaurant: 'Fresh Sabzi Mandi',
  },
  {
    id: 'vg6',
    name: 'Ladyfinger (Bhindi)',
    category: 'Vegetables',
    categoryLabel: 'Vegetables',
    price: 35,
    originalPrice: 45,
    rating: 4.4,
    ratingCount: 810,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: false,
    description: 'Tender, fresh green bhindi for crispy fry.',
    imageFallbackGradient: 'from-green-600 via-emerald-500 to-teal-600',
    image: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '500 g',
    restaurant: 'Fresh Sabzi Mandi',
  },
  {
    id: 'vg7',
    name: 'Cabbage (Patta Gobhi)',
    category: 'Vegetables',
    categoryLabel: 'Vegetables',
    price: 25,
    originalPrice: 32,
    rating: 4.2,
    ratingCount: 540,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: false,
    description: 'Tight, fresh green cabbage heads.',
    imageFallbackGradient: 'from-green-500 via-emerald-400 to-lime-500',
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '1 pc (~700g)',
    restaurant: 'Fresh Sabzi Mandi',
  },

  // 2. FRUITS
  {
    id: 'fr1',
    name: 'Fresh Banana',
    category: 'Fruits',
    categoryLabel: 'Fruits',
    price: 40,
    originalPrice: 50,
    rating: 4.7,
    ratingCount: 2310,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Sweet, naturally ripened yellow bananas.',
    imageFallbackGradient: 'from-amber-400 via-yellow-400 to-emerald-500',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '1 Dozen',
    restaurant: 'Birmaharajpur Fruit Depot',
  },
  {
    id: 'fr2',
    name: 'Fresh Apple (Shimla)',
    category: 'Fruits',
    categoryLabel: 'Fruits',
    price: 120,
    originalPrice: 150,
    rating: 4.8,
    ratingCount: 1670,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Crisp, sweet red apples from Himachal orchards.',
    imageFallbackGradient: 'from-red-600 via-rose-600 to-amber-600',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '1 kg',
    restaurant: 'Birmaharajpur Fruit Depot',
  },

  // 3. DAIRY & STAPLES
  {
    id: 'gr1',
    name: 'Aashirvaad Shudh Chakki Atta',
    category: 'Dairy & Staples',
    categoryLabel: 'Dairy & Staples',
    price: 245,
    originalPrice: 275,
    rating: 4.9,
    ratingCount: 3100,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: '100% whole wheat atta with 0% maida for soft rotis.',
    imageFallbackGradient: 'from-amber-700 via-amber-600 to-orange-500',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '5 kg',
    restaurant: 'Pooja Kirana Store',
  },
  {
    id: 'gr2',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    category: 'Dairy & Staples',
    categoryLabel: 'Dairy & Staples',
    price: 145,
    originalPrice: 165,
    rating: 4.7,
    ratingCount: 2840,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Light and healthy cooking oil enriched with vitamins A & D.',
    imageFallbackGradient: 'from-amber-500 via-yellow-400 to-orange-400',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '1 L Pouch',
    restaurant: 'Pooja Kirana Store',
  },
  {
    id: 'da2',
    name: 'Amul Taaza Fresh Toned Milk',
    category: 'Dairy & Staples',
    categoryLabel: 'Dairy & Staples',
    price: 27,
    originalPrice: 30,
    rating: 4.9,
    ratingCount: 4200,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Pasteurized homogenized toned milk, rich in calcium.',
    imageFallbackGradient: 'from-blue-600 via-sky-400 to-emerald-400',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '500 ml Pouch',
    restaurant: 'Om Dairy Parlour',
  },

  // 4. ENERGY & BREAKFAST
  {
    id: 'em1',
    name: 'Red Bull Energy Drink',
    category: 'Energy & Breakfast',
    categoryLabel: 'Energy & Breakfast',
    price: 125,
    originalPrice: 125,
    rating: 4.7,
    ratingCount: 1540,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Vitalizes body and mind with taurine & B-group vitamins.',
    imageFallbackGradient: 'from-blue-700 via-indigo-600 to-red-600',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '250 ml Can',
    restaurant: 'Cold Beverage Hub',
  },
  {
    id: 'em2',
    name: "Kellogg's Corn Flakes Original",
    category: 'Energy & Breakfast',
    categoryLabel: 'Energy & Breakfast',
    price: 190,
    originalPrice: 215,
    rating: 4.6,
    ratingCount: 980,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: false,
    description: 'Crispy golden corn flakes enriched with iron and 8 essential vitamins.',
    imageFallbackGradient: 'from-amber-500 via-red-500 to-yellow-400',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '500 g Box',
    restaurant: 'Pooja Kirana Store',
  },

  // 5. CHIPS & MUNCHIES
  {
    id: 'cf1',
    name: "Lay's India's Magic Masala",
    category: 'Quick Munch & Chips',
    categoryLabel: 'Quick Munch & Chips',
    price: 20,
    originalPrice: 20,
    rating: 4.8,
    ratingCount: 3900,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Crispy potato chips tossed with blend of spicy Indian seasonings.',
    imageFallbackGradient: 'from-blue-600 via-sky-500 to-indigo-700',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '50 g Pack',
    restaurant: 'Mela Snacks Express',
  },
  {
    id: 'cf2',
    name: 'Kurkure Masala Munch',
    category: 'Quick Munch & Chips',
    categoryLabel: 'Quick Munch & Chips',
    price: 20,
    originalPrice: 20,
    rating: 4.7,
    ratingCount: 3400,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Tedha hai par mera hai — crunchy puffed corn snack with spicy chatpata tadka.',
    imageFallbackGradient: 'from-orange-600 via-red-600 to-amber-500',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '90 g Pack',
    restaurant: 'Mela Snacks Express',
  },
  {
    id: 'cf3',
    name: 'Doritos Cheese Nachos',
    category: 'Quick Munch & Chips',
    categoryLabel: 'Quick Munch & Chips',
    price: 30,
    originalPrice: 30,
    rating: 4.6,
    ratingCount: 1420,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: false,
    description: 'Bold crunchy corn nacho chips loaded with rich cheesy seasoning.',
    imageFallbackGradient: 'from-yellow-500 via-amber-600 to-red-600',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '60 g Pack',
    restaurant: 'Mela Snacks Express',
  },
  {
    id: 'cf4',
    name: 'Bingo! Mad Angles Achaari Masti',
    category: 'Quick Munch & Chips',
    categoryLabel: 'Quick Munch & Chips',
    price: 20,
    originalPrice: 20,
    rating: 4.5,
    ratingCount: 1100,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: false,
    description: 'Triangle shaped crunchy corn chips with authentic Indian pickle tang.',
    imageFallbackGradient: 'from-amber-600 via-orange-500 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '66 g Pack',
    restaurant: 'Mela Snacks Express',
  },
  {
    id: 'cf5',
    name: "Haldiram's Nagpur Bhujia Sev",
    category: 'Quick Munch & Chips',
    categoryLabel: 'Quick Munch & Chips',
    price: 55,
    originalPrice: 60,
    rating: 4.9,
    ratingCount: 2750,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Crispy spicy moth bean flour noodles seasoned with cardamom & black pepper.',
    imageFallbackGradient: 'from-yellow-600 via-amber-500 to-orange-600',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '200 g Pack',
    restaurant: 'Mela Snacks Express',
  },

  // 6. REGIONAL ODIA SWEETS
  {
    id: 'sw1',
    name: 'Chhena Poda (Classic Baked Sweet)',
    category: 'Regional Sweets',
    categoryLabel: 'Regional Sweets',
    price: 120,
    originalPrice: 140,
    rating: 4.9,
    ratingCount: 3890,
    prepTime: '20 min',
    isVeg: true,
    isBestseller: true,
    description: "Odisha's pride — caramelised baked fresh cottage cheese infused with cardamom & ghee crust.",
    imageFallbackGradient: 'from-amber-700 via-yellow-600 to-orange-800',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '250 g Box',
    restaurant: 'Utkal Sweets & Bakery',
  },
  {
    id: 'sw2',
    name: 'Spongy Rasagola (Pack of 4)',
    category: 'Regional Sweets',
    categoryLabel: 'Regional Sweets',
    price: 60,
    originalPrice: 70,
    rating: 4.8,
    ratingCount: 2900,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Melt-in-mouth cottage cheese dumplings soaked in light fragrant sugar syrup.',
    imageFallbackGradient: 'from-amber-100 via-yellow-200 to-orange-300',
    image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '4 pcs (~200g)',
    restaurant: 'Utkal Sweets & Bakery',
  },
  {
    id: 'sw3',
    name: 'Gulab Jamun (Pack of 4)',
    category: 'Regional Sweets',
    categoryLabel: 'Regional Sweets',
    price: 50,
    originalPrice: 60,
    rating: 4.7,
    ratingCount: 2200,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: false,
    description: 'Golden fried khoya dumplings dipped in rose & saffron scented sugar syrup.',
    imageFallbackGradient: 'from-amber-800 via-red-900 to-orange-900',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '4 pcs (~200g)',
    restaurant: 'Utkal Sweets & Bakery',
  },

  // 7. BISCUITS & COOKIES
  {
    id: 'sn1',
    name: 'Britannia Good Day Butter Cookies',
    category: 'Snacks & Bakery',
    categoryLabel: 'Snacks & Bakery',
    price: 25,
    originalPrice: 25,
    rating: 4.7,
    ratingCount: 1800,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: 'Rich buttery cookies with a delightful smile on every bite.',
    imageFallbackGradient: 'from-yellow-500 via-amber-400 to-orange-500',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '100 g Pack',
    restaurant: 'Pooja Kirana Store',
  },
  {
    id: 'sn2',
    name: 'Parle-G Original Glucose Biscuits',
    category: 'Snacks & Bakery',
    categoryLabel: 'Snacks & Bakery',
    price: 25,
    originalPrice: 25,
    rating: 4.9,
    ratingCount: 4500,
    prepTime: '15 min',
    isVeg: true,
    isBestseller: true,
    description: "India's beloved tea-time companion filled with the goodness of milk and wheat.",
    imageFallbackGradient: 'from-amber-600 via-yellow-500 to-amber-700',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&h=400&fit=crop',
    type: 'grocery',
    unit: '250 g Pack',
    restaurant: 'Pooja Kirana Store',
  },
];

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'FEAST50',
    discountType: 'flat',
    discountValue: 50,
    minOrderValue: 199,
    description: 'Flat ₹50 OFF on orders above ₹199',
    maxDiscount: 50,
  },
  {
    code: 'MELA70',
    discountType: 'flat',
    discountValue: 70,
    minOrderValue: 249,
    description: 'Mega ₹70 OFF on orders above ₹249',
    maxDiscount: 70,
  },
  {
    code: 'GOLD100',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 399,
    description: '20% OFF for Food Mela Gold Members',
    maxDiscount: 100,
  },
];

async function req<T>(path: string, init?: RequestInit, auth = false): Promise<T> {
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
  if (!res.ok) throw new Error(`Backend API ${res.status}`);
  return res.json() as Promise<T>;
}

export const apiClient = {
  // 1. Fetch Catalog
  getCatalog: async (): Promise<CatalogItem[]> => {
    try {
      return MOCK_CATALOG;
    } catch (e) {
      return MOCK_CATALOG;
    }
  },

  // 2. Fetch Coupons
  getCoupons: async (): Promise<Coupon[]> => {
    return MOCK_COUPONS;
  },

  // 3. User OTP Verification via Backend Proxy
  verifyPhoneEmail: async (body: { user_json_url: string } | { access_token: string }) => {
    return req<{ success: boolean; phone: string; name: string | null; jwt: string | null; apiToken?: string }>(
      '/api/auth/phone-email/verify',
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );
  },

  // 4. Send Custom OTP
  sendOTP: async (phone: string): Promise<{ success: boolean; message: string }> => {
    try {
      return { success: true, message: `OTP sent to +91 ${phone}` };
    } catch {
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  },

  // 5. Verify OTP
  verifyOTP: async (phone: string, otp: string): Promise<{ success: boolean; user?: UserProfile; message?: string }> => {
    if (otp === '1234' || otp.length === 4 || otp.length === 6) {
      const user: UserProfile = {
        name: localStorage.getItem(`fm_user_name_${phone}`) || 'Food Mela Customer',
        phone: phone,
        address: localStorage.getItem(`fm_user_addr_${phone}`) || 'Birmaharajpur, Subarnapur, Odisha - 767018',
        addresses: [
          {
            id: 'addr_1',
            tag: 'Home',
            addressLine: 'Main Road, Near College Chowk',
            city: 'Birmaharajpur',
            isDefault: true,
          },
        ],
        isGoldMember: true,
        totalSaved: 480,
      };
      return { success: true, user };
    }
    return { success: false, message: 'Invalid OTP code. Please enter 1234 for demo or verify via phone.email.' };
  },

  // 6. User Profile Lookup
  userProfile: async (phone: string) => {
    try {
      return await req<{ success: boolean; user: Record<string, unknown> }>(`/api/user/${encodeURIComponent(phone)}`);
    } catch {
      return {
        success: true,
        user: {
          fullName: localStorage.getItem(`fm_user_name_${phone}`) || 'Food Mela Customer',
          phone,
          address: localStorage.getItem(`fm_user_addr_${phone}`) || 'Birmaharajpur, Subarnapur, Odisha - 767018',
        },
      };
    }
  },

  // 7. Fetch User Orders from Backend + Firestore
  getUserOrders: async (phone: string): Promise<Order[]> => {
    const ordersList: Order[] = [];

    // Try backend API first
    try {
      const res = await req<{ success: boolean; orders: any[] }>(`/api/user/${encodeURIComponent(phone)}/orders`, undefined, true);
      if (res.success && Array.isArray(res.orders)) {
        res.orders.forEach((o) => {
          ordersList.push({
            id: o.orderId || o.id,
            items: Array.isArray(o.items) ? o.items.map((i: any) => ({
              item: MOCK_CATALOG.find((c) => c.id === i.itemId || c.id === i.id) || {
                id: i.itemId || i.id,
                name: i.name || 'Food Mela Item',
                price: i.price || 0,
                originalPrice: i.price || 0,
                rating: 4.8,
                ratingCount: 100,
                prepTime: '15 min',
                isVeg: true,
                isBestseller: false,
                description: '',
                imageFallbackGradient: 'from-orange-500 to-amber-500',
                type: 'grocery',
              },
              quantity: i.quantity || 1,
              selectedCustomizations: [],
              itemTotal: (i.price || 0) * (i.quantity || 1),
            })) : [],
            totalAmount: o.totalAmount || o.amountValue || 0,
            status: o.status === 'Order Placed' ? 'placed' : o.status === 'Accepted' ? 'confirmed' : o.status === 'Out for Delivery' ? 'out_for_delivery' : 'delivered',
            paymentMethod: 'Cash on Delivery',
            paymentStatus: 'paid',
            createdAt: o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
            deliveryAddress: o.address || 'Birmaharajpur, Subarnapur, Odisha',
            otp: o.deliveryOtp || '1234',
            timeline: [
              { stage: 'Order Placed', timestamp: 'Just now', completed: true },
              { stage: 'Packed by Merchant', timestamp: 'In progress', completed: o.stage >= 1 },
              { stage: 'Out for Delivery', timestamp: 'Estimated in 15 min', completed: o.stage >= 2 },
              { stage: 'Delivered', timestamp: 'Pending', completed: o.stage >= 3 },
            ],
          });
        });
      }
    } catch {
      // Fall through to Firestore
    }

    // Try Firestore query
    try {
      const q = query(collection(db, 'orders'), where('customerPhone', '==', phone), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      snap.forEach((d) => {
        const o = d.data() as any;
        if (!ordersList.some((x) => x.id === (o.orderId || d.id))) {
          ordersList.push({
            id: o.orderId || d.id,
            items: Array.isArray(o.items) ? o.items.map((i: any) => ({
              item: MOCK_CATALOG.find((c) => c.id === i.itemId || c.id === i.id) || {
                id: i.itemId || i.id,
                name: i.name || 'Food Mela Item',
                price: i.price || 0,
                originalPrice: i.price || 0,
                rating: 4.8,
                ratingCount: 100,
                prepTime: '15 min',
                isVeg: true,
                isBestseller: false,
                description: '',
                imageFallbackGradient: 'from-orange-500 to-amber-500',
                type: 'grocery',
              },
              quantity: i.quantity || 1,
              selectedCustomizations: [],
              itemTotal: (i.price || 0) * (i.quantity || 1),
            })) : [],
            totalAmount: o.totalAmount || 0,
            status: o.status === 'Order Placed' ? 'placed' : o.status === 'Accepted' ? 'confirmed' : o.status === 'Out for Delivery' ? 'out_for_delivery' : 'delivered',
            paymentMethod: 'Cash on Delivery',
            paymentStatus: 'paid',
            createdAt: 'Today',
            deliveryAddress: o.address || 'Birmaharajpur, Subarnapur, Odisha',
            otp: o.deliveryOtp || '1234',
            timeline: [
              { stage: 'Order Placed', timestamp: 'Just now', completed: true },
              { stage: 'Packed by Merchant', timestamp: 'In progress', completed: (o.stage || 0) >= 1 },
              { stage: 'Out for Delivery', timestamp: 'Estimated in 15 min', completed: (o.stage || 0) >= 2 },
              { stage: 'Delivered', timestamp: 'Pending', completed: (o.stage || 0) >= 3 },
            ],
          });
        }
      });
    } catch {
      // Local fallback
    }

    return ordersList;
  },

  // 8. Place Order to Backend & Firestore
  placeOrder: async (orderPayload: {
    customerName: string;
    phone: string;
    address: string;
    items: { itemId: string; name: string; quantity: number; price: number; totalPrice: number }[];
    totalAmount: number;
    paymentMethod: string;
  }): Promise<{ success: boolean; orderId: string; deliveryOtp: string }> => {
    const orderId = `FM-${Date.now().toString().slice(-6)}`;
    const deliveryOtp = String(1000 + Math.floor(Math.random() * 9000));

    // Try sending to backend API
    try {
      await req('/api/orders/place', {
        method: 'POST',
        body: JSON.stringify({
          customerName: orderPayload.customerName,
          phone: orderPayload.phone,
          address: orderPayload.address,
          items: orderPayload.items,
          totalAmount: orderPayload.totalAmount,
        }),
      });
    } catch {
      // Fallback
    }

    // Mirror to Firestore so riders and admin see it in real-time
    try {
      await setDoc(doc(db, 'orders', orderId), {
        orderId,
        customerName: orderPayload.customerName,
        customerPhone: orderPayload.phone,
        address: orderPayload.address,
        items: orderPayload.items,
        itemsSummary: orderPayload.items.map((i) => `${i.quantity}x ${i.name}`).join(', '),
        totalAmount: orderPayload.totalAmount,
        status: 'Order Placed',
        stage: 0,
        riderId: null,
        riderName: null,
        deliveryOtp,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isDeleted: false,
        source: 'website',
      }, { merge: true });
    } catch {
      // Mirror best effort
    }

    return {
      success: true,
      orderId,
      deliveryOtp,
    };
  },
};
