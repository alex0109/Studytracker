import { ITagResponse } from "@/entities/tag";
import { MaterialStatusEnum } from "./material-status.type";
import { MaterialTypeEnum } from "./material-type.type";

import { INoteResponse } from "@/entities/note/model";
import { RichTextDocument } from "@/shared/types";

export interface IMaterialResponse {
  id: string;
  assessmentId: string;
  title: string;
  type: MaterialTypeEnum;
  materialTags?: ITagResponse[];
  notes?: INoteResponse[];
  link?: string;
  content?: RichTextDocument;
  status: MaterialStatusEnum;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
