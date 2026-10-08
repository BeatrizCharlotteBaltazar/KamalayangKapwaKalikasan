import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const aliceFont = localFont({
  src: "../../public/fonts/Alice-Regular.ttf",
  variable: "--font-alice",
  display: "swap",
});

const theSeasonsFont = localFont({
  src: [
    {
      path: "../../public/fonts/Fontspring-DEMO-theseasons-reg.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Fontspring-DEMO-theseasons-bd.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-the-seasons",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Kamalayang Kapwa Kalikasan",
    default: "Kamalayang Kapwa Kalikasan",
  },
  description:
    "Isang makakalikasang samahan na nagtataguyod ng pakikipagkapwa para sa pangangalaga ng kalikasan, kagubatan, at komunidad sa Pilipinas.",
  keywords: [
    "Kamalayang Kapwa Kalikasan",
    "Philippine Environmental NGO",
    "Sierra Madre Reforestation",
    "Pakikipagkapwa",
    "Volunteer Philippines",
    "Eco Advocacy",
    "Zero Waste",
    "Mangrove Conservation",
  ],
  authors: [{ name: "Kamalayang Kapwa Kalikasan" }],
  creator: "Kamalayang Kapwa Kalikasan",
  icons: {
    icon: "/images/logo.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1008",
  width: "device-width",
  initialScale: 1,
};

import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="tl-PH" 
      className={`${poppins.variable} ${inter.variable} ${aliceFont.variable} ${theSeasonsFont.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alice&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#07140B] text-[#E2ECE4] antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
