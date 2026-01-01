import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Eye } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.variants[0]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: language === 'ar' ? 'SAR' : 'USD',
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
        className="group bg-card border border-border hover:border-primary transition-all duration-300"
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
    <Link
      to={`/product/${product.slug}`}
      className="group bg-card border border-border hover:border-primary transition-all duration-300"
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Status Badge */}
        {product.status === 'out_of_stock' && (
          <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} bg-destructive text-destructive-foreground px-3 py-1 text-xs uppercase tracking-wider font-mono`}>
            {t.product.outOfStock}
          </div>
        )}
        
        {hasDiscount && (
          <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} bg-primary text-primary-foreground px-3 py-1 text-xs uppercase tracking-wider font-mono`}>
            {t.product.sale}
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground hover:bg-accent transition-colors"
            disabled={product.status === 'out_of_stock'}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
          <span className="flex items-center justify-center w-12 h-12 bg-foreground text-background hover:bg-muted-foreground transition-colors">
            <Eye className="w-5 h-5" />
          </span>
        </div>
      </div>

      <div className="p-6">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
          {categoryTranslations[product.category] || product.category.replace('-', ' ')}
        </span>
        <h3 className="font-semibold text-lg mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
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
          <p className="text-xs text-accent mt-3 uppercase tracking-wider font-mono">
            {t.product.onlyLeft.replace('{count}', product.stock.toString())}
          </p>
        )}

        {product.bulkPricing && product.bulkPricing.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3 uppercase tracking-wider font-mono">
            {t.product.bulkPricing}
          </p>
        )}
      </div>
    </Link>
  );
}
