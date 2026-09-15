export type NutritionMealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface NutritionFoodResponse {
  id: string;
  user_id: string | null;
  name: string;
  brand: string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sugar_per_100g: number;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNutritionFoodRequest {
  name: string;
  brand?: string;
  calories_per_100g: number;
  protein_per_100g?: number;
  carbs_per_100g?: number;
  fat_per_100g?: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
}

export interface CreateNutritionMealRequest {
  food_id: string;
  meal_type: NutritionMealType;
  quantity_g: number;
  logged_at?: string;
}

export interface NutritionMealResponse {
  id: string;
  user_id: string;
  food_id: string;
  meal_type: NutritionMealType;
  quantity_g: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  logged_at: string;
  created_at: string;
  updated_at: string;
  food: NutritionFoodResponse;
}

export interface NutritionDailyMealsResponse {
  date: string;
  totals: { calories: number; protein: number; carbs: number; fat: number };
  logs: NutritionMealResponse[];
}

export interface CreateNutritionWaterRequest { amount_ml: number; logged_at?: string }
export interface NutritionWaterSummaryResponse { date: string; total_ml: number; total_L: number }
