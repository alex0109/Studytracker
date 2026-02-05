import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MaterialsModule } from './models/materials/materials.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MaterialsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
