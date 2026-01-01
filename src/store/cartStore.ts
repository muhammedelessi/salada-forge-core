import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant, Coupon } from '@/types';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  getTotal: () => number;
  getShipping: () => number;
  getTax: () => number;
}

const coupons: Coupon[] = [
  { id: '1', code: 'INDUSTRY20', type: 'percentage', value: 20, minOrderAmount: 1000, active: true, usedCount: 0 },
  { id: '2', code: 'FIRST100', type: 'fixed', value: 100, active: true, usedCount: 0 },
  { id: '3', code: 'BULK500', type: 'fixed', value: 500, minOrderAmount: 5000, active: true, usedCount: 0 },
];

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.selectedVariant?.id === variant?.id
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems };
          }

          return {
            items: [...state.items, { product, quantity, selectedVariant: variant }],
          };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.selectedVariant?.id === variantId)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.selectedVariant?.id === variantId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: null, couponDiscount: 0 });
      },

      applyCoupon: (code) => {
        const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
        if (!coupon) return false;

        const subtotal = get().getSubtotal();
        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) return false;

        const discount = coupon.type === 'percentage' 
          ? (subtotal * coupon.value) / 100 
          : coupon.value;

        set({ couponCode: coupon.code, couponDiscount: discount });
        return true;
      },

      removeCoupon: () => {
        set({ couponCode: null, couponDiscount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const basePrice = item.product.price;
          const variantModifier = item.selectedVariant?.priceModifier || 0;
          
          // Check for bulk pricing
          let price = basePrice + variantModifier;
          if (item.product.bulkPricing) {
            for (const bulk of item.product.bulkPricing) {
              if (item.quantity >= bulk.minQuantity && (!bulk.maxQuantity || item.quantity <= bulk.maxQuantity)) {
                price = bulk.price + variantModifier;
                break;
              }
            }
          }
          
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal >= 10000) return 0; // Free shipping over $10k
        if (subtotal >= 5000) return 250;
        return 500;
      },

      getTax: () => {
        const subtotal = get().getSubtotal() - get().couponDiscount;
        return subtotal * 0.08; // 8% tax
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().couponDiscount;
        const shipping = get().getShipping();
        const tax = get().getTax();
        return subtotal - discount + shipping + tax;
      },
    }),
    {
      name: 'salada-cart',
    }
  )
);
