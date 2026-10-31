import { Skeleton } from "@/shared/radix-ui";

export const LoadingDictionary = () => {
  return (
    <div className="flex flex-col w-full p-5 gap-3">
      <div className="flex w-full justify-end">
        <Skeleton className="w-[100px] h-10" />
      </div>
      <div className="flex flex-col w-full gap-3 justify-center items-center">
        <Skeleton className="w-[200px] h-10" />
        <Skeleton className="w-[300px] h-6" />
      </div>
      <div className="flex w-full gap-4 justify-center items-center my-5">
        <Skeleton className="w-[150px] h-10" />
        <Skeleton className="w-[150px] h-10" />
      </div>
      <div className="flex flex-col w-full gap-3 px-5">
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
      </div>
    </div>
  );
};
