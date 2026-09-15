import { describe, expect, it } from 'vitest';
import { calculateNutrients } from './nutrition-calculation';

describe('calculateNutrients', () => {
  const food = { calories: 250, protein: 12.5, carbs: 40, fat: 5 };

  it('calculates a 100 gram serving', () => {
    expect(calculateNutrients(food, 100)).toEqual(food);
  });

  it('calculates and rounds a partial serving', () => {
    expect(calculateNutrients(food, 37.5)).toEqual({ calories: 93.75, protein: 4.69, carbs: 15, fat: 1.88 });
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])('rejects invalid quantity %s', (quantity) => {
    expect(() => calculateNutrients(food, quantity)).toThrow(RangeError);
  });
});
