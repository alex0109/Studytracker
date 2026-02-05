import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaterialsController } from './models/materials/materials.controller';
import { MaterialsService } from './models/materials/materials.service';
import { MaterialsModule } from './models/materials/materials.module';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './providers/database/mongodb.provider';
import { DatabaseModule } from './providers/database/mongodb.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    MaterialsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
