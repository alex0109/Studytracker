import { IsPendingLoader, Subtitle } from "@/shared/ui";

const LoadingQuestions = () => {
  return (
    <div className="flex w-full my-5 justify-center items-center gap-3">
      <Subtitle text="Loading questions..." textStyles="text-neutral-500" />
      <IsPendingLoader isPending={true} />
    </div>
  );
};

export default LoadingQuestions;
