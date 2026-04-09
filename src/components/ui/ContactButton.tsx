import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';

interface ContactButtonProps {
  productSlug: string;
  quantity?: number;
  className?: string;
  size?: 'default' | 'lg' | 'icon';
}

export function ContactButton({
  productSlug,
  quantity = 1,
  className,
  size = 'default',
}: ContactButtonProps) {
  const { language, isRTL } = useLanguageStore();

  const label = language === 'ar' ? 'تواصل معنا' : 'Contact Us';

  if (size === 'icon') {
    return (
      <Link
        to={`/inquiry/${productSlug}?quantity=${quantity}`}
        className={cn(
          'flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground hover:opacity-[0.88] transition-opacity',
          className
        )}
      >
        <MessageSquare className="w-3.5 h-3.5" />
      </Link>
    );
  }

  return (
    <Link
      to={`/inquiry/${productSlug}?quantity=${quantity}`}
      className={cn(
        'btn-primary w-full sm:w-auto',
        className
      )}
    >
      <MessageSquare className={cn('w-3.5 h-3.5')} />
      {label}
    </Link>
  );
}