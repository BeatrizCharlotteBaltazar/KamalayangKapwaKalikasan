"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, Megaphone, Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface NotificationAnnouncement {
  id: string;
  title: string;
  category: string;
  summary: string;
  published_at?: string;
  created_at: string;
}

export function MemberNotificationsDropdown() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<NotificationAnnouncement[]>([]);
  const [readIds, setReadIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("kkk_read_announcements");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = announcements.filter((a) => !readIds.includes(a.id)).length;

  const loadAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("id, title, category, summary, body, show_on_member, status, published_at, created_at")
        .eq("status", "published")
        .eq("show_on_member", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[Supabase Error in MemberNotificationsDropdown]", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        return;
      }

      const items: NotificationAnnouncement[] = (data || []).map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category || "General",
        summary: a.summary || a.body?.slice(0, 140) || "",
        published_at: a.published_at,
        created_at: a.created_at,
      }));

      setAnnouncements(items);
    } catch (err: any) {
      console.error("[Exception in MemberNotificationsDropdown]", {
        message: err?.message || String(err),
        code: err?.code || "UNKNOWN",
        details: err?.details || null,
        hint: err?.hint || null,
      });
    }
  };

  useEffect(() => {
    loadAnnouncements();

    const handleReadSync = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setReadIds(e.detail);
      } else if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("kkk_read_announcements");
          if (raw) setReadIds(JSON.parse(raw));
        } catch {}
      }
    };

    const handleContentUpdate = () => {
      loadAnnouncements();
    };

    window.addEventListener("kkk_notifications_read", handleReadSync);
    window.addEventListener("kkk_content_updated", handleContentUpdate);
    window.addEventListener("storage", handleReadSync);

    return () => {
      window.removeEventListener("kkk_notifications_read", handleReadSync);
      window.removeEventListener("kkk_content_updated", handleContentUpdate);
      window.removeEventListener("storage", handleReadSync);
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const markItemAsRead = (id: string) => {
    if (!id) return;
    const next = Array.from(new Set([...readIds, id]));
    setReadIds(next);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("kkk_read_announcements", JSON.stringify(next));
        window.dispatchEvent(new CustomEvent("kkk_notifications_read", { detail: next }));
      } catch {}
    }
  };

  const handleMarkAllRead = () => {
    const allIds = announcements.map((a) => a.id);
    setReadIds(allIds);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("kkk_read_announcements", JSON.stringify(allIds));
        window.dispatchEvent(new CustomEvent("kkk_notifications_read", { detail: allIds }));
      } catch {}
    }
  };

  const handleAnnouncementClick = (id: string) => {
    markItemAsRead(id);
    setIsOpen(false);
    router.push(`/member/dashboard?tab=feed&highlight=${id}`);
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleToggleOpen}
        className="relative p-2 rounded-full bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-slate-200 hover:text-white transition-all cursor-pointer"
        aria-label="Member announcements and notifications"
        title="Announcements & Alerts"
      >
        <Bell className="w-4 h-4 text-emerald-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center animate-pulse shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-3xl bg-[#0D1E13]/95 border-2 border-emerald-500/40 shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 text-white font-sans">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-400" />
              <h4 className="font-heading font-bold text-sm text-white">
                Member Announcements
              </h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] text-emerald-300 hover:text-emerald-200 font-semibold flex items-center gap-1 cursor-pointer bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg border border-white/10 transition-colors"
              >
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List of Announcements */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5 my-2">
            {announcements.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <Bell className="w-6 h-6 text-slate-500 mx-auto opacity-50" />
                <p>No announcements yet.</p>
              </div>
            ) : (
              announcements.map((ann) => {
                const isUnread = !readIds.includes(ann.id);

                return (
                  <div
                    key={ann.id}
                    onClick={() => handleAnnouncementClick(ann.id)}
                    className={`p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                      isUnread
                        ? "bg-amber-950/25 hover:bg-amber-950/40 border border-amber-500/30"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 border ${
                      isUnread
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                        : "bg-black/40 text-slate-400 border-white/10"
                    }`}>
                      <Megaphone className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
                          )}
                          <h5 className="font-bold text-xs text-white truncate">
                            {ann.title}
                          </h5>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatTimeAgo(ann.published_at || ann.created_at)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                        {ann.summary}
                      </p>

                      <div className="mt-1.5 flex items-center justify-between text-[10px]">
                        <span className="text-emerald-400 font-medium hover:underline">
                          View dispatch &rarr;
                        </span>
                        {isUnread && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            UNREAD
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}
    </div>
  );
}
