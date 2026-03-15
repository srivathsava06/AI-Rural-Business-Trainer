"use client";

import { useTranslation } from "react-i18next";
import { useUserStore } from "@/store/userStore";
import "@/lib/i18n";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage, voiceOn, toggleVoice, isAuthenticated, logout } =
    useUserStore();

  const handleLanguageChange = (lang: "en" | "te" | "hi") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
              <span className="text-white text-lg font-bold">B</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {t("common.appName")}
            </span>
          </a>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              {(["en", "te", "hi"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    language === lang
                      ? "bg-white text-amber-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t(`language.${lang}`)}
                </button>
              ))}
            </div>

            {/* Voice Toggle */}
            {isAuthenticated && (
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  voiceOn
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-100 text-gray-400"
                }`}
                title={t("mentor.voiceToggle")}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {voiceOn ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  )}
                </svg>
              </button>
            )}

            {/* Logout */}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
