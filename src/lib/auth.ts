import { supabase } from "@/lib/supabase/client";

export interface KKKUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "member";
  avatarUrl?: string;
}

export type UserProfile = KKKUser;

// Curated nature & eco avatar presets for easy selection
import { PHILIPPINE_ENDANGERED_ANIMALS } from "./wildlifePhotos";

export const ECO_AVATAR_PRESETS = PHILIPPINE_ENDANGERED_ANIMALS.map((animal) => ({
  id: animal.id,
  label: animal.name,
  url: animal.url,
  status: animal.status,
  scientificName: animal.scientificName,
  habitat: animal.habitat,
}));

export function getDefaultAvatar(_name: string, _email: string): string {
  // Default to authentic Philippine Eagle photography (NOT AI generated)
  return PHILIPPINE_ENDANGERED_ANIMALS[0].url;
}

export function notifyAuthListeners() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("kkk_auth_changed"));
  }
}

// Instant synchronous retrieval from localStorage to prevent auth flicker
export function getStoredUser(): KKKUser | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("kkk_current_user");
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved) as KKKUser;
    if (!parsed.avatarUrl) {
      parsed.avatarUrl = getDefaultAvatar(parsed.fullName, parsed.email);
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<KKKUser | null> {
  if (typeof window === "undefined") return null;

  // 1. First retrieve local stored session for instant response
  const cachedUser = getStoredUser();

  try {
    // 2. Fetch live user from Supabase Auth server
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const email = user.email || "";

      // Check optional profiles table
      let profileRole: string | null = null;
      let profileAvatar: string | null = null;
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, avatar_url")
          .eq("id", user.id)
          .maybeSingle();
        if (profile?.role) profileRole = profile.role;
        if (profile?.avatar_url) profileAvatar = profile.avatar_url;
      } catch {
        // user_metadata is primary fallback
      }

      // STRICT CHECK: Admin checks must read profiles.role, never user_metadata
      const role: "admin" | "member" = profileRole === "admin" ? "admin" : "member";

      const avatarUrl =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        profileAvatar ||
        cachedUser?.avatarUrl ||
        getDefaultAvatar(user.user_metadata?.full_name || email, email);

      const userObj: KKKUser = {
        id: user.id,
        email,
        fullName: user.user_metadata?.full_name || email.split("@")[0],
        role,
        avatarUrl,
      };

      localStorage.setItem("kkk_current_user", JSON.stringify(userObj));
      return userObj;
    }
  } catch (err) {
    console.warn("Supabase auth verification failed, using cached session:", err);
  }

  // 3. Fallback to cached session (e.g. offline or demo mode)
  return cachedUser;
}

export async function updateUserAvatar(avatarUrl: string): Promise<KKKUser | null> {
  const user = getStoredUser();
  if (!user) return null;

  const updated: KKKUser = { ...user, avatarUrl };
  if (typeof window !== "undefined") {
    localStorage.setItem("kkk_current_user", JSON.stringify(updated));
    notifyAuthListeners();
  }

  // Also update in Supabase user_metadata if active
  try {
    await supabase.auth.updateUser({
      data: { avatar_url: avatarUrl },
    });
  } catch (err) {
    console.warn("Could not sync avatar to Supabase server:", err);
  }

  return updated;
}

export async function updateUserProfile(updates: Partial<KKKUser>): Promise<KKKUser | null> {
  const current = getStoredUser();
  if (!current) return null;

  const merged: KKKUser = { ...current, ...updates };
  if (typeof window !== "undefined") {
    localStorage.setItem("kkk_current_user", JSON.stringify(merged));
    notifyAuthListeners();
  }

  try {
    await supabase.auth.updateUser({
      data: {
        full_name: merged.fullName,
        role: merged.role,
        avatar_url: merged.avatarUrl,
      },
    });
  } catch (err) {
    console.warn("Could not sync profile to Supabase server:", err);
  }

  return merged;
}

export async function signOutUser() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error("SignOut error:", err);
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("kkk_current_user");
    notifyAuthListeners();
    window.location.href = "/login";
  }
}
