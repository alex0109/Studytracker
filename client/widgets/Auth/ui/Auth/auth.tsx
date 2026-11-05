"use client";

import { useActionState, useState } from "react";
import { Spinner, Subtitle, Title } from "@/shared/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MagicLinkStateType, signInWithMagicLink } from "@/entities/auth";
import { Button } from "@/shared/radix-ui";
import { createClient } from "@/entities/auth/api/client";
import { getSafeRedirect } from "@/shared/lib";
import { useLeavingPage } from "@/shared/lib/use-leaving-page";
import { useTranslation } from "@/shared/i18n";

export const Auth = ({ mode = "signin" }: { mode?: "signin" | "signup" }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { leaving, leave } = useLeavingPage();
  const searchParams = useSearchParams();
  const redirect = searchParams!.get("redirect");

  const [magicLinkState, magicLinkAction] = useActionState<
    MagicLinkStateType,
    FormData
  >(signInWithMagicLink, {});

  // Busy from the click until Google's page opens: a second click would start a second sign in.
  // The address is taken first and opened here, so a failed request gives the button back
  const handleGoogleSignIn = async () => {
    const redirectTo = `${process.env.NEXT_PUBLIC_HOME}/api/auth/callback`;
    setLoading(true);

    const { data, error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectTo}?redirect=${encodeURIComponent(getSafeRedirect(redirect))}`,
        skipBrowserRedirect: true,
      },
    });

    setLoading(false);
    if (!error && data.url) leave(data.url, true);
  };

  return (
    <div className="flex flex-col justify-center items-center h-[450px] w-[300px]">
      {magicLinkState.success ? (
        <div className="animate-in slide-in-from-top-4 duration-500 motion-reduce:animate-none">
          <div className="flex flex-col justify-center items-center h-[450px] w-[300px]">
            <Title text={t("auth.checkEmail")} />
            <Subtitle text={`✅${t("auth.magicLinkSent")}`} />
          </div>
        </div>
      ) : (
        <>
          {/* CSS slide without a fade: the greeting is in the server HTML and visible from the first frame */}
          <div className="animate-in slide-in-from-top-4 duration-500 motion-reduce:animate-none">
            <div className="flex flex-col justify-center items-center w-full">
              <Title
                text={
                  mode === "signin" ? t("auth.welcomeBack") : t("auth.createAccount")
                }
              />
              <Subtitle
                text={
                  mode === "signin" ? t("auth.signInText") : t("auth.signUpText")
                }
              />
            </div>
          </div>
          <form action={magicLinkAction} className="flex flex-col w-full">
            {/* <div className="w-full">
              <CustomInput
                disabled={pending ? true : false}
                name="email"
                placeholder="Email..."
                required={true}
              />
            </div>
            <Button size="lg" type="submit">
              Continue with email
            </Button>
            <div className="flex flex-row items-center gap-3 my-3">
              <div className="border-t border-neutral-400 w-[150px]" />
              <div>
                <p className="text-neutral-500">or</p>
              </div>
              <div className="border-t border-neutral-400 w-[150px]" />
            </div> */}
            <Button
              size="lg"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || !!leaving}
            >
              {(loading || leaving) && <Spinner />}
              {t("auth.google")}
            </Button>
          </form>
        </>
      )}

      {magicLinkState.error && (
        <div className="flex flex-col justify-center items-center w-full my-10">
          <p className="text-rose-700">{magicLinkState.error}</p>
        </div>
      )}

      <div className="flex flex-row my-5">
        <p className="text-xs">
          {mode === "signin" ? t("auth.newHere") : t("auth.haveAccount")}{" "}
          {/* Only a checked local path goes on, encoded as a query value */}
          <Link
            href={`${mode === "signin" ? "/sign-up" : "/sign-in"}${
              redirect
                ? `?redirect=${encodeURIComponent(getSafeRedirect(redirect))}`
                : ""
            }`}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {mode === "signin" ? t("auth.createAccountLink") : t("auth.signInLink")}
          </Link>
        </p>
      </div>
    </div>
  );
};
