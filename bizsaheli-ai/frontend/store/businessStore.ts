"use client";

import { create } from "zustand";

export interface Business {
  business_id: string;
  type: string;
  capital: number;
  location: "village" | "town" | "city" | "online";
  payment_mode: "cash" | "gpay" | "both";
  inventory: Record<string, number>;
  profit: number;
  day: number;
}

export interface ScenarioOption {
  label: string;
  text: string;
  risk_level: string;
}

export interface Scenario {
  scenario: string;
  options: ScenarioOption[];
  difficulty: string;
  category: string;
}

export interface Decision {
  day: number;
  scenario: string;
  choice: string;
  profit_delta: number;
  ai_feedback?: string;
}

interface BusinessState {
  businesses: Business[];
  activeBusiness: Business | null;
  currentScenario: Scenario | null;
  decisions: Decision[];
  isLoading: boolean;

  setBusinesses: (businesses: Business[]) => void;
  addBusiness: (business: Business) => void;
  setActiveBusiness: (business: Business | null) => void;
  updateActiveBusiness: (updates: Partial<Business>) => void;
  setCurrentScenario: (scenario: Scenario | null) => void;
  addDecision: (decision: Decision) => void;
  setLoading: (loading: boolean) => void;
  advanceDay: () => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  businesses: [],
  activeBusiness: null,
  currentScenario: null,
  decisions: [],
  isLoading: false,

  setBusinesses: (businesses) =>
    set({ businesses }),

  addBusiness: (business) =>
    set((state) => ({
      businesses: [...state.businesses, business],
      activeBusiness: business,
    })),

  setActiveBusiness: (business) =>
    set({ activeBusiness: business }),

  updateActiveBusiness: (updates) =>
    set((state) => {
      if (!state.activeBusiness) return state;
      const updatedBusiness = { ...state.activeBusiness, ...updates };
      return {
        activeBusiness: updatedBusiness,
        businesses: state.businesses.map((b) =>
          b.business_id === updatedBusiness.business_id ? updatedBusiness : b
        ),
      };
    }),

  setCurrentScenario: (scenario) =>
    set({ currentScenario: scenario }),

  addDecision: (decision) =>
    set((state) => ({
      decisions: [...state.decisions, decision],
    })),

  setLoading: (loading) =>
    set({ isLoading: loading }),

  advanceDay: () =>
    set((state) => {
      if (!state.activeBusiness) return state;
      const updatedBusiness = {
        ...state.activeBusiness,
        day: state.activeBusiness.day + 1,
      };
      return {
        activeBusiness: updatedBusiness,
        businesses: state.businesses.map((b) =>
          b.business_id === updatedBusiness.business_id ? updatedBusiness : b
        ),
      };
    }),
}));
