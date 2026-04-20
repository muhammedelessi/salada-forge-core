import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { useLocalizedField } from '@/hooks/useLocalizedField';
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
  selectedVariant: _selectedVariant,
  quantity,
  showAfterScroll = 400,
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { language, isRTL } = useLanguageStore();
  const rtl = isRTL();
  const t = translations[language];
  const { getField } = useLocalizedField();
  const displayTitle = getField(product, 'title') ?? product.title;

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border',
        'transform transition-transform duration-300',
        isVisible ? 'translate-y-0' : 'translate-y-full',
      )}
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <div className="industrial-container py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Product info — DOM order; dir=rtl places this block on the physical right */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center bg-transparent p-0.5 sm:flex">
              <img
                src={product.images[0]}
                alt={displayTitle}
                loading="lazy"
                decoding="async"
                width={48}
                height={48}
                className="max-h-full max-w-full min-h-0 object-contain object-center"
                style={{ objectFit: 'contain', objectPosition: 'center' }}
              />
            </div>
            <div className="min-w-0 flex-1 text-start">
              <p className="truncate text-sm font-medium">{displayTitle}</p>
              <p className="text-sm text-muted-foreground">
                {t.products.sku}: {product.sku}
              </p>
            </div>
          </div>

          <Link
            to={`/inquiry/${product.slug}?quantity=${quantity}`}
            className={cn(
              'btn-primary inline-flex shrink-0 items-center gap-2',
              rtl && 'flex-row-reverse',
            )}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            {t.productDetail.stickyContactCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
