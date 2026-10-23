import { Subtitle } from "@/shared/ui";

export const EmptyFlashcards = () => {
  return (
    <div className="flex flex-col w-full my-5 justify-center items-center">
      <Subtitle
        text="There are no words to practice yet..."
        textStyles="text-neutral-500"
      />
      <p className="text-sm text-neutral-400">
        Add words in the Words tab or return archived ones
      </p>
    </div>
  );
};
