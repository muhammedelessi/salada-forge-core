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
          'flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground hover:bg-accent transition-all duration-200',
          className
        )}
      >
        <MessageSquare className="w-5 h-5" />
      </Link>
    );
  }

  return (
    <Link
      to={`/inquiry/${productSlug}?quantity=${quantity}`}
      className={cn(
        'industrial-button transition-all duration-200 inline-flex items-center justify-center',
        size === 'lg' && 'py-5 text-base',
        className
      )}
    >
      <MessageSquare className={cn('w-5 h-5', isRTL ? 'ml-2' : 'mr-2')} />
      {label}
    </Link>
  );
}