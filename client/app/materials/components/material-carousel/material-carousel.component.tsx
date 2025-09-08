import React, { FC } from "react";

import { CarouselProps } from "./types";
import EmptyMaterialItem from "./empty-material-list.component";
import MaterialItem from "./material-carousel-item.component";
import Link from "next/link";
import { routes } from "@/shared/lib/data";

const Carousel: FC<CarouselProps> = ({ materials }) => {
  if (materials == undefined || materials.length === 0) {
    materials = [];
    return (
      <div className="w-full rounded-4xl">
        <EmptyMaterialItem />
      </div>
    );
  }
  return (
    <div className="w-full overflow-x-scroll scroll-smooth whitespace-nowrap rounded-4xl">
      {materials.map((item) => (
        <Link key={item.id} href={`${routes.materials}/${item.id}`}>
          <MaterialItem
            title={item.title}
            type={item.type}
            tag={item.tag}
            status={item.status}
            link={item.link}
            id={item.id}
          />
        </Link>
      ))}
    </div>
  );
};

export default Carousel;
