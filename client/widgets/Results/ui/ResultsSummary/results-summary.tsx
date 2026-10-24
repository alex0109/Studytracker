import { FC, ReactNode } from "react";
import moment from "moment";
import { LuCircleCheck, LuCircleX, LuClock, LuTarget } from "react-icons/lu";
import { IAttempt } from "@/entities/attempt";
import { cn } from "@/shared/lib";

interface ResultsSummaryProps {
  attempt: IAttempt;
  questionsLength: number;
}

const formatDuration = (totalSeconds: number) => {
  const seconds = Math.round(totalSeconds);
  const minutes = Math.floor(seconds / 60);

  return minutes > 0 ? `${minutes} min ${seconds % 60} s` : `${seconds} s`;
};

const StatCard: FC<{
  icon: ReactNode;
  label: string;
  value: ReactNode;
  className?: string;
}> = ({ icon, label, value, className }) => (
  <div
    className={cn(
      "flex flex-col gap-1 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900",
      className,
    )}
  >
    <span className="flex items-center gap-1.5 text-sm text-neutral-500">
      {icon}
      {label}
    </span>
    <span className="text-2xl font-bold tabular-nums">{value}</span>
  </div>
);

export const ResultsSummary: FC<ResultsSummaryProps> = ({
  attempt,
  questionsLength,
}) => {
  const score = Math.round(attempt.score);
  const scoreColor =
    score >= 80
      ? "text-emerald-600"
      : score >= 50
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          icon={<LuTarget />}
          label="Score"
          value={<span className={scoreColor}>{score}%</span>}
        />
        <StatCard
          icon={<LuCircleCheck className="text-emerald-600" />}
          label="Correct"
          value={
            <>
              {attempt.correctAnswers}
              <span className="text-base font-medium text-neutral-400">
                {" "}
                / {questionsLength}
              </span>
            </>
          }
        />
        <StatCard
          icon={<LuCircleX className="text-red-500" />}
          label="Wrong"
          value={attempt.wrongAnswers}
        />
        <StatCard
          icon={<LuClock />}
          label="Time"
          value={formatDuration(attempt.totalTimeSeconds)}
        />
      </div>
      <p className="text-center text-sm text-neutral-500">
        {moment(attempt.startedAt).format("D MMM YYYY, HH:mm")}
        {attempt.finishedAt &&
          ` – ${moment(attempt.finishedAt).format("HH:mm")}`}
      </p>
    </div>
  );
};
