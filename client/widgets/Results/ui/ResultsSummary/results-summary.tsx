import { FC } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/shared/radix-ui";
import { IAttempt } from "@/entities/attempt";
import moment from "moment";

interface ResultsSummaryProps {
  attempt: IAttempt;
  questionsLength: number;
}

export const ResultsSummary: FC<ResultsSummaryProps> = ({
  attempt,
  questionsLength,
}) => {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="text-xl font-medium">Score</TableCell>

          <TableCell className="text-xl font-bold">{attempt.score}%</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="text-xl font-medium">Questions</TableCell>

          <TableCell className="text-xl">{questionsLength}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="text-xl font-medium">Correct answers</TableCell>

          <TableCell className="text-xl">{attempt.correctAnswers}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="text-xl font-medium">Wrong answers</TableCell>

          <TableCell className="text-xl">{attempt.wrongAnswers}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="text-xl font-medium">Started at</TableCell>

          <TableCell className="text-xl">
            {moment(attempt.startedAt).format("DD.MM.YY | HH:mm:ss")}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="text-xl font-medium">Finished at</TableCell>

          <TableCell className="text-xl">
            {moment(attempt.finishedAt).format("DD.MM.YY | HH:mm:ss")}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
