import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsIn(['male', 'female', 'other']) gender?: 'male' | 'female' | 'other';
  @IsOptional() @IsNumber() @Min(50) @Max(300) heightCm?: number;
  @IsOptional() @IsNumber() @Min(20) @Max(500) weightKg?: number;
  @IsOptional() @IsIn(['lose_weight', 'build_muscle', 'stay_fit', 'improve_endurance']) fitnessGoal?: string;
  @IsOptional() @IsIn(['sedentary', 'light', 'moderate', 'active', 'very_active']) activityLevel?: string;
}

export class CreateGoalDto {
  @IsIn(['fitness', 'nutrition', 'weight', 'sleep', 'mental', 'habits', 'hydration', 'steps', 'general']) category!: string;
  @IsString() title!: string;
  @IsOptional() @IsNumber() targetValue?: number;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @IsDateString() deadline?: string;
}

export class UpdateGoalDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsNumber() targetValue?: number;
  @IsOptional() @IsNumber() currentValue?: number;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @IsDateString() deadline?: string;
  @IsOptional() @IsIn(['active', 'completed', 'abandoned']) status?: 'active' | 'completed' | 'abandoned';
}

export class CreateMeasurementDto {
  @IsDateString() measuredAt!: string;
  @IsOptional() @IsNumber() @Min(1) @Max(500) weightKg?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(100) bodyFatPercent?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(200) muscleMassKg?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(300) waistCm?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(300) chestCm?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(300) hipsCm?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(100) armsCm?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(200) thighsCm?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(100) neckCm?: number;
}

export class UpdateActivityDto {
  @IsDateString() date!: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) steps?: number;
  @IsOptional() @IsNumber() @Min(0) caloriesBurned?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) activeMinutes?: number;
  @IsOptional() @IsNumber() @Min(0) distanceKm?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) waterMl?: number;
}

export class RecordStreakDto { @IsString() type!: string }

export class UpdateSettingsDto {
  @IsOptional() @IsIn(['en', 'ar', 'fr', 'es']) language?: string;
  @IsOptional() @IsIn(['kg', 'lbs']) weightUnit?: 'kg' | 'lbs';
  @IsOptional() @IsIn(['km', 'miles']) distanceUnit?: 'km' | 'miles';
  @IsOptional() @IsIn(['light', 'dark', 'system']) theme?: 'light' | 'dark' | 'system';
  @IsOptional() @IsBoolean() notificationsEnabled?: boolean;
  @IsOptional() @IsBoolean() workoutReminders?: boolean;
  @IsOptional() @IsBoolean() nutritionReminders?: boolean;
  @IsOptional() @IsBoolean() sleepReminders?: boolean;
  @IsOptional() @IsBoolean() streakAlerts?: boolean;
}

export class ModuleDto { @IsString() moduleName!: string }

export class ConsentDto {
  @IsString() module!: string;
  @IsIn(['body_data', 'activity_data', 'sleep_data', 'nutrition_data', 'mental_data', 'reproductive_data', 'location_data', 'connected_device_data']) dataType!: string;
}
