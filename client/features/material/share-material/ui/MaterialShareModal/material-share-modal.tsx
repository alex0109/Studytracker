"use client";

import { FC, useState } from "react";
import { useTranslation } from "@/shared/i18n";
import { LuCheck, LuCopy, LuLink, LuShare2 } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";
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
  const { t } = useTranslation();
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
      toast({ title: `❌${t("toasts.copyFailed")}`, variant: "error" });
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <LuShare2 aria-hidden /> {t("share.button")}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-4 md:w-[480px] w-[300px]">
          <Title text={t("share.title")} />
          <p className="text-sm text-neutral-500 text-center">{t("share.text")}</p>

          {materialShareIsPending ? (
            <Skeleton className="w-full h-12" />
          ) : materialShareData ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-neutral-100 dark:bg-neutral-700 p-2 pl-4">
                <LuLink className="shrink-0 text-neutral-500" />
                <input
                  readOnly
                  value={shareUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  aria-label={t("share.linkLabel")}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
                <Button size="sm" onClick={onCopy}>
                  {/* The icon turns into a check, so the copy is felt and not only read */}
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={isCopied ? "copied" : "copy"}
                      className="inline-flex"
                      initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 24 }}
                    >
                      {isCopied ? <LuCheck /> : <LuCopy />}
                    </motion.span>
                  </AnimatePresence>
                  {isCopied ? t("share.copied") : t("share.copy")}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">
                  {t("share.imports", { count: materialShareData.importsCount })}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  disabled={revokeShareIsPending}
                  onClick={() => revokeShare()}
                >
                  {t("share.stop")}
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
                <LuLink /> {t("share.create")}
              </Button>
              <IsPendingLoader isPending={createShareIsPending} />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
