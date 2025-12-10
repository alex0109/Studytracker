"use client";

import CustomButton from "@/shared/components/button";
import ContainerColumn from "@/shared/components/container-column";
import ContainerRow from "@/shared/components/container-row";
import CustomInput from "@/shared/components/input";
import Subtitle from "@/shared/components/subtitle";
import Title from "@/shared/components/title";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useActionState, useState } from "react";
import { MagicLinkStateType, signInWithMagicLink } from "./actions";
import Text from "@/shared/components/text";
import { createClient } from "@/shared/supabase/client";

const Auth = ({ mode = "signin" }: { mode?: "signin" | "signup" }) => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [magicLinkState, magicLinkAction, pending] = useActionState<
    MagicLinkStateType,
    FormData
  >(signInWithMagicLink, {});

  const handleGoogleSignIn = () => {
    const redirectTo = `${process.env.NEXT_PUBLIC_HOME}/api/auth/callback`;
    setLoading(true);
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectTo}?redirect=${encodeURIComponent(
          "/materials"
        )}`,
      },
    });
    setLoading(false);
  };

  return (
    <ContainerColumn blockStyles="h-[450px]">
      {magicLinkState.success ? (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <ContainerColumn>
            <Title text="Check your email!" />
            <Subtitle text="✅We have sent you a magic link to sign in to your account" />
          </ContainerColumn>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <ContainerColumn>
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
            </ContainerColumn>
          </motion.div>
          <form action={magicLinkAction}>
            <CustomInput
              disabled={pending ? true : false}
              name="email"
              placeholder="Email..."
              required={true}
            />
            <CustomButton type="submit" title="Continue with email" />
            <ContainerRow>
              <div className="border-t-1 border-neutral-400 w-[150px]" />
              <div>
                <p className="text-neutral-500">or</p>
              </div>
              <div className="border-t-1 border-neutral-400 w-[150px]" />
            </ContainerRow>
            <CustomButton
              type="button"
              onClick={handleGoogleSignIn}
              title="Continue with Google"
              disabled={loading}
            />
          </form>
        </>
      )}

      {magicLinkState.error && (
        <ContainerColumn>
          <Text text={magicLinkState.error} />
        </ContainerColumn>
      )}

      <div className="my-3">
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
    </ContainerColumn>
  );
};

export default Auth;
