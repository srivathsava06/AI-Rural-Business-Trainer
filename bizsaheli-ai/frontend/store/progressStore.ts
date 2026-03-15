"use client";

import { create } from "zustand";

export interface SkillProgress {
  skill: string;
  level: number;
  completed: boolean;
  score: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
}

interface ProgressState {
  skills: SkillProgress[];
  readinessScore: number;
  decisionCount: number;
  badges: Badge[];

  setSkills: (skills: SkillProgress[]) => void;
  updateSkill: (skill: string, updates: Partial<SkillProgress>) => void;
  setReadinessScore: (score: number) => void;
  setDecisionCount: (count: number) => void;
  addBadge: (badge: Badge) => void;
  calculateReadiness: (
    decisionAccuracy: number,
    profitPerformance: number,
    quizAverage: number
  ) => number;
}

const DEFAULT_BADGES: Badge[] = [
  { id: "first_sale", name: "First Sale", description: "Made your first sale", earned: false },
  { id: "ten_days", name: "10 Days Running", description: "Ran business for 10 days", earned: false },
  { id: "no_fraud", name: "No Fraud Victim", description: "Avoided all fraud scenarios", earned: false },
  { id: "digital_pro", name: "Digital Pro", description: "Mastered digital payments", earned: false },
];

export const useProgressStore = create<ProgressState>((set) => ({
  skills: [],
  readinessScore: 0,
  decisionCount: 0,
  badges: DEFAULT_BADGES,

  setSkills: (skills) =>
    set({ skills }),

  updateSkill: (skill, updates) =>
    set((state) => ({
      skills: state.skills.map((s) =>
        s.skill === skill ? { ...s, ...updates } : s
      ),
    })),

  setReadinessScore: (score) =>
    set({ readinessScore: score }),

  setDecisionCount: (count) =>
    set({ decisionCount: count }),

  addBadge: (badge) =>
    set((state) => ({
      badges: state.badges.map((b) =>
        b.id === badge.id ? { ...b, earned: true, earnedAt: new Date().toISOString() } : b
      ),
    })),

  calculateReadiness: (decisionAccuracy, profitPerformance, quizAverage) => {
    const score =
      decisionAccuracy * 0.4 +
      profitPerformance * 0.35 +
      quizAverage * 0.25;
    const rounded = Math.round(score * 10) / 10;
    set({ readinessScore: rounded });
    return rounded;
  },
}));
