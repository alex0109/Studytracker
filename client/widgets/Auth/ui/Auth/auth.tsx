"use client";

import { useActionState, useState } from "react";
import { CustomInput, Subtitle, Title } from "@/shared/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  createClient,
  MagicLinkStateType,
  signInWithMagicLink,
} from "@/entities/auth";
import { Button } from "@/shared/radix-ui";

export const Auth = ({ mode = "signin" }: { mode?: "signin" | "signup" }) => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams!.get("redirect");

  const [magicLinkState, magicLinkAction, pending] = useActionState<
    MagicLinkStateType,
    FormData
  >(signInWithMagicLink, {});

  const handleGoogleSignIn = () => {
    const redirectTo = `${process.env.NEXT_PUBLIC_HOME}/api/auth/callback`;
    setLoading(true);
    const supabase = createClient();
    try {
      supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectTo}?redirect=${encodeURIComponent(
            "/materials",
          )}`,
        },
      });
      setLoading(false);
    } catch (error) {
      return;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[450px] w-[300px]">
      {magicLinkState.success ? (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex flex-col justify-center items-center h-[450px] w-[300px]">
            <Title text="Check your email!" />
            <Subtitle text="✅We have sent you a magic link to sign in to your account" />
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex flex-col justify-center items-center w-[400px]">
              <Title
                text={
                  mode === "signin" ? "Welcome back!" : "Create your account"
                }
              />
              <Subtitle
                text={
                  mode === "signin"
                    ? "Sign in to continue to your account."
                    : "Get started with your new account!"
                }
              />
            </div>
          </motion.div>
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
              disabled={loading}
            >
              Continue with Google
            </Button>
          </form>
        </>
      )}

      {magicLinkState.error && (
        <div className="flex flex-col justify-center items-center w-[400px] my-10">
          <p className="text-rose-700">{magicLinkState.error}</p>
        </div>
      )}

      <div className="flex flex-row my-5">
        <p className="text-xs">
          {mode === "signin"
            ? "New to our platform? "
            : "Already have an account? "}
          <Link
            href={`
              ${mode === "signin" ? "/sign-up" : "/sign-in"}
              ${redirect ? `?redirect=${redirect}` : ""}
            `}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};
