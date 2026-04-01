import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ChevronDown, ArrowUpRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import saladaLogo from "@/assets/SALADA_LOGO.png";

/* ══════════════════════════════════════
   MEGA MENU
══════════════════════════════════════ */
function MegaMenu({
  items,
  isOpen,
  onClose,
}: {
  items: { label: string; desc: string; href: string }[];
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "absolute top-full inset-x-0 z-50 overflow-hidden",
        "transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
      )}
    >
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, hsl(var(--primary)/0.5) 30%, hsl(var(--primary)/0.5) 70%, transparent)",
        }}
      />

      <div className="border-b border-border" style={{ background: "hsl(var(--background)/0.97)", backdropFilter: "blur(12px)" }}>
        <div className="container-xl py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className="group p-6 flex flex-col gap-1.5 bg-background hover:bg-primary/5 transition-colors duration-200"
              >
                <div
                  className="h-px mb-2 transition-all duration-300 bg-primary"
                  style={{ width: "0" }}
                  ref={(el) => {
                    if (!el) return;
                    el.closest("a")!.addEventListener("mouseenter", () => {
                      el.style.width = "1.5rem";
                    });
                    el.closest("a")!.addEventListener("mouseleave", () => {
                      el.style.width = "0";
                    });
                  }}
                />
                <span className="text-xs font-black uppercase tracking-[0.05em] text-foreground transition-colors duration-200">
                  {item.label}
                </span>
                <span className="text-[0.7rem] leading-relaxed text-muted-foreground">
                  {item.desc}
                </span>
                <span className="inline-flex items-center gap-1 mt-1 text-[0.6rem] font-mono uppercase tracking-[0.15em] text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  View <ArrowUpRight style={{ width: 10, height: 10 }} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MOBILE DRAWER
══════════════════════════════════════ */
function MobileDrawer({
  open,
  onClose,
  navLinks,
  isAr,
  currentPath,
}: {
  open: boolean;
  onClose: () => void;
  navLinks: { label: string; href: string }[];
  isAr: boolean;
  currentPath: string;
}) {
  const dir = isAr ? "rtl" : "ltr";

  return (
    <>
      {/* backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/35 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* drawer panel */}
      <div
        dir={dir}
        className={cn(
          "fixed top-0 z-50 h-full w-80 max-w-[90vw] flex flex-col bg-background",
          "transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          "ltr:left-0 rtl:right-0 ltr:border-r rtl:border-l border-border",
          open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full",
        )}
      >
        {/* drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-primary">
            {isAr ? "القائمة" : "Menu"}
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-muted-foreground transition-colors duration-200"
            aria-label="Close menu"
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* nav items */}
        <nav className="flex-1 overflow-y-auto px-6 py-8">
          {navLinks.map((link, i) => {
            const isActive = currentPath === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className="flex items-center justify-between py-4 border-b border-border group"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[0.55rem] font-mono text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-black uppercase tracking-[0.04em] transition-colors duration-200",
                      isActive ? "text-primary" : "text-foreground group-hover:text-primary",
                    )}
                  >
                    {link.label}
                  </span>
                </div>
                <ArrowUpRight
                  className={cn(
                    "shrink-0 transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                  )}
                  style={{ width: 14, height: 14 }}
                />
              </Link>
            );
          })}
        </nav>

        {/* drawer footer */}
        <div className="px-6 py-6 border-t border-border">
          <Link
            to="/contact"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 text-[0.65rem] bg-primary text-primary-foreground font-mono font-bold uppercase tracking-[0.18em] px-5 py-3 hover:opacity-90 transition-opacity"
          >
            <span>{isAr ? "اطلب عرض سعر" : "Request a Quote"}</span>
            <ArrowUpRight style={{ width: 14, height: 14 }} />
          </Link>
          <p className="text-center mt-4 text-[0.55rem] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            ISO Certified · DNV Approved
          </p>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════
   SEARCH OVERLAY
══════════════════════════════════════ */
function SearchOverlay({
  open,
  onClose,
  navLinks,
}: {
  open: boolean;
  onClose: () => void;
  navLinks: { label: string; href: string }[];
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = q.trim() ? navLinks.filter((l) => l.label.toLowerCase().includes(q.toLowerCase())) : [];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else setQ("");
  }, [open]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex items-start justify-center pt-28 px-4",
        "transition-all duration-300 bg-foreground/50 backdrop-blur-md",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "w-full max-w-xl bg-background border border-border transition-all duration-300",
          open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
        )}
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <Search className="text-primary shrink-0" style={{ width: 16, height: 16 }} />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none"
          />
          <button
            onClick={onClose}
            className="text-[0.6rem] font-mono uppercase tracking-[0.15em] px-2 py-1 border border-border text-muted-foreground"
          >
            Esc
          </button>
        </div>

        {results.length > 0 && (
          <div>
            {results.map((r) => (
              <Link
                key={r.href}
                to={r.href}
                onClick={() => {
                  onClose();
                  setQ("");
                }}
                className="flex items-center justify-between px-5 py-3.5 border-b border-border hover:bg-primary/5 transition-colors duration-150"
              >
                <span className="text-sm font-semibold text-foreground">{r.label}</span>
                <ArrowUpRight className="text-primary" style={{ width: 14, height: 14 }} />
              </Link>
            ))}
          </div>
        )}

        {q && results.length === 0 && (
          <p className="px-5 py-4 text-sm text-muted-foreground">
            No results for "{q}"
          </p>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   HEADER
══════════════════════════════════════ */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const megaTimer = useRef<ReturnType<typeof setTimeout>>();
  const { t, isRTL } = useLanguageStore();
  const location = useLocation();
  const isAr = isRTL();
  const dir = isAr ? "rtl" : "ltr";

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenMega(null);
  }, [location.pathname]);

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  /* nav items — Home added */
  const navLinks = [
    { label: isAr ? "الرئيسية" : "Home", href: "/" },
    { label: t("nav.solutions"), href: "/solutions", mega: "solutions" },
    { label: t("nav.shop"), href: "/shop" },
    { label: t("nav.industries"), href: "/industries", mega: "industries" },
    { label: t("nav.whySalada"), href: "/why-salada" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  /* mega menu data */
  const solutionsMega = [
    {
      label: isAr ? "حاويات الشحن" : "Shipping Containers",
      desc: isAr ? "حاويات ISO معتمدة بأحجام متعددة" : "ISO-certified containers in multiple sizes",
      href: "/solutions#shipping-containers",
    },
    {
      label: isAr ? "حاويات التخزين" : "Storage Containers",
      desc: isAr ? "وحدات تخزين جاهزة للنشر" : "Deployment-ready storage units",
      href: "/solutions#storage-containers",
    },
    {
      label: t("solutions.landFreight"),
      desc: isAr ? "دعم النقل البري الكامل" : "Complete ground transport support",
      href: "/solutions#land",
    },
    {
      label: t("solutions.seaFreight"),
      desc: isAr ? "البنية التحتية للشحن البحري" : "Maritime cargo infrastructure",
      href: "/solutions#sea",
    },
    {
      label: t("solutions.airFreight"),
      desc: isAr ? "حلول دعم الشحن الجوي" : "Air cargo support solutions",
      href: "/solutions#air",
    },
    {
      label: t("solutions.storage"),
      desc: isAr ? "حلول تخزين جاهزة" : "Modular storage solutions",
      href: "/solutions#storage",
    },
  ];

  const industriesMega = [
    {
      label: t("industries.logistics"),
      desc: isAr ? "حاويات معززة للشحن والنقل" : "Reinforced containers for freight",
      href: "/industries#logistics",
    },
    {
      label: t("industries.construction"),
      desc: isAr ? "حلول تخزين موثوقة في الموقع" : "Reliable on-site storage",
      href: "/industries#construction",
    },
    {
      label: t("industries.government"),
      desc: isAr ? "حاويات متوافقة مع المعايير" : "Standards-aligned containers",
      href: "/industries#government",
    },
    {
      label: t("industries.industrial"),
      desc: isAr ? "حلول للبيئات القاسية" : "Solutions for harsh environments",
      href: "/industries#industrial",
    },
    {
      label: t("industries.storage"),
      desc: isAr ? "حلول تخزين قابلة للتوسع" : "Scalable storage solutions",
      href: "/industries#storage",
    },
  ];

  const megaData: Record<string, typeof solutionsMega> = {
    solutions: solutionsMega,
    industries: industriesMega,
  };

  const handleMegaEnter = (key: string) => {
    clearTimeout(megaTimer.current);
    setOpenMega(key);
  };
  const handleMegaLeave = () => {
    megaTimer.current = setTimeout(() => setOpenMega(null), 180);
  };

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <>
      <header
        dir={dir}
        className={cn(
          "relative inset-x-0 z-50",
          "transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
        )}
        style={{
          background: "hsl(var(--background))",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        <div className="container-xl">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* ── Logo — bigger ── */}
            <Link to="/" className="flex items-center shrink-0 hover-lift" aria-label="Salada — Home">
              <img src={saladaLogo} alt="SALADA Metal Industries" className="h-6 md:h-8 w-auto object-contain" />
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const hasMega = Boolean(link.mega);
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => hasMega && handleMegaEnter(link.mega!)}
                    onMouseLeave={() => hasMega && handleMegaLeave()}
                  >
                    <Link
                      to={link.href}
                      className={cn(
                        "relative flex items-center gap-1 px-3 py-2",
                        "text-[0.7rem] font-black uppercase tracking-[0.08em]",
                        "transition-colors duration-200 group",
                        active
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {link.label}
                      {hasMega && (
                        <ChevronDown
                          className={cn(
                            "transition-transform duration-200",
                            openMega === link.mega ? "rotate-180" : "",
                          )}
                          style={{ width: 12, height: 12 }}
                        />
                      )}
                      {/* active underline */}
                      {active && (
                        <span className="absolute bottom-0 inset-x-3 h-px bg-primary" />
                      )}
                      {/* hover underline */}
                      {!active && (
                        <span
                          className="absolute bottom-0 ltr:left-3 rtl:right-3 h-px bg-foreground transition-all duration-300 w-0 group-hover:w-[calc(100%-1.5rem)]"
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-primary transition-colors duration-200"
                aria-label="Search"
              >
                <Search style={{ width: 17, height: 17 }} />
              </button>

              {/* Language switcher */}
              <LanguageSwitcher />

              {/* CTA — desktop */}
              <Link
                to="/contact"
                className="hidden md:inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono font-bold uppercase tracking-[0.18em] text-[0.6rem] px-5 py-2.5 hover:opacity-90 transition-opacity"
              >
                {isAr ? "اطلب عرض سعر" : "Get Quote"}
              </Link>

              {/* Hamburger — mobile */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 text-foreground transition-colors duration-200"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu style={{ width: 20, height: 20 }} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Mega menus ── */}
        {Object.entries(megaData).map(([key, items]) => (
          <div key={key} onMouseEnter={() => handleMegaEnter(key)} onMouseLeave={handleMegaLeave}>
            <MegaMenu items={items} isOpen={openMega === key} onClose={() => setOpenMega(null)} />
          </div>
        ))}
      </header>

      {/* ── Mobile drawer ── */}
      <MobileDrawer
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navLinks={navLinks}
        isAr={isAr}
        currentPath={location.pathname}
      />

      {/* ── Search overlay ── */}
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} navLinks={navLinks} />
    </>
  );
}
