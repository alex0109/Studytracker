import moment from "moment";
import React, { FC } from "react";
import Text from "@/shared/components/text";

interface MaterialDateType {
  created_at: Date;
}

const MaterialDate: FC<MaterialDateType> = ({ created_at }) => {
  return (
    <div>
      <Text
        textStyles="text-neutral-400"
        text={moment(created_at).format("DD MMMM yy")}
      />
    </div>
  );
};

export default MaterialDate;
