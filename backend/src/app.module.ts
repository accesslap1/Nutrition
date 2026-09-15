import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './config/environment';
import { CoreModule } from './core/core.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { DatabaseModule } from './shared/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    DatabaseModule,
    CoreModule,
    NutritionModule,
  ],
})
export class AppModule {}
