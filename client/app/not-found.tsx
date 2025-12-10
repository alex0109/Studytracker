import { FC } from "react";
import Title from "@/shared/components/title";

const NotFound: FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-[90vh] py-10">
      <div>
        <Title text="404 | NOT FOUND" />
      </div>
    </div>
  );
};

export default NotFound;
