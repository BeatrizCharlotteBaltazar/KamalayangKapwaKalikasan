import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "brown" | "accent";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E5E34] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-[#2E5E34] hover:bg-[#1F4425] text-white shadow-sm hover:shadow-md",
      secondary:
        "bg-[#EAF1E4] hover:bg-[#d6e5cc] text-[#2E5E34] font-semibold",
      outline:
        "border-2 border-[#2E5E34] text-[#2E5E34] hover:bg-[#EAF1E4] bg-transparent",
      ghost:
        "text-[#1E2A1F] hover:bg-[#EAF1E4] hover:text-[#2E5E34] bg-transparent",
      brown:
        "bg-[#8B5A2B] hover:bg-[#6E4620] text-white shadow-sm hover:shadow-md",
      accent:
        "bg-[#5A8F3E] hover:bg-[#4a7732] text-white shadow-sm hover:shadow-md",
    };

    const sizes = {
      sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
      md: "h-11 px-5 text-sm rounded-xl gap-2",
      lg: "h-12 px-7 text-base rounded-xl gap-2.5 font-semibold",
      icon: "h-10 w-10 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
