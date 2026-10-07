import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { ImpactStats } from "@/components/home/ImpactStats";
import { CarbonCalculator } from "@/components/home/CarbonCalculator";
import { FeaturedPrograms } from "@/components/home/FeaturedPrograms";
import { PartnersCarousel } from "@/components/home/PartnersCarousel";
import { LatestNews } from "@/components/home/LatestNews";
import { CTABanner } from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "KAMALAYANG KAPWA KALIKASAN | Bayanihan Para sa Tao at Kalikasan",
  description:
    "Opisyal na website ng Kamalayang Kapwa Kalikasan — isang samahang Pilipino na nagtataguyod ng reforestation sa Sierra Madre, mga rally para sa kalikasan at sangkatauhan, at pamayanang makakalikasan.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col relative min-h-screen">
      {/* Sticky Fixed Background: bg 2 stays fixed for the WHOLE home page */}
      <div className="fixed inset-0 -z-30 pointer-events-none select-none">
        <Image
          src="/images/bg2.jpg"
          alt="Sierra Madre Rainforest Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Cinematic dark forest overlay for high contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06110a]/45 via-[#07160c]/55 to-[#040e06]/85" />
      </div>

      <Hero />
      <ImpactStats />
      <CarbonCalculator />
      <FeaturedPrograms />
      <PartnersCarousel />
      <LatestNews />
      <CTABanner />
    </div>
  );
}
