"use client";

import { FC, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { LuLibrary } from "react-icons/lu";
import { Field, FieldInput, FieldSelect, FieldTextArea, Modal, Spinner } from "@/shared/ui";
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
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      size="md"
      icon={<LuLibrary />}
      tone="success"
      title={isUpdate ? t("library.submit.updateTitle") : t("library.submit.title")}
      description={isUpdate ? t("library.submit.updateText") : t("library.submit.text")}
      footer={
        <>
          <Button size="lg" variant="outline" onClick={() => setOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button size="lg" type="submit" form="submit-to-library" disabled={createLibraryRequestIsPending}>
            {createLibraryRequestIsPending && <Spinner />}
            {t("library.submit.send")}
          </Button>
        </>
      }
    >
      <form id="submit-to-library" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {!materialId && (
          <Field label={t("library.submit.material")} required error={errors.materialId?.message}>
            <FieldSelect
              aria-invalid={!!errors.materialId}
              {...register("materialId", { required: t("library.submit.chooseMaterial") })}
            >
              <option value="">{t("library.submit.chooseMaterial")}</option>
              {ownMaterials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.title}
                </option>
              ))}
            </FieldSelect>
          </Field>
        )}

        {fromTheWeb && (
          <p role="note" className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            {t("library.submit.copyrightWarning")}
          </p>
        )}

        <Field
          label={t("library.submit.nickname")}
          hint={t("library.submit.nicknameHint")}
          error={errors.nickname?.message}
        >
          <FieldInput
            placeholder={t("library.submit.nicknamePlaceholder")}
            maxLength={40}
            aria-invalid={!!errors.nickname}
            {...register("nickname", {
              validate: (value) => isValidNickname(value) || t("library.errors.nickname"),
            })}
          />
        </Field>

        <Field label={t("library.submit.comment")}>
          <FieldTextArea
            placeholder={t("library.submit.commentPlaceholder")}
            maxLength={500}
            rows={3}
            {...register("comment")}
          />
        </Field>
      </form>
    </Modal>
  );
};
