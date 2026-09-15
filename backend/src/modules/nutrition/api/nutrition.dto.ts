import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export class FoodSearchQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}

export class CreateFoodDto {
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsOptional() @IsString() @MaxLength(255) brand?: string;
  @Type(() => Number) @IsNumber() @Min(0) @Max(10000) calories_per_100g!: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(1000) protein_per_100g?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(1000) carbs_per_100g?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(1000) fat_per_100g?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(1000) fiber_per_100g?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(1000) sugar_per_100g?: number;
}

export class CreateMealLogDto {
  @IsUUID() food_id!: string;
  @IsIn(['breakfast', 'lunch', 'dinner', 'snack']) meal_type!: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  @Type(() => Number) @IsNumber() @Min(0.01) @Max(100000) quantity_g!: number;
  @IsOptional() @IsDateString() logged_at?: string;
}

export class CreateWaterLogDto {
  @Type(() => Number) @IsInt() @Min(1) @Max(100000) amount_ml!: number;
  @IsOptional() @IsDateString() logged_at?: string;
}
