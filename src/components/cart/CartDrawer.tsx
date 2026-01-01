import { Link } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getSubtotal, getTotal } = useCartStore();
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side={isRTL ? 'left' : 'right'} 
        className="w-full sm:max-w-md bg-background border-border flex flex-col"
      >
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-xl font-bold">{t.cart.yourCart}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-6" />
            <p className="text-lg font-medium mb-2">{t.cart.empty}</p>
            <p className="text-sm text-muted-foreground mb-6">{t.cart.emptyDesc}</p>
            <Link 
              to="/shop" 
              onClick={() => onOpenChange(false)}
              className="industrial-button"
            >
              {t.cart.continueShopping}
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => {
                const itemPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`}
                    className="flex gap-4 group animate-fade-in"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="w-20 h-20 bg-muted flex-shrink-0 overflow-hidden"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div>
                          <Link
                            to={`/product/${item.product.slug}`}
                            onClick={() => onOpenChange(false)}
                            className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.product.title}
                          </Link>
                          {item.selectedVariant && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.selectedVariant.name}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedVariant?.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1 opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 h-7 flex items-center justify-center font-mono text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-sm font-medium">{formatPrice(itemTotal)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t.cart.subtotal}</span>
                <span className="font-mono font-bold text-lg">{formatPrice(getSubtotal())}</span>
              </div>

              <div className="space-y-2">
                <Link
                  to="/checkout"
                  onClick={() => onOpenChange(false)}
                  className="w-full industrial-button justify-center"
                >
                  {t.cart.proceedToCheckout}
                  <ArrowIcon className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Link>
                
                <Link
                  to="/cart"
                  onClick={() => onOpenChange(false)}
                  className="w-full industrial-button-outline justify-center text-center"
                >
                  {t.cart.yourCart}
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
