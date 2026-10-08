"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Trees, 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Award,
  Megaphone,
  Share2,
  BookOpen, 
  Download,
  Check, 
  Eye, 
  X, 
  Users,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { resolveAuthorName } from "@/lib/supabase/adminStore";

interface MemberFeedAnnouncement {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  imageUrl?: string;
  pinned?: boolean;
  createdAt: string;
  likesCount: number;
}

interface MemberEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  targetVolunteers: number;
  signedUp: number;
  status: string;
  imageUrl?: string;
  createdAt: string;
}

interface MemberResource {
  id: string;
  title: string;
  category: string;
  description: string;
  format: string;
  downloadUrl: string;
  fileSize?: string;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
}

interface UserVolunteerRecord {
  id: string;
  program?: string;
  status: string;
  role?: string;
  created_at: string;
}

interface UserDonationRecord {
  id: string;
  amount: number | string;
  currency?: string;
  payment_method?: string;
  status: string;
  project_allocation?: string;
  created_at: string;
}

export default function MemberDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"feed" | "events" | "resources" | "volunteering" | "donations">("feed");
  const [announcements, setAnnouncements] = useState<MemberFeedAnnouncement[]>([]);
  const [eventPrograms, setEventPrograms] = useState<MemberEvent[]>([]);
  const [resources, setResources] = useState<MemberResource[]>([]);
  const [volunteerRecords, setVolunteerRecords] = useState<UserVolunteerRecord[]>([]);
  const [donationRecords, setDonationRecords] = useState<UserDonationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<MemberFeedAnnouncement | null>(null);
  const [rsvpEvents, setRsvpEvents] = useState<string[]>([]);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  // Load announcements, events, and resources live from Supabase
  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const [annRes, evRes, resRes] = await Promise.all([
        supabase
          .from("announcements")
          .select("id, title, category, summary, body, image_url, show_on_member, status, published_at, created_at")
          .eq("status", "published")
          .eq("show_on_member", true)
          .order("created_at", { ascending: false }),

        supabase
          .from("events")
          .select("id, title, description, location, event_date, image_url, status, created_at")
          .neq("status", "draft")
          .order("event_date", { ascending: true }),

        supabase
          .from("resources")
          .select("id, title, slug, category, summary, content, cover_image, status, published_at, created_at")
          .eq("status", "published")
          .order("created_at", { ascending: false }),
      ]);

      if (annRes.error) {
        console.error("[Supabase Error in member announcements]", {
          message: annRes.error.message,
          code: annRes.error.code,
          details: annRes.error.details,
          hint: annRes.error.hint,
        });
      }
      if (evRes.error) {
        console.error("[Supabase Error in member events]", {
          message: evRes.error.message,
          code: evRes.error.code,
          details: evRes.error.details,
          hint: evRes.error.hint,
        });
      }
      if (resRes.error) {
        console.error("[Supabase Error in member resources]", {
          message: resRes.error.message,
          code: resRes.error.code,
          details: resRes.error.details,
          hint: resRes.error.hint,
        });
      }

      const mappedAnn: MemberFeedAnnouncement[] = (annRes.data || []).map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category || "General",
        excerpt: a.summary || a.body?.slice(0, 160) || "",
        content: a.body || "",
        author: resolveAuthorName((a as any).author),
        authorRole: "Official Dispatch",
        authorAvatar: "/images/logo.jpg",
        imageUrl: a.image_url || undefined,
        pinned: false,
        createdAt: a.published_at || a.created_at,
        likesCount: 0,
      }));

      const mappedEv: MemberEvent[] = (evRes.data || []).map((e) => ({
        id: e.id,
        title: e.title,
        type: "Tree Growing",
        date: e.event_date || "Upcoming",
        time: "8:00 AM - 1:00 PM",
        location: e.location || "Tanay, Rizal",
        description: e.description || "",
        targetVolunteers: 100,
        signedUp: 0,
        status: e.status || "upcoming",
        imageUrl: e.image_url || undefined,
        createdAt: e.created_at,
      }));

      const mappedRes: MemberResource[] = (resRes.data || []).map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category || "Biodiversity",
        description: r.content || r.summary || "",
        format: "Field Manual",
        downloadUrl: r.content?.startsWith("http") ? r.content : `/resources/${r.slug || r.id}`,
        fileSize: "PDF Document",
        tags: ["Sierra Madre", "Conservation"],
        imageUrl: r.cover_image || undefined,
        createdAt: r.created_at,
      }));

      setAnnouncements(mappedAnn);
      setEventPrograms(mappedEv);
      setResources(mappedRes);
    } catch (err: any) {
      console.error("[Exception in member loadData]", {
        message: err?.message || String(err),
        code: err?.code || "UNKNOWN",
        details: err?.details || null,
        hint: err?.hint || null,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load user volunteer & donation records if signed in
  const loadUserRecords = async () => {
    if (!user?.email) return;

    try {
      const [vRes, dRes] = await Promise.all([
        supabase
          .from("volunteers")
          .select("id, program, status, role, created_at")
          .eq("email", user.email)
          .order("created_at", { ascending: false }),

        supabase
          .from("donations")
          .select("id, amount, currency, payment_method, status, project_allocation, created_at")
          .eq("donor_email", user.email)
          .order("created_at", { ascending: false }),
      ]);

      if (vRes.data) setVolunteerRecords(vRes.data);
      if (dRes.data) setDonationRecords(dRes.data);
    } catch (err) {
      console.error("[Error fetching user volunteer/donation records]", err);
    }
  };

  // Reset unread count when opening feed tab
  useEffect(() => {
    if (activeTab === "feed" && typeof window !== "undefined") {
      localStorage.setItem("kkk_member_last_seen", new Date().toISOString());
      window.dispatchEvent(new Event("kkk_feed_opened"));
    }
  }, [activeTab]);

  useEffect(() => {
    // Load liked posts from localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("kkk_liked_announcements");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setLikedPosts(parsed);
          }
        }
      } catch {
        // ignore
      }
    }

    loadData();
    loadUserRecords();

    // Check URL params for highlight or tab
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      const highlightParam = params.get("highlight");

      if (tabParam && ["feed", "events", "resources", "volunteering", "donations"].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
      if (highlightParam) {
        setHighlightedPostId(highlightParam);
      }
    } catch {
      // ignore
    }

    const handleUpdate = () => {
      loadData(true);
      loadUserRecords();
    };

    const handleLikesSync = () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("kkk_liked_announcements");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) setLikedPosts(parsed);
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("kkk_content_updated", handleUpdate);
    window.addEventListener("kkk_likes_updated", handleLikesSync);
    window.addEventListener("storage", handleLikesSync);

    return () => {
      window.removeEventListener("kkk_content_updated", handleUpdate);
      window.removeEventListener("kkk_likes_updated", handleLikesSync);
      window.removeEventListener("storage", handleLikesSync);
    };
  }, [user?.email]);

  const handleLike = (id: string) => {
    setLikedPosts((prev) => {
      const isAlreadyLiked = prev.includes(id);
      const next = isAlreadyLiked ? prev.filter((p) => p !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("kkk_liked_announcements", JSON.stringify(next));
          window.dispatchEvent(new CustomEvent("kkk_likes_updated", { detail: { id, liked: !isAlreadyLiked } }));
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  const getPostLikesCount = (postId: string) => {
    let hash = 0;
    for (let i = 0; i < postId.length; i++) {
      hash = (hash << 5) - hash + postId.charCodeAt(i);
      hash |= 0;
    }
    const baseLikes = Math.abs(hash % 16) + 5; // e.g., 5 to 20 community likes
    const isLiked = likedPosts.includes(postId);
    return baseLikes + (isLiked ? 1 : 0);
  };

  const handleShare = async (ann: MemberFeedAnnouncement) => {
    const url = `${window.location.origin}/member/dashboard?tab=feed&highlight=${ann.id}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedPostId(ann.id);
      setTimeout(() => setCopiedPostId(null), 2500);
    }
  };

  const displayName = user?.fullName || "Eco-Steward";
  const userInitial = displayName.charAt(0).toUpperCase() || "K";

  const filteredAnnouncements = categoryFilter === "all"
    ? announcements
    : announcements.filter((a) => a.category.toLowerCase().includes(categoryFilter.toLowerCase()));

  const pinnedPost = announcements.find((a) => a.pinned);

  // Total verified donations sum
  const totalVerifiedDonations = donationRecords
    .filter((d) => d.status?.toLowerCase() === "verified")
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  return (
    <div className="space-y-8 text-white" id="member-news-feed">
      
      {/* Welcome Banner with User Account Picture & Status */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-emerald-950/80 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-300 font-black text-2xl font-heading shrink-0 shadow-lg">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={displayName}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <span>{userInitial}</span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 
                style={{ fontFamily: 'var(--font-alice), "Alice", Georgia, serif', color: '#e1ffdd' }}
                className="font-alice text-2xl sm:text-3xl font-normal tracking-tight"
              >
                Welcome back, {displayName}!
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                Active Eco-Steward
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {user?.email ? `${user.email} • ` : ""}Member since 2026 &bull;{" "}
              <strong className="text-white">{volunteerRecords.length * 4}</strong> Bayanihan Hours &bull;{" "}
              <strong className="text-white">₱{totalVerifiedDonations.toLocaleString()}</strong> Support Contributions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/get-involved">
            <Button size="sm" className="bg-[#B07D48] hover:bg-[#9E6E3C] text-[#1A1108] text-xs font-bold rounded-xl shadow-md cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>Join Mission</span>
            </Button>
          </Link>
          <Link href="/donate">
            <Button size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer">
              <Heart className="w-3.5 h-3.5 fill-white mr-1" />
              <span>Donate</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Switcher: News Feed vs Events vs Resources vs Volunteering vs Donations */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
          {[
            { id: "feed", label: `News Feed & Announcements (${announcements.length})`, icon: Megaphone, badge: "Live" },
            { id: "events", label: `Event Programs (${eventPrograms.length})`, icon: Calendar },
            { id: "resources", label: `Shared Resources (${resources.length})`, icon: BookOpen },
            { id: "volunteering", label: `Volunteer Missions (${volunteerRecords.length})`, icon: Clock },
            { id: "donations", label: `Logged Donations (${donationRecords.length})`, icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[#25150B] text-[#e1ffdd] border border-[#8B5A2B] shadow-md scale-102"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#e1ffdd]" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: NEWS FEED & POSTED ANNOUNCEMENTS */}
        {activeTab === "feed" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            
            {/* Header & Category Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-emerald-400" />
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                    Official Announcements & News Feed
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Live bulletins, urgent climate alerts, and conservation dispatches from Kamalayang Kapwa Kalikasan leaders.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: "all", label: "All Posts" },
                  { id: "urgent", label: "Urgent" },
                  { id: "reforestation", label: "Trees" },
                  { id: "advisory", label: "Advisories" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCategoryFilter(f.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      categoryFilter === f.id
                        ? "bg-[#22C55E] text-slate-950 font-bold"
                        : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Announcements Stream Cards */}
            {filteredAnnouncements.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0A1B11]/85 border border-white/10 text-slate-400 space-y-2">
                <Megaphone className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                <h4 className="font-bold text-white text-base">No announcements yet</h4>
                <p className="text-xs">Official bulletins and field updates from the leadership will appear here once published.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAnnouncements.map((post) => {
                  const isLiked = likedPosts.includes(post.id);

                  return (
                    <article
                      key={post.id}
                      id={`item-${post.id}`}
                      className={`p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group ${
                        highlightedPostId === post.id
                          ? "border-emerald-400 ring-4 ring-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.5)] scale-[1.02]"
                          : "border-emerald-500/25 hover:border-emerald-500/50"
                      }`}
                    >
                      <div className="space-y-3.5">
                        {/* Author Header & Category Pill */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-emerald-500/40 bg-black shrink-0">
                              <Image
                                src={post.authorAvatar || "/images/logo.jpg"}
                                alt={post.author}
                                fill
                                sizes="36px"
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">
                                {post.author}
                              </p>
                              <p className="text-[10px] text-emerald-400 font-medium">
                                {post.authorRole}
                              </p>
                            </div>
                          </div>

                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                            {post.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-heading font-extrabold text-lg text-white leading-snug group-hover:text-emerald-300 transition-colors">
                          {post.title}
                        </h3>

                        {/* Optional photo attachment */}
                        {post.imageUrl && (
                          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-black">
                            <Image
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover group-hover:scale-102 transition-transform duration-500"
                              unoptimized
                            />
                          </div>
                        )}

                        {/* Content excerpt */}
                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                          {post.excerpt || post.content}
                        </p>
                      </div>

                      {/* Interactive Action Bar */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                              isLiked
                                ? "bg-red-950/80 text-red-400 border border-red-500/40"
                                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-red-400"
                            }`}
                            title={isLiked ? "Unlike announcement" : "Like announcement"}
                          >
                            <Heart className={`w-3.5 h-3.5 transition-transform active:scale-125 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                            <span>{getPostLikesCount(post.id)}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShare(post)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                            title="Share announcement link"
                          >
                            {copiedPostId === post.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[11px] text-emerald-300 font-bold">Link Copied!</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Share</span>
                              </>
                            )}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedAnnouncement(post)}
                          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 text-xs cursor-pointer"
                        >
                          <span>Full Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: EVENT PROGRAMS */}
        {activeTab === "events" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Upcoming Event Programs & Assemblies
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Organized field tree plantings, environmental rallies, and volunteer training assemblies.
              </p>
            </div>

            {eventPrograms.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0A1B11]/85 border border-white/10 text-slate-400 space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                <h4 className="font-bold text-white text-base">No event programs currently scheduled</h4>
                <p className="text-xs">Upcoming assemblies and tree-growing events will appear here once announced.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {eventPrograms.map((ev) => {
                  const isRsvp = rsvpEvents.includes(ev.id);

                  return (
                    <div
                      key={ev.id}
                      id={`item-${ev.id}`}
                      className="p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 hover:border-emerald-500/50 shadow-xl flex flex-col justify-between space-y-4 transition-all"
                    >
                      <div className="space-y-3">
                        {ev.imageUrl && (
                          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-black">
                            <Image
                              src={ev.imageUrl}
                              alt={ev.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}

                        {ev.status === "completed" || ev.status === "past" ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 inline-flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>FINISHED / COMPLETED</span>
                          </span>
                        ) : ev.status === "ongoing" ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-500/40 inline-flex items-center gap-1.5 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>ONGOING NOW</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[10px] font-bold border border-blue-500/40 inline-block">
                            UPCOMING
                          </span>
                        )}

                        <h3 className="font-heading font-extrabold text-base text-white leading-snug">
                          {ev.title}
                        </h3>

                        <div className="space-y-1 text-xs text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{ev.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{ev.location}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                          {ev.description}
                        </p>
                      </div>

                      {ev.status === "completed" || ev.status === "past" ? (
                        <div className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 text-slate-400 select-none">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Event Finished</span>
                        </div>
                      ) : ev.status === "ongoing" ? (
                        <Link
                          href="/get-involved"
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all cursor-pointer"
                        >
                          <span>⚡ Join Ongoing Mobilization</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setRsvpEvents((prev) =>
                              isRsvp ? prev.filter((id) => id !== ev.id) : [...prev, ev.id]
                            )
                          }
                          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isRsvp
                              ? "bg-emerald-600 text-slate-950 shadow-md"
                              : "bg-blue-600 hover:bg-blue-500 text-white shadow-md"
                          }`}
                        >
                          {isRsvp ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>RSVP Confirmed</span>
                            </>
                          ) : (
                            <span>RSVP Attendance</span>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: SHARED RESOURCES */}
        {activeTab === "resources" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Shared Eco-Resources & Field Manuals
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Downloadable guides, policy briefs, and educational materials for grassroots eco-stewards.
              </p>
            </div>

            {resources.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0A1B11]/85 border border-white/10 text-slate-400 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                <h4 className="font-bold text-white text-base">No shared resources published yet</h4>
                <p className="text-xs">Community field manuals and guides will be accessible here once uploaded.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 hover:border-emerald-500/50 shadow-xl flex flex-col justify-between space-y-4 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                          {res.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {res.format}
                        </span>
                      </div>

                      <h3 className="font-heading font-extrabold text-base text-white leading-snug">
                        {res.title}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {res.description}
                      </p>
                    </div>

                    <a
                      href={res.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-emerald-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Download Resource</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 4: Volunteering Missions */}
        {activeTab === "volunteering" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {volunteerRecords.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0A1B11]/85 border border-white/10 text-slate-400 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                <h4 className="font-bold text-white text-base">No volunteer missions logged yet</h4>
                <p className="text-xs">Apply for upcoming tree-planting or coastal cleanup missions through the Get Involved page.</p>
                <div className="pt-2">
                  <Link href="/get-involved">
                    <Button size="sm" className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold text-xs rounded-xl">
                      Sign Up as Volunteer
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              volunteerRecords.map((act) => (
                <div
                  key={act.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-blue-950 text-blue-300 border-blue-500/40">
                        {act.status}
                      </span>
                      {act.role && (
                        <span className="text-xs font-semibold text-[#F59E0B]">
                          Role: {act.role}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-extrabold text-base text-white">
                      {act.program || "Sierra Madre Conservation Mission"}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        {new Date(act.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60 rounded-xl cursor-pointer">
                      <Award className="w-3.5 h-3.5 text-[#F59E0B] mr-1" />
                      <span>Certificate</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: Donations */}
        {activeTab === "donations" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {donationRecords.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0A1B11]/85 border border-white/10 text-slate-400 space-y-2">
                <Heart className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                <h4 className="font-bold text-white text-base">No donations recorded for your email yet</h4>
                <p className="text-xs">Your voluntary contributions through GCash or bank transfers directly support Sierra Madre reforestation.</p>
                <div className="pt-2">
                  <Link href="/donate">
                    <Button size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs rounded-xl">
                      Make a Contribution
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              donationRecords.map((don) => (
                <div
                  key={don.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        don.status?.toLowerCase() === "verified"
                          ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                          : "bg-amber-950 text-amber-300 border-amber-500/40"
                      }`}>
                        {don.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(don.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-heading font-black text-xl text-white">
                      ₱{Number(don.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                    <p className="text-xs text-slate-300">
                      <strong>Allocation:</strong> {don.project_allocation || "General Reforestation"} &bull;{" "}
                      <span className="font-mono text-emerald-300">{don.payment_method || "GCash"}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Announcement Detail Reader Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[#0E1E14] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  {selectedAnnouncement.category}
                </span>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  {selectedAnnouncement.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Published by <strong className="text-white">{selectedAnnouncement.author}</strong> ({selectedAnnouncement.authorRole}) &bull; {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedAnnouncement.imageUrl && (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
                <Image
                  src={selectedAnnouncement.imageUrl}
                  alt={selectedAnnouncement.title}
                  fill
                  sizes="600px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {selectedAnnouncement.content}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleLike(selectedAnnouncement.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer text-xs ${
                  likedPosts.includes(selectedAnnouncement.id)
                    ? "bg-red-950/80 text-red-400 border border-red-500/40"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-red-400"
                }`}
                title={likedPosts.includes(selectedAnnouncement.id) ? "Unlike announcement" : "Like announcement"}
              >
                <Heart className={`w-4 h-4 transition-transform active:scale-125 ${likedPosts.includes(selectedAnnouncement.id) ? "fill-red-500 text-red-500" : ""}`} />
                <span>{getPostLikesCount(selectedAnnouncement.id)}</span>
              </button>

              <Button
                onClick={() => setSelectedAnnouncement(null)}
                className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold rounded-xl text-xs"
              >
                Close Bulletin
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
