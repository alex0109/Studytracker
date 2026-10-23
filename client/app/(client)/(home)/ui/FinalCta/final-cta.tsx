"use client";

import { FC } from "react";
import Link from "next/link";
import { LuArrowRight, LuSprout } from "react-icons/lu";
import { useSession } from "@/shared/context/session.provider";
import { routes } from "@/shared/config/routes";
import { Reveal } from "../Reveal";

export const FinalCta: FC = () => {
  const { user } = useSession();

  return (
    <section className="w-full max-w-6xl px-4">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-neutral-900 px-6 py-16 text-center text-white md:px-16 md:py-20">
          <div
            aria-hidden
            className="absolute -top-40 left-1/2 h-[26rem] w-[44rem] -translate-x-1/2 rounded-full bg-linear-to-r from-emerald-500/40 via-sky-500/40 to-violet-500/40 blur-3xl"
          />
          <div className="relative flex flex-col items-center gap-6">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 text-2xl text-emerald-300 backdrop-blur">
              <LuSprout />
            </span>
            <h2 className="text-3xl! md:text-5xl! font-semibold! tracking-tight text-balance">
              Plant the first seed today.
            </h2>
            <p className="max-w-xl text-lg text-neutral-300 text-pretty">
              Add one material, ask yourself three questions and defend them
              tomorrow. In a week you will see what you really know, and what
              to grow next.
            </p>
            <Link
              href={user ? routes.materials : routes.auth}
              className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-6 font-medium text-neutral-900 transition hover:bg-neutral-100"
            >
              {user ? "Open my materials" : "Start growing"}
              <LuArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
