"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import "@/lib/i18n";

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    { key: "feature1", emoji: "🛡️" },
    { key: "feature2", emoji: "🤖" },
    { key: "feature3", emoji: "📈" },
  ];

  const testimonials = [
    { key: "testimonial1" },
    { key: "testimonial2" },
    { key: "testimonial3" },
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
              <span className="text-white text-lg font-bold">B</span>
            </div>
            <span className="text-xl font-bold gradient-text">
              {t("common.appName")}
            </span>
          </div>
          <a href="/login">
            <Button variant="primary" size="sm">{t("landing.cta")}</Button>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 via-orange-50/30 to-rose-100/50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
              🙏 AI-Powered Business Mentor
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              {t("landing.hero")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("landing.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/login">
                <Button variant="primary" size="lg">
                  {t("landing.cta")} →
                </Button>
              </a>
              <a href="#features">
                <Button variant="outline" size="lg">
                  {t("learn.title")}
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why {t("common.appName")}?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t("common.tagline")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <Card variant="gradient" padding="lg" hoverable>
                  <div className="text-4xl mb-4">{feature.emoji}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {t(`landing.${feature.key}Title`)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t(`landing.${feature.key}Desc`)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Stories from Rural Women
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t_item, i) => (
              <motion.div
                key={t_item.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <Card variant="glass" padding="lg">
                  <p className="text-gray-700 italic mb-4 leading-relaxed">
                    &ldquo;{t(`landing.${t_item.key}`)}&rdquo;
                  </p>
                  <p className="text-sm font-semibold text-amber-700">
                    — {t(`landing.${t_item.key}Author`)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start?
          </h2>
          <p className="text-gray-600 mb-8">
            {t("common.tagline")}
          </p>
          <a href="/login">
            <Button variant="primary" size="lg">
              {t("landing.cta")} 🚀
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            © 2026 {t("common.appName")} — Practice business safely before investing real money.
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Every rural woman deserves a mentor. 🙏
          </p>
        </div>
      </footer>
    </div>
  );
}
