"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLatest } from "@/shared/hooks/use-latest";

// The browser's Web Speech API, which TypeScript's DOM types don't fully cover
interface RecognitionResultEvent {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
}

interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type RecognitionConstructor = new () => Recognition;

const getConstructor = (): RecognitionConstructor | undefined => {
  const speechWindow = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
};

const subscribeToNothing = () => () => {};

export type SpeechErrorKind = "notAllowed" | "network" | "failed";

interface SpeechOptions {
  lang: string;
  onFinal: (text: string) => void;
  onInterim?: (text: string) => void;
  onError?: (kind: SpeechErrorKind) => void;
}

export const useSpeechRecognition = ({ lang, onFinal, onInterim, onError }: SpeechOptions) => {
  // Firefox has no recognition at all; the server can't know, so it says no until the browser answers
  const isSupported = useSyncExternalStore(subscribeToNothing, () => !!getConstructor(), () => false);
  const [isListening, setIsListening] = useState(false);
  const latest = useLatest({ onFinal, onInterim, onError });
  const recognition = useRef<Recognition | null>(null);
  // Browsers end recognition after a silence: while the user hasn't pressed stop it goes on
  const wantsToListen = useRef(false);

  const stop = () => {
    wantsToListen.current = false;
    recognition.current?.stop();
  };

  const start = () => {
    const Constructor = getConstructor();
    if (!Constructor) return;

    const instance = new Constructor();
    instance.lang = lang;
    instance.continuous = true;
    instance.interimResults = true;

    instance.onresult = (event) => {
      let interim = "";
      for (let index = event.resultIndex; index < event.results.length; index++) {
        const result = event.results[index];
        const text = result[0].transcript.trim();
        if (result.isFinal) {
          if (text) latest.current.onFinal(text);
        } else {
          interim += `${result[0].transcript}`;
        }
      }
      latest.current.onInterim?.(interim.trim());
    };

    instance.onerror = ({ error }) => {
      // Silence and our own stop are not failures
      if (error === "no-speech" || error === "aborted") return;

      wantsToListen.current = false;
      latest.current.onError?.(
        error === "not-allowed" || error === "service-not-allowed"
          ? "notAllowed"
          : error === "network"
            ? "network"
            : "failed",
      );
    };

    instance.onend = () => {
      if (wantsToListen.current) {
        instance.start();
        return;
      }
      latest.current.onInterim?.("");
      setIsListening(false);
    };

    recognition.current = instance;
    wantsToListen.current = true;
    setIsListening(true);
    instance.start();
  };

  // Leaving the page must not keep the microphone on
  useEffect(
    () => () => {
      wantsToListen.current = false;
      recognition.current?.abort();
    },
    [],
  );

  return { isSupported, isListening, start, stop };
};
