import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
 
import { cn } from "~/lib/utils"
 
/**
 * ------------------------------------------------------------------
 * GlassFilter
 * ------------------------------------------------------------------
 * The "Liquid Glass" look on the web relies on backdrop-filter being
 * pointed at an SVG filter (feTurbulence + feGaussianBlur +
 * feDisplacementMap) instead of (or in addition to) a plain blur.
 * That's the technique covered in the Frontend Masters article on
 * Liquid Glass: https://frontendmasters.com/blog/liquid-glass-on-the-web/
 *
 * This component renders that filter once, hidden, somewhere near the
 * root of your app (e.g. in layout.tsx). Every <Button variant="glass" />
 * then references it via `backdrop-filter: blur(...) url(#liquid-glass-distortion)`.
 *
 * Usage:
 *   // app/layout.tsx
 *   import { GlassFilter } from "@/components/ui/button"
 *   ...
 *   <body>
 *     <GlassFilter />
 *     {children}
 *   </body>
 *
 * Note: Safari & Firefox support `url(#filter)` inside backdrop-filter.
 * Chrome currently ignores it, so the component also layers a regular
 * `backdrop-blur` + saturation as a graceful fallback — Chrome users
 * still get a frosted glass look, just without the wavy refraction.
 * ------------------------------------------------------------------
 */
export function GlassFilter() {
  return (
    <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
      <defs>
        <filter
          id="liquid-glass-distortion"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.012"
            numOctaves="2"
            seed="92"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="40"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}
 
/**
 * ------------------------------------------------------------------
 * Button variants
 * ------------------------------------------------------------------
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:ring-primary",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 focus-visible:ring-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        /**
         * Liquid Glass
         * - translucent fill + saturated backdrop blur (frosted base)
         * - SVG distortion filter for the "refraction" feel (Safari/Firefox)
         * - inset highlight on top edge + soft inset shadow on the bottom
         *   to mimic the curved-edge light catch from the article
         * - subtle top-to-bottom gradient sheen
         */
        glass:
          cn(
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
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-2xl px-8 text-base",
        icon: "h-9 w-9 [&_svg]:size-5",
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
