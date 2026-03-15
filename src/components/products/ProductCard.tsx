import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Eye, MessageSquare } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  // Category translations
  const categoryTranslations: Record<string, string> = {
    'shipping-containers': t.categories.shippingContainers,
    'storage-tanks': t.categories.storageTanks,
    'ibc-containers': t.categories.ibcContainers,
    'specialty-containers': t.categories.specialtyContainers,
    'drums-barrels': t.categories.drumsBarrels,
    'modular-buildings': t.categories.modularBuildings,
  };

  const contactLabel = language === 'ar' ? 'تواصل معنا' : 'Contact Us';

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
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <Link
            to={`/inquiry/${product.slug}`}
            className="inline-flex items-center gap-1 text-primary text-sm mt-2 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageSquare className="w-3 h-3" />
            {contactLabel}
          </Link>
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

          {/* Quick Actions - Appear on hover with smooth transition */}
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <Link
              to={`/inquiry/${product.slug}`}
              className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground hover:bg-accent transition-colors pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageSquare className="w-5 h-5" />
            </Link>
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
        
        {/* Contact Us Button */}
        <Link
          to={`/inquiry/${product.slug}`}
          className={cn(
            'inline-flex items-center gap-2 text-primary font-semibold hover:underline',
            isRTL && 'flex-row-reverse'
          )}
        >
          <MessageSquare className="w-4 h-4" />
          {contactLabel}
        </Link>
      </div>
    </div>
  );
}
