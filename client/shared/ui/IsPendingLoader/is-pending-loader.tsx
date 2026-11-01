import React, { FC } from "react";
import { LuLoaderCircle } from "react-icons/lu";

interface IsPendingLoaderProps {
  isPending: boolean;
}

export const IsPendingLoader: FC<IsPendingLoaderProps> = ({ isPending }) => {
  return (
    isPending && (
      <div className="w-9 h-9 border-3 border-transparent border-t-neutral-900 rounded-full animate-spin dark:border-t-neutral-100" />
    )
  );
};

// Inside a button: the button keeps its place and size while its action runs
export const Spinner = () => <LuLoaderCircle aria-hidden className="animate-spin" />;
