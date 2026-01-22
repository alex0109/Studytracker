import mongoose from 'mongoose';

export interface Node {
  type: string;
  text?: string;
  attrs?: Record<string, string | number>;
  content?: Node[];
}

export interface RichTextDocument {
  type: 'doc';
  content: Node[];
}

export const CustomTypeRichTextDocument = new mongoose.Schema({
  type: String,
  content: Array<Node>,
});

export interface IMaterials {
  title: string;
  type: 'article' | 'video' | 'summary' | 'practice' | 'test';
  tags?: string[];
  link?: string;
  status: 'tolearn' | 'inprocess' | 'finished';
  description?: RichTextDocument;
  created_at: Date;
}

export interface IStatistics {
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
