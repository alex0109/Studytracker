import { Connection } from 'mongoose';
import { MaterialsSchema } from './entities/materials.entity';

export const materialsProvider = [
  {
    provide: 'MATERIALS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Materials', MaterialsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
