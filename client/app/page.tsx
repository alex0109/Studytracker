import BlockRow from "@/shared/components/block-row";
import Intro from "./components/intro.component";
import CustomButton from "@/shared/components/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center pt-10">
      <Intro />
      <BlockRow blockStyles="justify-end">
        <div className="w-[200px]">
          <Link href="/materials">
            <CustomButton title="Go to Materials" />
          </Link>
        </div>
      </BlockRow>
    </main>
  );
}
