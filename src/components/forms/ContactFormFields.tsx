import type { ReactNode } from "react";

export function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full min-w-0">
      <label
        className="mb-2 block text-[0.9rem] font-semibold normal-case tracking-[0.02em]"
        style={{ color: "hsl(var(--foreground)/0.85)" }}
      >
        {label}
        {required && <span style={{ color: "hsl(var(--primary))" }}> *</span>}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

/** Shared field shell: 1rem type, border, focus on border only */
export const fieldShell = [
  "w-full min-w-0 box-border border border-border bg-background text-foreground",
  "text-base leading-normal font-[var(--font-body)]",
  "placeholder:text-muted-foreground",
  "focus:outline-none focus:border-primary",
  "transition-[border-color] duration-200 ease-in-out",
].join(" ");

export const controlPad = { padding: "0.75rem 1rem", fontSize: "1rem" } as const;
export const inputHeight = { height: "48px", ...controlPad } as const;
export const textareaMin = { minHeight: "140px", resize: "vertical" as const, ...controlPad };
