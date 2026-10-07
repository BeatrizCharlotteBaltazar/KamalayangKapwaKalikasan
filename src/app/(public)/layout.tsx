import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyPlantedTrees } from "@/components/layout/StickyPlantedTrees";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Sticky Tree Symbol for Carbon Offset Trees Count */}
      <StickyPlantedTrees />

      <Suspense fallback={<div className="h-16 bg-[#180E07]" />}>
        <Navbar />
      </Suspense>

      <main className="flex-1">{children}</main>
      
      <Footer />
    </div>
  );
}
