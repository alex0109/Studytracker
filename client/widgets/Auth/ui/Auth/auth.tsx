"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LuArrowLeft, LuMail, LuTriangleAlert } from "react-icons/lu";
import { Spinner } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { createClient } from "@/entities/auth/api/client";
import { sendEmailSignIn } from "@/entities/auth";
import { getSafeRedirect } from "@/shared/lib";
import { useLeavingPage } from "@/shared/lib/use-leaving-page";
import { useTranslation } from "@/shared/i18n";

// The code can be asked for again after a pause: the mail service counts every send
const RESEND_AFTER_SECONDS = 60;

type Step = { name: "email" } | { name: "code"; email: string };

const inputClass =
  "h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-base outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-300/50 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-neutral-600 dark:focus:ring-neutral-700/50";

export const Auth = ({ mode = "signin" }: { mode?: "signin" | "signup" }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const redirect = getSafeRedirect(searchParams?.get("redirect"));
  const { leaving, leave } = useLeavingPage<"google" | "signed-in">();

  const [step, setStep] = useState<Step>({ name: "email" });
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  // A link from the email that didn't work brings the user here with a reason
  const [error, setError] = useState<string | null>(
    searchParams?.get("error") === "link" ? t("auth.email.linkFailed") : null,
  );
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const send = async (address: string) => {
    setPending(true);
    setError(null);
    const result = await sendEmailSignIn({ email: address, redirect });
    setPending(false);

    if (!result.ok) {
      setError(
        result.error === "invalid"
          ? t("auth.email.invalidEmail")
          : result.error === "rate"
            ? t("auth.email.rate")
            : t("auth.email.failed"),
      );
      return;
    }

    setStep({ name: "code", email: address });
    setResendIn(RESEND_AFTER_SECONDS);
  };

  const onSendCode = (event: FormEvent) => {
    event.preventDefault();
    void send(email.trim());
  };

  const onVerify = async (event: FormEvent) => {
    event.preventDefault();
    if (step.name !== "code") return;

    setPending(true);
    setError(null);
    const { error: verifyError } = await createClient().auth.verifyOtp({
      email: step.email,
      token: code.trim(),
      type: "email",
    });

    if (verifyError) {
      setPending(false);
      setError(t("auth.email.wrongCode"));
      return;
    }

    // A full load, so the server pages see the new session at once
    leave(redirect, "signed-in");
  };

  // Busy from the click until Google's page opens: a second click would start a second sign in.
  // The address is taken first and opened here, so a failed request gives the button back
  const onGoogle = async () => {
    const redirectTo = `${process.env.NEXT_PUBLIC_HOME}/api/auth/callback`;
    setPending(true);

    const { data, error: oauthError } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectTo}?redirect=${encodeURIComponent(redirect)}`,
        skipBrowserRedirect: true,
      },
    });

    setPending(false);
    if (!oauthError && data.url) leave(data.url, "google");
  };

  const busy = pending || !!leaving;
  const motionProps = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, x: 16 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -16 } };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 px-4">
      <AnimatePresence mode="wait" initial={false}>
        {step.name === "email" ? (
          <motion.div key="email" {...motionProps} transition={{ duration: 0.2 }} className="flex flex-col gap-6">
            {/* CSS slide without a fade: the greeting is in the server HTML and visible from the first frame */}
            <div className="flex flex-col items-center gap-2 text-center animate-in slide-in-from-top-4 duration-500 motion-reduce:animate-none">
              <h1 className="text-3xl! font-semibold! tracking-tight text-neutral-900 dark:text-neutral-50">
                {mode === "signin" ? t("auth.welcomeBack") : t("auth.createAccount")}
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400">
                {mode === "signin" ? t("auth.signInText") : t("auth.signUpText")}
              </p>
            </div>

            <form onSubmit={onSendCode} className="flex flex-col gap-3" noValidate>
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
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("auth.email.placeholder")}
                className={inputClass}
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
              {leaving === "google" && <Spinner />}
              {t("auth.google")}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="code" {...motionProps} transition={{ duration: 0.2 }} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-neutral-900 text-2xl text-white dark:bg-neutral-100 dark:text-neutral-900">
                <LuMail aria-hidden />
              </span>
              <h1 className="text-3xl! font-semibold! tracking-tight text-neutral-900 dark:text-neutral-50">
                {t("auth.email.codeTitle")}
              </h1>
              <p className="text-neutral-500 text-pretty dark:text-neutral-400">
                {t("auth.email.codeText", { email: step.email })}
              </p>
            </div>

            <form onSubmit={onVerify} className="flex flex-col gap-3">
              <label htmlFor="auth-code" className="sr-only">
                {t("auth.email.codeLabel")}
              </label>
              <input
                id="auth-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={10}
                autoFocus
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className={`${inputClass} text-center font-mono text-2xl tracking-[0.4em]`}
                disabled={busy}
              />
              <Button size="lg" type="submit" className="h-12 rounded-2xl" disabled={busy || code.length < 6}>
                {(pending || leaving === "signed-in") && <Spinner />}
                {t("auth.email.verify")}
              </Button>
            </form>

            <div className="flex items-center justify-between gap-3 text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep({ name: "email" });
                  setCode("");
                  setError(null);
                }}
                className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                <LuArrowLeft aria-hidden /> {t("auth.email.otherEmail")}
              </button>
              <button
                type="button"
                disabled={resendIn > 0 || busy}
                onClick={() => send(step.email)}
                className="font-medium text-neutral-700 hover:text-neutral-900 disabled:font-normal disabled:text-neutral-400 dark:text-neutral-300 dark:hover:text-white"
              >
                {resendIn > 0 ? t("auth.email.resendIn", { seconds: resendIn }) : t("auth.email.resend")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          <LuTriangleAlert aria-hidden className="mt-0.5 shrink-0" /> {error}
        </p>
      )}

      {step.name === "email" && (
        <p className="text-center text-xs text-neutral-500">
          {mode === "signin" ? t("auth.newHere") : t("auth.haveAccount")}{" "}
          {/* Only a checked local path goes on, encoded as a query value */}
          <Link
            href={`${mode === "signin" ? "/sign-up" : "/sign-in"}${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {mode === "signin" ? t("auth.createAccountLink") : t("auth.signInLink")}
          </Link>
        </p>
      )}
    </div>
  );
};
