import { FC } from "react";
import { Introduction, Advantages, Bulletpoints } from "./(client)/(home)";
import { LastOpened } from "@/entities/material/ui";
import { Navigation } from "@/widgets/Navigation";

const Page: FC = () => {
  return (
    <>
      <Navigation />
      <main className=" flex flex-col items-center pt-30">
        <LastOpened />
        <Introduction />
        <Advantages />
        <Bulletpoints />
      </main>
    </>
  );
};

export default Page;
