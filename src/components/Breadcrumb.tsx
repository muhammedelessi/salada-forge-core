import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const { isRTL } = useLanguageStore();

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-secondary/50 border-b border-border py-3"
    >
      <div className="industrial-container">
        <ol className="flex items-center gap-2 text-sm rtl:flex-row-reverse">
          <li>
            <Link
              to="/"
              className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="sr-only">{isRTL() ? 'الرئيسية' : 'Home'}</span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2 rtl:flex-row-reverse">
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground rtl:rotate-180" />
              {item.href ? (
                <Link
                  to={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
