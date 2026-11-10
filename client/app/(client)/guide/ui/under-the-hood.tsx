"use client";

import { FC } from "react";
import { IconType } from "react-icons";
import { LuDownload, LuGauge, LuLock, LuSave } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { Reveal } from "../../(home)/ui/Reveal";
import { SectionHeading } from "../../(home)/ui/SectionHeading";
import { ScorePipeline } from "./score-pipeline";
import { MemoryCurve } from "./memory-curve";

const TRUST: { key: "ai" | "quota" | "autosave" | "export"; icon: IconType }[] = [
  { key: "ai", icon: LuLock },
  { key: "quota", icon: LuGauge },
  { key: "autosave", icon: LuSave },
  { key: "export", icon: LuDownload },
];

const card =
  "flex flex-col gap-4 rounded-[2rem] border border-white bg-white/60 p-5 backdrop-blur md:p-8 dark:border-neutral-800 dark:bg-neutral-900/60";

// How scores, repetition and AI work inside, shown rather than told
export const UnderTheHood: FC = () => {
  const { t } = useTranslation();

  return (
    <section id="hood" aria-labelledby="hood-title" className="flex scroll-mt-28 flex-col gap-8">
      <Reveal>
        <SectionHeading
          eyebrow={t("guide.hood.eyebrow")}
          title={<span id="hood-title">{t("guide.hood.title")}</span>}
          text={t("guide.hood.text")}
          align="left"
        />
      </Reveal>

      <Reveal>
        <div className={card}>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl! font-semibold!">{t("guide.hood.score.title")}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("guide.hood.score.text")}</p>
          </div>
          <ScorePipeline />
        </div>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal>
          <div className={card}>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl! font-semibold!">{t("guide.hood.memory.title")}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("guide.hood.memory.text")}</p>
            </div>
            <MemoryCurve />
          </div>
        </Reveal>

        <Reveal>
          <div className={card}>
            <h3 className="text-xl! font-semibold!">{t("guide.hood.trust.title")}</h3>
            <ul className="flex flex-col gap-4">
              {TRUST.map((item) => (
                <li key={item.key} className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                    <item.icon aria-hidden />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{t(`guide.hood.trust.${item.key}.title`)}</span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">{t(`guide.hood.trust.${item.key}.text`)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
