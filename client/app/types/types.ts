export interface Node {
  type: string;
  text?: string;
  attrs?: Record<string, string | number>;
  content?: Node[];
}

export interface RichTextDocument {
  type: "doc";
  content: Node[];
}

export enum MaterialStatusEnum {
  tolearn = "tolearn",
  inprocess = "inprocess",
  finished = "finished",
}

export enum MaterialTypeEnum {
  article = "article",
  video = "video",
  summary = "summary",
  practice = "practice",
  test = "test",
}
export interface IMaterial {
  id: string;
  title: string;
  type?: MaterialTypeEnum;
  tags?: string[];
  link?: string;
  description?: RichTextDocument | undefined;
  status?: MaterialStatusEnum;
  created_at: Date;
  updated_at: Date;
}

export type TUpdateMaterial = Partial<IMaterial> & {
  id: string;
};

export interface CarouselProps {
  materials: IMaterial[];
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
