"use client";

import { FC, useState } from "react";
import { LuCheck, LuCopy, LuLink, LuShare2 } from "react-icons/lu";
import { Button, Skeleton, toast } from "@/shared/radix-ui";
import { IsPendingLoader, Modal, Title } from "@/shared/ui";
import { buildShareUrl, useMaterialShare } from "@/entities/share";
import { useMaterialShareCreate } from "../../hooks/useMaterialShareCreate";
import { useMaterialShareRevoke } from "../../hooks/useMaterialShareRevoke";

interface MaterialShareModalProps {
  materialId: string;
}

export const MaterialShareModal: FC<MaterialShareModalProps> = ({
  materialId,
}) => {
  const [open, setOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { materialShareData, materialShareIsPending } = useMaterialShare(
    materialId,
    open,
  );
  const { createShare, createShareIsPending } =
    useMaterialShareCreate(materialId);
  const { revokeShare, revokeShareIsPending } =
    useMaterialShareRevoke(materialId);

  const shareUrl = materialShareData
    ? buildShareUrl(materialShareData.token)
    : "";

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast({ title: "❌Could not copy, select the link instead", variant: "error" });
    }
  };

  return (
    <>
      <Button size="lg" variant="outline" onClick={() => setOpen(true)}>
        <LuShare2 /> Share
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-4 md:w-[480px] w-[300px]">
          <Title text="Share material" />
          <p className="text-sm text-neutral-500 text-center">
            Anyone with the link gets a full copy: notes, dictionaries and
            questions. Tags and attempts stay with you, and changes in their
            copy never touch yours.
          </p>

          {materialShareIsPending ? (
            <Skeleton className="w-full h-12" />
          ) : materialShareData ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-gray-100 dark:bg-neutral-700 p-2 pl-4">
                <LuLink className="shrink-0 text-neutral-500" />
                <input
                  readOnly
                  value={shareUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  aria-label="Share link"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
                <Button size="sm" onClick={onCopy}>
                  {isCopied ? <LuCheck /> : <LuCopy />}
                  {isCopied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">
                  Imported {materialShareData.importsCount}{" "}
                  {materialShareData.importsCount === 1 ? "time" : "times"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  disabled={revokeShareIsPending}
                  onClick={() => revokeShare()}
                >
                  Stop sharing
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-3">
              <Button
                size="lg"
                disabled={createShareIsPending}
                onClick={() => createShare()}
              >
                <LuLink /> Create link
              </Button>
              <IsPendingLoader isPending={createShareIsPending} />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
