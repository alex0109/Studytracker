"use client";

import { FC, MouseEvent, useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { cn } from "@/shared/lib";

export interface LibraryContentsSection {
  id: string;
  label: string;
  icon: IconType;
  parts: { id: string; label: string }[];
}

const openIfCollapsed = (target: HTMLElement | null) => {
  if (target instanceof HTMLDetailsElement) target.open = true;
};

// A link goes through a closed section's header straight to its text
const goTo = (event: MouseEvent, id: string) => {
  const target = document.getElementById(id);
  if (!target) return;

  event.preventDefault();
  openIfCollapsed(target);
  target.scrollIntoView();
  window.history.replaceState(null, "", `#${id}`);
};

const useActiveSection = (ids: string) => {
  const [active, setActive] = useState(ids.split(",")[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.filter((entry) => entry.isIntersecting).forEach((entry) => setActive(entry.target.id)),
      // A thin band in the upper part of the screen: the section crossing it is the one being read
      { rootMargin: "-25% 0px -70% 0px" },
    );

    ids.split(",").forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
};

export const LibraryContents: FC<{ label: string; sections: LibraryContentsSection[] }> = ({ label, sections }) => {
  const active = useActiveSection(sections.map((section) => section.id).join());

  // A shared link to a note opens that note
  useEffect(() => {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target instanceof HTMLDetailsElement) {
      openIfCollapsed(target);
      target.scrollIntoView();
    }
  }, []);

  return (
    <nav aria-label={label} className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] self-start overflow-y-auto pr-1 lg:block">
      <p className="mb-2 px-3 text-xs font-medium tracking-wide text-neutral-500 uppercase">{label}</p>
      <ul className="flex flex-col gap-1">
        {sections.map(({ id, label: title, icon: Icon, parts }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              onClick={(event) => goTo(event, id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                active === id
                  ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-neutral-50"
                  : "text-neutral-600 hover:bg-white/70 dark:text-neutral-400 dark:hover:bg-neutral-800/60",
              )}
            >
              <Icon aria-hidden className="shrink-0" /> {title}
            </a>
            {active === id && parts.length > 0 && (
              <ul className="mt-1 mb-2 ml-5 flex flex-col border-l border-neutral-300/70 dark:border-neutral-700">
                {parts.map((part) => (
                  <li key={part.id}>
                    <a
                      href={`#${part.id}`}
                      title={part.label}
                      onClick={(event) => goTo(event, part.id)}
                      className="block truncate py-1 pr-2 pl-3 text-[0.8125rem] text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                      {part.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
