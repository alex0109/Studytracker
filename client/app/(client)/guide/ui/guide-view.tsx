"use client";

import { FC } from "react";
import { FinalCta } from "../../(home)/ui/FinalCta";
import { guideSections } from "./data";
import { GuideHero } from "./guide-hero";
import { GuideToc } from "./guide-toc";
import { GuideSection } from "./guide-section";
import { UnderTheHood } from "./under-the-hood";
import { GuideTips } from "./guide-tips";
import { GuideFaq } from "./guide-faq";

export const GuideView: FC = () => (
  <div className="flex flex-col items-center gap-16 overflow-x-clip pb-24 md:gap-24">
    <GuideHero />

    <div className="grid w-full max-w-7xl gap-10 px-4 lg:grid-cols-[220px_1fr] xl:gap-14">
      {/* Contents stay in view on wide screens while the guide scrolls */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2 [scrollbar-width:thin]">
          <GuideToc />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col gap-10 md:gap-14">
        {guideSections.map((section, index) => (
          <GuideSection key={section.id} section={section} index={index} />
        ))}
        <UnderTheHood />
        <GuideTips />
        <GuideFaq />
      </div>
    </div>

    <FinalCta />
  </div>
);
