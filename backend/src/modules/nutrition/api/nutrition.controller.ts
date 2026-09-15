import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../core/auth/api/jwt-auth.guard';
import type { AuthenticatedUser } from '../../../core/auth/domain/authenticated-user';
import { CurrentUser } from '../../../shared/security/current-user.decorator';
import { NutritionService } from '../application/nutrition.service';
import { CreateFoodDto, CreateMealLogDto, CreateWaterLogDto, FoodSearchQueryDto } from './nutrition.dto';

@UseGuards(JwtAuthGuard)
@Controller('nutrition')
export class NutritionController {
  constructor(private readonly nutrition: NutritionService) {}

  @Get('foods')
  foods(@CurrentUser() user: AuthenticatedUser, @Query() query: FoodSearchQueryDto) {
    return this.nutrition.searchFoods(user.id, query.search);
  }

  @Post('foods')
  createFood(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateFoodDto) {
    return this.nutrition.createFood(user.id, dto);
  }

  @Get('meals/today')
  mealsToday(@CurrentUser() user: AuthenticatedUser) {
    return this.nutrition.mealsToday(user.id);
  }

  @Post('meals')
  createMeal(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateMealLogDto) {
    return this.nutrition.createMeal(user.id, dto);
  }

  @Delete('meals/:id')
  @HttpCode(HttpStatus.OK)
  deleteMeal(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.nutrition.deleteMeal(user.id, id);
  }

  @Get('water/today')
  waterToday(@CurrentUser() user: AuthenticatedUser) {
    return this.nutrition.waterToday(user.id);
  }

  @Post('water')
  createWater(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateWaterLogDto) {
    return this.nutrition.createWater(user.id, dto);
  }
}
