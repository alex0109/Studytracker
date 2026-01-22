"use client";

import { FC, useEffect, useState } from "react";
import Intro from "./(client)/(home)/intro.component";
import Navigation from "@/shared/components/navigation";
import LastOpened from "./(client)/(home)/components/last-opened.component";
import useLastOpened from "@/shared/hooks/use-last-opened.hook";
import useMaterials from "./(client)/materials/hooks/useMaterials.hook";
import { Material } from "./(client)/materials/services/type";
import Advantages from "./(client)/(home)/components/advantages.component";

const Home: FC = () => {
  const [lastOpenedMaterial, setLastOpenedMaterial] =
    useState<Partial<Material>>();

  const [lastOpenedMaterialID, setLastOpenedMaterialID] = useState<string>();

  const { lastOpened } = useLastOpened();

  const { exactMaterial, exactMaterialError } = useMaterials(lastOpened);

  useEffect(() => {
    if (lastOpened) {
      setLastOpenedMaterialID(lastOpened);
    }

    if (exactMaterial) {
      setLastOpenedMaterial(exactMaterial);
    }
  }, [exactMaterial, exactMaterialError, lastOpened]);

  return (
    <>
      <Navigation />
      <main className="flex flex-col items-center pt-30">
        {!lastOpenedMaterialID ||
        !lastOpenedMaterial ||
        exactMaterialError ? null : (
          <LastOpened
            id={lastOpenedMaterialID}
            title={lastOpenedMaterial.title!}
            status={lastOpenedMaterial.status}
          />
        )}
        <Intro />
        <Advantages />
      </main>
    </>
  );
};

export default Home;
