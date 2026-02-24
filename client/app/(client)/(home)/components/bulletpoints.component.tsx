import ContainerColumn from "@/shared/components/container-column";
import React from "react";
import Bullet from "./bullet.component";
import Title from "@/shared/components/title";
import ContainerRow from "@/shared/components/container-row";

const Bulletpoints = () => {
  return (
    <div className="flex justify-center items-center w-full h-full bg-neutral-100 dark:bg-neutral-800">
      <ContainerColumn blockStyles="flex w-[80%]">
        <h1>ST Advantages</h1>
        <ContainerRow blockStyles="justify-between">
          <div className="flex w-full h-full flex-1 justify-center items-center">
            <Bullet>
              <span className="font-bold text-4xl">1</span>
            </Bullet>
          </div>
          <div className="flex-2 p-5">
            <p className="text-lg">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum
              rerum consectetur minus itaque cumque ea. Nesciunt, necessitatibus
              odio aperiam cumque nulla dolore neque et cum aspernatur magni
              animi dolores obcaecati harum. Perspiciatis praesentium, eveniet
              repudiandae id officia voluptatem nobis molestias.
            </p>
          </div>
        </ContainerRow>
        <ContainerRow blockStyles="justify-between">
          <div className="flex-2 p-10">
            <p className="text-lg">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum
              rerum consectetur minus itaque cumque ea. Nesciunt, necessitatibus
              odio aperiam cumque nulla dolore neque et cum aspernatur magni
              animi dolores obcaecati harum. Perspiciatis praesentium, eveniet
              repudiandae id officia voluptatem nobis molestias.
            </p>
          </div>
          <div className="flex w-full h-full flex-1 justify-center items-center">
            <Bullet>
              <span className="font-bold text-4xl">2</span>
            </Bullet>
          </div>
        </ContainerRow>
        <ContainerRow blockStyles="justify-between">
          <div className="flex w-full h-full flex-1 justify-center items-center">
            <Bullet>
              <span className="font-bold text-4xl">3</span>
            </Bullet>
          </div>
          <div className="flex-2 p-10">
            <p className="text-lg">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum
              rerum consectetur minus itaque cumque ea. Nesciunt, necessitatibus
              odio aperiam cumque nulla dolore neque et cum aspernatur magni
              animi dolores obcaecati harum. Perspiciatis praesentium, eveniet
              repudiandae id officia voluptatem nobis molestias.
            </p>
          </div>
        </ContainerRow>
        <ContainerRow blockStyles="justify-between">
          <div className="flex-2 px-10">
            <p className="text-lg">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum
              rerum consectetur minus itaque cumque ea. Nesciunt, necessitatibus
              odio aperiam cumque nulla dolore neque et cum aspernatur magni
              animi dolores obcaecati harum. Perspiciatis praesentium, eveniet
              repudiandae id officia voluptatem nobis molestias.
            </p>
          </div>
          <div className="flex w-full h-full flex-1 justify-center items-center">
            <Bullet>
              <span className="font-bold text-4xl">4</span>
            </Bullet>
          </div>
        </ContainerRow>
      </ContainerColumn>
    </div>
  );
};

export default Bulletpoints;
