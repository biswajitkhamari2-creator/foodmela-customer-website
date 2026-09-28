export interface CustomizationChoice {
  name: string;
  price: number;
}

export interface CustomizationOption {
  name: string;
  type: 'radio' | 'checkbox';
  choices: CustomizationChoice[];
}

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  categoryLabel?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  ratingCount: number;
  prepTime: string;
  isVeg: boolean;
  isBestseller?: boolean;
  description: string;
  imageFallbackGradient: string; // CSS gradient fallback
  image?: string; // Real image URL from foodmela.online
  type: 'food' | 'grocery';
  customizationOptions?: CustomizationOption[];
  restaurant?: string;
  unit?: string; // for groceries, e.g., "500g", "1kg", "6 pcs"
}

export interface SelectedCustomization {
  optionName: string;
  choiceName: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart item id (combines item.id + selected customizations)
  item: CatalogItem;
  quantity: number;
  selectedCustomizations: SelectedCustomization[];
  instructions?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
}

export interface Rider {
  name: string;
  phone: string;
  vehicleNumber: string;
  avatar: string;
  pin: string;
  lat: number; // 0 to 1 scale for visual simulation on grid map
  lng: number; // 0 to 1 scale
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'placed' | 'preparing' | 'rider_assigned' | 'out_for_delivery' | 'delivered';
  statusTimestamps: {
    placed?: string;
    preparing?: string;
    rider_assigned?: string;
    out_for_delivery?: string;
    delivered?: string;
  };
  itemTotal: number;
  deliveryFee: number;
  taxes: number;
  platformFee: number;
  discountAmount: number;
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  rider?: Rider;
  createdAt: string;
}

export interface UserProfile {
  phone: string;
  name?: string;
  email?: string;
  isGoldMember: boolean;
  savedAddresses: {
    id: string;
    label: 'Home' | 'Work' | 'Other';
    addressLine: string;
    city: string;
  }[];
}
