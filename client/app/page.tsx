import Intro from "./(components)/intro.component";
import MaterialCarousel from "./materials/components/material-carousel/material-carousel-list.component";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Intro />
      <MaterialCarousel />
    </main>
  );
}
