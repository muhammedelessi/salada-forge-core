import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { cn } from '@/lib/utils';
import saladaLogo from '@/assets/SALADA_LOGO.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const { t, isRTL } = useLanguageStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('nav.solutions'), href: '/solutions' },
    { label: t('nav.shop'), href: '/shop' },
    { label: t('nav.industries'), href: '/industries' },
    { label: t('nav.whySalada'), href: '/why-salada' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
        isScrolled 
          ? "bg-background/98 backdrop-blur-md border-b-2 border-primary/40 shadow-[0_4px_30px_-4px_hsl(var(--primary)/0.25)]" 
          : "bg-background/80 backdrop-blur-sm border-b border-primary/20 shadow-[0_2px_10px_-4px_hsl(var(--primary)/0.1)]"
      )}>
        <div className="industrial-container">
          <div className={`flex items-center justify-between h-24 md:h-32 ${isRTL() ? 'flex-row-reverse' : ''}`}>
            {/* Logo */}
            <Link to="/" className="flex items-center hover-lift">
              <img 
                src={saladaLogo} 
                alt="SALADA" 
                className="h-20 md:h-28 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className={`hidden md:flex items-center gap-8 ${isRTL() ? 'flex-row-reverse' : ''}`}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors font-medium group"
                >
                  {link.label}
                  <span className={`absolute -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${isRTL() ? 'right-0' : 'left-0'}`} />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className={`flex items-center gap-2 md:gap-4 ${isRTL() ? 'flex-row-reverse' : ''}`}>
              <LanguageSwitcher />
              
              <Link
                to="/account"
                className="hidden md:flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-colors focus-ring rounded"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={cn(
                  'relative flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-colors focus-ring rounded',
                  itemCount > 0 && 'text-primary'
                )}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span 
                    className={cn(
                      'absolute -top-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center font-mono animate-scale-in',
                      isRTL() ? '-left-1' : '-right-1'
                    )}
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 focus-ring rounded"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div 
            className={cn(
              'md:hidden border-t border-border overflow-hidden transition-all duration-300',
              isMenuOpen ? 'max-h-96 py-6' : 'max-h-0 py-0'
            )}
          >
            <nav className={`flex flex-col gap-4 ${isRTL() ? 'text-right' : ''}`}>
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-lg uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/account"
                className="text-lg uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.account')}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
}
