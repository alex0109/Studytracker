"use client";

import { FC, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { LuLibrary } from "react-icons/lu";
import { CustomInput, IsPendingLoader, Modal, TextArea, Title } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { useMaterialAll } from "@/entities/material";
import { LibraryRequestTypeEnum } from "@/entities/library";
import { useProfile } from "@/entities/profile";
import { useLibraryRequestCreate } from "../hooks/useLibraryRequests";
import { isValidNickname, readSavedNickname, saveNickname } from "../lib/nickname";

interface SubmitToLibraryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  // Fixed when sent from a material's page; otherwise the user picks one
  materialId?: string;
  // Set when an already published library material gets a new version
  libraryItemId?: string;
  defaultNickname?: string;
}

interface SubmitForm {
  materialId: string;
  nickname: string;
  comment: string;
}

export const SubmitToLibraryModal: FC<SubmitToLibraryModalProps> = ({
  open,
  setOpen,
  materialId,
  libraryItemId,
  defaultNickname,
}) => {
  const { t } = useTranslation();
  const isUpdate = !!libraryItemId;
  const { materialsData } = useMaterialAll();
  const { profileData } = useProfile();
  const { createLibraryRequest, createLibraryRequestIsPending } = useLibraryRequestCreate();

  // Library copies go back only through their own library material
  const ownMaterials = materialsData?.filter((material) => !material.isFromLibrary) ?? [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SubmitForm>();

  // An article imported from a link is someone else's text: publishing needs the right to share it
  const watchedId = useWatch({ control, name: "materialId" });
  const chosenId = materialId ?? watchedId;
  const chosen = materialsData?.find((material) => material.id === chosenId);
  const fromTheWeb = !!chosen?.link && chosen.type === "article";

  useEffect(() => {
    if (open) {
      reset({
        materialId: materialId ?? "",
        // The profile keeps it across devices; this browser's copy is for profiles from before
        nickname: defaultNickname ?? profileData?.nickname ?? readSavedNickname(),
        comment: "",
      });
    }
  }, [open, materialId, defaultNickname, profileData?.nickname, reset]);

  const onSubmit = async (values: SubmitForm) => {
    const nickname = values.nickname.trim().replace(/\s+/g, " ");

    try {
      await createLibraryRequest({
        type: isUpdate ? LibraryRequestTypeEnum.Update : LibraryRequestTypeEnum.Publish,
        materialId: materialId ?? values.materialId,
        libraryItemId,
        authorNickname: nickname,
        comment: values.comment.trim() || undefined,
      });
      saveNickname(nickname);
      setOpen(false);
    } catch {
      // The hook already explains what went wrong
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-h-[85vh] w-[300px] flex-col gap-3 overflow-y-auto sm:w-[420px]"
      >
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <LuLibrary aria-hidden />
        </span>
        <Title text={isUpdate ? t("library.submit.updateTitle") : t("library.submit.title")} />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {isUpdate ? t("library.submit.updateText") : t("library.submit.text")}
        </p>

        {!materialId && (
          <label className="flex flex-col gap-1 text-sm font-medium">
            {t("library.submit.material")}
            <select
              className="rounded-2xl bg-neutral-100 p-2 font-normal dark:bg-neutral-700"
              {...register("materialId", { required: t("library.submit.chooseMaterial") })}
            >
              <option value="">{t("library.submit.chooseMaterial")}</option>
              {ownMaterials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.title}
                </option>
              ))}
            </select>
            {errors.materialId && <span className="text-red-400">{errors.materialId.message}</span>}
          </label>
        )}

        {fromTheWeb && (
          <p role="note" className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            {t("library.submit.copyrightWarning")}
          </p>
        )}

        <label className="flex flex-col text-sm font-medium">
          {t("library.submit.nickname")}
          <CustomInput
            placeholder={t("library.submit.nicknamePlaceholder")}
            maxLength={40}
            {...register("nickname", {
              validate: (value) => isValidNickname(value) || t("library.errors.nickname"),
            })}
            error={errors.nickname?.message}
          />
          <span className="-mt-1 text-xs font-normal text-neutral-500">{t("library.submit.nicknameHint")}</span>
        </label>

        <label className="flex flex-col text-sm font-medium">
          {t("library.submit.comment")}
          <TextArea
            inputBlockStyles="mt-2"
            inputStyles="h-[90px] px-4 py-2"
            placeholder={t("library.submit.commentPlaceholder")}
            maxLength={500}
            {...register("comment")}
          />
        </label>

        <div className="mt-2 flex items-center justify-center gap-3">
          <Button size="lg" type="submit" disabled={createLibraryRequestIsPending}>
            {t("library.submit.send")}
          </Button>
          <IsPendingLoader isPending={createLibraryRequestIsPending} />
        </div>
      </form>
    </Modal>
  );
};
