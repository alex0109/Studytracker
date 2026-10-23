"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LuBookA,
  LuCircleHelp,
  LuDownload,
  LuLink2Off,
  LuNotebookPen,
} from "react-icons/lu";
import { useSharedMaterialPreview } from "@/entities/share";
import { useMaterialImport } from "@/features/material/import-material";
import { useSession } from "@/shared/context/session.provider";
import { routes } from "@/shared/config/routes";
import { Button, Skeleton } from "@/shared/radix-ui";
import { BlockColumn, IsPendingLoader, Subtitle, Title } from "@/shared/ui";

interface SharedMaterialProps {
  shareToken: string;
}

export const SharedMaterial: FC<SharedMaterialProps> = ({ shareToken }) => {
  const router = useRouter();
  const { user } = useSession();
  const { previewData, previewIsPending, previewError } =
    useSharedMaterialPreview(shareToken);
  const { importMaterial, importMaterialIsPending } =
    useMaterialImport(shareToken);

  const onImport = () => {
    importMaterial(undefined, {
      onSuccess: () => router.push(routes.materials),
    });
  };

  if (previewIsPending) {
    return (
      <BlockColumn>
        <div className="flex flex-col w-full items-center gap-4 p-5">
          <Skeleton className="w-[260px] h-10" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-[200px] h-12" />
        </div>
      </BlockColumn>
    );
  }

  if (previewError) {
    return (
      <BlockColumn>
        <div className="flex flex-col items-center gap-3 p-5 text-center">
          <Title text="Could not open this link" />
          <Subtitle
            text="Something went wrong on our side, please try again a bit later."
            textStyles="text-neutral-500"
          />
        </div>
      </BlockColumn>
    );
  }

  // Unknown token or the owner stopped sharing
  if (!previewData) {
    return (
      <BlockColumn>
        <div className="flex flex-col items-center gap-3 p-5 text-center">
          <LuLink2Off className="size-10 text-neutral-400" />
          <Title text="This link is not active" />
          <Subtitle
            text="The owner stopped sharing this material or deleted it."
            textStyles="text-neutral-500"
          />
          <Link href={routes.home}>
            <Button size="lg" variant="outline">
              Go home
            </Button>
          </Link>
        </div>
      </BlockColumn>
    );
  }

  const stats = [
    { icon: LuNotebookPen, label: "notes", value: previewData.notesCount },
    {
      icon: LuCircleHelp,
      label: "questions",
      value: previewData.questionsCount,
    },
    {
      icon: LuBookA,
      label: "dictionaries",
      value: previewData.dictionariesCount,
    },
    { icon: LuBookA, label: "words", value: previewData.wordsCount },
  ];

  return (
    <BlockColumn>
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col w-full items-center justify-center gap-6 p-5"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-sm text-neutral-500">
            Someone shared a material with you
          </span>
          <Title text={previewData.title} blockStyles="my-1" />
          <span className="rounded-xl bg-neutral-200 px-3 py-1 text-xs text-neutral-700">
            {previewData.type}
          </span>
        </div>

        <div className="grid w-full max-w-[520px] grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 rounded-2xl border-3 border-white bg-gray-50 p-4"
            >
              <stat.icon className="text-neutral-500" />
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-xs text-neutral-500">{stat.label}</span>
            </div>
          ))}
        </div>

        <p className="max-w-[520px] text-center text-sm text-neutral-500">
          You get your own copy to edit and learn from. Tags, attempts and the
          owner&apos;s progress are not copied.
        </p>

        {!user ? (
          <Link
            href={`${routes.auth}?redirect=${encodeURIComponent(`/share/${shareToken}`)}`}
          >
            <Button size="lg">Sign in to get this material</Button>
          </Link>
        ) : previewData.isOwner ? (
          <div className="flex flex-col items-center gap-3">
            <Subtitle
              text="This is your material."
              textStyles="text-neutral-500"
            />
            <Link href={routes.materials}>
              <Button size="lg" variant="outline">
                Open my materials
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {previewData.isAlreadyImported && (
              <span className="text-sm text-amber-600">
                You already have a copy. Importing again creates another one.
              </span>
            )}
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={importMaterialIsPending}
                onClick={onImport}
              >
                <LuDownload /> Import to my materials
              </Button>
              <IsPendingLoader isPending={importMaterialIsPending} />
            </div>
          </div>
        )}
      </motion.div>
    </BlockColumn>
  );
};
