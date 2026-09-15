import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/database/prisma.service';
import { CreateFoodDto, CreateMealLogDto, CreateWaterLogDto } from '../api/nutrition.dto';
import { calculateNutrients } from '../domain/nutrition-calculation';

@Injectable()
export class NutritionService {
  constructor(private readonly prisma: PrismaService) {}

  async searchFoods(userId: string, search?: string) {
    const foods = await this.prisma.nutritionFood.findMany({
      where: {
        AND: [
          { OR: [{ userId: null }, { userId }] },
          search?.trim() ? { name: { contains: search.trim(), mode: 'insensitive' } } : {},
        ],
      },
      orderBy: [{ name: 'asc' }, { brand: 'asc' }],
      take: 50,
    });
    return foods.map(serializeFood);
  }

  async createFood(userId: string, dto: CreateFoodDto) {
    const food = await this.prisma.nutritionFood.create({
      data: {
        userId,
        name: dto.name.trim(),
        brand: dto.brand?.trim() || null,
        caloriesPer100g: dto.calories_per_100g,
        proteinPer100g: dto.protein_per_100g ?? 0,
        carbsPer100g: dto.carbs_per_100g ?? 0,
        fatPer100g: dto.fat_per_100g ?? 0,
        fiberPer100g: dto.fiber_per_100g ?? 0,
        sugarPer100g: dto.sugar_per_100g ?? 0,
        isCustom: true,
      },
    });
    return serializeFood(food);
  }

  async mealsToday(userId: string) {
    const date = utcDateOnly();
    const logs = await this.prisma.nutritionMealLog.findMany({
      where: { userId, loggedAt: date },
      include: { food: true },
      orderBy: [{ createdAt: 'asc' }],
    });
    const totals = logs.reduce(
      (sum, log) => ({
        calories: sum.calories + Number(log.calories),
        protein: sum.protein + Number(log.protein),
        carbs: sum.carbs + Number(log.carbs),
        fat: sum.fat + Number(log.fat),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
    return {
      date: date.toISOString().slice(0, 10),
      totals: {
        calories: roundTotal(totals.calories),
        protein: roundTotal(totals.protein),
        carbs: roundTotal(totals.carbs),
        fat: roundTotal(totals.fat),
      },
      logs: logs.map(serializeMeal),
    };
  }

  async createMeal(userId: string, dto: CreateMealLogDto) {
    const food = await this.prisma.nutritionFood.findUnique({ where: { id: dto.food_id } });
    if (!food) throw new NotFoundException('Food not found');
    if (food.userId && food.userId !== userId) throw new ForbiddenException('Food is not available to this user');

    const nutrients = calculateNutrients({
      calories: Number(food.caloriesPer100g),
      protein: Number(food.proteinPer100g),
      carbs: Number(food.carbsPer100g),
      fat: Number(food.fatPer100g),
    }, dto.quantity_g);

    const log = await this.prisma.nutritionMealLog.create({
      data: {
        userId,
        foodId: food.id,
        mealType: dto.meal_type,
        quantityG: dto.quantity_g,
        ...nutrients,
        loggedAt: utcDateOnly(dto.logged_at),
      },
      include: { food: true },
    });
    return serializeMeal(log);
  }

  async deleteMeal(userId: string, id: string) {
    const log = await this.prisma.nutritionMealLog.findUnique({ where: { id }, select: { userId: true } });
    if (!log) throw new NotFoundException('Meal log not found');
    if (log.userId !== userId) throw new ForbiddenException('Meal log belongs to another user');
    await this.prisma.nutritionMealLog.delete({ where: { id } });
    return { message: 'Log deleted' };
  }

  async waterToday(userId: string) {
    const date = utcDateOnly();
    const aggregate = await this.prisma.nutritionWaterLog.aggregate({
      where: { userId, loggedAt: date },
      _sum: { amountMl: true },
    });
    const totalMl = aggregate._sum.amountMl ?? 0;
    return { date: date.toISOString().slice(0, 10), total_ml: totalMl, total_L: Math.round(totalMl / 10) / 100 };
  }

  async createWater(userId: string, dto: CreateWaterLogDto) {
    const log = await this.prisma.nutritionWaterLog.create({
      data: { userId, amountMl: dto.amount_ml, loggedAt: utcDateOnly(dto.logged_at) },
    });
    return { id: log.id, user_id: log.userId, amount_ml: log.amountMl, logged_at: dateValue(log.loggedAt), created_at: log.createdAt.toISOString() };
  }
}

function utcDateOnly(value?: string): Date {
  const date = value ? new Date(value) : new Date();
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function dateValue(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function roundTotal(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function serializeFood(food: {
  id: string; userId: string | null; name: string; brand: string | null;
  caloriesPer100g: Prisma.Decimal; proteinPer100g: Prisma.Decimal; carbsPer100g: Prisma.Decimal;
  fatPer100g: Prisma.Decimal; fiberPer100g: Prisma.Decimal; sugarPer100g: Prisma.Decimal;
  isCustom: boolean; createdAt: Date; updatedAt: Date;
}) {
  return {
    id: food.id, user_id: food.userId, name: food.name, brand: food.brand,
    calories_per_100g: Number(food.caloriesPer100g), protein_per_100g: Number(food.proteinPer100g),
    carbs_per_100g: Number(food.carbsPer100g), fat_per_100g: Number(food.fatPer100g),
    fiber_per_100g: Number(food.fiberPer100g), sugar_per_100g: Number(food.sugarPer100g),
    is_custom: food.isCustom, created_at: food.createdAt.toISOString(), updated_at: food.updatedAt.toISOString(),
  };
}

function serializeMeal(log: {
  id: string; userId: string; foodId: string; mealType: string; quantityG: Prisma.Decimal;
  calories: Prisma.Decimal; protein: Prisma.Decimal; carbs: Prisma.Decimal; fat: Prisma.Decimal;
  loggedAt: Date; createdAt: Date; updatedAt: Date;
  food: Parameters<typeof serializeFood>[0];
}) {
  return {
    id: log.id, user_id: log.userId, food_id: log.foodId, meal_type: log.mealType,
    quantity_g: Number(log.quantityG), calories: Number(log.calories), protein: Number(log.protein),
    carbs: Number(log.carbs), fat: Number(log.fat), logged_at: dateValue(log.loggedAt),
    created_at: log.createdAt.toISOString(), updated_at: log.updatedAt.toISOString(), food: serializeFood(log.food),
  };
}
