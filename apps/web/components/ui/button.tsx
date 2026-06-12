import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        solid: "bg-accent text-[#1C1C1C] hover:bg-accent-hover font-sans font-medium",
        glass: cn(
          "relative isolate text-foreground border border-white/30 dark:border-white/10",
          "bg-white/10 dark:bg-white/5",
          "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)]",
          "[backdrop-filter:blur(8px)_saturate(180%)_url(#liquid-glass-distortion)]",
          "[-webkit-backdrop-filter:blur(8px)_saturate(180%)]",
          "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit]",
          "before:bg-gradient-to-b before:from-white/40 before:to-white/0 before:opacity-50",
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]",
          "after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.15)]",
          "hover:bg-white/20 hover:dark:bg-white/10 hover:shadow-[0_8px_32px_-6px_rgba(0,0,0,0.3)]",
          "focus-visible:ring-white/60"
        ),
        destructive: "bg-danger text-[#1C1C1C] hover:bg-danger/90",
        outline: "bg-transparent text-text-primary border border-white/20 hover:border-white/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "bg-transparent text-text-primary border border-border hover:bg-surface-elevated",
        link: "text-text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "glass",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
