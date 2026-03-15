"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import LakshmiChat from "@/components/mentor/LakshmiChat";
import { useProgressStore } from "@/store/progressStore";
import "@/lib/i18n";

const COURSES = [
  { id: "pricing", name: "Pricing", emoji: "💰", color: "from-amber-400 to-orange-500" },
  { id: "inventory", name: "Inventory", emoji: "📦", color: "from-emerald-400 to-teal-500" },
  { id: "digitalPayments", name: "Digital Payments", emoji: "📱", color: "from-blue-400 to-indigo-500" },
  { id: "customerService", name: "Customer Service", emoji: "🤝", color: "from-purple-400 to-pink-500" },
];

// Each course has 5 questions. Questions are keyed to i18n: quiz.<courseId>.q<N>, quiz.<courseId>.o<N>_<optIdx>, etc.
const QUIZ_META: Record<string, { count: number; answers: number[] }> = {
  pricing:         { count: 5, answers: [1, 1, 2, 1, 2] },
  inventory:       { count: 5, answers: [1, 1, 1, 1, 1] },
  digitalPayments: { count: 5, answers: [1, 1, 1, 2, 1] },
  customerService: { count: 5, answers: [1, 2, 1, 1, 1] },
};

export default function LearnPage() {
  const { t, i18n } = useTranslation();
  const { updateSkill } = useProgressStore();

  const [activeTab, setActiveTab] = useState<"courses" | "chat">("courses");
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // ─── TTS using browser speechSynthesis ─────────────────────────────────
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Map i18n language code to BCP-47 speech synthesis lang
    const langMap: Record<string, string> = { en: "en-IN", te: "te-IN", hi: "hi-IN" };
    utterance.lang = langMap[i18n.language] || "en-IN";
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [i18n.language]);

  const speakQuestion = useCallback(() => {
    if (!activeCourse) return;
    const qText = t(`quiz.${activeCourse}.q${currentQ}`);
    const options = [0, 1, 2, 3]
      .map((i) => `${String.fromCharCode(65 + i)}. ${t(`quiz.${activeCourse}.o${currentQ}_${i}`)}`)
      .join(". ");
    speak(`${qText}. ${options}`);
  }, [activeCourse, currentQ, t, speak]);

  // ─── Quiz logic ────────────────────────────────────────────────────────
  const handleAnswer = (answerIdx: number) => {
    if (!activeCourse) return;
    window.speechSynthesis?.cancel();
    const meta = QUIZ_META[activeCourse];
    const isCorrect = answerIdx === meta.answers[currentQ];
    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) setScore(newScore);

    if (currentQ < meta.count - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setShowResult(true);
      const courseConfig = COURSES.find((c) => c.id === activeCourse);
      const skillName = courseConfig?.name || activeCourse;
      updateSkill(skillName, {
        score: (newScore / meta.count) * 100,
        completed: true,
        level: Math.max(1, Math.floor((newScore / meta.count) * 5)),
      });
    }
  };

  const resetQuiz = () => {
    window.speechSynthesis?.cancel();
    setQuizActive(false);
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setActiveCourse(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("learn.title")}</h1>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "courses" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500"
          }`}
        >
          📚 {t("learn.courses")}
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "chat" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500"
          }`}
        >
          💬 {t("learn.askQuestion")}
        </button>
      </div>

      {activeTab === "chat" ? (
        <LakshmiChat />
      ) : quizActive && activeCourse ? (
        /* Quiz */
        <div className="max-w-2xl mx-auto">
          {showResult ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Card variant="gradient" padding="lg" className="text-center">
                <span className="text-6xl block mb-4">{score >= 3 ? "🎉" : "📖"}</span>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("learn.quizComplete")}</h2>
                <p className="text-4xl font-bold text-amber-600 mb-2">{score}/5</p>
                <p className="text-gray-600 mb-6">
                  {score >= 3 ? t("learn.quizPass") : t("learn.quizFail")}
                </p>
                {score >= 3 && <Badge label={t("learn.badge")} variant="premium" size="md" icon="🏆" />}
                <Button variant="primary" className="mt-6" onClick={resetQuiz}>{t("common.back")}</Button>
              </Card>
            </motion.div>
          ) : (
            <Card variant="glass" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  {t("learn.questionNum", { current: currentQ + 1, total: 5 })}
                </h2>
                <div className="flex items-center gap-2">
                  {/* 🔊 Speaker button */}
                  <button
                    onClick={speakQuestion}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      speaking
                        ? "bg-amber-100 text-amber-600 animate-pulse"
                        : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                    }`}
                    title={t("learn.speakQuestion")}
                  >
                    🔊
                  </button>
                  <ProgressBar value={(currentQ / 5) * 100} color="amber" showLabel={false} size="sm" className="w-32" />
                </div>
              </div>
              <p className="text-lg text-gray-800 mb-6">
                {t(`quiz.${activeCourse}.q${currentQ}`)}
              </p>
              <div className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all duration-200 font-medium"
                  >
                    {String.fromCharCode(65 + i)}. {t(`quiz.${activeCourse}.o${currentQ}_${i}`)}
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : (
        /* Course Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COURSES.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card variant="default" padding="lg" hoverable>
                <div className={`w-14 h-14 bg-gradient-to-br ${course.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <span className="text-2xl">{course.emoji}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t(`learn.${course.id}`)}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t("learn.courseInfo")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveCourse(course.id);
                    setQuizActive(true);
                    setCurrentQ(0);
                    setScore(0);
                    setShowResult(false);
                  }}
                >
                  {t("learn.quiz")} →
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
