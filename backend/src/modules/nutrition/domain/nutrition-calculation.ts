export type NutrientsPer100g = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type NutrientTotals = NutrientsPer100g;

export function calculateNutrients(source: NutrientsPer100g, quantityG: number): NutrientTotals {
  if (!Number.isFinite(quantityG) || quantityG <= 0) {
    throw new RangeError('Quantity must be a positive number of grams');
  }

  const multiplier = quantityG / 100;
  return {
    calories: roundNutritionValue(source.calories * multiplier),
    protein: roundNutritionValue(source.protein * multiplier),
    carbs: roundNutritionValue(source.carbs * multiplier),
    fat: roundNutritionValue(source.fat * multiplier),
  };
}

export function roundNutritionValue(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
