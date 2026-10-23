"use client";

import { FC } from "react";
import Link from "next/link";
import { LuArrowDown, LuArrowRight, LuSprout } from "react-icons/lu";
import { useSession } from "@/shared/context/session.provider";
import { routes } from "@/shared/config/routes";
import { HeroPreview } from "./hero-preview";

export const Hero: FC = () => {
  const { user } = useSession();

  return (
    <section className="grid w-full max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col items-start gap-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
          <LuSprout /> A learning system, not a notebook
        </span>

        {/* Headline stays visible from the first paint, it is the LCP element */}
        <h1 className="text-5xl! md:text-7xl! font-semibold! leading-[1.02] tracking-tight text-neutral-900">
          Grow knowledge.
          <br />
          Reinforce it.
          <br />
          <span className="bg-linear-to-r from-emerald-600 via-sky-600 to-violet-600 bg-clip-text text-transparent">
            Make it last.
          </span>
        </h1>

        <p className="max-w-xl text-lg text-neutral-600 text-pretty">
          Studytracker is a system that grows, reinforces and strengthens what
          you learn. Collect materials, turn them into questions and
          flashcards, defend what you know and see exactly where it still
          cracks.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={user ? routes.materials : routes.auth}
            className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-neutral-900 px-6 font-medium text-white shadow-lg shadow-neutral-900/20 transition hover:bg-neutral-800"
          >
            {user ? "Open my materials" : "Start growing"}
            <LuArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center gap-2 rounded-2xl px-5 font-medium text-neutral-700 transition hover:bg-white/70"
          >
            See how it works <LuArrowDown />
          </a>
        </div>
      </div>

      <HeroPreview />
    </section>
  );
};
