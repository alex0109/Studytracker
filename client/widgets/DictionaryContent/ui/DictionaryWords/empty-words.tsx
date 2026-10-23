import { Subtitle } from "@/shared/ui";

export const EmptyWords = () => {
  return (
    <div className="flex w-full my-5 justify-center items-center">
      <Subtitle
        text="There are no words yet..."
        textStyles="text-neutral-500"
      />
    </div>
  );
};
