import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin CMS & Operations Portal",
  description: "Executive control panel for managing volunteers, donations, rallies, and content.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-white relative selection:bg-emerald-500 selection:text-black">
      {children}
    </div>
  );
}
