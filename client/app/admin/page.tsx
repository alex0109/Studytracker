import { FC } from "react";
import BlockColumn from "@/shared/components/block-column";
import Title from "@/shared/components/title";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import {
  LuChartSpline,
  LuSquareArrowOutUpRight,
  LuUsers,
  LuActivity,
} from "react-icons/lu";
import { Separator } from "@/shared/components/ui/separator";
import ContainerRow from "@/shared/components/container-row";

const AdminPanel: FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full py-10">
      <BlockColumn>
        <Title text="Admin Panel" />
        <Separator />
        <ContainerRow blockStyles="flex justify-center">
          <Link target="_blank" href="https://reybey-org.sentry.io/issues/">
            <Button className="w-[400px] h-[200px] text-2xl">
              Check logs (Sentry) <LuSquareArrowOutUpRight />
            </Button>
          </Link>
          <Link href="/admin/materials">
            <Button className="w-[400px] h-[200px] text-2xl">
              Check Materials <LuChartSpline />
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button className="w-[400px] h-[200px] text-2xl">
              Check Users <LuUsers />
            </Button>
          </Link>
          <Link href="/admin/traffic">
            <Button className="w-[400px] h-[200px] text-2xl">
              Check Traffic <LuActivity />
            </Button>
          </Link>
        </ContainerRow>
        <Separator />
      </BlockColumn>
    </div>
  );
};

export default AdminPanel;
