import { FC } from "react";
import Title from "@/shared/components/title";

const ErrorPage: FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-[90vh] py-10">
      <div>
        <Title text="Ooops... Something went wrong :*" />
      </div>
    </div>
  );
};

export default ErrorPage;
