"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useUserStore } from "@/store/userStore";
import "@/lib/i18n";

export default function LoginPage() {
  const { t } = useTranslation();
  const { setUser } = useUserStore();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const handleSendOTP = async () => {
    setError("");
    if (!phone || phone.length < 10) {
      setError("Please enter a valid mobile number (include country code, e.g., +91)");
      return;
    }
    setIsLoading(true);
    try {
      const { setupRecaptcha, sendOTP } = await import("@/lib/firebase");
      const verifier = setupRecaptcha("send-otp-btn");
      const result = await sendOTP(phone, verifier);
      setConfirmation(result);
      setStep("otp");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || t("auth.otpError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError("");
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    if (!confirmation) {
      setError("Session expired. Please request OTP again.");
      setStep("phone");
      return;
    }
    setIsLoading(true);
    try {
      const { verifyOTP } = await import("@/lib/firebase");
      const user = await verifyOTP(confirmation, otp);
      setUser(user.uid, phone);
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err);
      setError(err?.message || t("auth.otpError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card variant="glass" padding="lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/25">
              <span className="text-white text-3xl font-bold">B</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {t("auth.loginTitle")}
            </h1>
            <p className="text-sm text-gray-500">{t("common.tagline")}</p>
          </div>

          {/* Phone Step */}
          {step === "phone" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("auth.phoneLabel")}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("auth.phonePlaceholder")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 text-lg"
                maxLength={15}
              />
              {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              )}
              <Button
                id="send-otp-btn"
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isLoading}
                onClick={handleSendOTP}
                className="mt-4"
              >
                {t("auth.sendOtp")}
              </Button>
            </motion.div>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-emerald-50 text-emerald-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <span>✅</span>
                {t("auth.otpSent")} <strong>{phone}</strong>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("auth.otpLabel")}
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder={t("auth.otpPlaceholder")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 text-center text-2xl tracking-widest"
                maxLength={6}
              />
              {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              )}
              <Button
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isLoading}
                onClick={handleVerifyOTP}
                className="mt-4"
              >
                {t("auth.verifyOtp")}
              </Button>
              <button
                onClick={() => setStep("phone")}
                className="w-full mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                ← {t("auth.resendOtp")}
              </button>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
