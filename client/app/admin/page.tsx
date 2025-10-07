import { FC } from "react";
import BlockColumn from "@/shared/components/block-column";
import ContainerColumn from "@/shared/components/container-column";
import Title from "@/shared/components/title";
import Text from "@/shared/components/text";
import { Button } from "@/shared/components/ui/button";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";

const AdminPanel: FC = () => {
  return (
    <div className="w-[100%]">
      <Title text="Admin Panel" />
      <ContainerColumn blockStyles="justify-center">
        <Text text="Admin" />
        <Button>Button shadcn</Button>
      </ContainerColumn>
    </div>
  );
};

export default AdminPanel;
