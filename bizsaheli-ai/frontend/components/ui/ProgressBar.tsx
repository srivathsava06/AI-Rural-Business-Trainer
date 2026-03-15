"use client";

interface ProgressBarProps {
  value: number; // 0-100
  color?: "amber" | "emerald" | "blue" | "red";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  color = "amber",
  size = "md",
  showLabel = true,
  animated = true,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const colorClasses = {
    amber: "from-amber-400 to-orange-500",
    emerald: "from-emerald-400 to-teal-500",
    blue: "from-blue-400 to-indigo-500",
    red: "from-red-400 to-rose-500",
  };

  const bgClasses = {
    amber: "bg-amber-100",
    emerald: "bg-emerald-100",
    blue: "bg-blue-100",
    red: "bg-red-100",
  };

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-500">Progress</span>
          <span className="text-xs font-bold text-gray-700">
            {Math.round(clamped)}%
          </span>
        </div>
      )}
      <div
        className={`w-full ${bgClasses[color]} rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full ${
            animated ? "transition-all duration-700 ease-out" : ""
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
