import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  getTotal: () => number;
  getShipping: () => number;
  getTax: () => number;
}

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

      applyCoupon: async (code) => {
        const subtotal = get().getSubtotal();
        const { data, error } = await supabase.rpc('validate_coupon', {
          coupon_code: code,
          order_subtotal: subtotal,
        });

        if (error || !data || !(data as any).valid) return false;

        const result = data as any;
        set({ couponCode: result.code, couponDiscount: Number(result.discount) });
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
