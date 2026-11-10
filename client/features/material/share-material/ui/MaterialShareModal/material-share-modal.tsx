"use client";

import { FC, useState } from "react";
import { useTranslation } from "@/shared/i18n";
import { LuCheck, LuCopy, LuLink, LuShare2 } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Skeleton, toast } from "@/shared/radix-ui";
import { Modal, Spinner } from "@/shared/ui";
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
      {/* Only the icon on a phone, so the title row keeps its room */}
      <Button variant="outline" onClick={() => setOpen(true)} aria-label={t("share.button")} title={t("share.button")}>
        <LuShare2 aria-hidden /> <span className="hidden sm:inline">{t("share.button")}</span>
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="md"
        icon={<LuShare2 />}
        title={t("share.title")}
        description={t("share.text")}
        footer={
          // Without a link yet the only step is to make one; with it, to stop sharing or close
          !materialShareIsPending &&
          (materialShareData ? (
            <>
              <Button
                size="lg"
                variant="outline"
                className="text-red-600 hover:text-red-700 dark:text-red-400"
                disabled={revokeShareIsPending}
                onClick={() => revokeShare()}
              >
                {revokeShareIsPending && <Spinner />}
                {t("share.stop")}
              </Button>
              <Button size="lg" onClick={() => setOpen(false)}>
                {t("common.close")}
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" variant="outline" onClick={() => setOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button size="lg" disabled={createShareIsPending} onClick={() => createShare()}>
                {createShareIsPending ? <Spinner /> : <LuLink />}
                {t("share.create")}
              </Button>
            </>
          ))
        }
      >
        {materialShareIsPending ? (
          <Skeleton className="h-12 w-full rounded-2xl" />
        ) : (
          materialShareData && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-1.5 pl-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <LuLink aria-hidden className="shrink-0 text-neutral-400" />
                <input
                  readOnly
                  value={shareUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  aria-label={t("share.linkLabel")}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
                <Button onClick={onCopy}>
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
              <p className="text-center text-xs text-neutral-500">
                {t("share.imports", { count: materialShareData.importsCount })}
              </p>
            </div>
          )
        )}
      </Modal>
    </>
  );
};
