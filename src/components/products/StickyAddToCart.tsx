import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { Product, ProductVariant } from '@/types';
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
  const { language, isRTL } = useLanguageStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  const contactLabel = language === 'ar' ? 'تواصل معنا' : 'Contact Us';

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
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{product.title}</p>
              <p className="text-sm text-muted-foreground">{product.sku}</p>
            </div>
          </div>

          {/* Contact Us Button */}
          <Link
            to={`/inquiry/${product.slug}?quantity=${quantity}`}
            className="industrial-button flex-shrink-0 px-6 py-3 inline-flex items-center"
          >
            <MessageSquare className={cn('w-5 h-5', isRTL ? 'ml-2' : 'mr-2')} />
            {contactLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
