import * as mongoose from 'mongoose';
// import { CustomTypeRichTextDocument } from '../interfaces/materials.interface';

export const MaterialsSchema = new mongoose.Schema({
  title: String,
  type: String,
  tags: Array<String>,
  link: String,
  status: String,
  description: mongoose.Schema.Types.Mixed,
  created_at: Date,
});
