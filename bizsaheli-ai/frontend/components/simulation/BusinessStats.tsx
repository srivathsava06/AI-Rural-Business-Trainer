"use client";

import { useTranslation } from "react-i18next";
import Card from "@/components/ui/Card";
import "@/lib/i18n";

interface BusinessStatsProps {
  capital: number;
  profit: number;
  inventory: number;
  day: number;
  costPerUnit?: number;
  sellingPrice?: number;
}

export default function BusinessStats({
  capital,
  profit,
  inventory,
  day,
  costPerUnit = 0,
  sellingPrice = 0,
}: BusinessStatsProps) {
  const { t } = useTranslation();

  const stats = [
    { label: t("dashboard.day"), value: day.toString(), emoji: "📅", color: "text-blue-600" },
    { label: t("dashboard.capital"), value: `₹${capital.toLocaleString()}`, emoji: "💰", color: "text-amber-600" },
    { label: t("dashboard.profit"), value: `₹${profit.toLocaleString()}`, emoji: profit >= 0 ? "📈" : "📉", color: profit >= 0 ? "text-emerald-600" : "text-red-500" },
    { label: t("simulation.inventory"), value: inventory.toString(), emoji: "📦", color: "text-purple-600" },
  ];

  return (
    <Card variant="default" padding="md">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <span className="text-2xl block mb-1">{stat.emoji}</span>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
      {(costPerUnit > 0 || sellingPrice > 0) && (
        <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
          <span>{t("labels.costPerUnit")}: <strong className="text-gray-700">₹{costPerUnit}</strong></span>
          <span>{t("labels.pricePerUnit")}: <strong className="text-gray-700">₹{sellingPrice}</strong></span>
          <span>{t("labels.margin")}: <strong className={sellingPrice > costPerUnit ? "text-emerald-600" : "text-red-500"}>
            {sellingPrice > 0 ? Math.round(((sellingPrice - costPerUnit) / sellingPrice) * 100) : 0}%
          </strong></span>
        </div>
      )}
    </Card>
  );
}
