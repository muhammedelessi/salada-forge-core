import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLanguageStore } from "@/store/languageStore";
import { cn } from "@/lib/utils";
import heroPort from "@/assets/hero-port.webp";

interface PageHeroProps {
  /** Current-page label shown after "Home /" in the breadcrumb. */
  breadcrumbLabel: string;
  title: string;
  description?: string;
  image?: string;
  minHeight?: number;
  /** Optional extra content rendered under the description (e.g. counts, filters). */
  children?: ReactNode;
}

/** Shared dark page hero: background image + breadcrumb + title + subtitle. */
export function PageHero({
  breadcrumbLabel,
  title,
  description,
  image = heroPort,
  minHeight = 260,
  children,
}: PageHeroProps) {
  const { isRTL } = useLanguageStore();
  const isAr = isRTL();
  const mh = `${minHeight}px`;

  return (
    <section className="relative overflow-hidden" dir={isAr ? "rtl" : "ltr"} style={{ minHeight: mh }}>
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          aria-hidden
          width={1920}
          height={1080}
          decoding="async"
          className="h-full w-full max-w-full object-cover object-center"
          style={{ filter: "grayscale(18%) brightness(0.48)" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(8,6,2,0.58)" }} />
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "1.5px",
            background:
              "linear-gradient(to right, transparent, hsl(var(--primary)/0.45) 25%, hsl(var(--primary)/0.45) 75%, transparent)",
          }}
        />
      </div>

      <div
        className="industrial-container relative z-10 flex flex-col justify-center py-10 md:py-14"
        style={{ minHeight: mh }}
      >
        <div className={cn("max-w-xl text-start", isAr && "ml-auto")}>
          <nav className="page-hero-breadcrumb mb-4 flex items-center gap-1.5">
            <Link
              to="/"
              className="hero-crumb label-text text-label-md uppercase tracking-[0.15em]"
              style={{ color: "rgba(255,255,255,0.32)" }}
            >
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
            <span
              className="hero-crumb label-text text-label-md uppercase tracking-[0.15em]"
              style={{ color: "hsl(var(--primary))" }}
            >
              {breadcrumbLabel}
            </span>
          </nav>

          <h1 className="hero-title-primary font-black uppercase leading-[0.93] tracking-[-0.025em] mb-3">
            {title}
          </h1>

          {description ? (
            <p className="hero-subtitle leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "36rem" }}>
              {description}
            </p>
          ) : null}

          {children}
        </div>
      </div>
    </section>
  );
}
