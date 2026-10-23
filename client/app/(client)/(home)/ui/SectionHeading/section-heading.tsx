import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  text?: ReactNode;
  align?: "center" | "left";
}

// Sizes use "!" because global h2 styles are unlayered and win over utilities
export const SectionHeading: FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  text,
  align = "center",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 max-w-2xl",
        align === "center" ? "items-center text-center mx-auto" : "items-start",
      )}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-wider text-neutral-500 shadow-sm backdrop-blur">
        {eyebrow}
      </span>
      <h2 className="text-3xl! md:text-5xl! font-semibold! tracking-tight text-neutral-900 text-balance">
        {title}
      </h2>
      {text && (
        <p className="text-base md:text-lg text-neutral-600 text-pretty">
          {text}
        </p>
      )}
    </div>
  );
};
