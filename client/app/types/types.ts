import { RichTextDocument } from "../(client)/materials/services/type";

export interface MaterialType {
  id: number;
  title: string;
  type?: "article" | "video" | "summary" | "practice" | "test";
  tags?: string[];
  link?: string;
  description?: RichTextDocument | undefined;
  status?: "tolearn" | "inprocess" | "finished";
  created_at: Date;
}

export interface CarouselProps {
  materials: MaterialType[];
  materialsLoading: boolean;
}

export interface ServerStatsDataType {
  count: number;
  types: {
    summary?: number;
    video?: number;
    article?: number;
    practice?: number;
    test?: number;
  };
  statuses: { tolearn?: number; inprocess?: number; finished?: number };
}
