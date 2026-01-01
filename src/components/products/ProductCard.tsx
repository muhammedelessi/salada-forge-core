import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Eye } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { AddToCartButton } from '@/components/ui/AddToCartButton';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
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

  // Category translations
  const categoryTranslations: Record<string, string> = {
    'shipping-containers': t.categories.shippingContainers,
    'storage-tanks': t.categories.storageTanks,
    'ibc-containers': t.categories.ibcContainers,
    'specialty-containers': t.categories.specialtyContainers,
    'drums-barrels': t.categories.drumsBarrels,
    'modular-buildings': t.categories.modularBuildings,
  };

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  if (variant === 'compact') {
    return (
      <Link
        to={`/product/${product.slug}`}
        className="group bg-card border border-border hover:border-primary transition-all duration-300 hover-lift"
      >
        <div className="aspect-square bg-muted overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-primary font-mono text-sm mt-1">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div className="group bg-card border border-border hover:border-primary transition-all duration-300">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Status Badge */}
          {product.status === 'out_of_stock' && (
            <div className={cn(
              'absolute top-4 bg-destructive text-destructive-foreground px-3 py-1 text-xs uppercase tracking-wider font-mono',
              isRTL ? 'right-4' : 'left-4'
            )}>
              {t.product.outOfStock}
            </div>
          )}
          
          {hasDiscount && product.status !== 'out_of_stock' && (
            <div className={cn(
              'absolute top-4 bg-primary text-primary-foreground px-3 py-1 text-xs uppercase tracking-wider font-mono',
              isRTL ? 'right-4' : 'left-4'
            )}>
              {t.product.sale}
            </div>
          )}

          {/* Quick Actions - Appear on hover with smooth transition */}
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="pointer-events-auto">
              <AddToCartButton
                product={product}
                variant={product.variants[0]}
                size="icon"
              />
            </div>
            <Link
              to={`/product/${product.slug}`}
              className="flex items-center justify-center w-12 h-12 bg-foreground text-background hover:bg-muted-foreground transition-colors pointer-events-auto"
            >
              <Eye className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
          {categoryTranslations[product.category] || product.category.replace('-', ' ')}
        </span>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-lg mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse justify-end')}>
          <span className="text-xl font-bold text-primary font-mono">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through font-mono">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>

        {product.stock <= 10 && product.stock > 0 && (
          <p className="text-xs text-accent mt-3 uppercase tracking-wider font-mono animate-pulse">
            {t.product.onlyLeft.replace('{count}', product.stock.toString())}
          </p>
        )}

        {product.bulkPricing && product.bulkPricing.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3 uppercase tracking-wider font-mono">
            {t.product.bulkPricing}
          </p>
        )}
      </div>
    </div>
  );
}
