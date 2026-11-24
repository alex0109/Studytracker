"use client";

import { FC, FormEvent } from "react";
import { LuDices, LuPlay } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { Modal, NumberChoice, Spinner } from "@/shared/ui";
import { CUSTOM, isWholeInRange, useNumberSetting } from "@/shared/hooks";
import { useTranslation } from "@/shared/i18n";
import { MAX_SESSION_SIZE } from "../../consts";

// The same quick choices as the number of questions of an attempt
const COUNT_PRESETS = [10, 20, 30];
const MIN_COUNT = 1;

interface RandomCardsModalProps {
  open: boolean;
  onClose: () => void;
  // Cards in the dictionary that can be practised
  total: number;
  isPending: boolean;
  onStart: (count: number) => void;
}

export const RandomCardsModal: FC<RandomCardsModalProps> = ({ open, onClose, total, isPending, onStart }) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} size="md" icon={<LuDices />} title={t("flashcards.random.title")} description={t("flashcards.random.text")}>
      {/* Built again on every opening, so it starts from the default choice */}
      {open && <RandomCardsForm total={total} isPending={isPending} onCancel={onClose} onStart={onStart} />}
    </Modal>
  );
};

const RandomCardsForm: FC<Omit<RandomCardsModalProps, "open" | "onClose"> & { onCancel: () => void }> = ({
  total,
  isPending,
  onCancel,
  onStart,
}) => {
  const { t } = useTranslation();
  // A session holds at most this many cards, however big the dictionary is
  const available = Math.min(total, MAX_SESSION_SIZE);
  const count = useNumberSetting(available > COUNT_PRESETS[0] ? COUNT_PRESETS[0] : null, COUNT_PRESETS);

  const valid = isWholeInRange(count.value, MIN_COUNT, available);
  const cards = valid ? Math.min(count.value ?? available, available) : undefined;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (cards !== undefined) onStart(cards);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <NumberChoice
        label={t("flashcards.random.count")}
        noneLabel={t("flashcards.random.all", { count: available })}
        presets={COUNT_PRESETS}
        choice={count.choice}
        onChoice={(choice) => {
          count.setChoice(choice);
          if (choice === CUSTOM && !count.customText) count.setCustomText(String(available));
        }}
        customText={count.customText}
        onCustomText={count.setCustomText}
        min={MIN_COUNT}
        max={available}
        unit={t("flashcards.random.ofTotal", { count: available })}
        available={available}
        error={valid ? undefined : t("flashcards.random.range", { min: MIN_COUNT, max: available })}
      />

      {/* Like the dialog's own footer: side by side from 400px, the main button last */}
      <div className="flex flex-col-reverse gap-2 min-[400px]:flex-row min-[400px]:gap-3 min-[400px]:*:flex-1">
        <Button type="button" size="lg" variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" size="lg" disabled={isPending || cards === undefined} className="bg-emerald-600 text-white hover:bg-emerald-700">
          {isPending ? <Spinner /> : <LuPlay aria-hidden />}
          {cards === undefined ? t("flashcards.random.start") : t("flashcards.random.startWith", { count: cards })}
        </Button>
      </div>
    </form>
  );
};
