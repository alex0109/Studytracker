import { FC } from "react";
import Intro from "./(client)/(home)/intro.component";
import { Navigation } from "@/shared/ui/Navigation";
import LastOpened from "./(client)/(home)/components/last-opened.component";

import Advantages from "./(client)/(home)/components/advantages.component";
import Bulletpoints from "./(client)/(home)/components/bulletpoints.component";

const Home: FC = () => {
  return (
    <>
      <Navigation />
      <main className=" flex flex-col items-center pt-30">
        <LastOpened />
        <Intro />
        <Advantages />
        <Bulletpoints />
      </main>
    </>
  );
};

export default Home;
