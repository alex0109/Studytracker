"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { LuTriangleAlert } from "react-icons/lu";
import { createClient, sendEmailSignIn } from "@/entities/auth";
import { getSafeRedirect } from "@/shared/lib";
import { useLeavingPage } from "@/shared/lib/use-leaving-page";
import { useTranslation } from "@/shared/i18n";
import { EmailStep } from "./email-step";
import { CodeStep } from "./code-step";

// The code can be asked for again after a pause: the mail service counts every send
const RESEND_AFTER_SECONDS = 60;

type Step = { name: "email" } | { name: "code"; email: string };


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
          <EmailStep
            key="email"
            motionProps={motionProps}
            mode={mode}
            email={email}
            onEmailChange={setEmail}
            busy={busy}
            pending={pending}
            googlePending={leaving === "google"}
            onSubmit={onSendCode}
            onGoogle={onGoogle}
          />
        ) : (
          <CodeStep
            key="code"
            motionProps={motionProps}
            email={step.email}
            code={code}
            onCodeChange={setCode}
            busy={busy}
            pending={pending || leaving === "signed-in"}
            resendIn={resendIn}
            onSubmit={onVerify}
            onResend={() => send(step.email)}
            onOtherEmail={() => {
              setStep({ name: "email" });
              setCode("");
              setError(null);
            }}
          />
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
