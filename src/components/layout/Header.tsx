import { Link } from 'react-router-dom';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { cn } from '@/lib/utils';
import saladaLogo from '@/assets/SALADA_LOGO.png';

function MegaMenu({ items, isOpen, onLinkClick }: { items: { label: string; desc: string; href: string }[]; isOpen: boolean; onLinkClick?: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="industrial-container py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 rtl:text-right">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onLinkClick}
              className="group p-4 rounded-lg hover:bg-secondary/60 transition-all duration-200"
            >
              <span className="block text-sm font-semibold tracking-wide group-hover:text-primary transition-colors">
                {item.label}
              </span>
              <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                {item.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { t, isRTL } = useLanguageStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const isAr = isRTL();

  const solutionsMega = [
    { label: isAr ? 'حاويات الشحن' : 'Shipping Containers', desc: isAr ? 'حاويات ISO معتمدة بأحجام متعددة' : 'ISO-certified containers in multiple sizes', href: '/solutions#shipping-containers' },
    { label: isAr ? 'حاويات التخزين' : 'Storage Containers', desc: isAr ? 'وحدات تخزين جاهزة للنشر' : 'Deployment-ready storage units', href: '/solutions#storage-containers' },
    { label: t('solutions.landFreight'), desc: isAr ? 'دعم النقل البري الكامل' : 'Complete ground transport support', href: '/solutions#land' },
    { label: t('solutions.seaFreight'), desc: isAr ? 'البنية التحتية للشحن البحري' : 'Maritime cargo infrastructure', href: '/solutions#sea' },
    { label: t('solutions.airFreight'), desc: isAr ? 'حلول دعم الشحن الجوي' : 'Air cargo support solutions', href: '/solutions#air' },
    { label: t('solutions.storage'), desc: isAr ? 'حلول تخزين جاهزة' : 'Modular storage solutions', href: '/solutions#storage' },
  ];

  const industriesMega = [
    { label: t('industries.logistics'), desc: isAr ? 'حاويات معززة للشحن والنقل' : 'Reinforced containers for freight', href: '/industries#logistics' },
    { label: t('industries.construction'), desc: isAr ? 'حلول تخزين موثوقة في الموقع' : 'Reliable on-site storage', href: '/industries#construction' },
    { label: t('industries.government'), desc: isAr ? 'حاويات متوافقة مع المعايير' : 'Standards-aligned containers', href: '/industries#government' },
    { label: t('industries.industrial'), desc: isAr ? 'حلول للبيئات القاسية' : 'Solutions for harsh environments', href: '/industries#industrial' },
    { label: t('industries.storage'), desc: isAr ? 'حلول تخزين قابلة للتوسع' : 'Scalable storage solutions', href: '/industries#storage' },
  ];

  const navLinks = [
    { label: t('nav.solutions'), href: '/solutions', mega: 'solutions' },
    { label: t('nav.shop'), href: '/shop' },
    { label: t('nav.industries'), href: '/industries', mega: 'industries' },
    { label: t('nav.whySalada'), href: '/why-salada' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  const handleMegaEnter = (key: string) => {
    clearTimeout(megaTimeoutRef.current);
    setOpenMega(key);
  };

  const handleMegaLeave = () => {
    megaTimeoutRef.current = setTimeout(() => setOpenMega(null), 200);
  };

  const searchResults = searchQuery.trim() ? navLinks.filter(l =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background shadow-[0_2px_16px_-2px_hsl(var(--foreground)/0.08)]"
          : "bg-background/95 backdrop-blur-sm"
      )}
    >
      <div className="industrial-container">
        <div className={cn(
          "flex items-center justify-between transition-all duration-300",
          isScrolled ? "h-16 md:h-20" : "h-20 md:h-24",
          "rtl:flex-row-reverse"
        )}>
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 py-2">
            <img
              src={saladaLogo}
              alt="SALADA Metal Industries"
              className={cn(
                "w-auto object-contain transition-all duration-300",
                isScrolled ? "h-12 md:h-16" : "h-16 md:h-20"
              )}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 rtl:flex-row-reverse">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.mega && handleMegaEnter(link.mega)}
                onMouseLeave={() => link.mega && handleMegaLeave()}
              >
                <Link
                  to={link.href}
                  className={cn(
                    "relative text-[13px] font-semibold uppercase tracking-[0.08em] text-foreground/70 hover:text-primary transition-colors duration-200 inline-flex items-center gap-1.5 py-2",
                    "rtl:flex-row-reverse rtl:tracking-normal rtl:normal-case rtl:text-sm"
                  )}
                >
                  {link.label}
                  {link.mega && <ChevronDown className="w-3.5 h-3.5 opacity-50" />}
                  <span className="absolute bottom-0 ltr:left-0 rtl:right-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full hover-parent" />
                </Link>
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 rtl:flex-row-reverse">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full text-foreground/60 hover:text-primary hover:bg-secondary transition-all duration-200"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-foreground/70 hover:text-primary hover:bg-secondary transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className={cn(
          'overflow-hidden transition-all duration-300',
          isSearchOpen ? 'max-h-20 py-3 border-t border-border' : 'max-h-0 py-0'
        )}>
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ltr:left-4 rtl:right-4" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في الموقع...' : 'Search the site...'}
              className="w-full py-2.5 bg-secondary/40 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4 rtl:text-right"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="absolute left-4 right-4 bg-background border border-border rounded-lg shadow-lg mt-1.5 z-50 overflow-hidden">
              {searchResults.map((r) => (
                <Link
                  key={r.href}
                  to={r.href}
                  onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                  className="block px-4 py-3 text-sm hover:bg-secondary/60 transition-colors rtl:text-right"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mega Menus */}
      <MegaMenu items={solutionsMega} isOpen={openMega === 'solutions'} onLinkClick={() => setOpenMega(null)} />
      <MegaMenu items={industriesMega} isOpen={openMega === 'industries'} onLinkClick={() => setOpenMega(null)} />

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Slide-in Menu */}
      <div
        className={cn(
          "fixed top-0 z-50 h-full w-[280px] bg-background shadow-2xl lg:hidden transition-transform duration-300 ease-out overflow-y-auto",
          isAr ? "right-0" : "left-0",
          isMenuOpen
            ? "translate-x-0"
            : isAr ? "translate-x-full" : "-translate-x-full"
        )}
      >
        {/* Mobile menu header */}
        <div className="flex items-center justify-between p-5 border-b border-border rtl:flex-row-reverse">
          <img src={saladaLogo} alt="SALADA" className="h-10 w-auto" />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile nav links */}
        <nav className="flex flex-col p-4 rtl:text-right">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "py-3.5 px-3 text-[15px] font-medium text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-lg transition-all duration-200",
                "animate-slide-up",
                isAr ? "text-right" : "uppercase tracking-wider text-sm"
              )}
              style={{ animationDelay: `${index * 40}ms` }}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile language switcher */}
        <div className="p-4 mt-auto border-t border-border">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
