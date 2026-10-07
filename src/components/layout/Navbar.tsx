"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  ChevronDown,
  Sparkles,
  Heart
} from "lucide-react";

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/programs", label: "PROGRAMS" },
  { href: "/resources", label: "RESOURCES" },
  { href: "/news-events", label: "EVENTS" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsHelpOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
          ? "bg-[#180E07]/75 backdrop-blur-lg border-b border-[#4A2814]/50 py-3 shadow-2xl"
          : "bg-[#1F1209]/60 backdrop-blur-md border-b border-[#4A2814]/30 py-3.5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Left: Round Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group focus-visible:outline-none rounded-full"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#8B5A2B]/40 bg-[#120A04] shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/images/logo.jpg"
                alt="Kamalayang Kapwa Kalikasan Logo"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
          </Link>

          {/* Center: The Seasons Font Nav Links (Dark Brown Navbar theme) */}
          <nav
            className="hidden md:flex items-center justify-center gap-7 lg:gap-11 font-the-seasons tracking-widest text-sm lg:text-base text-[#F0E6D2]"
            style={{ fontFamily: 'var(--font-the-seasons), "The Seasons", Georgia, serif' }}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-all duration-200 uppercase hover:text-[#e1ffdd] ${isActive
                      ? "text-[#e1ffdd] font-bold border-b border-[#e1ffdd] pb-0.5"
                      : "text-[#F0E6D2]/90 hover:opacity-100"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* HELP Dropdown in Navbar */}
            <div 
              className="relative"
              onMouseEnter={() => setIsHelpOpen(true)}
              onMouseLeave={() => setIsHelpOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsHelpOpen(!isHelpOpen)}
                className={`flex items-center gap-1 uppercase transition-all duration-200 hover:text-[#e1ffdd] cursor-pointer ${pathname === "/get-involved" || pathname === "/donate"
                    ? "text-[#e1ffdd] font-bold border-b border-[#e1ffdd] pb-0.5"
                    : "text-[#F0E6D2]/90"
                  }`}
              >
                <span>HELP</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isHelpOpen ? "rotate-180 text-[#e1ffdd]" : "opacity-80"}`} />
              </button>

              {isHelpOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="w-48 bg-[#28160D] rounded-2xl border border-[#5A331A] shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150 font-sans tracking-normal text-xs backdrop-blur-md">
                    <Link
                      href="/get-involved"
                      onClick={() => setIsHelpOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-[#E2ECE4] hover:bg-[#3D2214] hover:text-[#e1ffdd] transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Volunteer</span>
                    </Link>

                    <Link
                      href="/donate"
                      onClick={() => setIsHelpOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-[#E2ECE4] hover:bg-[#3D2214] hover:text-[#EF4444] transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 fill-[#DC2626] text-[#DC2626]" />
                      <span>Donate</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right: User Avatar Circle Icon & Volunteer Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">


            <Link
              href="/login"
              className="w-10 h-10 rounded-full bg-[#120A04]/80 hover:bg-[#2C190E] border border-[#52331C] flex items-center justify-center text-white hover:text-[#e1ffdd] transition-all shadow-md group"
              title="Member Portal & CMS"
              aria-label="Member Sign In"
            >
              <User className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/login"
              className="w-9 h-9 rounded-full bg-[#120A04] border border-[#52331C] flex items-center justify-center text-white"
              aria-label="Member login"
            >
              <User className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl border border-[#52331C] text-white hover:bg-white/10 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div
          className="md:hidden bg-[#180E07]/90 backdrop-blur-xl border-b border-[#4A2F1A]/70 shadow-2xl px-6 py-6 space-y-4"
          style={{ fontFamily: 'var(--font-the-seasons), "The Seasons", Georgia, serif' }}
        >
          <nav className="flex flex-col gap-3 text-base tracking-widest">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-2 px-3 rounded-xl uppercase transition-colors ${pathname === item.href
                    ? "text-[#e1ffdd] bg-white/10 font-bold"
                    : "text-[#F0E6D2]/90 hover:text-white"
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Help Section */}
            <div className="pt-2 border-t border-[#4A2F1A]/60 flex flex-col gap-2 font-sans tracking-normal">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider px-3">
                Help & Support
              </span>
              <Link
                href="/get-involved"
                className="py-2 px-3 rounded-xl text-xs font-bold text-white hover:bg-white/10 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Volunteer With Us</span>
              </Link>
              <Link
                href="/donate"
                className="py-2 px-3 rounded-xl text-xs font-bold text-red-400 hover:bg-white/10 flex items-center gap-2"
              >
                <Heart className="w-3.5 h-3.5 fill-[#DC2626]" />
                <span>Donate to Reforestation</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
