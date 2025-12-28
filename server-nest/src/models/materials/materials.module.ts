import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { materialsProvider } from './materials.provider';
import { DatabaseModule } from 'src/providers/database/mongodb.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MaterialsController],
  providers: [MaterialsService, ...materialsProvider],
})
export class MaterialsModule {}
