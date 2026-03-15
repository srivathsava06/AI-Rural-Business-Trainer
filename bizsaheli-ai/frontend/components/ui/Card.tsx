"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "glass" | "gradient" | "bordered";
  padding?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
  onClick,
  hoverable = false,
}: CardProps) {
  const variantClasses = {
    default:
      "bg-white border border-gray-100 shadow-sm",
    glass:
      "bg-white/70 backdrop-blur-lg border border-white/20 shadow-xl",
    gradient:
      "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 shadow-sm",
    bordered:
      "bg-white border-2 border-amber-200 shadow-sm",
  };

  const paddingClasses = {
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };

  return (
    <div
      className={`rounded-2xl ${variantClasses[variant]} ${paddingClasses[padding]} ${
        hoverable
          ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
