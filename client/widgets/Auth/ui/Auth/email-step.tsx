"use client";

import { FC, FormEvent } from "react";
import { motion, type MotionProps } from "framer-motion";
import { LuMail } from "react-icons/lu";
import { Spinner } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { AUTH_INPUT } from "./auth-input";

interface EmailStepProps {
  motionProps: MotionProps;
  mode: "signin" | "signup";
  email: string;
  onEmailChange: (email: string) => void;
  busy: boolean;
  pending: boolean;
  googlePending: boolean;
  onSubmit: (event: FormEvent) => void;
  onGoogle: () => void;
}

// The first step: an email for a code, or Google instead
export const EmailStep: FC<EmailStepProps> = ({ motionProps, mode, email, onEmailChange, busy, pending, googlePending, onSubmit, onGoogle }) => {
  const { t } = useTranslation();

  return (
    <motion.div {...motionProps} transition={{ duration: 0.2 }} className="flex flex-col gap-6">
      {/* CSS slide without a fade: the greeting is in the server HTML and visible from the first frame */}
      <div className="flex flex-col items-center gap-2 text-center animate-in slide-in-from-top-4 duration-500 motion-reduce:animate-none">
        <h1 className="text-3xl! font-semibold! tracking-tight text-neutral-900 dark:text-neutral-50">
          {mode === "signin" ? t("auth.welcomeBack") : t("auth.createAccount")}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          {mode === "signin" ? t("auth.signInText") : t("auth.signUpText")}
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
        <label htmlFor="auth-email" className="sr-only">
          {t("auth.email.label")}
        </label>
        <input
          id="auth-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder={t("auth.email.placeholder")}
          className={AUTH_INPUT}
          disabled={busy}
        />
        <Button size="lg" type="submit" className="h-12 rounded-2xl" disabled={busy || !email.trim()}>
          {pending ? <Spinner /> : <LuMail aria-hidden />}
          {t("auth.email.send")}
        </Button>
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">{t("auth.email.noPassword")}</p>
      </form>

      <div className="flex items-center gap-3 text-xs text-neutral-400" aria-hidden>
        <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        {t("auth.email.or")}
        <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <Button size="lg" type="button" variant="outline" className="h-12 rounded-2xl" onClick={onGoogle} disabled={busy}>
        {googlePending && <Spinner />}
        {t("auth.google")}
      </Button>
    </motion.div>
  );
};
