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
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const calculateUnread = (items: NotificationAnnouncement[]) => {
    if (typeof window === "undefined") return 0;
    const lastSeen = localStorage.getItem("kkk_member_last_seen");
    if (!lastSeen) {
      return items.length;
    }
    const lastSeenTime = new Date(lastSeen).getTime();
    return items.filter((item) => {
      const itemTime = new Date(item.published_at || item.created_at).getTime();
      return itemTime > lastSeenTime;
    }).length;
  };

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
      setUnreadCount(calculateUnread(items));
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

    const handleFeedOpened = () => {
      setUnreadCount(0);
    };

    const handleUpdate = () => {
      loadAnnouncements();
    };

    window.addEventListener("kkk_feed_opened", handleFeedOpened);
    window.addEventListener("kkk_content_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("kkk_feed_opened", handleFeedOpened);
      window.removeEventListener("kkk_content_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
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
    const willOpen = !isOpen;
    setIsOpen(willOpen);

    if (willOpen && unreadCount > 0) {
      // Mark as read in localStorage
      localStorage.setItem("kkk_member_last_seen", new Date().toISOString());
      setUnreadCount(0);
      window.dispatchEvent(new Event("kkk_feed_opened"));
    }
  };

  const handleMarkAllRead = () => {
    localStorage.setItem("kkk_member_last_seen", new Date().toISOString());
    setUnreadCount(0);
    window.dispatchEvent(new Event("kkk_feed_opened"));
  };

  const handleAnnouncementClick = (id: string) => {
    localStorage.setItem("kkk_member_last_seen", new Date().toISOString());
    setUnreadCount(0);
    setIsOpen(false);
    window.dispatchEvent(new Event("kkk_feed_opened"));
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
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-md">
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
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
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
              announcements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => handleAnnouncementClick(ann.id)}
                  className="p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 hover:bg-white/5"
                >
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10 shrink-0 mt-0.5">
                    <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="font-bold text-xs text-white truncate">
                        {ann.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatTimeAgo(ann.published_at || ann.created_at)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                      {ann.summary}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-[10px] text-emerald-400 font-medium">
                      <span>View post &rarr;</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}
