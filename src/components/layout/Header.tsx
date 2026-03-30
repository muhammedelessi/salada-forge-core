import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { cn } from '@/lib/utils';
import saladaLogo from '@/assets/SALADA_LOGO.png';

function MegaMenu({ items, isOpen, onLinkClick }: { items: { label: string; desc: string; href: string }[]; isOpen: boolean; onLinkClick?: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md border-b border-border shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rtl:text-right">
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
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

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

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      )}
      style={isScrolled ? {
        backgroundColor: 'hsl(var(--background) / 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
      } : {
        backgroundColor: 'hsl(var(--background))',
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        {/* Main bar — 72px desktop, 60px mobile */}
        <div className={cn(
          "flex items-center justify-between",
          "h-[60px] lg:h-[72px]",
          "rtl:flex-row-reverse"
        )}>
          {/* Logo — 40px height */}
          <Link to="/" className="shrink-0 ltr:mr-1 rtl:ml-1">
            <img
              src={saladaLogo}
              alt="SALADA Metal Industries"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav Links — 32px gap, 15px / 500 weight */}
          <nav className="hidden lg:flex items-center rtl:flex-row-reverse" style={{ gap: '32px' }}>
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
                    "relative inline-flex items-center gap-1 py-1 transition-colors duration-200 rtl:flex-row-reverse",
                    isActive(link.href) ? "text-primary" : "text-foreground/70 hover:text-foreground"
                  )}
                  style={{ fontSize: '15px', fontWeight: 500 }}
                >
                  <span className={cn(
                    isAr ? "" : "uppercase tracking-[0.06em]"
                  )}>
                    {link.label}
                  </span>
                  {link.mega && <ChevronDown className="w-3.5 h-3.5 opacity-50" />}
                  {/* Underline — permanent for active, animated for hover */}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 ltr:left-0 rtl:right-0 h-[2px] bg-primary transition-all duration-200 ease-out",
                      isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                    )}
                    style={{ transitionProperty: 'width' }}
                  />
                </Link>
                {/* Hover underline via CSS peer */}
                <style>{`
                  div:has(> a[href="${link.href}"]):hover span.absolute.-bottom-0\\.5 {
                    width: 100% !important;
                  }
                `}</style>
              </div>
            ))}
          </nav>

          {/* Right side: search + lang + hamburger */}
          <div className="flex items-center gap-3 rtl:flex-row-reverse">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full text-foreground/60 hover:text-primary hover:bg-secondary/60 transition-all duration-200"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Language Switcher — desktop */}
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            {/* CTA — desktop */}
            <Link
              to="/contact"
              className="hidden lg:inline-flex items-center justify-center text-primary-foreground font-semibold transition-all duration-200 hover:shadow-md"
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                backgroundColor: 'hsl(var(--primary))',
                fontSize: '14px',
                fontWeight: 600,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.filter = 'brightness(0.9)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px hsl(var(--primary) / 0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.filter = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              {t('hero.quote')}
            </Link>

            {/* Hamburger — mobile */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen
                ? <X className="text-primary" style={{ width: 24, height: 24 }} />
                : <Menu className="text-primary" style={{ width: 24, height: 24 }} />
              }
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: isSearchOpen ? '64px' : '0px',
            paddingTop: isSearchOpen ? '8px' : '0px',
            paddingBottom: isSearchOpen ? '12px' : '0px',
            borderTop: isSearchOpen ? '1px solid hsl(var(--border))' : '1px solid transparent',
          }}
        >
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

        {/* Mobile Menu — slide down */}
        <div
          className="lg:hidden overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: isMenuOpen ? '600px' : '0px',
            borderTop: isMenuOpen ? '1px solid hsl(var(--border))' : '1px solid transparent',
          }}
        >
          <nav className="flex flex-col rtl:text-right" style={{ padding: '16px' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center transition-colors duration-200",
                  isActive(link.href) ? "text-primary" : "text-foreground/80 hover:text-primary",
                  isAr ? "justify-end" : ""
                )}
                style={{
                  height: '48px',
                  fontSize: '15px',
                  fontWeight: 500,
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  paddingLeft: isAr ? undefined : '4px',
                  paddingRight: isAr ? '4px' : undefined,
                }}
              >
                <span className={isAr ? "" : "uppercase tracking-wider text-sm"}>{link.label}</span>
              </Link>
            ))}

            {/* Mobile CTA */}
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 flex items-center justify-center text-primary-foreground font-semibold"
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                backgroundColor: 'hsl(var(--primary))',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {t('hero.quote')}
            </Link>

            {/* Mobile Language Switcher */}
            <div className="mt-4 flex justify-center">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      </div>

      {/* Mega Menus */}
      <MegaMenu items={solutionsMega} isOpen={openMega === 'solutions'} onLinkClick={() => setOpenMega(null)} />
      <MegaMenu items={industriesMega} isOpen={openMega === 'industries'} onLinkClick={() => setOpenMega(null)} />
    </header>
  );
}
