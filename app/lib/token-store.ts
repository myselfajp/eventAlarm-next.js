"use client";

const KEY = "se_at";

//if want to stay in local
const PERSIST_IN_LOCALSTORAGE = true;

let memToken: string | null = null;

function safeGetStorage() {
    try {
        return typeof window !== "undefined";
    } catch {
        return false;
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
    },
    get(): string | null {
        if (!safeGetStorage()) return memToken;
        try {
            if (memToken) return memToken;
            if (PERSIST_IN_LOCALSTORAGE)
                return localStorage.getItem(KEY) || null;
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
    },
};
