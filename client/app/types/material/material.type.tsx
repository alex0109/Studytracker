import { MaterialStatusEnum } from "./material.status.type";
import { MaterialTypeEnum } from "./material.type.type";
import { RichTextDocument } from "./rich.text.document.type";

export interface IMaterial {
  id: string;
  title: string;
  type: MaterialTypeEnum;
  tags?: string[];
  link?: string;
  description?: RichTextDocument | undefined;
  status: MaterialStatusEnum;
  created_at: Date;
  updated_at: Date;
}
