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
    <div>
      <p className="text-neutral-500">
        {moment(createdAt).format("DD MMMM yy")}
      </p>
    </div>
  );
};
