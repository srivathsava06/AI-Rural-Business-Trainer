"use client";

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import VoiceInput from "@/components/voice/VoiceInput";
import { useUserStore } from "@/store/userStore";
import "@/lib/i18n";

interface ChatMessage {
  role: "user" | "mentor";
  text: string;
  timestamp: Date;
}

export default function LakshmiChat() {
  const { t, i18n } = useTranslation();
  const { voiceOn } = useUserStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "mentor", text: t("mentor.greeting"), timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/learn/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          language: i18n.language,
        }),
      });

      if (!res.ok) throw new Error("API failed");
      const data = await res.json();

      const mentorMsg: ChatMessage = {
        role: "mentor",
        text: data.answer || "I'm sorry, I couldn't understand that.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, mentorMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "mentor", text: t("common.error"), timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleVoiceResult = (text: string) => {
    setInput(text);
    sendMessage(text);
  };

  return (
    <Card variant="glass" padding="md" className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-lg">🙏</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Lakshmi</h3>
          <p className="text-xs text-emerald-500">● Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-hide">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder={t("mentor.askAnything")}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm"
          disabled={isLoading}
        />
        {voiceOn && (
          <VoiceInput onResult={handleVoiceResult} />
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={() => sendMessage(input)}
          isLoading={isLoading}
        >
          →
        </Button>
      </div>
    </Card>
  );
}
