import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono uppercase tracking-[0.18em] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 min-h-[44px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground font-bold text-[0.65rem] transition-opacity hover:opacity-[0.88] [&_svg]:w-3.5 [&_svg]:h-3.5",
        destructive:
          "bg-destructive text-destructive-foreground font-bold text-[0.65rem] transition-opacity hover:opacity-[0.88] [&_svg]:w-3.5 [&_svg]:h-3.5",
        outline:
          "border border-border text-foreground/70 font-medium text-[0.65rem] transition-[border-color,color] duration-150 hover:border-primary hover:text-primary [&_svg]:w-3.5 [&_svg]:h-3.5",
        secondary:
          "border border-border text-foreground/70 font-medium text-[0.65rem] transition-[border-color,color] duration-150 hover:border-primary hover:text-primary [&_svg]:w-3.5 [&_svg]:h-3.5",
        ghost: "bg-transparent border-0 text-muted-foreground font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-colors duration-150 hover:text-primary [&_svg]:w-3.5 [&_svg]:h-3.5",
        link: "text-primary underline-offset-4 hover:underline text-[0.65rem] font-medium",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "h-10 w-10 min-h-[40px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
