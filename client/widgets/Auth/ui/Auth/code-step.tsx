"use client";

import { FC, FormEvent } from "react";
import { motion, type MotionProps } from "framer-motion";
import { LuArrowLeft, LuMail } from "react-icons/lu";
import { Spinner } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { AUTH_INPUT } from "./auth-input";

interface CodeStepProps {
  motionProps: MotionProps;
  email: string;
  code: string;
  onCodeChange: (code: string) => void;
  busy: boolean;
  pending: boolean;
  // Seconds until another code may be asked for
  resendIn: number;
  onSubmit: (event: FormEvent) => void;
  onResend: () => void;
  onOtherEmail: () => void;
}

// The second step: the code from the email, a new one after a pause, or back to another address
export const CodeStep: FC<CodeStepProps> = ({ motionProps, email, code, onCodeChange, busy, pending, resendIn, onSubmit, onResend, onOtherEmail }) => {
  const { t } = useTranslation();

  return (
    <motion.div {...motionProps} transition={{ duration: 0.2 }} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-neutral-900 text-2xl text-white dark:bg-neutral-100 dark:text-neutral-900">
          <LuMail aria-hidden />
        </span>
        <h1 className="text-3xl! font-semibold! tracking-tight text-neutral-900 dark:text-neutral-50">
          {t("auth.email.codeTitle")}
        </h1>
        <p className="text-neutral-500 text-pretty dark:text-neutral-400">
          {t("auth.email.codeText", { email })}
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
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
          onChange={(event) => onCodeChange(event.target.value.replace(/\D/g, ""))}
          placeholder="••••••"
          className={`${AUTH_INPUT} text-center font-mono text-2xl tracking-[0.4em]`}
          disabled={busy}
        />
        <Button size="lg" type="submit" className="h-12 rounded-2xl" disabled={busy || code.length < 6}>
          {pending && <Spinner />}
          {t("auth.email.verify")}
        </Button>
      </form>

      <div className="flex items-center justify-between gap-3 text-sm">
        <button
          type="button"
          onClick={onOtherEmail}
          className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <LuArrowLeft aria-hidden /> {t("auth.email.otherEmail")}
        </button>
        <button
          type="button"
          disabled={resendIn > 0 || busy}
          onClick={onResend}
          className="font-medium text-neutral-700 hover:text-neutral-900 disabled:font-normal disabled:text-neutral-400 dark:text-neutral-300 dark:hover:text-white"
        >
          {resendIn > 0 ? t("auth.email.resendIn", { seconds: resendIn }) : t("auth.email.resend")}
        </button>
      </div>
    </motion.div>
  );
};
