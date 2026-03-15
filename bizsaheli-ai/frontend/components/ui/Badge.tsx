"use client";

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "info" | "premium";
  size?: "sm" | "md";
  icon?: string;
}

export default function Badge({
  label,
  variant = "default",
  size = "sm",
  icon,
}: BadgeProps) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700",
    premium:
      "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200",
  };

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
}
