import React, { FC } from "react";
import { TailSpin } from "react-loader-spinner";

interface IsPendingLoaderProps {
  isPending: boolean;
}

export const IsPendingLoader: FC<IsPendingLoaderProps> = ({ isPending }) => {
  return (
    <TailSpin
      visible={isPending}
      height="35"
      width="35"
      color="black"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};
