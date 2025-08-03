import BlockRow from "@/shared/components/block-row";
import Intro from "./components/intro.component";
import CustomButton from "@/shared/components/button";
import Link from "next/link";
import { routes } from "@/shared/lib/data";
import MaterialCarousel from "./materials/components/material-carousel/material-carousel-list.component";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Intro />
      <MaterialCarousel />
      <BlockRow blockStyles="justify-end">
        <div className="w-[200px]">
          <Link href={routes.materials}>
            <CustomButton title="Go to Materials" />
          </Link>
        </div>
      </BlockRow>
    </main>
  );
}
