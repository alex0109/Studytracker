"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { IconType } from "react-icons";
import { LuArrowLeft, LuBookA, LuPlus } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { Field, FieldInput, Modal, Spinner } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { NoteTypeEnum } from "@/entities/note";
import { IDictionaryResponse } from "@/entities/dictionary";
import { useNoteCreate } from "@/features/note/create-note";
import { useDictionaryCreate } from "@/features/dictionary/create-dictionary";
import { NOTE_TYPE_ICONS } from "../../lib/sidebar-icons";

type Kind = "text" | "drawing" | "essay" | "dictionary" | "summary";

const KINDS: { kind: Kind; icon: IconType; tone: string }[] = [
  { kind: "text", icon: NOTE_TYPE_ICONS[NoteTypeEnum.text]!, tone: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  { kind: "drawing", icon: NOTE_TYPE_ICONS[NoteTypeEnum.drawing]!, tone: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
  { kind: "essay", icon: NOTE_TYPE_ICONS[NoteTypeEnum.essay]!, tone: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
  { kind: "dictionary", icon: LuBookA, tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  { kind: "summary", icon: NOTE_TYPE_ICONS[NoteTypeEnum.summary]!, tone: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
];

interface CreateInMaterialProps {
  materialId: string;
  // A material has at most one summary
  hasSummary: boolean;
  onCreatedNote: (noteId: string) => void;
  onCreatedDictionary: (dictionary: IDictionaryResponse) => void;
}

// One button under the material for everything it can hold: first what to make, as big tiles, then its name
export const CreateInMaterial: FC<CreateInMaterialProps> = ({ materialId, hasSummary, onCreatedNote, onCreatedDictionary }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind | null>(null);
  const { createNote, createNoteIsPending } = useNoteCreate(materialId);
  const { createDictionary, createDictionaryIsPending } = useDictionaryCreate(materialId);
  const isPending = createNoteIsPending || createDictionaryIsPending;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setFocus,
  } = useForm<{ title: string }>({ defaultValues: { title: "" } });

  const close = () => {
    setOpen(false);
    setKind(null);
    reset();
  };

  const pick = (next: Kind) => {
    setKind(next);
    requestAnimationFrame(() => setFocus("title"));
  };

  const onSubmit = ({ title }: { title: string }) => {
    if (!kind) return;
    const name = title.trim();

    // Open with a spinner until it is saved, so the click shows and can't repeat; then the new one opens
    if (kind === "dictionary") {
      createDictionary({ title: name }, {
        onSuccess: (dictionary) => {
          close();
          onCreatedDictionary(dictionary);
        },
      });
      return;
    }

    createNote({ title: name, type: NoteTypeEnum[kind] }, {
      onSuccess: (note) => {
        close();
        onCreatedNote(note.id);
      },
    });
  };

  const chosen = KINDS.find((item) => item.kind === kind);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full justify-start gap-2 border-dashed bg-white/60 text-neutral-700 hover:bg-white dark:bg-neutral-900/60 dark:text-neutral-200 dark:hover:bg-neutral-900"
      >
        <LuPlus aria-hidden /> {t("materials.create.button")}
      </Button>

      <Modal
        open={open}
        onClose={close}
        size="lg"
        icon={chosen ? <chosen.icon /> : <LuPlus />}
        title={kind ? t(`materials.create.kinds.${kind}.title`) : t("materials.create.title")}
        description={kind ? t("materials.create.nameText") : t("materials.create.text")}
        footer={
          kind ? (
            <>
              <Button size="lg" variant="outline" onClick={() => setKind(null)} disabled={isPending}>
                <LuArrowLeft aria-hidden /> {t("materials.create.back")}
              </Button>
              <Button size="lg" type="submit" form="create-in-material" disabled={isPending}>
                {isPending && <Spinner />}
                {t("common.create")}
              </Button>
            </>
          ) : undefined
        }
      >
        {kind ? (
          <form id="create-in-material" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Field label={t("materials.titleLabel")} required error={errors.title?.message}>
              <FieldInput
                placeholder={t(`materials.create.kinds.${kind}.placeholder`)}
                maxLength={70}
                aria-invalid={!!errors.title}
                {...register("title", {
                  required: t("common.required"),
                  validate: (value) => value.trim().length > 0 || t("common.required"),
                })}
              />
            </Field>
          </form>
        ) : (
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {KINDS.map(({ kind: item, icon: Icon, tone }) => {
              const taken = item === "summary" && hasSummary;

              return (
                <li key={item} className={cn(item === "summary" && "col-span-2 sm:col-span-1")}>
                  <button
                    type="button"
                    disabled={taken}
                    onClick={() => pick(item)}
                    className="flex h-full w-full flex-col items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-neutral-400 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                  >
                    <span className={cn("flex size-12 items-center justify-center rounded-xl text-2xl", tone)}>
                      <Icon aria-hidden />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                        {t(`materials.create.kinds.${item}.title`)}
                      </span>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {taken ? t("materials.create.summaryTaken") : t(`materials.create.kinds.${item}.text`)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Modal>
    </>
  );
};
