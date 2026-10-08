import { supabase } from "@/lib/supabase/client";

// ==========================================
// ERROR LOGGING HELPER
// Prints { message, code, details, hint } explicitly
// ==========================================
export function logSupabaseError(context: string, error: any): string {
  const message = error?.message || "Unknown error occurred";
  const code = error?.code || "NO_CODE";
  const details = error?.details || "None";
  const hint = error?.hint || "None";
  console.error(`[Supabase Error in ${context}] message: ${message}, code: ${code}, details: ${details}, hint: ${hint}`);
  return `${message}${hint && hint !== "None" ? ` (Hint: ${hint})` : ""}${code && code !== "NO_CODE" ? ` [Code: ${code}]` : ""}`;
}

// ==========================================
// TYPES (Adapted to exact Supabase Schema)
// ==========================================

export interface AdminAnnouncement {
  id: string;
  title: string;
  category: "Urgent Mobilization" | "Advisory" | "Reforestation Update" | "Policy Brief" | "General";
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  imageUrl?: string;
  animalSpeciesId?: string;
  animalSpeciesName?: string;
  pinned: boolean;
  isPublished: boolean;
  publishToMain: boolean;
  publishToMembers: boolean;
  likesCount: number;
  publishedAt?: string | null;
  createdAt: string;
}

export type EventDbStatus =
  | "draft"
  | "published"
  | "upcoming"
  | "ongoing"
  | "past"
  | "completed"
  | "cancelled";

export interface AdminEvent {
  id: string;
  title: string;
  type: "Rally for Nature" | "Tree Growing" | "Coastal Cleanup" | "Youth Eco-Camp" | "Community Forum";
  date: string;
  time: string;
  location: string;
  description: string;
  targetVolunteers?: number;
  signedUp?: number;
  status: EventDbStatus;
  imageUrl?: string;
  animalSpeciesId?: string;
  animalSpeciesName?: string;
  isPublished: boolean;
  publishToMain: boolean;
  publishToMembers: boolean;
  createdAt: string;
}

export interface AdminProgram {
  id: string;
  title: string;
  slug?: string;
  description: string;
  detailedContent?: string;
  status: "ongoing" | "upcoming" | "past" | "draft";
  category: string;
  location?: string;
  beneficiaries?: string;
  coverImage?: string;
  startDate?: string | null;
  endDate?: string | null;
  isPublished: boolean;
  createdAt: string;
}

export interface AdminResource {
  id: string;
  title: string;
  slug?: string;
  category: "Zero Waste" | "Biodiversity" | "Climate Action" | "Community Guides" | "Eco-Living Tips";
  description: string;
  format: "PDF Document" | "Field Manual" | "Infographic" | "Policy Brief" | "Spreadsheet";
  downloadUrl: string;
  fileSize?: string;
  tags: string[];
  imageUrl?: string;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
}

export interface AdminGalleryItem {
  id: string;
  title?: string;
  album: string;
  caption: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  videoEmbedUrl?: string;
  location?: string;
  date?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface AdminPartner {
  id: string;
  name: string;
  type: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  isActive?: boolean;
  createdAt: string;
}

export interface AdminVolunteer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  interests?: string[];
  availability?: string;
  program: string;
  message?: string;
  status: "Approved" | "Pending Review" | "Rejected";
  createdAt: string;
}

export interface AdminDonation {
  id: string;
  donorName: string;
  email: string;
  amount: number | string;
  trees: number;
  paymentMethod: string;
  referenceNo: string;
  proofUrl?: string;
  status: "Verified" | "Pending" | "Rejected";
  createdAt: string;
}

export interface AdminSubscriber {
  id: string;
  email: string;
  status: "Active" | "Unsubscribed";
  createdAt: string;
}

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "Unread" | "Read" | "Resolved";
  createdAt: string;
}

export interface AdminStats {
  announcementsCount: number;
  eventsCount: number;
  programsCount: number;
  resourcesCount: number;
  galleryCount: number;
  volunteersCount: number;
  donationsCount: number;
  pendingDonationsCount: number;
  subscribersCount: number;
  messagesCount: number;
  unreadMessagesCount: number;
}

// ==========================================
// AUTHOR RESOLUTION HELPER
// Requirement: Show poster as "Kamalayang Kapwa Kalikasan" (or admin's profiles.full_name).
// Never show email or hardcoded "Admin". Fallback to org name.
// ==========================================
export function resolveAuthorName(name?: string | null): string {
  if (!name) return "Kamalayang Kapwa Kalikasan";
  const clean = name.trim();
  if (!clean || clean.toLowerCase() === "admin" || clean.toLowerCase() === "administrator" || clean.includes("@")) {
    return "Kamalayang Kapwa Kalikasan";
  }
  return clean;
}

// ==========================================
// 1. STRICT ADMIN AUTH CHECK (profiles.role ONLY)
// ==========================================
export async function verifyAdminClearance(): Promise<{
  isAdmin: boolean;
  user: { id: string; email: string } | null;
  profile: { id: string; role: string; fullName: string; email: string; avatarUrl: string } | null;
  error?: string;
}> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      if (authError) {
        logSupabaseError("verifyAdminClearance.getUser", authError);
      }
      return { isAdmin: false, user: null, profile: null, error: "Not authenticated" };
    }

    // STRICT CHECK: Read profiles.role from database table, NEVER user_metadata
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, full_name, email, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      const errStr = logSupabaseError("verifyAdminClearance.profiles", profileError);
      return {
        isAdmin: false,
        user: { id: user.id, email: user.email || "" },
        profile: null,
        error: errStr,
      };
    }

    if (!profile || profile.role !== "admin") {
      return {
        isAdmin: false,
        user: { id: user.id, email: user.email || "" },
        profile: profile
          ? {
              id: profile.id,
              role: profile.role,
              fullName: resolveAuthorName(profile.full_name),
              email: profile.email || user.email || "",
              avatarUrl: profile.avatar_url || "",
            }
          : null,
        error: "Forbidden: Account does not have admin role in profiles table.",
      };
    }

    return {
      isAdmin: true,
      user: { id: user.id, email: user.email || "" },
      profile: {
        id: profile.id,
        role: profile.role,
        fullName: resolveAuthorName(profile.full_name),
        email: profile.email || user.email || "",
        avatarUrl: profile.avatar_url || "",
      },
    };
  } catch (err: any) {
    const errStr = logSupabaseError("verifyAdminClearance", err);
    return { isAdmin: false, user: null, profile: null, error: errStr };
  }
}

// ==========================================
// 2. LIVE DASHBOARD STATS
// ==========================================
export async function fetchAdminLiveStats(): Promise<AdminStats> {
  const defaultCounts: AdminStats = {
    announcementsCount: 0,
    eventsCount: 0,
    programsCount: 0,
    resourcesCount: 0,
    galleryCount: 0,
    volunteersCount: 0,
    donationsCount: 0,
    pendingDonationsCount: 0,
    subscribersCount: 0,
    messagesCount: 0,
    unreadMessagesCount: 0,
  };

  try {
    const [
      annRes,
      evRes,
      progRes,
      resRes,
      galRes,
      volRes,
      donRes,
      pendingDonRes,
      subRes,
      msgRes,
      unreadMsgRes,
    ] = await Promise.all([
      supabase.from("announcements").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("programs").select("*", { count: "exact", head: true }),
      supabase.from("resources").select("*", { count: "exact", head: true }),
      supabase.from("gallery_items").select("*", { count: "exact", head: true }),
      supabase.from("volunteers").select("*", { count: "exact", head: true }),
      supabase.from("donations").select("*", { count: "exact", head: true }),
      supabase.from("donations").select("*", { count: "exact", head: true }).eq("status", "Pending"),
      supabase.from("subscribers").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "unread"),
    ]);

    if (annRes.error) logSupabaseError("fetchAdminLiveStats.announcements", annRes.error);
    if (evRes.error) logSupabaseError("fetchAdminLiveStats.events", evRes.error);
    if (progRes.error) logSupabaseError("fetchAdminLiveStats.programs", progRes.error);
    if (resRes.error) logSupabaseError("fetchAdminLiveStats.resources", resRes.error);
    if (galRes.error) logSupabaseError("fetchAdminLiveStats.gallery_items", galRes.error);
    if (volRes.error) logSupabaseError("fetchAdminLiveStats.volunteers", volRes.error);
    if (donRes.error) logSupabaseError("fetchAdminLiveStats.donations", donRes.error);
    if (subRes.error) logSupabaseError("fetchAdminLiveStats.subscribers", subRes.error);
    if (msgRes.error) logSupabaseError("fetchAdminLiveStats.contact_messages", msgRes.error);

    let totalDonations = donRes.count ?? 0;
    let pendingDonations = pendingDonRes.count ?? 0;
    if (typeof window !== "undefined") {
      try {
        const cached = await fetchDonations();
        if (cached.length > totalDonations) {
          totalDonations = cached.length;
          pendingDonations = cached.filter((d) => d.status === "Pending").length;
        }
      } catch {
        // ignore
      }
    }

    let totalVolunteers = volRes.count ?? 0;
    if (typeof window !== "undefined") {
      try {
        const cachedV = await fetchVolunteers();
        if (cachedV.length > totalVolunteers) {
          totalVolunteers = cachedV.length;
        }
      } catch {
        // ignore
      }
    }

    return {
      announcementsCount: annRes.count ?? 0,
      eventsCount: evRes.count ?? 0,
      programsCount: progRes.count ?? 0,
      resourcesCount: resRes.count ?? 0,
      galleryCount: galRes.count ?? 0,
      volunteersCount: totalVolunteers,
      donationsCount: totalDonations,
      pendingDonationsCount: pendingDonations,
      subscribersCount: subRes.count ?? 0,
      messagesCount: msgRes.count ?? 0,
      unreadMessagesCount: unreadMsgRes.count ?? 0,
    };
  } catch (err) {
    logSupabaseError("fetchAdminLiveStats", err);
    return defaultCounts;
  }
}

// ==========================================
// 3. ANNOUNCEMENTS CRUD
// Exact columns: id, title, category, summary, body, image_url, show_on_main, show_on_member, status['draft','published'], published_at, created_at
// ==========================================
export async function fetchAnnouncements(): Promise<AdminAnnouncement[]> {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("id, title, category, summary, body, image_url, show_on_main, show_on_member, status, published_at, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("fetchAnnouncements", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((d) => ({
        id: d.id,
        title: d.title,
        category: (d.category as AdminAnnouncement["category"]) || "General",
        excerpt: d.summary || "",
        content: d.body || "",
        author: resolveAuthorName((d as any).author),
        authorRole: "Official Dispatch",
        imageUrl: d.image_url || undefined,
        pinned: false,
        isPublished: d.status === "published",
        publishToMain: !!d.show_on_main,
        publishToMembers: !!d.show_on_member,
        likesCount: 0,
        publishedAt: d.published_at,
        createdAt: d.created_at,
      }));
    }
  } catch (err) {
    logSupabaseError("fetchAnnouncements", err);
  }
  return [];
}

export async function createAnnouncement(payload: Omit<AdminAnnouncement, "id" | "createdAt" | "likesCount">): Promise<AdminAnnouncement> {
  const newRow = {
    title: payload.title,
    category: payload.category,
    summary: payload.excerpt || payload.content.slice(0, 160),
    body: payload.content,
    image_url: payload.imageUrl || null,
    show_on_main: payload.publishToMain !== false,
    show_on_member: payload.publishToMembers !== false,
    status: payload.isPublished ? "published" : "draft",
    published_at: payload.isPublished ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase
    .from("announcements")
    .insert([newRow])
    .select()
    .single();

  if (error || !data) {
    const errText = logSupabaseError("createAnnouncement", error);
    throw new Error(errText);
  }

  return {
    id: data.id,
    title: data.title,
    category: (data.category as AdminAnnouncement["category"]) || "General",
    excerpt: data.summary || "",
    content: data.body || "",
    author: resolveAuthorName(payload.author),
    authorRole: payload.authorRole || "Official Dispatch",
    imageUrl: data.image_url || undefined,
    pinned: false,
    isPublished: data.status === "published",
    publishToMain: !!data.show_on_main,
    publishToMembers: !!data.show_on_member,
    likesCount: 0,
    publishedAt: data.published_at,
    createdAt: data.created_at,
  };
}

export async function updateAnnouncement(id: string, updates: Partial<AdminAnnouncement>): Promise<boolean> {
  const dbUpdates: Record<string, any> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.excerpt !== undefined) dbUpdates.summary = updates.excerpt;
  if (updates.content !== undefined) dbUpdates.body = updates.content;
  if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
  if (updates.publishToMain !== undefined) dbUpdates.show_on_main = updates.publishToMain;
  if (updates.publishToMembers !== undefined) dbUpdates.show_on_member = updates.publishToMembers;
  if (updates.isPublished !== undefined) {
    dbUpdates.status = updates.isPublished ? "published" : "draft";
    if (updates.isPublished) dbUpdates.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from("announcements").update(dbUpdates).eq("id", id);
  if (error) {
    const errText = logSupabaseError("updateAnnouncement", error);
    throw new Error(errText);
  }
  return true;
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) {
    const errText = logSupabaseError("deleteAnnouncement", error);
    throw new Error(errText);
  }
  return true;
}

// ==========================================
// 4. EVENTS CRUD
// Exact columns: id, title, description, location, event_date, image_url, status, created_at
// ==========================================

export const VALID_EVENT_STATUSES: EventDbStatus[] = [
  "draft",
  "published",
  "upcoming",
  "ongoing",
  "past",
  "completed",
  "cancelled",
];

export function resolveEventStatus(
  isPublished: boolean,
  statusCandidate?: string,
  eventDateStr?: string
): EventDbStatus {
  if (!isPublished || statusCandidate === "draft") {
    return "draft";
  }
  if (
    statusCandidate &&
    VALID_EVENT_STATUSES.includes(statusCandidate as EventDbStatus) &&
    statusCandidate !== "draft"
  ) {
    return statusCandidate as EventDbStatus;
  }
  // If the date is in the future, set to "upcoming"; else default to "published"
  if (eventDateStr) {
    const timestamp = Date.parse(eventDateStr);
    if (!isNaN(timestamp) && timestamp > Date.now()) {
      return "upcoming";
    }
  }
  return "published";
}

export async function fetchEvents(): Promise<AdminEvent[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("id, title, description, location, event_date, image_url, status, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("fetchEvents", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((d) => {
        const rawStatus = (d.status || "").toLowerCase();
        const validStatus: EventDbStatus = VALID_EVENT_STATUSES.includes(rawStatus as EventDbStatus)
          ? (rawStatus as EventDbStatus)
          : rawStatus === "draft"
          ? "draft"
          : "published";

        return {
          id: d.id,
          title: d.title,
          type: "Tree Growing",
          date: d.event_date || "Upcoming",
          time: "8:00 AM",
          location: d.location || "Tanay, Rizal",
          description: d.description || "",
          targetVolunteers: 100,
          signedUp: 0,
          status: validStatus,
          imageUrl: d.image_url || undefined,
          isPublished: validStatus !== "draft",
          publishToMain: true,
          publishToMembers: true,
          createdAt: d.created_at,
        };
      });
    }
  } catch (err) {
    logSupabaseError("fetchEvents", err);
  }
  return [];
}

export async function createEvent(
  payload: Omit<AdminEvent, "id" | "createdAt" | "signedUp">
): Promise<AdminEvent> {
  const finalStatus = resolveEventStatus(payload.isPublished, payload.status, payload.date);

  const newRow = {
    title: payload.title,
    description: payload.description,
    location: payload.location,
    event_date: payload.date || new Date().toISOString(),
    image_url: payload.imageUrl || null,
    status: finalStatus,
  };

  const { data, error } = await supabase.from("events").insert([newRow]).select().single();
  if (error || !data) {
    const errText = logSupabaseError("createEvent", error);
    throw new Error(errText);
  }

  const savedStatus = (data.status as EventDbStatus) || finalStatus;

  return {
    id: data.id,
    title: data.title,
    type: payload.type || "Tree Growing",
    date: data.event_date || payload.date,
    time: payload.time || "8:00 AM",
    location: data.location,
    description: data.description,
    targetVolunteers: payload.targetVolunteers || 100,
    signedUp: 0,
    status: savedStatus,
    imageUrl: data.image_url || undefined,
    isPublished: savedStatus !== "draft",
    publishToMain: true,
    publishToMembers: true,
    createdAt: data.created_at,
  };
}

export async function updateEvent(id: string, updates: Partial<AdminEvent>): Promise<boolean> {
  const dbUpdates: Record<string, any> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.location !== undefined) dbUpdates.location = updates.location;
  if (updates.date !== undefined) dbUpdates.event_date = updates.date;
  if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;

  if (updates.status !== undefined || updates.isPublished !== undefined) {
    const isPub = updates.isPublished !== undefined ? updates.isPublished : updates.status !== "draft";
    dbUpdates.status = resolveEventStatus(isPub, updates.status, updates.date);
  }

  const { error } = await supabase.from("events").update(dbUpdates).eq("id", id);
  if (error) {
    const errText = logSupabaseError("updateEvent", error);
    throw new Error(errText);
  }
  return true;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    const errText = logSupabaseError("deleteEvent", error);
    throw new Error(errText);
  }
  return true;
}

// ==========================================
// 5. PROGRAMS CRUD
// Exact columns: id, title, slug, description, status['ongoing','upcoming','past','draft'], cover_image, start_date, end_date, created_at
// ==========================================
export async function fetchPrograms(): Promise<AdminProgram[]> {
  try {
    const { data, error } = await supabase
      .from("programs")
      .select("id, title, slug, description, status, cover_image, start_date, end_date, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("fetchPrograms", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        detailedContent: p.description,
        status: (p.status === "draft" ? "ongoing" : p.status) as AdminProgram["status"],
        category: "Forestry & Reforestation",
        location: "Sierra Madre",
        beneficiaries: "Dumagat Ancestral Domain",
        coverImage: p.cover_image || undefined,
        startDate: p.start_date,
        endDate: p.end_date,
        isPublished: p.status !== "draft",
        createdAt: p.created_at,
      }));
    }
  } catch (err) {
    logSupabaseError("fetchPrograms", err);
  }
  return [];
}

export async function createProgram(payload: Omit<AdminProgram, "id" | "createdAt">): Promise<AdminProgram> {
  const newRow = {
    title: payload.title,
    slug: payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: payload.description,
    status: payload.isPublished ? (payload.status || "ongoing") : "draft",
    cover_image: payload.coverImage || null,
    start_date: payload.startDate || null,
    end_date: payload.endDate || null,
  };

  const { data, error } = await supabase.from("programs").insert([newRow]).select().single();
  if (error || !data) {
    const errText = logSupabaseError("createProgram", error);
    throw new Error(errText);
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    detailedContent: data.description,
    status: (data.status === "draft" ? "ongoing" : data.status) as AdminProgram["status"],
    category: payload.category || "Forestry & Reforestation",
    location: payload.location || "Sierra Madre",
    beneficiaries: payload.beneficiaries || "Indigenous Custodians",
    coverImage: data.cover_image || undefined,
    startDate: data.start_date,
    endDate: data.end_date,
    isPublished: data.status !== "draft",
    createdAt: data.created_at,
  };
}

export async function updateProgram(id: string, updates: Partial<AdminProgram>): Promise<boolean> {
  const dbUpdates: Record<string, any> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
  if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
  if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
  if (updates.isPublished !== undefined) {
    dbUpdates.status = updates.isPublished ? (updates.status || "ongoing") : "draft";
  }

  const { error } = await supabase.from("programs").update(dbUpdates).eq("id", id);
  if (error) {
    const errText = logSupabaseError("updateProgram", error);
    throw new Error(errText);
  }
  return true;
}

export async function deleteProgram(id: string): Promise<boolean> {
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) {
    const errText = logSupabaseError("deleteProgram", error);
    throw new Error(errText);
  }
  return true;
}

// ==========================================
// 6. RESOURCES CRUD
// Exact columns: id, title, slug, category, summary, content, cover_image, status, published_at, created_at
// ==========================================
export async function fetchResources(): Promise<AdminResource[]> {
  try {
    const { data, error } = await supabase
      .from("resources")
      .select("id, title, slug, category, summary, content, cover_image, status, published_at, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("fetchResources", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        category: (r.category as AdminResource["category"]) || "Biodiversity",
        description: r.summary || "",
        format: "PDF Document",
        downloadUrl: r.content || "/resources/guide.pdf",
        fileSize: "3.5 MB",
        tags: ["Conservation", "Sierra Madre"],
        imageUrl: r.cover_image || undefined,
        isPublished: r.status === "published",
        publishedAt: r.published_at,
        createdAt: r.created_at,
      }));
    }
  } catch (err) {
    logSupabaseError("fetchResources", err);
  }
  return [];
}

export async function createResource(payload: Omit<AdminResource, "id" | "createdAt">): Promise<AdminResource> {
  const newRow = {
    title: payload.title,
    slug: payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    category: payload.category,
    summary: payload.description,
    content: payload.downloadUrl || payload.description,
    cover_image: payload.imageUrl || null,
    status: payload.isPublished ? "published" : "draft",
    published_at: payload.isPublished ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase.from("resources").insert([newRow]).select().single();
  if (error || !data) {
    const errText = logSupabaseError("createResource", error);
    throw new Error(errText);
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    category: (data.category as AdminResource["category"]) || "Biodiversity",
    description: data.summary || "",
    format: payload.format || "PDF Document",
    downloadUrl: data.content || "/resources/guide.pdf",
    fileSize: payload.fileSize || "3.5 MB",
    tags: payload.tags || ["Conservation"],
    imageUrl: data.cover_image || undefined,
    isPublished: data.status === "published",
    publishedAt: data.published_at,
    createdAt: data.created_at,
  };
}

export async function updateResource(id: string, updates: Partial<AdminResource>): Promise<boolean> {
  const dbUpdates: Record<string, any> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.description !== undefined) dbUpdates.summary = updates.description;
  if (updates.downloadUrl !== undefined) dbUpdates.content = updates.downloadUrl;
  if (updates.imageUrl !== undefined) dbUpdates.cover_image = updates.imageUrl;
  if (updates.isPublished !== undefined) {
    dbUpdates.status = updates.isPublished ? "published" : "draft";
    if (updates.isPublished) dbUpdates.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from("resources").update(dbUpdates).eq("id", id);
  if (error) {
    const errText = logSupabaseError("updateResource", error);
    throw new Error(errText);
  }
  return true;
}

export async function deleteResource(id: string): Promise<boolean> {
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) {
    const errText = logSupabaseError("deleteResource", error);
    throw new Error(errText);
  }
  return true;
}

// ==========================================
// 7. GALLERY ITEMS CRUD
// Exact columns: id, album, caption, media_url, media_type['image','video'], created_at
// ==========================================
export async function fetchGalleryItems(): Promise<AdminGalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("id, album, caption, media_url, media_type, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("fetchGalleryItems", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((g) => ({
        id: g.id,
        title: g.caption || g.album,
        album: g.album || "Tree Planting",
        caption: g.caption || "",
        mediaUrl: g.media_url,
        mediaType: (g.media_type as "image" | "video") || "image",
        videoEmbedUrl: g.media_type === "video" ? g.media_url : undefined,
        location: "Tanay, Rizal",
        date: new Date(g.created_at).toLocaleDateString(),
        isPublished: true,
        createdAt: g.created_at,
      }));
    }
  } catch (err) {
    logSupabaseError("fetchGalleryItems", err);
  }
  return [];
}

export async function createGalleryItem(payload: Omit<AdminGalleryItem, "id" | "createdAt">): Promise<AdminGalleryItem> {
  const newRow = {
    album: payload.album,
    caption: payload.caption || payload.title || "Photo from the field",
    media_url: payload.mediaUrl,
    media_type: payload.mediaType || "image",
  };

  const { data, error } = await supabase.from("gallery_items").insert([newRow]).select().single();
  if (error || !data) {
    const errText = logSupabaseError("createGalleryItem", error);
    throw new Error(errText);
  }

  return {
    id: data.id,
    title: data.caption,
    album: data.album,
    caption: data.caption,
    mediaUrl: data.media_url,
    mediaType: (data.media_type as "image" | "video") || "image",
    videoEmbedUrl: data.media_type === "video" ? data.media_url : undefined,
    location: payload.location || "Tanay, Rizal",
    date: payload.date || new Date().toLocaleDateString(),
    isPublished: true,
    createdAt: data.created_at,
  };
}

export async function updateGalleryItem(id: string, updates: Partial<AdminGalleryItem>): Promise<boolean> {
  const dbUpdates: Record<string, any> = {};
  if (updates.album !== undefined) dbUpdates.album = updates.album;
  if (updates.caption !== undefined) dbUpdates.caption = updates.caption;
  if (updates.mediaUrl !== undefined) dbUpdates.media_url = updates.mediaUrl;
  if (updates.mediaType !== undefined) dbUpdates.media_type = updates.mediaType;

  const { error } = await supabase.from("gallery_items").update(dbUpdates).eq("id", id);
  if (error) {
    const errText = logSupabaseError("updateGalleryItem", error);
    throw new Error(errText);
  }
  return true;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) {
    const errText = logSupabaseError("deleteGalleryItem", error);
    throw new Error(errText);
  }
  return true;
}

// ==========================================
// 8. PARTNERS CRUD
// Exact columns: id, name, type, logo_url, website, created_at
// ==========================================
export async function fetchPartners(): Promise<AdminPartner[]> {
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("id, name, type, logo_url, website, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("fetchPartners", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type || "Environmental NGOs",
        logoUrl: p.logo_url || undefined,
        website: p.website || undefined,
        description: "",
        isActive: true,
        createdAt: p.created_at,
      }));
    }
  } catch (err) {
    logSupabaseError("fetchPartners", err);
  }
  return [];
}

export async function createPartner(payload: Omit<AdminPartner, "id" | "createdAt">): Promise<AdminPartner> {
  const newRow = {
    name: payload.name,
    type: payload.type,
    logo_url: payload.logoUrl || null,
    website: payload.website || null,
  };

  const { data, error } = await supabase.from("partners").insert([newRow]).select().single();
  if (error || !data) {
    const errText = logSupabaseError("createPartner", error);
    throw new Error(errText);
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    logoUrl: data.logo_url || undefined,
    website: data.website || undefined,
    description: "",
    isActive: true,
    createdAt: data.created_at,
  };
}

export async function updatePartner(id: string, updates: Partial<AdminPartner>): Promise<boolean> {
  const dbUpdates: Record<string, any> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.type !== undefined) dbUpdates.type = updates.type;
  if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
  if (updates.website !== undefined) dbUpdates.website = updates.website;

  const { error } = await supabase.from("partners").update(dbUpdates).eq("id", id);
  if (error) {
    const errText = logSupabaseError("updatePartner", error);
    throw new Error(errText);
  }
  return true;
}

export async function deletePartner(id: string): Promise<boolean> {
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) {
    const errText = logSupabaseError("deletePartner", error);
    throw new Error(errText);
  }
  return true;
}

// ==========================================
// 9. VOLUNTEERS CRUD
// Existing table: volunteers
// ==========================================
export async function fetchVolunteers(): Promise<AdminVolunteer[]> {
  const mergedMap = new Map<string, AdminVolunteer>();

  // 1. Fetch from Supabase volunteers table
  try {
    const { data, error } = await supabase
      .from("volunteers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("fetchVolunteers", error);
    } else if (data && data.length > 0) {
      data.forEach((v) => {
        mergedMap.set(v.id || v.email, {
          id: v.id,
          fullName: v.full_name,
          email: v.email,
          phone: v.phone,
          location: v.location,
          interests: Array.isArray(v.interests) ? v.interests : (v.skills || []),
          availability: v.availability || "Weekends",
          program: v.program || "Sierra Madre Reforestation",
          message: v.message || "",
          status: v.status || "Pending Review",
          createdAt: v.created_at,
        });
      });
    }
  } catch (err) {
    logSupabaseError("fetchVolunteers", err);
  }

  // 2. Fetch from /api/volunteer (persistent server store)
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/volunteer", { cache: "no-store" });
      if (res.ok) {
        const body = await res.json();
        if (Array.isArray(body?.volunteers)) {
          body.volunteers.forEach((v: any) => {
            const key = v.id || v.email;
            if (!mergedMap.has(key)) {
              mergedMap.set(key, {
                id: v.id,
                fullName: v.fullName || v.full_name,
                email: v.email,
                phone: v.phone,
                location: v.location,
                interests: v.interests || [],
                availability: v.availability || "Weekends",
                program: v.program || "Sierra Madre Reforestation",
                message: v.message || "",
                status: v.status || "Pending Review",
                createdAt: v.createdAt || v.created_at,
              });
            }
          });
        }
      }
    } catch {
      // ignore
    }

    // 3. Merge from localStorage for instantaneous offline/instant visibility
    try {
      const localRaw = localStorage.getItem("kkk_volunteer_applications");
      if (localRaw) {
        const localList = JSON.parse(localRaw);
        if (Array.isArray(localList)) {
          localList.forEach((v: any) => {
            const key = v.id || v.email;
            if (!mergedMap.has(key)) {
              mergedMap.set(key, {
                id: v.id || `vol-local-${Math.random().toString(36).substring(2, 7)}`,
                fullName: v.fullName || v.full_name,
                email: v.email,
                phone: v.phone,
                location: v.location,
                interests: v.interests || [],
                availability: v.availability || "Weekends",
                program: v.program || "Sierra Madre Reforestation",
                message: v.message || "",
                status: v.status || "Pending Review",
                createdAt: v.createdAt || v.created_at || new Date().toISOString(),
              });
            }
          });
        }
      }
    } catch {
      // ignore
    }
  }

  const results = Array.from(mergedMap.values());
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return results;
}

export async function updateVolunteerStatus(id: string, status: AdminVolunteer["status"]): Promise<boolean> {
  // Update in /api/volunteer server store
  if (typeof window !== "undefined") {
    try {
      await fetch("/api/volunteer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch {
      // ignore
    }

    try {
      const localRaw = localStorage.getItem("kkk_volunteer_applications");
      if (localRaw) {
        const localList = JSON.parse(localRaw);
        const updated = localList.map((item: any) => item.id === id ? { ...item, status } : item);
        localStorage.setItem("kkk_volunteer_applications", JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
  }

  // Also attempt Supabase update if table has status column
  try {
    await supabase.from("volunteers").update({ status }).eq("id", id);
  } catch {
    // schema might not have status column
  }

  return true;
}

export async function deleteVolunteer(id: string): Promise<boolean> {
  // Delete from /api/volunteer server store
  if (typeof window !== "undefined") {
    try {
      await fetch(`/api/volunteer?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {
      // ignore
    }

    try {
      const localRaw = localStorage.getItem("kkk_volunteer_applications");
      if (localRaw) {
        const localList = JSON.parse(localRaw);
        const updated = localList.filter((item: any) => item.id !== id);
        localStorage.setItem("kkk_volunteer_applications", JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
  }

  // Also attempt Supabase delete
  try {
    await supabase.from("volunteers").delete().eq("id", id);
  } catch {
    // ignore
  }

  return true;
}

// ==========================================
// 10. DONATIONS CRUD & STATUS VERIFICATION
// Existing table: donations
// ==========================================
export async function fetchDonations(): Promise<AdminDonation[]> {
  const mergedMap = new Map<string, AdminDonation>();

  // 1. Fetch from Supabase donations table
  try {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("fetchDonations", error);
    } else if (data && data.length > 0) {
      data.forEach((d) => {
        const key = d.id || d.reference_no;
        mergedMap.set(key, {
          id: d.id,
          donorName: d.donor_name || "Anonymous",
          email: d.email,
          amount: Number(d.amount) || 0,
          trees: d.trees || Math.max(1, Math.floor(Number(d.amount) / 250)),
          paymentMethod: d.payment_method || "GCash",
          referenceNo: d.reference_no || "N/A",
          proofUrl: d.proof_url || null,
          status: (d.status as AdminDonation["status"]) || "Pending",
          createdAt: d.created_at,
        });
      });
    }
  } catch (err) {
    logSupabaseError("fetchDonations", err);
  }

  // 2. Fetch from /api/donate (persistent server store)
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/donate", { cache: "no-store" });
      if (res.ok) {
        const body = await res.json();
        if (Array.isArray(body?.donations)) {
          body.donations.forEach((d: any) => {
            const key = d.id || d.referenceNo;
            if (!mergedMap.has(key)) {
              mergedMap.set(key, {
                id: d.id,
                donorName: d.donorName || d.donor_name || "Anonymous",
                email: d.email,
                amount: Number(d.amount) || 0,
                trees: d.trees || Math.max(1, Math.floor(Number(d.amount) / 250)),
                paymentMethod: d.paymentMethod || d.payment_method || "GCash",
                referenceNo: d.referenceNo || d.reference_no || "N/A",
                proofUrl: d.proofUrl || d.proof_url || null,
                status: (d.status as AdminDonation["status"]) || "Pending",
                createdAt: d.createdAt || d.created_at,
              });
            }
          });
        }
      }
    } catch {
      // ignore
    }

    // 3. Merge from localStorage for instantaneous offline/instant visibility
    try {
      const localRaw = localStorage.getItem("kkk_user_donations");
      if (localRaw) {
        const localList = JSON.parse(localRaw);
        if (Array.isArray(localList)) {
          localList.forEach((d: any) => {
            const key = d.id || d.referenceNo || d.reference_no;
            if (!mergedMap.has(key)) {
              mergedMap.set(key, {
                id: d.id || `don-local-${Math.random().toString(36).substring(2, 7)}`,
                donorName: d.donorName || d.donor_name || "Anonymous",
                email: d.email,
                amount: Number(d.amount) || 0,
                trees: d.trees || Math.max(1, Math.floor(Number(d.amount) / 250)),
                paymentMethod: d.paymentMethod || d.payment_method || "GCash",
                referenceNo: d.referenceNo || d.reference_no || "N/A",
                proofUrl: d.proofUrl || d.proof_url || null,
                status: (d.status as AdminDonation["status"]) || "Pending",
                createdAt: d.createdAt || d.created_at || new Date().toISOString(),
              });
            }
          });
        }
      }
    } catch {
      // ignore
    }
  }

  const results = Array.from(mergedMap.values());
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return results;
}

export async function updateDonationStatus(id: string, status: AdminDonation["status"]): Promise<boolean> {
  // Update in /api/donate server store
  if (typeof window !== "undefined") {
    try {
      await fetch("/api/donate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch {
      // ignore
    }

    try {
      const localRaw = localStorage.getItem("kkk_user_donations");
      if (localRaw) {
        const localList = JSON.parse(localRaw);
        const updated = localList.map((item: any) => item.id === id ? { ...item, status } : item);
        localStorage.setItem("kkk_user_donations", JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
  }

  // Also attempt Supabase update
  try {
    await supabase.from("donations").update({ status }).eq("id", id);
  } catch {
    // ignore
  }

  return true;
}

export async function deleteDonation(id: string): Promise<boolean> {
  // Delete from /api/donate server store
  if (typeof window !== "undefined") {
    try {
      await fetch(`/api/donate?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {
      // ignore
    }

    try {
      const localRaw = localStorage.getItem("kkk_user_donations");
      if (localRaw) {
        const localList = JSON.parse(localRaw);
        const updated = localList.filter((item: any) => item.id !== id);
        localStorage.setItem("kkk_user_donations", JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
  }

  // Also attempt Supabase delete
  try {
    await supabase.from("donations").delete().eq("id", id);
  } catch {
    // ignore
  }

  return true;
}

// ==========================================
// 11. SUBSCRIBERS CRUD
// Existing table: subscribers
// ==========================================
export async function fetchSubscribers(): Promise<AdminSubscriber[]> {
  try {
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("fetchSubscribers", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((s) => ({
        id: s.id,
        email: s.email,
        status: s.status || "Active",
        createdAt: s.created_at,
      }));
    }
  } catch (err) {
    logSupabaseError("fetchSubscribers", err);
  }
  return [];
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  const { error } = await supabase.from("subscribers").delete().eq("id", id);
  if (error) {
    const errText = logSupabaseError("deleteSubscriber", error);
    throw new Error(errText);
  }
  return true;
}

// ==========================================
// 12. CONTACT MESSAGES CRUD
// Exact columns: id, name, email, subject, message, status['unread','read','resolved'], created_at
// ==========================================
export async function fetchContactMessages(): Promise<AdminContactMessage[]> {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("id, name, email, subject, message, status, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("fetchContactMessages", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((m) => {
        let displayStatus: "Unread" | "Read" | "Resolved" = "Unread";
        const st = (m.status || "unread").toLowerCase();
        if (st === "read") displayStatus = "Read";
        else if (st === "resolved") displayStatus = "Resolved";
        else displayStatus = "Unread";

        return {
          id: m.id,
          name: m.name,
          email: m.email,
          subject: m.subject,
          message: m.message,
          status: displayStatus,
          createdAt: m.created_at,
        };
      });
    }
  } catch (err) {
    logSupabaseError("fetchContactMessages", err);
  }
  return [];
}

export async function updateMessageStatus(id: string, status: "Unread" | "Read" | "Resolved" | "unread" | "read" | "resolved"): Promise<boolean> {
  const dbStatus = status.toLowerCase();
  const { error } = await supabase.from("contact_messages").update({ status: dbStatus }).eq("id", id);
  if (error) {
    const errText = logSupabaseError("updateMessageStatus", error);
    throw new Error(errText);
  }
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) {
    const errText = logSupabaseError("deleteMessage", error);
    throw new Error(errText);
  }
  return true;
}

// ==========================================
// 13. STORAGE BUCKET HELPER ("media" is public)
// ==========================================
export async function uploadMedia(file: File, folder = "uploads"): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const { error } = await supabase.storage.from("media").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    const errText = logSupabaseError("uploadMedia", error);
    throw new Error(errText);
  }

  const { data } = supabase.storage.from("media").getPublicUrl(fileName);
  return data.publicUrl;
}
