"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { useBusinessStore } from "@/store/businessStore";
import { useProgressStore } from "@/store/progressStore";
import "@/lib/i18n";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { businesses } = useBusinessStore();
  const { readinessScore, badges } = useProgressStore();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("dashboard.title")}</h1>
          <p className="text-gray-500 mt-1">{t("common.tagline")}</p>
        </div>
        <a href="/business/new" className="mt-4 sm:mt-0">
          <Button variant="primary" size="md">
            + {t("dashboard.createNew")}
          </Button>
        </a>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card variant="gradient" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">{t("dashboard.readinessScore")}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{readinessScore}%</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <ProgressBar value={readinessScore} color="amber" size="sm" showLabel={false} className="mt-3" />
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{t("dashboard.myBusinesses")}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{businesses.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🏪</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{t("progress.badges")}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{badges.filter((b) => b.earned).length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Business Cards */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">{t("dashboard.myBusinesses")}</h2>
      {businesses.length === 0 ? (
        <Card variant="bordered" padding="lg">
          <div className="text-center py-8">
            <span className="text-5xl mb-4 block">🌱</span>
            <p className="text-gray-600 mb-4">{t("dashboard.noBusiness")}</p>
            <a href="/business/new">
              <Button variant="primary">{t("dashboard.createNew")}</Button>
            </a>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {businesses.map((biz, i) => (
            <motion.a
              key={biz.business_id}
              href={`/business/${biz.business_id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card variant="default" padding="md" hoverable>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 capitalize">{biz.type}</h3>
                  <Badge
                    label={`${t("dashboard.day")} ${biz.day}`}
                    variant="info"
                  />
                </div>
                <div className="flex items-center gap-4 text-sm mt-2">
                  <span className="text-gray-500">
                    {t("dashboard.capital")}: <strong className="text-gray-700">₹{biz.capital.toLocaleString()}</strong>
                  </span>
                  <span className={biz.profit >= 0 ? "text-emerald-600" : "text-red-500"}>
                    {t("dashboard.profit")}: <strong>₹{biz.profit.toLocaleString()}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge label={biz.location} variant="default" />
                  <Badge label={biz.payment_mode} variant="default" />
                </div>
              </Card>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
