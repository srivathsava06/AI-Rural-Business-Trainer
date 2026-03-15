"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import "@/lib/i18n";

interface ComparisonRow {
  option: string;
  action: string;
  result: string;
}

interface OutcomePanelProps {
  revenue: number;
  cost: number;
  profit: number;
  mentorMessage: string;
  comparisonTable: ComparisonRow[];
  isLoading?: boolean;
}

export default function OutcomePanel({
  revenue,
  cost,
  profit,
  mentorMessage,
  comparisonTable,
  isLoading,
}: OutcomePanelProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* P&L Result */}
      <Card variant={profit >= 0 ? "gradient" : "bordered"} padding="md" className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-3">{t("simulation.result")}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 font-medium">{t("simulation.revenue")}</p>
            <p className="text-xl font-bold text-emerald-600">₹{revenue.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 font-medium">{t("simulation.cost")}</p>
            <p className="text-xl font-bold text-gray-600">₹{cost.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 font-medium">{t("simulation.profitLoss")}</p>
            <p className={`text-xl font-bold ${profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {profit >= 0 ? "+" : ""}₹{profit.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Mentor Feedback */}
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🙏</span>
          <h3 className="text-lg font-bold text-amber-700">{t("simulation.mentorAdvice")}</h3>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t("mentor.thinking")}
          </div>
        ) : (
          <>
            <p className="text-gray-700 leading-relaxed mb-4">{mentorMessage}</p>

            {/* Comparison Table */}
            {comparisonTable.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-amber-50">
                      <th className="text-left px-3 py-2 font-bold text-amber-800 rounded-tl-xl">
                        {t("simulation.chooseOption")}
                      </th>
                      <th className="text-left px-3 py-2 font-bold text-amber-800">{t("labels.action")}</th>
                      <th className="text-left px-3 py-2 font-bold text-amber-800 rounded-tr-xl">{t("labels.result")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonTable.map((row, i) => (
                      <tr key={i} className="border-t border-amber-100">
                        <td className="px-3 py-2 font-bold text-gray-700">{row.option}</td>
                        <td className="px-3 py-2 text-gray-600">{row.action}</td>
                        <td className="px-3 py-2 text-gray-600">{row.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Card>
    </motion.div>
  );
}
