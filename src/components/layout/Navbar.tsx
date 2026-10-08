"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  ChevronDown,
  Sparkles,
  Heart,
  LogOut,
  Shield,
  LayoutDashboard,
  Camera,
  Check
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ECO_AVATAR_PRESETS } from "@/lib/auth";

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/programs", label: "PROGRAMS & EVENTS" },
  { href: "/resources", label: "RESOURCES" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/contact", label: "CONTACT US" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, role, isAuthenticated, signOut, updateAvatar } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setIsHelpOpen(false);
    setIsUserMenuOpen(false);
  }

  // Click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPresetAvatar = async (url: string) => {
    await updateAvatar(url);
    setIsAvatarModalOpen(false);
  };

  const handleSaveCustomAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAvatarUrl.trim()) return;
    await updateAvatar(customAvatarUrl.trim());
    setCustomAvatarUrl("");
    setIsAvatarModalOpen(false);
  };

  const displayName = user?.fullName || "Eco-Steward";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
          ? "bg-[#180E07]/85 backdrop-blur-lg border-b border-[#4A2814]/50 py-3 shadow-2xl"
          : "bg-[#1F1209]/70 backdrop-blur-md border-b border-[#4A2814]/30 py-3.5"
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
              className="hidden lg:flex items-center justify-center gap-4 xl:gap-6 font-the-seasons tracking-wider text-xs xl:text-sm text-[#F0E6D2]"
              style={{ fontFamily: 'var(--font-the-seasons), "The Seasons", Georgia, serif' }}
            >
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : item.href === "/programs"
                    ? pathname === "/programs" || pathname.startsWith("/programs/") || pathname === "/news-events" || pathname.startsWith("/news-events/")
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
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

            {/* Right: Highlighted Donate Button + User Avatar / Sign In */}
            <div className="hidden sm:flex items-center gap-3 shrink-0" ref={userMenuRef}>

              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-1 pr-2.5 rounded-full bg-[#120A04]/90 hover:bg-[#2C190E] border-2 border-emerald-500/50 hover:border-emerald-400 transition-all shadow-md group cursor-pointer"
                    aria-label="User Account Menu"
                    title={`${displayName} (${user.role})`}
                  >
                    {/* Account Picture on the Navbar */}
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-emerald-950/80 border border-emerald-400/60 shrink-0">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={displayName}
                          fill
                          sizes="32px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center font-bold text-xs text-emerald-300">
                          {userInitial}
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-bold text-[#E2ECE4] max-w-[110px] truncate group-hover:text-[#e1ffdd]">
                      {displayName}
                    </span>

                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? "rotate-180 text-emerald-400" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#1C0F07]/95 border border-[#5A331A] shadow-2xl p-3 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 text-white font-sans">
                      {/* User Header */}
                      <div className="flex items-center gap-3 p-2 border-b border-white/10 pb-3">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500/60 bg-black shrink-0">
                          {user.avatarUrl ? (
                            <Image
                              src={user.avatarUrl}
                              alt={displayName}
                              fill
                              sizes="44px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center font-black text-sm text-emerald-300">
                              {userInitial}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-white truncate">
                            {displayName}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {user.email}
                          </p>
                          <span className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${user.role === "admin"
                            ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                            : "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                            }`}>
                            {user.role === "admin" ? "Admin Clearance" : "Eco-Steward Member"}
                          </span>
                        </div>
                      </div>

                      {/* Menu Links */}
                      <div className="py-2 space-y-1 text-xs">
                        {role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-300 hover:bg-white/10 font-bold transition-colors"
                          >
                            <Shield className="w-4 h-4 text-amber-400" />
                            <span>Admin Command Center</span>
                          </Link>
                        )}

                        <Link
                          href="/member/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-emerald-300 hover:bg-white/10 font-bold transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                          <span>Member News Feed & Portal</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsAvatarModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/10 font-medium transition-colors cursor-pointer text-left"
                        >
                          <Camera className="w-4 h-4 text-blue-400" />
                          <span>Change Account Picture</span>
                        </button>
                      </div>

                      {/* Sign Out Button */}
                      <div className="pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            signOut();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-300 hover:bg-red-950/50 hover:text-red-200 font-bold text-xs transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full bg-[#120A04]/80 hover:bg-[#2C190E] border border-[#52331C] hover:border-emerald-500/60 flex items-center gap-2 text-white hover:text-[#e1ffdd] transition-all shadow-md group text-xs font-bold"
                  title="Member Portal & CMS"
                  aria-label="Member Sign In"
                >
                  <User className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button, Highlighted Donate Button & Avatar */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/donate"
                className="px-3 py-1.5 rounded-full bg-[#C8102E] hover:bg-[#A30D25] text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs"
                aria-label="Donate"
              >
                <Heart className="w-3 h-3 fill-white" />
                <span>Donate</span>
              </Link>

              {isAuthenticated && user ? (
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-500/60 bg-emerald-950/80 shrink-0"
                  aria-label="Account Menu"
                >
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={displayName}
                      fill
                      sizes="32px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center font-bold text-xs text-emerald-300">
                      {userInitial}
                    </span>
                  )}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="w-9 h-9 rounded-full bg-[#120A04] border border-[#52331C] flex items-center justify-center text-white"
                  aria-label="Member login"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}

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
            className="lg:hidden bg-[#180E07]/95 backdrop-blur-xl border-b border-[#4A2F1A]/70 shadow-2xl px-6 py-6 space-y-4"
            style={{ fontFamily: 'var(--font-the-seasons), "The Seasons", Georgia, serif' }}
          >
            {/* Mobile User Profile Section if Authenticated */}
            {isAuthenticated && user && (
              <div className="p-3.5 rounded-2xl bg-black/50 border border-emerald-500/30 flex items-center justify-between gap-3 font-sans tracking-normal">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-emerald-400 bg-emerald-950 shrink-0">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={displayName}
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center font-bold text-xs text-emerald-300">
                        {userInitial}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsAvatarModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-white/10 text-blue-300 hover:text-white"
                    title="Change picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                    className="p-2 rounded-xl bg-red-950/60 text-red-300 hover:text-white"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-3 text-base tracking-widest">
              {/* Highlighted Mobile Donate Button */}
              <div className="pb-1 font-sans tracking-normal">
                <Link
                  href="/donate"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 px-4 rounded-2xl bg-[#C8102E] hover:bg-[#A30D25] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Donate to Kalikasan</span>
                </Link>
              </div>

              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : item.href === "/programs"
                    ? pathname === "/programs" || pathname.startsWith("/programs/") || pathname === "/news-events" || pathname.startsWith("/news-events/")
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`py-2 px-3 rounded-xl uppercase transition-colors ${isActive
                      ? "text-[#e1ffdd] bg-white/10 font-bold"
                      : "text-[#F0E6D2]/90 hover:text-white"
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile Portals Direct Links */}
              {isAuthenticated && (
                <div className="pt-2 border-t border-[#4A2F1A]/60 flex flex-col gap-2 font-sans tracking-normal">
                  {role === "admin" && (
                    <Link
                      href="/admin"
                      className="py-2 px-3 rounded-xl text-xs font-bold text-amber-300 hover:bg-white/10 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Admin Operations Command</span>
                    </Link>
                  )}
                  <Link
                    href="/member/dashboard"
                    className="py-2 px-3 rounded-xl text-xs font-bold text-emerald-300 hover:bg-white/10 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                    <span>Member News Feed & Missions</span>
                  </Link>
                </div>
              )}

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

      {/* Account Picture Selector Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full bg-[#180E07] border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-white space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Endangered Animals of the Philippines
                  </h3>
                  <p className="text-[11px] text-emerald-300">
                    Real wildlife photography &bull; Choose your animal avatar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider block">
                  Select Philippine Species
                </span>
                <span className="text-[10px] text-slate-400">12 Endemic & Endangered Species</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {ECO_AVATAR_PRESETS.map((preset) => {
                  const isSelected = user?.avatarUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPresetAvatar(preset.url)}
                      className={`relative p-2 rounded-2xl border transition-all text-center flex flex-col items-center gap-1.5 group cursor-pointer ${isSelected
                        ? "bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg scale-102"
                        : "bg-white/5 border-white/10 hover:border-emerald-500/40 hover:bg-white/10"
                        }`}
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20 group-hover:scale-105 transition-transform shadow-md">
                        <Image
                          src={preset.url}
                          alt={preset.label}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-emerald-900/60 flex items-center justify-center">
                            <Check className="w-6 h-6 text-emerald-300 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-200 line-clamp-1 leading-tight">
                        {preset.label.split("(")[0]}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-950/70 text-red-300 border border-red-500/30 font-semibold line-clamp-1">
                        {preset.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-center pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
