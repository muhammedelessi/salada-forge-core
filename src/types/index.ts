export interface Product {
  id: string;
  title: string;
  sku: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  specifications: ProductSpecification[];
  /** Raw nested specifications object (e.g. { external, internal, door, capacity }) when
   *  stored as an object in the DB. Null when stored as an array (use `specifications`). */
  rawSpecifications?: Record<string, unknown> | null;
  /** Arabic nested specs object from `specifications_ar` when stored as object; UI falls back to `rawSpecifications`. */
  rawSpecificationsAr?: Record<string, unknown> | null;
  /** Parsed from DB `specifications_ar` when stored as array; when empty, UI falls back to `specifications`. */
  specificationsAr?: ProductSpecification[];
  variants: ProductVariant[];
  stock: number;
  status: 'active' | 'draft' | 'out_of_stock';
  bulkPricing?: BulkPricing[];
  seoTitle?: string;
  seoDescription?: string;
  idealFor?: string[];
  keyFeatures?: string[];
  customizationOptions?: string[];
  // Arabic localized fields (optional — fall back to base field when empty)
  titleAr?: string;
  descriptionAr?: string;
  seoTitleAr?: string;
  seoDescriptionAr?: string;
  idealForAr?: string[];
  keyFeaturesAr?: string[];
  // Optional product attributes
  tags?: string[];
  material?: string;
  weight?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: VariantOption[];
  priceModifier: number;
  stock: number;
}

export interface VariantOption {
  type: 'size' | 'material' | 'capacity' | 'color';
  value: string;
}

export interface BulkPricing {
  minQuantity: number;
  maxQuantity?: number;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  couponCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  orders: string[];
  createdAt: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  active: boolean;
  conditions?: CouponCondition[];
}

export interface CouponCondition {
  type: 'category' | 'product' | 'customer';
  value: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: string[];
  createdAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  newCustomers: number;
  ordersByStatus: Record<OrderStatus, number>;
  topProducts: { product: Product; sales: number }[];
  lowStockProducts: Product[];
  revenueByDay: { date: string; revenue: number }[];
}

export interface StoreSettings {
  name: string;
  email: string;
  phone: string;
  address: Address;
  currency: string;
  taxRate: number;
  shippingRules: ShippingRule[];
}

export interface ShippingRule {
  id: string;
  name: string;
  type: 'flat' | 'weight' | 'price' | 'free';
  rate: number;
  minOrderAmount?: number;
  maxWeight?: number;
}
