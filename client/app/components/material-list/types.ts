export interface MaterialItemProps {
  id: number;
  title: string;
  type: string;
  tag: string;
  status: string;
}

export interface CarouselProps {
  materials: MaterialItemProps[];
}
