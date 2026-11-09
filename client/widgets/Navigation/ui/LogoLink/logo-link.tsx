"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";

const LANDING_PATH = "/home";

// The logo leads to the landing page: "/" opens the app for someone signed in, so it is the way back.
// The file is black; the dark theme turns it white
export const LogoLink: FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation();
  const active = usePathname() === LANDING_PATH;

  return (
    <Link
      href={LANDING_PATH}
      aria-label={t("nav.landing")}
      title={t("nav.landing")}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-75",
        className,
      )}
    >
      <Image
        src="/brand/studytracker-logo.svg"
        alt=""
        width={40}
        height={40}
        unoptimized
        priority
        className="size-full dark:invert"
      />
    </Link>
  );
};
