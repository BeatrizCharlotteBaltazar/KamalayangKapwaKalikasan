// Kamalayang Kapwa Kalikasan - Content & Notification Store
// Provides persistent storage for Announcements, Event Programs, Resources & Member Notifications
// Connects Admin posting to both Member Portal and Public Pages (Main Website)

import { PHILIPPINE_ENDANGERED_ANIMALS } from "./wildlifePhotos";
import { programsData, resourcesData, newsEventsData } from "./data";
import { Program, Resource, NewsEvent } from "@/types";

export interface Announcement {
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
  pinned?: boolean;
  publishToMainWebsite?: boolean;
  publishToMemberSide?: boolean;
  createdAt: string;
  likesCount: number;
}

export interface EventProgram {
  id: string;
  title: string;
  type: "Rally for Nature" | "Tree Growing" | "Coastal Cleanup" | "Youth Eco-Camp" | "Community Forum";
  date: string;
  time: string;
  location: string;
  description: string;
  targetVolunteers: number;
  signedUp: number;
  status: "Confirmed" | "Planning" | "Completed";
  programFlow?: { time: string; activity: string }[];
  imageUrl?: string;
  animalSpeciesId?: string;
  animalSpeciesName?: string;
  publishToMainWebsite?: boolean;
  publishToMemberSide?: boolean;
  createdAt: string;
}

export interface SharedResource {
  id: string;
  title: string;
  category: "Zero Waste" | "Biodiversity" | "Climate Action" | "Community Guides" | "Eco-Living Tips";
  description: string;
  format: "PDF Document" | "Field Manual" | "Infographic" | "Policy Brief" | "Spreadsheet";
  downloadUrl: string;
  fileSize?: string;
  tags: string[];
  imageUrl?: string;
  animalSpeciesId?: string;
  animalSpeciesName?: string;
  publishToMainWebsite?: boolean;
  publishToMemberSide?: boolean;
  createdAt: string;
}

export interface MemberNotification {
  id: string;
  title: string;
  message: string;
  type: "announcement" | "event" | "resource" | "program";
  sourceId: string;
  targetId?: string; // backwards compatibility
  tabTarget?: "feed" | "events" | "resources";
  createdAt: string;
  read: boolean;
}

// Initial default data: empty by default; live data is read directly from Supabase
const INITIAL_ANNOUNCEMENTS: Announcement[] = [];
const INITIAL_EVENTS: EventProgram[] = [];
const INITIAL_RESOURCES: SharedResource[] = [];
const INITIAL_NOTIFICATIONS: MemberNotification[] = [];

function notifyListeners() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("kkk_content_updated"));
  }
}

// ------------------- ANNOUNCEMENTS -------------------
export function getAnnouncements(): Announcement[] {
  if (typeof window === "undefined") return INITIAL_ANNOUNCEMENTS;
  const saved = localStorage.getItem("kkk_announcements");
  if (!saved) {
    localStorage.setItem("kkk_announcements", JSON.stringify(INITIAL_ANNOUNCEMENTS));
    return INITIAL_ANNOUNCEMENTS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_ANNOUNCEMENTS;
  }
}

export function saveAnnouncement(
  item: Omit<Announcement, "id" | "createdAt" | "likesCount">
): Announcement {
  const all = getAnnouncements();
  const newPost: Announcement = {
    ...item,
    id: `ann-${Date.now()}`,
    publishToMainWebsite: item.publishToMainWebsite !== false,
    publishToMemberSide: item.publishToMemberSide !== false,
    createdAt: new Date().toISOString(),
    likesCount: 0,
  };
  const updated = [newPost, ...all];
  if (typeof window !== "undefined") {
    localStorage.setItem("kkk_announcements", JSON.stringify(updated));
    // Automatically trigger notification for member side
    addMemberNotification({
      title: "New Announcement Posted",
      message: `${newPost.author} published: "${newPost.title}"`,
      type: "announcement",
      sourceId: newPost.id,
      targetId: newPost.id,
      tabTarget: "feed",
    });
    notifyListeners();
  }
  return newPost;
}

export function updateAnnouncement(
  id: string,
  updatedData: Partial<Announcement>
): Announcement | null {
  const all = getAnnouncements();
  let updatedItem: Announcement | null = null;
  const updated = all.map((ann) => {
    if (ann.id === id) {
      updatedItem = { ...ann, ...updatedData };
      return updatedItem;
    }
    return ann;
  });
  if (typeof window !== "undefined" && updatedItem) {
    localStorage.setItem("kkk_announcements", JSON.stringify(updated));
    notifyListeners();
  }
  return updatedItem;
}

export function deleteAnnouncement(id: string) {
  const all = getAnnouncements();
  const updated = all.filter((a) => a.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem("kkk_announcements", JSON.stringify(updated));
    notifyListeners();
  }
}

export function toggleLikeAnnouncement(id: string): { likesCount: number; isLiked: boolean } {
  if (typeof window === "undefined") return { likesCount: 0, isLiked: false };
  const likedKey = "kkk_liked_announcements";
  const likedList: string[] = JSON.parse(localStorage.getItem(likedKey) || "[]");
  const isAlreadyLiked = likedList.includes(id);

  const all = getAnnouncements();
  let newLikes = 0;
  let newLikedState = false;

  const updated = all.map((ann) => {
    if (ann.id === id) {
      if (isAlreadyLiked) {
        newLikes = Math.max(0, ann.likesCount - 1);
        newLikedState = false;
      } else {
        newLikes = ann.likesCount + 1;
        newLikedState = true;
      }
      return { ...ann, likesCount: newLikes };
    }
    return ann;
  });

  const newLikedList = isAlreadyLiked
    ? likedList.filter((item) => item !== id)
    : [...likedList, id];

  localStorage.setItem(likedKey, JSON.stringify(newLikedList));
  localStorage.setItem("kkk_announcements", JSON.stringify(updated));
  notifyListeners();
  return { likesCount: newLikes, isLiked: newLikedState };
}

export function isAnnouncementLiked(id: string): boolean {
  if (typeof window === "undefined") return false;
  const likedList: string[] = JSON.parse(localStorage.getItem("kkk_liked_announcements") || "[]");
  return likedList.includes(id);
}

// ------------------- EVENT PROGRAMS -------------------
export function getEventPrograms(): EventProgram[] {
  if (typeof window === "undefined") return INITIAL_EVENTS;
  const saved = localStorage.getItem("kkk_event_programs");
  if (!saved) {
    localStorage.setItem("kkk_event_programs", JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_EVENTS;
  }
}

export function saveEventProgram(
  item: Omit<EventProgram, "id" | "createdAt">
): EventProgram {
  const all = getEventPrograms();
  const newEv: EventProgram = {
    ...item,
    id: `ev-${Date.now()}`,
    publishToMainWebsite: item.publishToMainWebsite !== false,
    publishToMemberSide: item.publishToMemberSide !== false,
    createdAt: new Date().toISOString(),
  };
  const updated = [newEv, ...all];
  if (typeof window !== "undefined") {
    localStorage.setItem("kkk_event_programs", JSON.stringify(updated));
    addMemberNotification({
      title: "New Event Program Announced",
      message: `Admin posted upcoming program: "${newEv.title}" (${newEv.date})`,
      type: "event",
      sourceId: newEv.id,
      targetId: newEv.id,
      tabTarget: "events",
    });
    notifyListeners();
  }
  return newEv;
}

export function updateEventProgram(
  id: string,
  updatedData: Partial<EventProgram>
): EventProgram | null {
  const all = getEventPrograms();
  let updatedItem: EventProgram | null = null;
  const updated = all.map((ev) => {
    if (ev.id === id) {
      updatedItem = { ...ev, ...updatedData };
      return updatedItem;
    }
    return ev;
  });
  if (typeof window !== "undefined" && updatedItem) {
    localStorage.setItem("kkk_event_programs", JSON.stringify(updated));
    notifyListeners();
  }
  return updatedItem;
}

export function deleteEventProgram(id: string) {
  const all = getEventPrograms();
  const updated = all.filter((e) => e.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem("kkk_event_programs", JSON.stringify(updated));
    notifyListeners();
  }
}

// ------------------- RESOURCES -------------------
export function getSharedResources(): SharedResource[] {
  if (typeof window === "undefined") return INITIAL_RESOURCES;
  const saved = localStorage.getItem("kkk_shared_resources");
  if (!saved) {
    localStorage.setItem("kkk_shared_resources", JSON.stringify(INITIAL_RESOURCES));
    return INITIAL_RESOURCES;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_RESOURCES;
  }
}

export function saveSharedResource(
  item: Omit<SharedResource, "id" | "createdAt">
): SharedResource {
  const all = getSharedResources();
  const newRes: SharedResource = {
    ...item,
    id: `res-${Date.now()}`,
    publishToMainWebsite: item.publishToMainWebsite !== false,
    publishToMemberSide: item.publishToMemberSide !== false,
    createdAt: new Date().toISOString(),
  };
  const updated = [newRes, ...all];
  if (typeof window !== "undefined") {
    localStorage.setItem("kkk_shared_resources", JSON.stringify(updated));
    addMemberNotification({
      title: "New Educational Resource Added",
      message: `Admin shared a new guide: "${newRes.title}" (${newRes.format})`,
      type: "resource",
      sourceId: newRes.id,
      targetId: newRes.id,
      tabTarget: "resources",
    });
    notifyListeners();
  }
  return newRes;
}

export function updateSharedResource(
  id: string,
  updatedData: Partial<SharedResource>
): SharedResource | null {
  const all = getSharedResources();
  let updatedItem: SharedResource | null = null;
  const updated = all.map((res) => {
    if (res.id === id) {
      updatedItem = { ...res, ...updatedData };
      return updatedItem;
    }
    return res;
  });
  if (typeof window !== "undefined" && updatedItem) {
    localStorage.setItem("kkk_shared_resources", JSON.stringify(updated));
    notifyListeners();
  }
  return updatedItem;
}

export function deleteSharedResource(id: string) {
  const all = getSharedResources();
  const updated = all.filter((r) => r.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem("kkk_shared_resources", JSON.stringify(updated));
    notifyListeners();
  }
}

// ------------------- NOTIFICATIONS -------------------
export function getMemberNotifications(): MemberNotification[] {
  if (typeof window === "undefined") return INITIAL_NOTIFICATIONS;
  const saved = localStorage.getItem("kkk_member_notifications");
  if (!saved) {
    localStorage.setItem("kkk_member_notifications", JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function addMemberNotification(item: Omit<MemberNotification, "id" | "createdAt" | "read">) {
  const all = getMemberNotifications();
  const newNotif: MemberNotification = {
    ...item,
    id: `notif-${Date.now()}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const updated = [newNotif, ...all.slice(0, 24)]; // Keep latest 25
  if (typeof window !== "undefined") {
    localStorage.setItem("kkk_member_notifications", JSON.stringify(updated));
    notifyListeners();
  }
}

export function markNotificationAsRead(id: string) {
  const all = getMemberNotifications();
  const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
  if (typeof window !== "undefined") {
    localStorage.setItem("kkk_member_notifications", JSON.stringify(updated));
    notifyListeners();
  }
}

export function markAllNotificationsAsRead() {
  const all = getMemberNotifications();
  const updated = all.map((n) => ({ ...n, read: true }));
  if (typeof window !== "undefined") {
    localStorage.setItem("kkk_member_notifications", JSON.stringify(updated));
    notifyListeners();
  }
}

export function clearNotifications() {
  if (typeof window !== "undefined") {
    localStorage.setItem("kkk_member_notifications", JSON.stringify([]));
    notifyListeners();
  }
}

// ------------------- PUBLIC WEBSITE INTEGRATION -------------------
// Merges static data with dynamic Admin posts published to the main website

export function getPublicProgramsList(): Program[] {
  const adminEvents = getEventPrograms().filter((e) => e.publishToMainWebsite !== false);
  const mappedAdminPrograms: Program[] = adminEvents.map((e) => ({
    id: e.id,
    title: e.title,
    slug: e.id,
    description: e.description,
    detailed_content: `${e.description}\n\n**Schedule:** ${e.date} at ${e.time}\n**Venue:** ${e.location}\n**Target Volunteers:** ${e.targetVolunteers}`,
    status: e.status === "Completed" ? "completed" : e.status === "Planning" ? "upcoming" : "ongoing",
    cover_image: e.imageUrl || PHILIPPINE_ENDANGERED_ANIMALS[0].url,
    start_date: e.date,
    location: e.location,
    beneficiaries: `${e.targetVolunteers} Community Stewards`,
    pillars: [e.type, "Grassroots Mobilization"],
  }));

  // Deduplicate against existing static programs
  const existingIds = new Set(programsData.map((p) => p.id));
  const newAdmin = mappedAdminPrograms.filter((p) => !existingIds.has(p.id));
  return [...newAdmin, ...programsData];
}

export function getPublicResourcesList(): Resource[] {
  const adminResources = getSharedResources().filter((r) => r.publishToMainWebsite !== false);
  const mappedAdminResources: Resource[] = adminResources.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.id,
    category: r.category,
    summary: r.description,
    content: `${r.description}\n\n**Resource Format:** ${r.format}\n**File Size:** ${r.fileSize || "Digital Guide"}\n**Tags:** ${r.tags.join(", ")}`,
    cover_image: r.imageUrl || PHILIPPINE_ENDANGERED_ANIMALS[4].url,
    read_time: "5 min read",
    published_at: r.createdAt.split("T")[0],
    tags: r.tags,
    file_url: r.downloadUrl,
  }));

  const existingIds = new Set(resourcesData.map((res) => res.id));
  const newAdmin = mappedAdminResources.filter((res) => !existingIds.has(res.id));
  return [...newAdmin, ...resourcesData];
}

export function getPublicNewsEventsList(): NewsEvent[] {
  const adminAnnouncements = getAnnouncements().filter((a) => a.publishToMainWebsite !== false);
  const adminEvents = getEventPrograms().filter((e) => e.publishToMainWebsite !== false);

  const mappedAnnouncements: NewsEvent[] = adminAnnouncements.map((a) => ({
    id: a.id,
    type: "news",
    title: a.title,
    slug: a.id,
    excerpt: a.excerpt,
    body: a.content,
    event_date: a.createdAt.split("T")[0],
    location: "National / Field Corridors",
    cover_image: a.imageUrl || PHILIPPINE_ENDANGERED_ANIMALS[0].url,
    organizer: `${a.author} (${a.authorRole})`,
    is_featured: a.pinned,
  }));

  const mappedEvents: NewsEvent[] = adminEvents.map((e) => ({
    id: e.id,
    type: "event",
    title: e.title,
    slug: e.id,
    excerpt: e.description,
    body: `${e.description}\n\nTime: ${e.time}\nLocation: ${e.location}`,
    event_date: e.date,
    location: e.location,
    cover_image: e.imageUrl || PHILIPPINE_ENDANGERED_ANIMALS[3].url,
    organizer: "Kamalayang Kapwa Kalikasan",
    is_featured: true,
  }));

  const existingIds = new Set(newsEventsData.map((ne) => ne.id));
  const combinedAdmin = [...mappedAnnouncements, ...mappedEvents].filter((item) => !existingIds.has(item.id));
  return [...combinedAdmin, ...newsEventsData];
}
