import React, { FC } from "react";
import MaterialItem from "./material-item.component";
import { CarouselProps } from "../types";

const Carousel: FC<CarouselProps> = ({ materials }) => {
  return (
    <div className="w-full overflow-x-scroll scroll-smooth whitespace-nowrap rounded-4xl">
      {materials.map((item) => (
        <MaterialItem
          key={item.id}
          title={item.title}
          type={item.type}
          tag={item.tag}
          status={item.status}
          id={item.id}
        />
      ))}
    </div>
  );
};

export default Carousel;
