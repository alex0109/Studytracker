import { FC } from "react";
import { useRouter } from "next/navigation";
import { IAttempt, useAttemptResults } from "@/entities/attempt";
import { BlockColumn, Subtitle, Title } from "@/shared/ui";
import moment from "moment";
import { Button } from "@/shared/radix-ui";

interface AttemptsContentProps {
  materialId: string;
  attempts: IAttempt[] | undefined;
}

export const AttemptsContent: FC<AttemptsContentProps> = ({
  materialId,
  attempts,
}) => {
  const router = useRouter();

  if (!attempts || attempts.length == 0) {
    return (
      <BlockColumn>
        <p className="text-neutral-500 text-lg">
          No attempts on this material yet...
        </p>
      </BlockColumn>
    );
  }

  const getAttemptResults = (attemptId: string) => {
    router.push(`/materials/${materialId}/attempt/${attemptId}/results`);
  };

  return (
    <>
      {attempts?.map((item) => (
        <BlockColumn key={item.id}>
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col w-full flex-1 justify-start">
              <div className="flex w-full justify-start">
                <Title text={`Attempt - ${item.id.split("-")[0]}`} />
              </div>
              <div>
                <p>
                  Finished: {moment(item.finishedAt).format("DD MMMM yy")} (
                  {moment(item.finishedAt).format("HH:mm:ss")})
                </p>
              </div>
            </div>
            <div className="flex flex-1 w-full justify-center items-center gap-5">
              <div>
                <Subtitle text={`SCORE: ${item.score}`} />
              </div>
              <div>
                <Button onClick={() => getAttemptResults(item.id)}>
                  See Results
                </Button>
              </div>
            </div>
          </div>
        </BlockColumn>
      ))}
    </>
  );
};
