"use client";

import { create } from "zustand";

interface UserState {
  userId: string | null;
  phone: string | null;
  language: "en" | "te" | "hi";
  voiceOn: boolean;
  isAuthenticated: boolean;

  setUser: (userId: string, phone: string) => void;
  setLanguage: (lang: "en" | "te" | "hi") => void;
  toggleVoice: () => void;
  setVoice: (on: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  phone: null,
  language: "en",
  voiceOn: true,
  isAuthenticated: false,

  setUser: (userId, phone) =>
    set({ userId, phone, isAuthenticated: true }),

  setLanguage: (lang) =>
    set({ language: lang }),

  toggleVoice: () =>
    set((state) => ({ voiceOn: !state.voiceOn })),

  setVoice: (on) =>
    set({ voiceOn: on }),

  logout: () =>
    set({
      userId: null,
      phone: null,
      isAuthenticated: false,
    }),
}));
