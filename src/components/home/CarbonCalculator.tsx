"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calculator, 
  Zap, 
  Car, 
  Plane, 
  Utensils, 
  Trees, 
  Leaf, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Flame,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function CarbonCalculator() {
  // User Inputs (Balanced Filipino Baseline by default)
  const [electricBill, setElectricBill] = useState<number>(1600); // PHP per month (~133 kWh)
  const [commuteMode, setCommuteMode] = useState<"jeepney" | "motorcycle" | "car" | "train" | "walk">("jeepney");
  const [commuteDistance, setCommuteDistance] = useState<number>(12); // km roundtrip daily
  const [domesticFlights, setDomesticFlights] = useState<number>(0); // roundtrips per year
  const [dietType, setDietType] = useState<"meat" | "balanced" | "plant">("balanced");

  // Emission Calculations (Metric Tons of CO2e per year)
  // 1. Electricity: Avg PH rate ~₱12/kWh -> kWh/month = bill / 12. PH grid factor = 0.71 kg CO2/kWh.
  const monthlyKwh = electricBill / 12;
  const annualElectricityCo2 = (monthlyKwh * 12 * 0.71) / 1000;

  // 2. Commute: 260 work days/yr. Factors (kg CO2 / km):
  // Jeepney/Bus: 0.05, Motorcycle: 0.09, Car: 0.19, Train: 0.03, Walk: 0
  const commuteFactors = {
    jeepney: 0.05,
    motorcycle: 0.09,
    car: 0.19,
    train: 0.03,
    walk: 0,
  };
  const annualCommuteCo2 = (commuteDistance * 260 * commuteFactors[commuteMode]) / 1000;

  // 3. Flights: PH Domestic roundtrip ~ 240 kg CO2 = 0.24 t
  const annualFlightsCo2 = domesticFlights * 0.24;

  // 4. Diet factor (t CO2e / year): meat: 1.8, balanced: 1.2, plant: 0.6
  const dietFactors = {
    meat: 1.8,
    balanced: 1.2,
    plant: 0.6,
  };
  const annualDietCo2 = dietFactors[dietType];

  // Total Metric Tons CO2e / year
  const totalCo2 = Number((annualElectricityCo2 + annualCommuteCo2 + annualFlightsCo2 + annualDietCo2).toFixed(2));

  // Native trees offset: 1 native Philippine Narra/Dao absorbs ~22 kg (0.022 t) CO2/year
  const treesNeeded = Math.max(1, Math.ceil(totalCo2 / 0.022));

  const phAverage = 1.40; // Philippines national per capita average (t CO2e)

  const footprintTier = totalCo2 <= 1.8
    ? { label: "Low Impact (Mababa)", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" }
    : totalCo2 <= 3.2
    ? { label: "Balanced Footprint (Katamtaman)", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" }
    : { label: "High Impact (Mataas)", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" };

  return (
    <section id="carbon-calculator" className="relative py-16 md:py-24 text-white scroll-mt-20">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] bg-emerald-700/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12281B] border border-emerald-500/30 text-xs font-bold text-emerald-300 mb-3">
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Tool for Filipinos</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
            Calculate Your <span className="text-[#22C55E]">Carbon Footprint</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Discover your annual environmental impact in the Philippine context, and calculate how many native Sierra Madre trees are needed to balance your footprint.
          </p>
        </div>

        {/* Interactive Layout: Equal-height CSS Grid with items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT CARD: Inputs & Controls (7 cols on desktop, full width on mobile) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#0A1B11]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-emerald-500/25 shadow-2xl space-y-6 h-full">
            
            {/* Aligned Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white">
                  Lifestyle &amp; Consumption Inputs
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#D4C3A3] uppercase tracking-wider bg-black/40 px-3 py-1 rounded-full border border-white/10">
                PH Baseline
              </span>
            </div>

            <div className="space-y-6 flex-1">
              {/* 1. Monthly Electricity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                  <span className="flex items-center gap-2 text-white">
                    <Zap className="w-4 h-4 text-[#F59E0B]" />
                    <span>Monthly Electric Bill (Meralco / Coop)</span>
                  </span>
                  <span className="text-[#F59E0B] font-extrabold text-base">
                    ₱{electricBill.toLocaleString()}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="250"
                  value={electricBill}
                  onChange={(e) => setElectricBill(Number(e.target.value))}
                  className="w-full accent-[#F59E0B] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>₱500/mo (Basic)</span>
                  <span>Est. {Math.round(monthlyKwh)} kWh/month</span>
                  <span>₱15,000/mo (Aircon)</span>
                </div>
              </div>

              {/* 2. Daily Commute Mode & Distance */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                  <span className="flex items-center gap-2 text-white">
                    <Car className="w-4 h-4 text-[#2563EB]" />
                    <span>Primary Daily Commute</span>
                  </span>
                  <span className="text-[#2563EB] font-extrabold text-sm capitalize">
                    {commuteMode === "jeepney" && "Jeepney / Bus"}
                    {commuteMode === "motorcycle" && "Motorcycle"}
                    {commuteMode === "car" && "Gasoline Car"}
                    {commuteMode === "train" && "LRT / MRT / PNR"}
                    {commuteMode === "walk" && "Bike / Walk"}
                  </span>
                </div>

                {/* Mode Selector Buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: "jeepney", label: "Jeep / Bus" },
                    { id: "motorcycle", label: "Motorcycle" },
                    { id: "car", label: "Private Car" },
                    { id: "train", label: "LRT / MRT" },
                    { id: "walk", label: "Bike / Walk" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setCommuteMode(mode.id as "jeepney" | "motorcycle" | "car" | "train" | "walk")}
                      className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                        commuteMode === mode.id
                          ? "bg-[#2563EB] text-white shadow-md scale-102"
                          : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* Distance Slider */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Daily round-trip travel:</span>
                    <strong className="text-white font-bold">{commuteDistance} km / day</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={commuteDistance}
                    onChange={(e) => setCommuteDistance(Number(e.target.value))}
                    className="w-full accent-[#2563EB] cursor-pointer"
                  />
                </div>
              </div>

              {/* 3. Domestic Flights */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                  <span className="flex items-center gap-2 text-white">
                    <Plane className="w-4 h-4 text-[#DC2626]" />
                    <span>Domestic Flights (PH Roundtrips / Year)</span>
                  </span>
                  <span className="text-[#DC2626] font-extrabold text-base">
                    {domesticFlights} flights
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={domesticFlights}
                  onChange={(e) => setDomesticFlights(Number(e.target.value))}
                  className="w-full accent-[#DC2626] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>0 (Stay local)</span>
                  <span>Manila - Cebu / Davao / Palawan</span>
                  <span>12+ (Frequent flyer)</span>
                </div>
              </div>

              {/* 4. Diet Profile */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                  <span className="flex items-center gap-2 text-white">
                    <Utensils className="w-4 h-4 text-[#22C55E]" />
                    <span>Diet &amp; Consumption Style</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "meat", label: "Meat-Heavy", desc: "Pork / Beef daily" },
                    { id: "balanced", label: "Balanced", desc: "Fish, chicken, gulay" },
                    { id: "plant", label: "Plant-Rich", desc: "Vegetarian / vegan" },
                  ].map((diet) => (
                    <button
                      key={diet.id}
                      type="button"
                      onClick={() => setDietType(diet.id as "meat" | "balanced" | "plant")}
                      className={`py-2 px-2 rounded-xl text-left transition-all cursor-pointer ${
                        dietType === diet.id
                          ? "bg-[#22C55E] text-slate-950 font-black shadow-md scale-102"
                          : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <span className="block text-xs font-bold leading-tight">{diet.label}</span>
                      <span className="block text-[10px] opacity-80 mt-0.5 leading-tight">{diet.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT CARD: Live Results & Offset (5 cols on desktop, full width on mobile, matching height) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-[#0E2919] via-[#0A1D13] to-[#140C06] rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6 h-full text-white">
            
            {/* Aligned Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4 text-[#22C55E]" />
                </div>
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white">
                  Annual Carbon Output
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${footprintTier.color}`}>
                {footprintTier.label}
              </span>
            </div>

            {/* Center the main number */}
            <div className="flex flex-col items-center justify-center text-center my-auto py-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] mb-1">
                Your Estimated Footprint
              </span>
              <div className="text-6xl sm:text-7xl font-black text-white tracking-tight leading-none font-heading">
                {totalCo2}
              </div>
              <span className="text-xs sm:text-sm font-bold text-emerald-300 uppercase tracking-widest mt-2">
                Metric Tons CO₂e / Year
              </span>
              <p className="text-xs text-slate-300 mt-2 max-w-xs leading-relaxed">
                Philippine national average: <strong className="text-white">{phAverage} tons</strong>. You are{" "}
                <span className={totalCo2 > phAverage ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                  {totalCo2 > phAverage ? `${Math.round(((totalCo2 - phAverage) / phAverage) * 100)}% above` : "below"} national avg.
                </span>
              </p>
            </div>

            {/* Tree Offset Box */}
            <div className="p-5 rounded-2xl bg-[#061109]/90 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Trees className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-300 block">Sierra Madre Native Trees Needed:</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#22C55E]">
                    {treesNeeded} Native Trees
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                1 native Narra or Dao sapling in Tanay, Rizal absorbs approximately <strong>22 kg of carbon each year</strong> while safeguarding drinking watersheds.
              </p>
            </div>

            {/* Direct Action Pledge Buttons */}
            <div className="space-y-3 pt-2">
              <Link href="/donate" className="block">
                <Button className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold text-sm py-5 rounded-xl shadow-xl flex items-center justify-center gap-2">
                  <Leaf className="w-4 h-4" />
                  <span>Sponsor Your {treesNeeded} Trees (₱250 each)</span>
                </Button>
              </Link>

              <Link href="/get-involved" className="block">
                <Button variant="outline" className="w-full border-emerald-500/40 bg-white/5 hover:bg-white/10 text-emerald-300 hover:text-white font-bold text-xs py-4 rounded-xl flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span>Join Hands-On Tree Planting &amp; Rallies</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

          </div>

          {/* FULL-WIDTH CARD: Scientific Calculation Basis & Standards (matching padding and border radius) */}
          <div className="col-span-1 lg:col-span-12 w-full rounded-3xl p-6 sm:p-8 bg-[#08150D]/90 backdrop-blur-md border border-emerald-500/25 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#F59E0B] uppercase tracking-wide">
                Estimation Basis &amp; Emission Factors
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              These calculations are estimates based on commonly used emission factors and general environmental research models:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-white block text-xs">1. Household Electricity</span>
                <p className="leading-relaxed">
                  General regional grid emission factor estimates (~0.7 kg CO₂e / kWh) calculated against standard residential electric consumption.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-white block text-xs">2. Daily Commuting</span>
                <p className="leading-relaxed">
                  Estimates derived from typical public and private transport emission factors (Jeep/Bus, motorcycle, car, train) across standard commute routines.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-white block text-xs">3. Domestic Air Travel</span>
                <p className="leading-relaxed">
                  Estimates based on passenger flight distance averages (~240 kg CO₂e per typical short-haul domestic roundtrip).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-white block text-xs">4. Diet &amp; Consumption</span>
                <p className="leading-relaxed">
                  General lifestyle consumption factors representing typical dietary profiles (plant-rich, balanced, or meat-heavy daily meals).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-white block text-xs">5. Native Tree Absorption</span>
                <p className="leading-relaxed">
                  General forestry estimates indicating that a healthy mature native tree absorbs approximately 20–22 kg CO₂e per year over its growth cycle.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-white block text-xs">6. Reference Benchmark</span>
                <p className="leading-relaxed">
                  General per-capita emissions benchmark of approximately 1.4 metric tons CO₂e annually for standard comparative awareness.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
