import moment from "moment";
import React, { FC } from "react";
import Text from "@/shared/components/text";

interface MaterialDateType {
  createdAt: Date;
}

const MaterialDate: FC<MaterialDateType> = ({ createdAt }) => {
  if (!createdAt) {
    return null;
  }

  return (
    <div>
      <Text
        textStyles="text-neutral-400"
        text={moment(createdAt).format("DD MMMM yy")}
      />
    </div>
  );
};

export default MaterialDate;
