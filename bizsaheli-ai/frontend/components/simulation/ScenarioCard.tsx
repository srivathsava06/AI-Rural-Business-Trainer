"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import "@/lib/i18n";

interface ScenarioOption {
  label: string;
  text: string;
  risk_level: string;
}

interface ScenarioCardProps {
  scenario: string;
  options: ScenarioOption[];
  difficulty: string;
  category: string;
  onChoose: (choice: string) => void;
  isLoading?: boolean;
}

const riskColors: Record<string, string> = {
  low: "border-emerald-300 bg-emerald-50 hover:border-emerald-500",
  medium: "border-amber-300 bg-amber-50 hover:border-amber-500",
  high: "border-red-300 bg-red-50 hover:border-red-500",
};

const riskBadgeColors: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export default function ScenarioCard({
  scenario,
  options,
  difficulty,
  category,
  onChoose,
  isLoading,
}: ScenarioCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card variant="glass" padding="lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {t("simulation.todayScenario")}
          </h2>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              difficulty === "easy" ? "bg-emerald-100 text-emerald-700"
              : difficulty === "hard" ? "bg-red-100 text-red-700"
              : "bg-amber-100 text-amber-700"
            }`}>
              {t(`labels.${difficulty}`)}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {t(`labels.${category}`)}
            </span>
          </div>
        </div>

        {/* Scenario description */}
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          {scenario}
        </p>

        {/* Options */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
          {t("simulation.chooseOption")}
        </h3>
        <div className="space-y-3">
          {options.map((option, i) => (
            <motion.button
              key={option.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              onClick={() => onChoose(option.label)}
              disabled={isLoading}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                riskColors[option.risk_level] || riskColors.medium
              } disabled:opacity-50`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-gray-700 shadow-sm flex-shrink-0">
                    {option.label}
                  </span>
                  <p className="text-gray-800 font-medium">{option.text}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                  riskBadgeColors[option.risk_level] || riskBadgeColors.medium
                }`}>
                  {t(`labels.${option.risk_level}Risk`)}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Voice hint */}
        <p className="text-center text-sm text-gray-400 mt-4">
          🎤 {t("simulation.voiceChoose")}
        </p>
      </Card>
    </motion.div>
  );
}
