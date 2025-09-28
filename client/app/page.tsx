import { FC } from "react";
import Intro from "./(components)/intro.component";
import MaterialCarousel from "./materials/components/material-carousel/material-carousel-list.component";

const Home: FC = () => {
  return (
    <main className="flex flex-col items-center">
      <Intro />
      <MaterialCarousel />
    </main>
  );
};

export default Home;
