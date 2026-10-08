"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  KKKUser, 
  getStoredUser, 
  getCurrentUser, 
  signOutUser, 
  updateUserAvatar
} from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

interface AuthContextType {
  user: KKKUser | null;
  role: "admin" | "member" | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateAvatar: (url: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  updateAvatar: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<KKKUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Load stored user after client mount without touching storage during render
    const stored = getStoredUser();
    if (stored && isMounted) {
      setUser(stored);
    }

    // Asynchronous background live verification
    getCurrentUser()
      .then((live) => {
        if (!isMounted) return;
        if (live) {
          setUser(live);
        } else {
          const fallback = getStoredUser();
          if (!fallback) {
            setUser(null);
          }
        }
      })
      .catch(() => {
        // preserve current user
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    // Supabase session listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
          const live = await getCurrentUser();
          setUser(live);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    // Cross-tab and in-app event listeners
    const handleAuthEvent = () => {
      const stored = getStoredUser();
      setUser(stored);
    };

    window.addEventListener("kkk_auth_changed", handleAuthEvent);
    window.addEventListener("storage", handleAuthEvent);

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
      window.removeEventListener("kkk_auth_changed", handleAuthEvent);
      window.removeEventListener("storage", handleAuthEvent);
    };
  }, []);

  const handleUpdateAvatar = async (url: string) => {
    const updated = await updateUserAvatar(url);
    if (updated) {
      setUser(updated);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
  };

  const handleRefresh = async () => {
    try {
      const live = await getCurrentUser();
      if (live) {
        setUser(live);
      } else {
        const stored = getStoredUser();
        setUser(stored);
      }
    } catch {
      // fallback
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        updateAvatar: handleUpdateAvatar,
        signOut: handleSignOut,
        refreshUser: handleRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
