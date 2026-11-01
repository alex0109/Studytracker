import { cn } from "@/shared/lib";

// Soft colour washes behind every page. Radial gradients, not blur(10rem) filters: a blur that big
// over half the screen took phone GPUs seconds to paint, and the page showed only these meanwhile
const blob =
  "absolute rounded-full scale-150 opacity-80 bg-[radial-gradient(closest-side,var(--blob),transparent)]";

// The wrapper clips the scaled washes to the page: unlike a blur, a transform counts as overflow,
// and phones widened the whole page to fit it
export const BackgroundBlobs = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div
      className={cn(
        blob,
        "top-[-6rem] right-0 h-[31.25rem] w-[31rem] sm:w-[68rem]",
        "[--blob:#cde7ff] dark:[--blob:rgb(38_38_38/0.6)]",
      )}
    />
    <div
      className={cn(
        blob,
        "top-[-1rem] left-[-35rem] h-[31.25rem] w-[50rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]",
        "[--blob:#c6c4ff] dark:[--blob:rgb(64_64_64/0.4)]",
      )}
    />
    <div
      className={cn(
        blob,
        "top-[30rem] right-0 h-[31.25rem] w-[31.25rem] sm:w-[68.75rem]",
        "[--blob:#ffd0cd] dark:[--blob:rgb(38_38_38/0.6)]",
      )}
    />
  </div>
);
