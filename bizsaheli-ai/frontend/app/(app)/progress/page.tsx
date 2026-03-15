"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { useProgressStore } from "@/store/progressStore";
import { useBusinessStore } from "@/store/businessStore";
import "@/lib/i18n";

export default function ProgressPage() {
  const { t } = useTranslation();
  const { readinessScore, badges, skills } = useProgressStore();
  const { decisions } = useBusinessStore();

  const ALL_SKILLS = ["Pricing", "Inventory", "Digital Payments", "Customer Service"];
  const displaySkills = ALL_SKILLS.map(skillName => {
    const existing = skills.find(s => s.skill === skillName);
    return existing || { skill: skillName, level: 0, completed: false, score: 0 };
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("progress.title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Score - Big Circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1"
        >
          <Card variant="gradient" padding="lg" className="text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t("progress.readiness")}</h2>
            <div className="relative w-40 h-40 mx-auto mb-4">
              {/* Background circle */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#fef3c7" strokeWidth="10" />
                <motion.circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="url(#gradient)" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${readinessScore * 3.26} 326.7`}
                  initial={{ strokeDasharray: "0 326.7" }}
                  animate={{ strokeDasharray: `${readinessScore * 3.26} 326.7` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <span className="text-3xl font-bold text-gray-900">{readinessScore}</span>
                  <span className="text-lg text-gray-500">%</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {readinessScore >= 70
                ? "You're almost ready to start a real business! 🎉"
                : readinessScore >= 40
                ? "Good progress! Keep learning and practicing! 💪"
                : "Keep going! Every decision helps you learn! 🌱"}
            </p>
          </Card>
        </motion.div>

        {/* Skills */}
        <div className="lg:col-span-2">
          <Card variant="default" padding="lg">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t("progress.skills")}</h2>
            <div className="space-y-4">
              {displaySkills.map((skill, i) => (
                <motion.div
                  key={skill.skill}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {t("progress.level")} {skill.level}/5
                      </span>
                      {skill.completed && (
                        <Badge label="✓" variant="success" size="sm" />
                      )}
                    </div>
                  </div>
                  <ProgressBar
                    value={skill.score}
                    color={
                      skill.score >= 70
                        ? "emerald"
                        : skill.score >= 40
                        ? "amber"
                        : "blue"
                    }
                    size="md"
                    showLabel={false}
                  />
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-6">
        <Card variant="default" padding="lg">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t("progress.badges")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                className={`text-center p-4 rounded-xl border-2 transition-all ${
                  badge.earned
                    ? "border-amber-300 bg-amber-50"
                    : "border-gray-200 bg-gray-50 opacity-50"
                }`}
                whileHover={badge.earned ? { scale: 1.05 } : {}}
              >
                <span className="text-3xl block mb-2">
                  {badge.earned ? "🏆" : "🔒"}
                </span>
                <p className="text-sm font-bold text-gray-800">{badge.name}</p>
                <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Decision History */}
      <div className="mt-6">
        <Card variant="default" padding="lg">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t("progress.decisions")}</h2>
          {decisions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No decisions yet. Start a business simulation to see your history!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-3 py-2 font-bold text-gray-600 rounded-tl-xl">{t("dashboard.day")}</th>
                    <th className="text-left px-3 py-2 font-bold text-gray-600">Scenario</th>
                    <th className="text-left px-3 py-2 font-bold text-gray-600">Choice</th>
                    <th className="text-left px-3 py-2 font-bold text-gray-600 rounded-tr-xl">{t("simulation.profitLoss")}</th>
                  </tr>
                </thead>
                <tbody>
                  {decisions.map((d, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-3 py-2 font-medium">{d.day}</td>
                      <td className="px-3 py-2 text-gray-600 max-w-xs truncate">{d.scenario}</td>
                      <td className="px-3 py-2">
                        <Badge label={d.choice} variant="info" />
                      </td>
                      <td className={`px-3 py-2 font-bold ${d.profit_delta >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {d.profit_delta >= 0 ? "+" : ""}₹{d.profit_delta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
