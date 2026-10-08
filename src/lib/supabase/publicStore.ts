import { supabase } from "@/lib/supabase/client";
import { Program, Resource, NewsEvent, GalleryItem, Partner } from "@/types";
import { resolveAuthorName } from "@/lib/supabase/adminStore";
import { defaultPartners } from "@/lib/data";

// Helper for consistent error logging
function logError(context: string, error: any) {
  const message = error?.message || "Unknown error occurred";
  const code = error?.code || "NO_CODE";
  const details = error?.details || "None";
  const hint = error?.hint || "None";
  console.error(`[Supabase Error in ${context}] message: ${message}, code: ${code}, details: ${details}, hint: ${hint}`);
}

// =============================================================================
// PUBLIC SUPABASE DATA STORE
// Reads strictly from real database tables and returns empty arrays if empty.
// ZERO fallback to hardcoded mock/demo data.
// =============================================================================

export interface PublicDispatch {
  id: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  author?: string;
  image_url?: string;
  published_at?: string;
  created_at: string;
}

export interface PublicRallyEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  image_url?: string;
  status: string;
  created_at: string;
}

/**
 * 1. HOME PAGE FIELD DISPATCHES:
 * Reads latest 3 announcements where status = 'published' AND show_on_main = true
 */
export async function fetchPublicHomeDispatches(): Promise<PublicDispatch[]> {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("id, title, category, summary, body, image_url, status, published_at, created_at")
      .eq("status", "published")
      .eq("show_on_main", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      logError("fetchPublicHomeDispatches", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category || "Field Report",
        summary: a.summary || a.body?.slice(0, 160) || "",
        body: a.body || "",
        author: resolveAuthorName((a as any).author),
        image_url: a.image_url || undefined,
        published_at: a.published_at || a.created_at,
        created_at: a.created_at,
      }));
    }
  } catch (err: any) {
    logError("fetchPublicHomeDispatches.exception", err);
  }
  return [];
}

/**
 * 2. HOME PAGE RALLIES & MOBILIZATIONS:
 * Reads events where status <> 'draft', prioritizing 'ongoing' events, then 'upcoming', then 'completed'.
 */
export async function fetchPublicHomeUpcomingRallies(): Promise<PublicRallyEvent[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("id, title, description, location, event_date, image_url, status, created_at")
      .neq("status", "draft")
      .order("created_at", { ascending: false });

    if (error) {
      logError("fetchPublicHomeUpcomingRallies", error);
      return [];
    }

    if (data && data.length > 0) {
      // Sort: ongoing first, then upcoming, then completed/past
      const sorted = [...data].sort((a, b) => {
        const statusOrder: Record<string, number> = {
          ongoing: 1,
          upcoming: 2,
          published: 3,
          completed: 4,
          past: 5,
          cancelled: 6,
        };
        const orderA = statusOrder[a.status?.toLowerCase()] || 3;
        const orderB = statusOrder[b.status?.toLowerCase()] || 3;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      return sorted.slice(0, 6).map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description || "",
        location: e.location || "",
        event_date: e.event_date || e.created_at,
        image_url: e.image_url || undefined,
        status: (e.status || "upcoming").toLowerCase(),
        created_at: e.created_at,
      }));
    }
  } catch (err: any) {
    logError("fetchPublicHomeUpcomingRallies.exception", err);
  }
  return [];
}

/**
 * 3. ALL NEWS & EVENTS (/news-events page):
 * Reads published announcements (show_on_main = true, status = 'published')
 * and events (status != 'draft')
 */
export async function fetchPublicNewsEvents(): Promise<NewsEvent[]> {
  try {
    const [annRes, evRes] = await Promise.all([
      supabase
        .from("announcements")
        .select("id, title, category, summary, body, image_url, show_on_main, status, published_at, created_at")
        .eq("status", "published")
        .eq("show_on_main", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("events")
        .select("id, title, description, location, event_date, image_url, status, created_at")
        .neq("status", "draft")
        .order("created_at", { ascending: false }),
    ]);

    if (annRes.error) logError("fetchPublicNewsEvents.announcements", annRes.error);
    if (evRes.error) logError("fetchPublicNewsEvents.events", evRes.error);

    const liveItems: NewsEvent[] = [];

    if (annRes.data && annRes.data.length > 0) {
      for (const a of annRes.data) {
        liveItems.push({
          id: a.id,
          type: "news",
          title: a.title,
          slug: a.id,
          excerpt: a.summary || a.body?.slice(0, 160) || "",
          body: a.body || "",
          event_date: (a.published_at || a.created_at || "").split("T")[0],
          location: "",
          cover_image: a.image_url || "/images/bg2.jpg",
          organizer: resolveAuthorName((a as any).author),
          is_featured: false,
        });
      }
    }

    if (evRes.data && evRes.data.length > 0) {
      for (const e of evRes.data) {
        liveItems.push({
          id: e.id,
          type: "event",
          title: e.title,
          slug: e.id,
          excerpt: e.description || "",
          body: e.description || "",
          event_date: (e.event_date || e.created_at || "").split("T")[0],
          location: e.location || "",
          cover_image: e.image_url || "/images/bg2.jpg",
          organizer: "Kamalayang Kapwa Kalikasan",
          is_featured: true,
          status: (e.status || "upcoming").toLowerCase(),
        });
      }
    }

    return liveItems;
  } catch (err: any) {
    logError("fetchPublicNewsEvents.exception", err);
    return [];
  }
}

/**
 * 4. MEMBER ANNOUNCEMENTS (/member/dashboard):
 * Reads published announcements where show_on_member = true, newest first
 */
export async function fetchMemberAnnouncements(): Promise<PublicDispatch[]> {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("id, title, category, summary, body, image_url, show_on_member, status, published_at, created_at")
      .eq("status", "published")
      .eq("show_on_member", true)
      .order("created_at", { ascending: false });

    if (error) {
      logError("fetchMemberAnnouncements", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category || "General",
        summary: a.summary || a.body?.slice(0, 160) || "",
        body: a.body || "",
        author: resolveAuthorName((a as any).author),
        image_url: a.image_url || undefined,
        published_at: a.published_at || a.created_at,
        created_at: a.created_at,
      }));
    }
  } catch (err: any) {
    logError("fetchMemberAnnouncements.exception", err);
  }
  return [];
}

/**
 * 5. PROGRAMS:
 * Reads published programs (status != 'draft')
 */
export async function fetchPublicPrograms(): Promise<Program[]> {
  try {
    const { data, error } = await supabase
      .from("programs")
      .select("id, title, slug, description, status, cover_image, start_date, end_date, created_at")
      .neq("status", "draft")
      .order("created_at", { ascending: false });

    if (error) {
      logError("fetchPublicPrograms", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug || p.id,
        description: p.description,
        detailed_content: p.description,
        status: (p.status === "past" ? "completed" : p.status || "ongoing") as Program["status"],
        cover_image: p.cover_image || "/images/bg2.jpg",
        start_date: (p.start_date || p.created_at || "") as string,
        end_date: (p.end_date || undefined) as string | undefined,
        location: (p as any).location || "",
        beneficiaries: (p as any).beneficiaries || "",
        pillars: (p as any).pillars || [],
      }));
    }
  } catch (err: any) {
    logError("fetchPublicPrograms.exception", err);
  }
  return [];
}

/**
 * 6. RESOURCES:
 * Reads published resources (status = 'published')
 */
export async function fetchPublicResources(): Promise<Resource[]> {
  try {
    const { data, error } = await supabase
      .from("resources")
      .select("id, title, slug, category, summary, content, cover_image, status, published_at, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      logError("fetchPublicResources", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug || r.id,
        category: (r.category as Resource["category"]) || "Biodiversity",
        summary: r.summary || "",
        content: r.content || r.summary || "",
        cover_image: r.cover_image || "/images/bg2.jpg",
        read_time: "5 min read",
        published_at: (r.published_at || r.created_at || "").split("T")[0],
        tags: ["Sierra Madre", "Conservation"],
        file_url: r.content?.startsWith("http") ? r.content : undefined,
      }));
    }
  } catch (err: any) {
    logError("fetchPublicResources.exception", err);
  }
  return [];
}

/**
 * 7. GALLERY:
 * Reads gallery items
 */
export async function fetchPublicGallery(): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("id, album, caption, media_url, media_type, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      logError("fetchPublicGallery", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((g) => ({
        id: g.id,
        album: g.album || "Tree Planting",
        caption: g.caption || "Kamalayang Kapwa Kalikasan in action",
        media_url: g.media_url,
        media_type: (g.media_type as "image" | "video") || "image",
        date: new Date(g.created_at).toLocaleDateString(),
        location: "Sierra Madre & Southern Luzon",
      }));
    }
  } catch (err: any) {
    logError("fetchPublicGallery.exception", err);
  }
  return [];
}

/**
 * 8. PARTNERS:
 * Reads partners table
 */
export async function fetchPublicPartners(): Promise<Partner[]> {
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("id, name, type, logo_url, website, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      logError("fetchPublicPartners", error);
      return defaultPartners;
    }

    if (data && data.length > 0) {
      return data.map((p) => ({
        id: p.id,
        name: p.name,
        type: (p.type as Partner["type"]) || "Environmental NGOs",
        logo_url: p.logo_url || "/images/logo.jpg",
        website: p.website || undefined,
        description: "Official institutional advocate of Kamalayang Kapwa Kalikasan.",
      }));
    }
  } catch (err: any) {
    logError("fetchPublicPartners.exception", err);
  }
  return defaultPartners;
}

/**
 * 9. SINGLE RESOURCE BY SLUG OR ID:
 * Reads published resource where slug = slugOrId OR id = slugOrId
 */
export async function fetchPublicResourceBySlugOrId(slugOrId: string): Promise<Resource | null> {
  try {
    const { data, error } = await supabase
      .from("resources")
      .select("id, title, slug, category, summary, content, cover_image, status, published_at, created_at")
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      logError("fetchPublicResourceBySlugOrId", error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      slug: data.slug || data.id,
      category: (data.category as Resource["category"]) || "Biodiversity",
      summary: data.summary || "",
      content: data.content || data.summary || "",
      cover_image: data.cover_image || "/images/bg2.jpg",
      read_time: "5 min read",
      published_at: (data.published_at || data.created_at || "").split("T")[0],
      tags: [data.category || "Ecology", "Sierra Madre", "Conservation"],
      file_url: data.content?.startsWith("http") ? data.content : undefined,
    };
  } catch (err: any) {
    logError("fetchPublicResourceBySlugOrId.exception", err);
    return null;
  }
}

/**
 * 10. RELATED RESOURCES:
 * Reads published resources with same category, excluding current resource
 */
export async function fetchRelatedResources(category: string, currentId: string): Promise<Resource[]> {
  try {
    const { data, error } = await supabase
      .from("resources")
      .select("id, title, slug, category, summary, content, cover_image, status, published_at, created_at")
      .eq("category", category)
      .eq("status", "published")
      .neq("id", currentId)
      .limit(2);

    if (error) {
      logError("fetchRelatedResources", error);
      return [];
    }

    if (!data) return [];

    return data.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug || r.id,
      category: (r.category as Resource["category"]) || "Biodiversity",
      summary: r.summary || "",
      content: r.content || r.summary || "",
      cover_image: r.cover_image || "/images/bg2.jpg",
      read_time: "5 min read",
      published_at: (r.published_at || r.created_at || "").split("T")[0],
      tags: ["Sierra Madre"],
      file_url: r.content?.startsWith("http") ? r.content : undefined,
    }));
  } catch (err: any) {
    logError("fetchRelatedResources.exception", err);
    return [];
  }
}
