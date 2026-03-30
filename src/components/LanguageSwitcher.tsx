import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();
  const isEn = language === 'en';

  return (
    <button
      onClick={() => setLanguage(isEn ? 'ar' : 'en')}
      className={cn(
        "relative flex items-center h-8 w-[72px] rounded-full border border-border bg-secondary/50 transition-colors duration-200 hover:border-primary/40 overflow-hidden"
      )}
      title={isEn ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
    >
      {/* Sliding pill indicator */}
      <span
        className={cn(
          "absolute top-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)] rounded-full bg-primary transition-all duration-300 ease-out",
          isEn ? "left-0.5" : "left-[calc(50%+1px)]"
        )}
      />
      <span
        className={cn(
          "relative z-10 flex-1 text-center text-xs font-bold transition-colors duration-200",
          isEn ? "text-primary-foreground" : "text-foreground/60"
        )}
      >
        EN
      </span>
      <span
        className={cn(
          "relative z-10 flex-1 text-center text-xs font-bold transition-colors duration-200",
          !isEn ? "text-primary-foreground" : "text-foreground/60"
        )}
      >
        AR
      </span>
    </button>
  );
}
