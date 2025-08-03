export interface MaterialType {
  id: number;
  title: string;
  type: string;
  tag: string;
  link: string;
  status: "tolearn" | "inprocess" | "finished";
}

export interface CarouselProps {
  materials: MaterialType[];
}
