// SHARED-UI
"use client";

import { FC, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { OPERATOR } from "@/shared/config";
import { useTranslation } from "@/shared/i18n";
import { GA_MEASUREMENT_ID, OPEN_CONSENT_EVENT } from "@/shared/lib";

const linkClass = "text-sm text-neutral-400 transition-colors hover:text-white";

const Column: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-xs! font-semibold! uppercase tracking-wider text-neutral-500">{title}</h2>
    <ul className="flex flex-col gap-2">{children}</ul>
  </div>
);

const FooterLink: FC<{ href: string; children: ReactNode }> = ({ href, children }) => (
  <li>
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  </li>
);

// Quick links to every main page; private ones send a signed-out visitor to sign in first
export const Footer: FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-10 bg-neutral-800 px-4 pt-14 pb-8 text-neutral-200 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
      <nav aria-label={t("footer.quickLinks")} className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="col-span-2 flex max-w-sm flex-col gap-3 lg:col-span-1">
          <Link href="/home" className="flex items-center gap-2.5 self-start text-lg font-semibold text-white hover:opacity-80">
            <Image src="/brand/studytracker-logo.svg" alt="" width={32} height={32} unoptimized className="size-8 invert" />
            Studytracker
          </Link>
          <p className="text-sm text-pretty text-neutral-400">{t("meta.description")}</p>
        </div>

        <Column title={t("footer.study")}>
          <FooterLink href="/app">{t("nav.today")}</FooterLink>
          <FooterLink href="/materials">{t("nav.materials")}</FooterLink>
          <FooterLink href="/library">{t("nav.library")}</FooterLink>
          <FooterLink href="/statistics">{t("nav.statistics")}</FooterLink>
          <FooterLink href="/calendar">{t("nav.calendar")}</FooterLink>
        </Column>

        <Column title={t("footer.help")}>
          <FooterLink href="/guide">{t("nav.guide")}</FooterLink>
          <FooterLink href="/limits">{t("nav.limits")}</FooterLink>
          <FooterLink href="/account">{t("nav.account")}</FooterLink>
          <FooterLink href="/home#feedback">{t("footer.feedback")}</FooterLink>
          <FooterLink href="/home">{t("footer.about")}</FooterLink>
        </Column>

        <Column title={t("footer.legal")}>
          <FooterLink href="/terms">{t("footer.terms")}</FooterLink>
          <FooterLink href="/privacy">{t("footer.privacy")}</FooterLink>
          {/* The analytics choice can be changed at any time */}
          {GA_MEASUREMENT_ID && (
            <li>
              <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className={linkClass}>
                {t("footer.cookies")}
              </button>
            </li>
          )}
        </Column>
      </nav>

      {/* The registered business, so customers and payment providers can see who runs the site */}
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-1.5 border-t border-white/10 pt-6 text-xs text-neutral-500">
        <small className="text-xs">
          &copy; 2026 Studytracker. {t("footer.rights")}
        </small>
        <small className="text-xs">
          {t("footer.operator", OPERATOR)} ·{" "}
          <a href={`mailto:${OPERATOR.email}`} className="transition-colors hover:text-white">
            {OPERATOR.email}
          </a>
        </small>
      </div>
    </footer>
  );
};
