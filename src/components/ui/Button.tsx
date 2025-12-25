"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-purple-600 text-white hover:bg-purple-700": variant === "primary",
            "bg-[#252525] text-gray-300 border border-[#333] hover:bg-[#333] hover:text-white":
              variant === "secondary",
            "text-gray-400 hover:text-white hover:bg-[#252525]": variant === "ghost",
            "bg-red-900/40 text-red-400 hover:bg-red-900/60": variant === "danger",
          },
          {
            "text-[10px] px-3 py-1.5 rounded": size === "sm",
            "text-xs px-4 py-2 rounded-md": size === "md",
            "text-sm px-6 py-3 rounded-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
