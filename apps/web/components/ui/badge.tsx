import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        important: "border-transparent bg-[#FFFFFF] text-[#1C1C1C]",
        team: "border-[#4ADE80]/30 bg-[#4ADE80]/15 text-[#4ADE80]",
        vip: "border-[#FACC15]/30 bg-[#FACC15]/15 text-[#FACC15]",
        marketing: "border-transparent bg-[#5C5C5C]/20 text-[#A0A0A0]",
        social: "border-[#38BDF8]/30 bg-[#38BDF8]/15 text-[#38BDF8]",
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
