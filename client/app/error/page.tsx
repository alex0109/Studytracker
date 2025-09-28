import ContainerColumn from "@/shared/components/container-column";
import Title from "@/shared/components/title";
import { FC } from "react";

const ErrorPage: FC = () => {
  return (
    <ContainerColumn blockStyles="h-[60vh]">
      <Title text="Oops, something went wrong :(" />
    </ContainerColumn>
  );
};

export default ErrorPage;
