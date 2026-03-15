"use client";

import { useState, useCallback, useRef } from "react";
import { useUserStore } from "@/store/userStore";

interface VoiceInputProps {
  onResult: (text: string) => void;
  onListening?: (isListening: boolean) => void;
}

const LANG_MAP: Record<string, string> = {
  en: "en-IN",
  te: "te-IN",
  hi: "hi-IN",
};

export default function VoiceInput({ onResult, onListening }: VoiceInputProps) {
  const { language } = useUserStore();
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    setError("");

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = LANG_MAP[language] || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      onListening?.(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        setError("Microphone access denied");
      }
      setIsListening(false);
      onListening?.(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      onListening?.(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, onResult, onListening]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    onListening?.(false);
  }, [onListening]);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening
            ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
            : "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
        }`}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
      {isListening && (
        <span className="text-sm text-amber-600 font-medium animate-pulse">🎤 Listening...</span>
      )}
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
