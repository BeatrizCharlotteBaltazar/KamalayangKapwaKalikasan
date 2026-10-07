import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "brown" | "outline" | "accent";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#EAF1E4] text-[#2E5E34] border-[#2E5E34]/20",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    brown: "bg-[#F3EBE1] text-[#8B5A2B] border-[#8B5A2B]/20",
    outline: "border border-[#2E5E34]/30 text-[#2E5E34] bg-transparent",
    accent: "bg-[#5A8F3E]/15 text-[#5A8F3E] border-[#5A8F3E]/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
