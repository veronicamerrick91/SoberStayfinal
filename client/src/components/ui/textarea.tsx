import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-lg border-2 bg-background/60 px-4 py-3 text-base shadow-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:bg-background/80 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-primary/40 hover:border-primary/60 focus-visible:border-primary transition-all",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
