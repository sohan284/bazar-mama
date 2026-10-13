"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** False during server render and hydration, true once running in the browser. */
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/**
 * A JSON value kept in localStorage that React components can subscribe to.
 * Changes show up immediately in this tab and, via the "storage" event, in other tabs.
 * Before anything is saved (and during server render) the fallback is used.
 */
export function createLocalStore<T>(key: string, fallback: T) {
  const changeEvent = `local-store:${key}`;
  let cache: { raw: string | null; value: T } = { raw: null, value: fallback };

  function get(): T {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {}
    if (raw !== cache.raw) {
      let value = fallback;
      try {
        if (raw) value = JSON.parse(raw) as T;
      } catch {}
      cache = { raw, value };
    }
    return cache.value;
  }

  /** Returns false when the browser refused the write (e.g. storage is full). */
  function set(value: T): boolean {
    let ok = true;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      ok = false;
    }
    window.dispatchEvent(new Event(changeEvent));
    return ok;
  }

  function reset() {
    try {
      localStorage.removeItem(key);
    } catch {}
    window.dispatchEvent(new Event(changeEvent));
  }

  function subscribe(onChange: () => void) {
    window.addEventListener("storage", onChange);
    window.addEventListener(changeEvent, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(changeEvent, onChange);
    };
  }

  function use(): T {
    return useSyncExternalStore(subscribe, get, () => fallback);
  }

  return { get, set, reset, use };
}
