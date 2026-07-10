import { FC } from "react";
import { Introduction, Advantages, Bulletpoints } from "./(client)/(home)";
import { Navigation } from "@/shared/ui/Navigation";
import { LastOpened } from "@/entities/material/ui";

const Home: FC = () => {
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

export default Home;
