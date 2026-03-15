"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useBusinessStore, Business } from "@/store/businessStore";
import { useUserStore } from "@/store/userStore";
import "@/lib/i18n";

const businessSchema = z.object({
  type: z.string().min(1, "Business type is required").max(80),
  capital: z.number().refine((v) => [1000, 5000, 10000, 20000].includes(v), {
    message: "Must be 1000, 5000, 10000, or 20000",
  }),
  location: z.enum(["village", "town", "city", "online"]),
  payment_mode: z.enum(["cash", "gpay", "both"]),
});

type BusinessForm = z.infer<typeof businessSchema>;

const STEPS = ["step1", "step2", "step3", "step4"] as const;

export default function NewBusinessPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { businesses, addBusiness } = useBusinessStore();
  const { userId } = useUserStore();
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BusinessForm>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      type: "",
      capital: 5000,
      location: "village",
      payment_mode: "cash",
    },
  });

  const formValues = watch();

  if (businesses.length >= 3) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl mb-4 block">🚫</span>
        <p className="text-gray-600 text-lg">{t("business.maxBusinesses")}</p>
        <a href="/dashboard">
          <Button variant="outline" className="mt-4">{t("common.back")}</Button>
        </a>
      </div>
    );
  }

  const onSubmit = (data: BusinessForm) => {
    const newBusiness: Business = {
      business_id: "biz-" + Date.now(),
      type: data.type,
      capital: data.capital,
      location: data.location,
      payment_mode: data.payment_mode,
      inventory: {},
      profit: 0,
      day: 1,
    };
    addBusiness(newBusiness);
    router.push(`/business/${newBusiness.business_id}`);
  };

  const capitalOptions = [
    { value: 1000, label: t("business.capital1k") },
    { value: 5000, label: t("business.capital5k") },
    { value: 10000, label: t("business.capital10k") },
    { value: 20000, label: t("business.capital20k") },
  ];

  const locationOptions = [
    { value: "village" as const, label: t("business.village"), emoji: "🏡" },
    { value: "town" as const, label: t("business.town"), emoji: "🏘️" },
    { value: "city" as const, label: t("business.city"), emoji: "🏙️" },
    { value: "online" as const, label: t("business.online"), emoji: "🌐" },
  ];

  const paymentOptions = [
    { value: "cash" as const, label: t("business.cash"), emoji: "💵" },
    { value: "gpay" as const, label: t("business.gpay"), emoji: "📱" },
    { value: "both" as const, label: t("business.both"), emoji: "💳" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("business.createTitle")}</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i <= step
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 h-0.5 ${i < step ? "bg-amber-400" : "bg-gray-200"} transition-all duration-300`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Step 1: Business Type */}
          {step === 0 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card variant="glass" padding="lg">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{t("business.step1")}</h2>
                <p className="text-sm text-gray-500 mb-4">{t("business.typeVoiceHint")}</p>
                <input
                  type="text"
                  {...register("type")}
                  placeholder={t("business.typePlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-lg"
                />
                {errors.type && <p className="text-sm text-red-500 mt-2">{errors.type.message}</p>}
                <Button variant="primary" size="lg" fullWidth className="mt-6" onClick={() => formValues.type && setStep(1)}>
                  {t("common.next")} →
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Capital */}
          {step === 1 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card variant="glass" padding="lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("business.capitalLabel")}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {capitalOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue("capital", opt.value)}
                      className={`p-4 rounded-xl border-2 text-center font-bold text-lg transition-all duration-200 ${
                        formValues.capital === opt.value
                          ? "border-amber-500 bg-amber-50 text-amber-700 shadow-lg shadow-amber-500/10"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="ghost" size="lg" onClick={() => setStep(0)}>← {t("common.back")}</Button>
                  <Button variant="primary" size="lg" fullWidth onClick={() => setStep(2)}>{t("common.next")} →</Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Location */}
          {step === 2 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card variant="glass" padding="lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("business.locationLabel")}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {locationOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue("location", opt.value)}
                      className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                        formValues.location === opt.value
                          ? "border-amber-500 bg-amber-50 text-amber-700 shadow-lg shadow-amber-500/10"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl block mb-1">{opt.emoji}</span>
                      <span className="font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="ghost" size="lg" onClick={() => setStep(1)}>← {t("common.back")}</Button>
                  <Button variant="primary" size="lg" fullWidth onClick={() => setStep(3)}>{t("common.next")} →</Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Payment Mode */}
          {step === 3 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card variant="glass" padding="lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("business.paymentLabel")}</h2>
                <div className="grid grid-cols-1 gap-3">
                  {paymentOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue("payment_mode", opt.value)}
                      className={`p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all duration-200 ${
                        formValues.payment_mode === opt.value
                          ? "border-amber-500 bg-amber-50 text-amber-700 shadow-lg shadow-amber-500/10"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="ghost" size="lg" onClick={() => setStep(2)}>← {t("common.back")}</Button>
                  <Button variant="primary" size="lg" fullWidth type="submit">
                    {t("business.startBusiness")} 🚀
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
