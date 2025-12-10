import { FC } from "react";
import Intro from "./(components)/intro.component";
import MaterialCarousel from "./(client)/materials/components/material-carousel/material-carousel-list.component";
import Navigation from "@/shared/components/navigation";

const Home: FC = () => {
  return (
    <>
      <Navigation />
      <main className="flex flex-col items-center pt-30">
        <Intro />
        <MaterialCarousel />
      </main>
    </>
  );
};

export default Home;
