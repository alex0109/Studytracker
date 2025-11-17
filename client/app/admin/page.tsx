import { FC } from "react";
import BlockColumn from "@/shared/components/block-column";
import ContainerColumn from "@/shared/components/container-column";
import Title from "@/shared/components/title";
import Text from "@/shared/components/text";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { LuSquarePen } from "react-icons/lu";
import { Separator } from "@/shared/components/ui/separator";

const AdminPanel: FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full py-10">
      <BlockColumn>
        <Title text="Admin Panel" />
        <Separator />
        <ContainerColumn blockStyles="justify-center">
          <Link target="_blank" href="https://reybey-org.sentry.io/issues/">
            <Button>
              Check logs (Sentry) <LuSquarePen />
            </Button>
          </Link>
        </ContainerColumn>
        <Separator />
      </BlockColumn>
    </div>
  );
};

export default AdminPanel;
