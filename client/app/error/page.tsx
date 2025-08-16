import ContainerColumn from "@/shared/components/container-column";
import Title from "@/shared/components/title";

export default function ErrorPage() {
  return (
    <ContainerColumn blockStyles="h-[60vh]">
      <Title text="Oops, something went wrong :(" />
    </ContainerColumn>
  );
}
