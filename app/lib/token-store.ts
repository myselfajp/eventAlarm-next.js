"use client";

import { tryRefreshToken } from "./api";

const KEY = "se_at";
const TOKEN_LIFETIME_MS = 15 * 60 * 1000; // 15 minutes
const REFRESH_BUFFER_MS = 2 * 60 * 1000; // Refresh 2 minutes before expiry

const PERSIST_IN_LOCALSTORAGE = true;

function getInitialToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    if (PERSIST_IN_LOCALSTORAGE) {
      return localStorage.getItem(KEY) || null;
    }
    return sessionStorage.getItem(KEY) || null;
  } catch {
    return null;
  }
}

let memToken: string | null = getInitialToken();
let refreshTimer: NodeJS.Timeout | null = null;

function safeGetStorage() {
  try {
    return typeof window !== "undefined";
  } catch {
    return false;
  }
}

function startAutoRefresh() {
  if (!safeGetStorage() || refreshTimer) return;

  // Clear any existing timer
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }

  // Start background refresh every 13 minutes (15min - 2min buffer)
  refreshTimer = setInterval(async () => {
    if (memToken) {
      console.log("🔄 Auto-refreshing token in background...");
      const success = await tryRefreshToken();
      if (!success) {
        console.warn("⚠️ Background token refresh failed");
      }
    }
  }, TOKEN_LIFETIME_MS - REFRESH_BUFFER_MS);
}

function stopAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

export const tokenStore = {
  set(t: string | null) {
    memToken = t || null;
    if (!safeGetStorage()) return;
    try {
      if (PERSIST_IN_LOCALSTORAGE) {
        if (memToken) localStorage.setItem(KEY, memToken);
        else localStorage.removeItem(KEY);
      } else {
        if (memToken) sessionStorage.setItem(KEY, memToken);
        else sessionStorage.removeItem(KEY);
      }
    } catch {}

    // Start/stop auto refresh based on token presence
    if (memToken) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
  },
  get(): string | null {
    if (!safeGetStorage()) return memToken;
    try {
      if (memToken) return memToken;
      if (PERSIST_IN_LOCALSTORAGE) return localStorage.getItem(KEY) || null;
      return sessionStorage.getItem(KEY) || null;
    } catch {
      return memToken;
    }
  },
  clear() {
    memToken = null;
    if (!safeGetStorage()) return;
    try {
      sessionStorage.removeItem(KEY);
      localStorage.removeItem(KEY);
    } catch {}
    stopAutoRefresh();
  },
};

// Initialize auto refresh if token exists on load
if (typeof window !== "undefined" && memToken) {
  startAutoRefresh();
}
