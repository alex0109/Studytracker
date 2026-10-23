import { FC } from "react";
import moment from "moment";
import { cn } from "@/shared/lib";
import { FlashcardStateEnum, IFlashcardProgress } from "../../model";

interface FlashcardProgressBadgeProps {
  progress?: IFlashcardProgress;
  className?: string;
}

const STATE_STYLES: Record<FlashcardStateEnum, string> = {
  [FlashcardStateEnum.New]: "bg-neutral-100 text-neutral-600",
  [FlashcardStateEnum.Learning]: "bg-amber-100 text-amber-700",
  [FlashcardStateEnum.Review]: "bg-emerald-100 text-emerald-700",
  [FlashcardStateEnum.Relearning]: "bg-red-100 text-red-600",
};

export const FlashcardProgressBadge: FC<FlashcardProgressBadgeProps> = ({
  progress,
  className,
}) => {
  const state = progress?.state ?? FlashcardStateEnum.New;
  const isNew = state === FlashcardStateEnum.New;
  const isDue = !!progress && new Date(progress.due).getTime() <= Date.now();

  return (
    <span
      title={
        progress
          ? `Next review: ${moment(progress.due).format("DD MMM YYYY, HH:mm")}`
          : "Not reviewed yet"
      }
      className={cn(
        "inline-flex items-center rounded-xl px-2 py-0.5 text-xs font-medium",
        STATE_STYLES[state],
        className,
      )}
    >
      {state.toLowerCase()}
      {!isNew &&
        progress &&
        (isDue ? " · due now" : ` · ${moment(progress.due).fromNow()}`)}
    </span>
  );
};
