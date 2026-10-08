import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { siteSettings as defaultSiteSettings } from "@/lib/data";
import { SiteSettings } from "@/types";

const STORAGE_KEY = "kkk_site_settings";

/**
 * Returns the currently cached site settings immediately (synchronous for fast SSR/render).
 */
export function getStoredSiteSettings(): SiteSettings {
  if (typeof window === "undefined") return defaultSiteSettings;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSiteSettings, ...parsed };
    }
  } catch {
    // fallback to default
  }
  return defaultSiteSettings;
}

/**
 * Fetches site settings from Supabase table `site_settings` (key text, value jsonb, updated_at).
 * Caches in localStorage and updates active listeners.
 */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error) {
      console.error("Supabase site_settings fetch error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return getStoredSiteSettings();
    }

    if (data && data.length > 0) {
      const merged: SiteSettings = { ...defaultSiteSettings };
      for (const row of data) {
        if (!row.key) continue;
        if (typeof row.value === "object" && row.value !== null && !Array.isArray(row.value)) {
          Object.assign(merged, row.value);
        } else {
          (merged as any)[row.key] = row.value;
        }
      }
      merged.email = merged.contact_email || merged.email;
      merged.phone = merged.contact_phone || merged.phone;
      merged.address = merged.office_address || merged.address;

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new Event("kkk_settings_updated"));
      }
      return merged;
    }
  } catch (err: any) {
    console.error("Could not fetch site_settings from Supabase:", {
      message: err?.message || String(err),
      code: err?.code || "UNKNOWN",
      details: err?.details || null,
      hint: err?.hint || null,
    });
  }

  return getStoredSiteSettings();
}

/**
 * Saves site settings to Supabase table `site_settings` where each setting is a row (key, value jsonb).
 * Updates localStorage only on successful database persistence.
 */
export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; data?: SiteSettings; error?: string }> {
  const current = getStoredSiteSettings();
  const merged: SiteSettings = { ...current, ...settings };
  const now = new Date().toISOString();

  try {
    const settingKeys: (keyof SiteSettings)[] = [
      "gcash_name",
      "gcash_number",
      "gcash_qr_url",
      "bank_name",
      "bank_account_name",
      "bank_account_number",
      "contact_email",
      "contact_phone",
      "office_address",
      "office_hours",
      "dpo_name",
      "dpo_email",
      "stat_trees_planted",
      "stat_volunteers",
      "stat_waste_diverted",
      "stat_hectares",
      "stat_survival_rate",
      "stat_gps_tracked",
      "stat_donation_percentage",
    ];

    const rows = settingKeys.map((k) => ({
      key: k,
      value: merged[k] ?? "",
      updated_at: now,
    }));

    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });

    if (error) {
      console.error("Supabase site_settings save error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return {
        success: false,
        error: `${error.message}${error.hint ? ` (${error.hint})` : ""}${error.code ? ` [Code: ${error.code}]` : ""}`,
      };
    }

    // Only update localStorage and dispatch event AFTER successful Supabase save
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event("kkk_settings_updated"));
    }

    return { success: true, data: merged };
  } catch (err: any) {
    const errorDetails = {
      message: err?.message || "Unknown error",
      code: err?.code || "UNKNOWN",
      details: err?.details || null,
      hint: err?.hint || null,
    };
    console.error("Supabase site_settings save exception:", errorDetails);
    return { success: false, error: errorDetails.message };
  }
}

/**
 * React hook to access live site settings and re-render on changes.
 */
export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    let isMounted = true;
    const stored = getStoredSiteSettings();
    if (stored && isMounted) {
      setSettings(stored);
    }
    fetchSiteSettings().then((live) => {
      if (isMounted) setSettings(live);
    });

    const handler = () => {
      if (isMounted) setSettings(getStoredSiteSettings());
    };

    window.addEventListener("kkk_settings_updated", handler);
    window.addEventListener("storage", handler);

    return () => {
      isMounted = false;
      window.removeEventListener("kkk_settings_updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return settings;
}
