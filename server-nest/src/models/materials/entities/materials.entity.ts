import * as mongoose from 'mongoose';
import { CustomTypeRichTextDocument } from '../interfaces/materials.interface';

export const MaterialsSchema = new mongoose.Schema({
  title: String,
  type: String,
  tags: Array<String>,
  link: String,
  status: String,
  description: CustomTypeRichTextDocument,
  created_at: Date,
});
