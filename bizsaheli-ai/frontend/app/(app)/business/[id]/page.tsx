"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import ScenarioCard from "@/components/simulation/ScenarioCard";
import OutcomePanel from "@/components/simulation/OutcomePanel";
import BusinessStats from "@/components/simulation/BusinessStats";
import { useBusinessStore } from "@/store/businessStore";
import { calcDailyResult, SimState } from "@/lib/simulation/engine";
import "@/lib/i18n";

// Meta data for demo scenarios (text is handled by i18n)
const SCENARIO_META = [
  { category: "digital_payment", difficulty: "easy" },
  { category: "seasonal_demand", difficulty: "medium" },
  { category: "competition", difficulty: "medium" },
];

export default function BusinessSimulationPage({
  params,
}: {
  params: { id: string };
}) {
  const { t, i18n } = useTranslation();
  const { activeBusiness, updateActiveBusiness, addDecision, advanceDay } =
    useBusinessStore();

  const [showOutcome, setShowOutcome] = useState(false);
  const [outcomeData, setOutcomeData] = useState({
    revenue: 0,
    cost: 0,
    profit: 0,
    mentorMessage: "",
    comparisonTable: [] as { option: string; action: string; result: string }[],
  });
  const [isLoadingMentor, setIsLoadingMentor] = useState(false);

  // Auto-set active business from URL param if missing (e.g., after reload)
  useEffect(() => {
    if (!activeBusiness || activeBusiness.business_id !== params.id) {
      const { businesses, setActiveBusiness } = useBusinessStore.getState();
      const found = businesses.find((b) => b.business_id === params.id);
      if (found) {
        setActiveBusiness(found);
      }
    }
  }, [params.id, activeBusiness]);

  // Get a demo scenario based on day and translate
  const scenarioIndex = ((activeBusiness?.day || 1) - 1 + 3) % 3; // Ensure index is 0, 1, or 2 based on day
  const meta = SCENARIO_META[scenarioIndex];
  const currentScenario = {
    scenario: t(`demoScenarios.s${scenarioIndex}.scenario`),
    options: [
      { label: "A", text: t(`demoScenarios.s${scenarioIndex}.oA`), risk_level: "low" },
      { label: "B", text: t(`demoScenarios.s${scenarioIndex}.oB`), risk_level: "medium" },
      { label: "C", text: t(`demoScenarios.s${scenarioIndex}.oC`), risk_level: "high" },
    ],
    difficulty: meta.difficulty,
    category: meta.category,
  };

  const handleChoice = async (choice: string) => {
    if (!activeBusiness) return;

    // Run simulation engine
    const state: SimState = {
      inventory: 20, // Demo initial inventory
      costPerUnit: 50, // Demo cost
      sellingPrice: 80, // Demo price
      capital: activeBusiness.capital,
      day: activeBusiness.day,
    };

    const events: string[] = [];
    if (currentScenario.category === "seasonal_demand") events.push("festival");
    if (currentScenario.category === "competition") events.push("competition");

    const result = calcDailyResult(state, events, activeBusiness.location);

    // Show outcome
    setOutcomeData({
      revenue: result.revenue,
      cost: state.costPerUnit * result.sales,
      profit: result.profit,
      mentorMessage: "",
      comparisonTable: [],
    });
    setShowOutcome(true);

    // Record decision
    addDecision({
      day: activeBusiness.day,
      scenario: currentScenario.scenario,
      choice,
      profit_delta: result.profit,
    });

    // Update business
    updateActiveBusiness({
      profit: activeBusiness.profit + result.profit,
      capital: activeBusiness.capital + result.profit,
    });

    // Call real mentor API
    setIsLoadingMentor(true);
    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_type: activeBusiness.type,
          day: activeBusiness.day,
          capital: activeBusiness.capital,
          profit: activeBusiness.profit,
          scenario: currentScenario.scenario,
          choice: choice,
          outcome: `Revenue: ₹${result.revenue}, Sales: ${result.sales}`,
          language: i18n.language,
        }),
      });

      if (!res.ok) throw new Error("Mentor API failed");
      const data = await res.json();

      setOutcomeData((prev) => ({
        ...prev,
        mentorMessage: data.message || t("mentorDemo.success", {
          choice,
          revenue: result.revenue,
          sales: result.sales,
        }),
        comparisonTable: data.comparison_table?.length > 0 ? data.comparison_table : currentScenario.options.map((opt) => ({
          option: opt.label,
          action: opt.text,
          result:
            opt.risk_level === "low"
              ? t("mentorDemo.riskLow")
              : opt.risk_level === "high"
              ? t("mentorDemo.riskHigh")
              : t("mentorDemo.riskMedium"),
        })),
      }));
    } catch (err) {
      console.error(err);
      // Fallback
      setOutcomeData((prev) => ({
        ...prev,
        mentorMessage: t("mentorDemo.success", {
          choice,
          revenue: result.revenue,
          sales: result.sales,
        }),
        comparisonTable: currentScenario.options.map((opt) => ({
          option: opt.label,
          action: opt.text,
          result:
            opt.risk_level === "low"
              ? t("mentorDemo.riskLow")
              : opt.risk_level === "high"
              ? t("mentorDemo.riskHigh")
              : t("mentorDemo.riskMedium"),
        })),
      }));
    } finally {
      setIsLoadingMentor(false);
    }
  };

  const handleNextDay = () => {
    advanceDay();
    setShowOutcome(false);
  };

  if (!activeBusiness) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl block mb-4">🏪</span>
        <p className="text-gray-600 text-lg mb-4">Business not found</p>
        <a href="/dashboard">
          <Button variant="primary">{t("common.back")}</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Business Stats */}
      <BusinessStats
        capital={activeBusiness.capital}
        profit={activeBusiness.profit}
        inventory={20}
        day={activeBusiness.day}
        costPerUnit={50}
        sellingPrice={80}
      />

      {/* Scenario or Outcome */}
      {!showOutcome ? (
        <ScenarioCard
          scenario={currentScenario.scenario}
          options={currentScenario.options}
          difficulty={currentScenario.difficulty}
          category={currentScenario.category}
          onChoose={handleChoice}
        />
      ) : (
        <>
          <OutcomePanel
            revenue={outcomeData.revenue}
            cost={outcomeData.cost}
            profit={outcomeData.profit}
            mentorMessage={outcomeData.mentorMessage}
            comparisonTable={outcomeData.comparisonTable}
            isLoading={isLoadingMentor}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNextDay}
            >
              {t("simulation.nextDay")} →
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
}
