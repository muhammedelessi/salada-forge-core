import { useState, useEffect } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { Product, ProductVariant } from '@/types';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface StickyAddToCartProps {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  showAfterScroll?: number;
}

export function StickyAddToCart({
  product,
  selectedVariant,
  quantity,
  showAfterScroll = 400,
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const currentPrice = product.price + (selectedVariant?.priceModifier || 0);

  const handleAddToCart = () => {
    if (product.status === 'out_of_stock') return;

    setIsAdding(true);

    setTimeout(() => {
      addItem(product, quantity, selectedVariant);
      setIsAdding(false);
      setIsSuccess(true);

      toast({
        title: language === 'ar' ? 'تمت الإضافة' : 'Added to Cart',
        description: product.title,
        duration: 2000,
      });

      setTimeout(() => setIsSuccess(false), 1500);
    }, 150);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border',
        'transform transition-transform duration-300',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="industrial-container py-3">
        <div className={cn('flex items-center justify-between gap-4', isRTL && 'flex-row-reverse')}>
          {/* Product Info */}
          <div className={cn('flex items-center gap-3 min-w-0', isRTL && 'flex-row-reverse')}>
            <div className="w-12 h-12 bg-muted flex-shrink-0 hidden sm:block">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{product.title}</p>
              <p className="text-primary font-mono font-bold">{formatPrice(currentPrice)}</p>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.status === 'out_of_stock' || isAdding}
            className={cn(
              'industrial-button flex-shrink-0 px-6 py-3',
              isSuccess && 'bg-green-600 hover:bg-green-600',
              (product.status === 'out_of_stock' || isAdding) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isSuccess ? (
              <>
                <Check className={cn('w-5 h-5', isRTL ? 'ml-2' : 'mr-2')} />
                {language === 'ar' ? 'تمت الإضافة' : 'Added'}
              </>
            ) : (
              <>
                <ShoppingCart className={cn('w-5 h-5', isRTL ? 'ml-2' : 'mr-2', isAdding && 'animate-pulse')} />
                {product.status === 'out_of_stock' ? t.product.outOfStock : t.product.addToCart}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
