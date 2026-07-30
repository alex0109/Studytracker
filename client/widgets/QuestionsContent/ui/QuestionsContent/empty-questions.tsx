import { Subtitle } from "@/shared/ui";

export const EmptyQuestions = () => {
  return (
    <div className="flex w-full my-5 justify-center items-center">
      <Subtitle
        text="There is no questions yet..."
        textStyles="text-neutral-500"
      />
    </div>
  );
};
