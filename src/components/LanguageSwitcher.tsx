import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();
  const isEn = language === 'en';

  return (
    <div
      className="inline-flex items-center overflow-hidden"
      style={{
        borderRadius: '20px',
        border: '1.5px solid hsl(var(--primary))',
      }}
    >
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "transition-all duration-200",
          isEn ? "text-primary-foreground" : "text-primary hover:bg-primary/10"
        )}
        style={{
          padding: '6px 14px',
          fontSize: '13px',
          fontWeight: 600,
          backgroundColor: isEn ? 'hsl(var(--primary))' : 'transparent',
          borderRadius: '18px 0 0 18px',
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ar')}
        className={cn(
          "transition-all duration-200",
          !isEn ? "text-primary-foreground" : "text-primary hover:bg-primary/10"
        )}
        style={{
          padding: '6px 14px',
          fontSize: '13px',
          fontWeight: 600,
          backgroundColor: !isEn ? 'hsl(var(--primary))' : 'transparent',
          borderRadius: '0 18px 18px 0',
        }}
      >
        AR
      </button>
    </div>
  );
}
