import React, { FC } from "react";

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
