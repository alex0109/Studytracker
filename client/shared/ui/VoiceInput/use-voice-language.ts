"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "voice-input-language";

export const VOICE_LANGUAGES = [
  "uk-UA", "en-GB", "nb-NO", "de-DE", "fr-FR", "es-ES", "it-IT", "pl-PL",
  "pt-PT", "sv-SE", "da-DK", "nl-NL", "fi-FI", "tr-TR", "ja-JP", "ko-KR",
];

const DEFAULT_BY_INTERFACE: Record<string, string> = { uk: "uk-UA", "en-GB": "en-GB", nb: "nb-NO" };

// One choice for the whole site: every microphone shows it, a change in one field reaches the
// others at once and other tabs through the storage event. Storage can be blocked: then the
// choice lasts until the page is left
const listeners = new Set<() => void>();
// undefined: storage not read yet
let chosen: string | null | undefined;

const readStorage = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const notify = () => listeners.forEach((listener) => listener());

const onStorage = (event: StorageEvent) => {
  if (event.key !== STORAGE_KEY) return;
  chosen = event.newValue;
  notify();
};

const subscribe = (listener: () => void) => {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
};

const getSnapshot = () => {
  if (chosen === undefined) chosen = readStorage();
  return chosen;
};

// The server can't know the choice; the microphone isn't rendered there anyway
const getServerSnapshot = () => null;

const chooseLanguage = (language: string) => {
  chosen = language;
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Kept in memory for this visit
  }
  notify();
};

// People often dictate in the language they study, not the one of the interface, so the choice
// wins; without one it is the interface language
export const useVoiceLanguage = (interfaceLanguage: string) => {
  const saved = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const language =
    saved && VOICE_LANGUAGES.includes(saved) ? saved : (DEFAULT_BY_INTERFACE[interfaceLanguage] ?? "en-GB");

  return [language, chooseLanguage] as const;
};
