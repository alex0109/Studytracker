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

export default function Auth({
  mode = "signin",
}: {
  mode?: "signin" | "signup";
}) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const discountCode = searchParams.get("discountCode");

  return (
    <ContainerColumn blockStyles="h-[450px]">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <ContainerColumn>
          <Title
            text={mode === "signin" ? "Welcome back!" : "Create your account"}
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
      <form>
        <CustomInput placeholder="Email..." />
        <CustomButton title="Continue with email" />
        <ContainerRow>
          <div className="border-t-1 border-neutral-400 w-[150px]" />
          <div>
            <p className="text-neutral-500">or</p>
          </div>
          <div className="border-t-1 border-neutral-400 w-[150px]" />
        </ContainerRow>
        <CustomButton title="Continue with Google" />
      </form>
      <div className="my-3">
        <p className="text-xs">
          {mode === "signin"
            ? "New to our platform? "
            : "Already have an account? "}
          <Link
            href={`
              ${mode === "signin" ? "/sign-up" : "/sign-in"}
              ${redirect ? `?redirect=${redirect}` : ""}
              ${priceId ? `&priceId=${priceId}` : ""}
            `}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </div>
    </ContainerColumn>
  );
}
