import { createClient } from "@supabase/supabase-js";

function getCleanSupabaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gvzabtuqopojnczjlmao.supabase.co";
  return raw.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_PeOg6EE8Zfh1slu4KyvUSg_EY5tCy-T";
}

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (typeof window === "undefined") {
    return createClient(getCleanSupabaseUrl(), getSupabaseAnonKey());
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(getCleanSupabaseUrl(), getSupabaseAnonKey(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseInstance;
}

export const supabase = getSupabaseClient();
