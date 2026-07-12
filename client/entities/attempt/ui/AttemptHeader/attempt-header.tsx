"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/radix-ui";
import { Title, Subtitle } from "@/shared/ui";

interface AttemptHeaderProps {
  materialId: string;
  attemptId: string;
}

export const AttemptHeader: FC<AttemptHeaderProps> = ({
  materialId,
  attemptId,
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center w-full">
      <Button className="self-start" onClick={() => router.back()}>
        Go Back
      </Button>
      <Title text="Attempt" />
      <Subtitle text={`Material ID: ${materialId}`} />
      <Subtitle text={`Attempt ID: ${attemptId}`} />
    </div>
  );
};
