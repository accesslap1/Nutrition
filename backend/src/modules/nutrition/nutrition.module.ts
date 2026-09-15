import { Module } from '@nestjs/common';
import { AuthModule } from '../../core/auth/auth.module';
import { NutritionController } from './api/nutrition.controller';
import { NutritionService } from './application/nutrition.service';

/**
 * Integration boundary owned by the Nutrition Module Backend workstream.
 * Nutrition may consume exported Core services; Core must never import Nutrition.
 */
@Module({
  imports: [AuthModule],
  controllers: [NutritionController],
  providers: [NutritionService],
})
export class NutritionModule {}
