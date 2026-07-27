import { FC } from "react";
import { ContainerColumn, Title } from "@/shared/ui";

const ErrorPage: FC = () => {
  return (
    <ContainerColumn blockStyles="h-[60vh]">
      <Title text="Oops, something went wrong :(" />
    </ContainerColumn>
  );
};

export default ErrorPage;
