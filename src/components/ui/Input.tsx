"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative group">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-[#1a1a1a] border border-[#333] rounded-lg py-2 text-sm text-white placeholder:text-gray-500 focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all",
            icon ? "pl-10 pr-4" : "px-4",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
