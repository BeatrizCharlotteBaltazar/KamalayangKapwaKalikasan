import { supabase } from "@/lib/supabase/client";

export interface KKKUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "member";
}

export type UserProfile = KKKUser;

export async function getCurrentUser(): Promise<KKKUser | null> {
  if (typeof window === "undefined") return null;

  try {
    // Fetch live user from Supabase Auth server to get latest role changes
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const email = user.email || "";

      // Check optional profiles table if the admin uses a profiles table
      let profileRole: string | null = null;
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        if (profile?.role) {
          profileRole = profile.role;
        }
      } catch {
        // Table may not exist; user_metadata is primary
      }

      // Check app_metadata, user_metadata, or database profile
      const rawRole = (
        user.app_metadata?.role ||
        user.user_metadata?.role ||
        profileRole ||
        "member"
      ).toString().toLowerCase();

      const role: "admin" | "member" = rawRole === "admin" ? "admin" : "member";

      const userObj: KKKUser = {
        id: user.id,
        email,
        fullName: user.user_metadata?.full_name || email.split("@")[0],
        role,
      };

      localStorage.setItem("kkk_current_user", JSON.stringify(userObj));
      return userObj;
    }
  } catch (err) {
    console.error("Error retrieving Supabase user:", err);
  }

  // Fallback from localStorage if offline
  const saved = localStorage.getItem("kkk_current_user");
  if (saved) {
    try {
      return JSON.parse(saved) as KKKUser;
    } catch {
      return null;
    }
  }

  return null;
}

export async function signOutUser() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error("SignOut error:", err);
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("kkk_current_user");
    window.location.href = "/login";
  }
}
