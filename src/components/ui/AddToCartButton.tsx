import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { Product, ProductVariant } from '@/types';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: ProductVariant;
  onSuccess?: () => void;
  className?: string;
  showIcon?: boolean;
  size?: 'default' | 'lg' | 'icon';
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant,
  onSuccess,
  className,
  showIcon = true,
  size = 'default',
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  const handleAddToCart = () => {
    if (product.status === 'out_of_stock') return;

    setIsAdding(true);

    // Simulate micro-delay for feedback
    setTimeout(() => {
      addItem(product, quantity, variant);
      setIsAdding(false);
      setIsSuccess(true);

      toast({
        title: t.product.addedToCart,
        description: product.title,
        duration: 2000,
      });

      onSuccess?.();

      // Reset success state
      setTimeout(() => setIsSuccess(false), 1500);
    }, 150);
  };

  const isDisabled = product.status === 'out_of_stock' || isAdding;

  if (size === 'icon') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={cn(
          'flex items-center justify-center w-12 h-12 transition-all duration-200',
          isSuccess
            ? 'bg-green-600 text-white'
            : 'bg-primary text-primary-foreground hover:bg-accent',
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {isSuccess ? (
          <Check className="w-5 h-5 animate-scale-in" />
        ) : (
          <ShoppingCart className={cn('w-5 h-5', isAdding && 'animate-pulse')} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={cn(
        'btn-primary transition-all duration-200',
        isSuccess && 'bg-green-600 hover:bg-green-600',
        isDisabled && 'opacity-50 cursor-not-allowed',
        size === 'lg' && 'py-5 text-base',
        className
      )}
    >
      {isSuccess ? (
        <>
          <Check className={cn('w-5 h-5 animate-scale-in', isRTL ? 'ml-2' : 'mr-2')} />
          {t.product.added}
        </>
      ) : (
        <>
          {showIcon && (
            <ShoppingCart className={cn('w-5 h-5', isRTL ? 'ml-2' : 'mr-2', isAdding && 'animate-pulse')} />
          )}
          {product.status === 'out_of_stock' ? t.product.outOfStock : t.product.addToCart}
        </>
      )}
    </button>
  );
}
