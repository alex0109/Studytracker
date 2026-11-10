"use client";

import { FC } from "react";
import { IconType } from "react-icons";
import {
  LuDownload,
  LuImage,
  LuLanguages,
  LuLink,
  LuMic,
  LuMoon,
  LuSearch,
  LuSquareMousePointer,
} from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { Reveal } from "../../(home)/ui/Reveal";
import { SectionHeading } from "../../(home)/ui/SectionHeading";

// keys: what to press, shown as keyboard keys; tips without keys are gestures or settings
const TIPS: { key: "search" | "flashcards" | "links" | "paste" | "voice" | "select" | "install" | "theme"; icon: IconType; keys?: string[] }[] = [
  { key: "search", icon: LuSearch, keys: ["/"] },
  { key: "flashcards", icon: LuSquareMousePointer, keys: ["←", "↓", "→", "Space"] },
  { key: "links", icon: LuLink, keys: ["Ctrl / ⌘", "Click"] },
  { key: "paste", icon: LuImage, keys: ["Ctrl / ⌘", "V"] },
  { key: "voice", icon: LuMic },
  { key: "select", icon: LuLanguages },
  { key: "install", icon: LuDownload },
  { key: "theme", icon: LuMoon },
];

export const GuideTips: FC = () => {
  const { t } = useTranslation();

  return (
    <section id="tips" aria-labelledby="tips-title" className="flex scroll-mt-28 flex-col gap-8">
      <Reveal>
        <SectionHeading
          eyebrow={t("guide.tips.eyebrow")}
          title={<span id="tips-title">{t("guide.tips.title")}</span>}
          text={t("guide.tips.text")}
          align="left"
        />
      </Reveal>
      <ul className="grid gap-3 sm:grid-cols-2">
        {TIPS.map((tip) => (
          <Reveal key={tip.key}>
            <li className="group flex h-full gap-3 rounded-2xl border border-white bg-white/70 p-4 backdrop-blur transition hover:bg-white hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:bg-neutral-900">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 transition-transform duration-300 group-hover:-rotate-6 dark:bg-neutral-800 dark:text-neutral-200">
                <tip.icon aria-hidden />
              </span>
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{t(`guide.tips.items.${tip.key}.title`)}</span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">{t(`guide.tips.items.${tip.key}.text`)}</span>
                {tip.keys && (
                  <span className="flex flex-wrap gap-1">
                    {tip.keys.map((key) => (
                      <kbd
                        key={key}
                        className="rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 shadow-[0_1px_0_rgb(0_0_0/0.08)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {key}
                      </kbd>
                    ))}
                  </span>
                )}
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
};
