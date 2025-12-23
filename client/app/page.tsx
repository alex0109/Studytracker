import { FC } from "react";
import Intro from "./(components)/intro.component";
import MaterialCarousel from "./(client)/materials/components/material-carousel/material-carousel-list.component";
import Navigation from "@/shared/components/navigation";
import LastOpened from "./(components)/last-opened.component";

const Home: FC = () => {
  return (
    <>
      <Navigation />
      <main className="flex flex-col items-center pt-30">
        <LastOpened />
        <Intro />
        <MaterialCarousel />
      </main>
    </>
  );
};

export default Home;
