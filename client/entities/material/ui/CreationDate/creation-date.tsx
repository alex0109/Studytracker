import { FC } from "react";
import moment from "moment";

interface MaterialDateType {
  createdAt: Date;
}

export const MaterialDate: FC<MaterialDateType> = ({ createdAt }) => {
  if (!createdAt) {
    return null;
  }

  return (
    <time
      dateTime={moment(createdAt).format("YYYY-MM-DD")}
      className="text-sm text-neutral-500 dark:text-neutral-400"
    >
      {moment(createdAt).format("DD MMMM yy")}
    </time>
  );
};
