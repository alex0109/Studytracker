import { RichTextDocument } from "../../services/type";

export interface MaterialType {
  id: number;
  title: string;
  type: string;
  tag: string;
  link: string;
  description?: RichTextDocument | undefined;
  status: "tolearn" | "inprocess" | "finished";
}

export interface CarouselProps {
  materials: MaterialType[];
  materialsLoading: boolean;
}
