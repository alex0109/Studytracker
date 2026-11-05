// SHARED-UI
"use client";

import { FC, ReactNode, useState } from "react";
import { LuCheck, LuChevronDown, LuMic, LuSquare } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/radix-ui/DropdownMenu/dropdown-menu";
import { toast } from "@/shared/radix-ui";
import { cn } from "@/shared/lib/cn";
import { useSpeechRecognition } from "./use-speech-recognition";

const STORAGE_KEY = "voice-input-language";

const VOICE_LANGUAGES = [
  "uk-UA", "en-GB", "nb-NO", "de-DE", "fr-FR", "es-ES", "it-IT", "pl-PL",
  "pt-PT", "sv-SE", "da-DK", "nl-NL", "fi-FI", "tr-TR", "ja-JP", "ko-KR",
];

const DEFAULT_BY_INTERFACE: Record<string, string> = { uk: "uk-UA", "en-GB": "en-GB", nb: "nb-NO" };

// People often dictate in the language they study, not the one of the interface, so the choice is
// remembered. Storage can be blocked: then it starts from the interface language each time
const readSavedLanguage = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const saveLanguage = (language: string) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Works without it for this visit
  }
};

interface VoiceInputButtonProps {
  // Each finished phrase
  onText: (text: string) => void;
  // What is being heard right now, before it is final
  onInterim?: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

// A microphone with its language. Shows nothing where the browser can't recognise speech
export const VoiceInputButton: FC<VoiceInputButtonProps> = ({ onText, onInterim, disabled, className }) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(() => {
    const saved = typeof window === "undefined" ? null : readSavedLanguage();
    return saved && VOICE_LANGUAGES.includes(saved) ? saved : (DEFAULT_BY_INTERFACE[i18n.language] ?? "en-GB");
  });

  const { isSupported, isListening, start, stop } = useSpeechRecognition({
    lang: language,
    onFinal: onText,
    onInterim,
    onError: (kind) => toast({ title: `❌${t(`voice.errors.${kind}`)}`, variant: "error" }),
  });

  if (!isSupported) return null;

  const names = new Intl.DisplayNames([i18n.language], { type: "language" });
  const nameOf = (code: string) => names.of(code.split("-")[0]) ?? code;

  return (
    <span className={cn("inline-flex shrink-0 items-center rounded-lg", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={isListening ? stop : start}
        aria-pressed={isListening}
        aria-label={isListening ? t("voice.stop") : t("voice.start")}
        title={isListening ? t("voice.stop") : t("voice.start")}
        className={cn(
          "flex size-8 cursor-pointer items-center justify-center rounded-lg transition disabled:cursor-default disabled:opacity-35",
          isListening
            ? "animate-pulse bg-red-500 text-white motion-reduce:animate-none"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white",
        )}
      >
        {isListening ? <LuSquare aria-hidden className="size-3.5 fill-current" /> : <LuMic aria-hidden className="size-4" />}
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={isListening || disabled}
          aria-label={t("voice.language")}
          title={t("voice.language")}
          className="flex h-8 cursor-pointer items-center gap-0.5 rounded-lg px-1 text-xs font-medium text-neutral-500 uppercase transition hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-40 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          {language.split("-")[0]}
          <LuChevronDown aria-hidden className="size-3 opacity-60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-72 min-w-44">
          {VOICE_LANGUAGES.map((code) => (
            <DropdownMenuItem
              key={code}
              lang={code}
              onSelect={() => {
                setLanguage(code);
                saveLanguage(code);
              }}
              className="flex items-center justify-between gap-3 capitalize"
            >
              {nameOf(code)}
              {code === language && <LuCheck aria-hidden />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
};

// A phrase added after what is already written, with a space between
export const appendSpoken = (current: string, spoken: string, maxLength?: number) => {
  const joined = `${current}${current && !/\s$/.test(current) ? " " : ""}${spoken}`;
  return maxLength ? joined.slice(0, maxLength) : joined;
};

interface VoiceFieldProps {
  value: string;
  onChange: (next: string) => void;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  // The text field itself
  children: ReactNode;
}

// A text field with a microphone under it and the words being heard next to it. The button comes
// after the field: inside a <label> the first control in the tree is the one a click on its text focuses
export const VoiceField: FC<VoiceFieldProps> = ({ value, onChange, maxLength, disabled, className, children }) => {
  const [interim, setInterim] = useState("");

  return (
    <div className="flex w-full flex-col gap-1">
      {children}
      <div className={cn("flex min-h-8 items-center justify-end gap-2", className)}>
        {interim && <p className="min-w-0 flex-1 truncate text-xs text-neutral-500 italic">{interim}</p>}
        <VoiceInputButton
          disabled={disabled}
          onInterim={setInterim}
          onText={(text) => onChange(appendSpoken(value, text, maxLength))}
        />
      </div>
    </div>
  );
};
