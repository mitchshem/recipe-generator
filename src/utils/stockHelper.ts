import type { Ingredient } from '../models/Ingredient';

/**
 * Check if an ingredient is low stock
 * Low stock = quantity <= 1
 */
export const isLowStock = (ingredient: Ingredient): boolean => {
  return ingredient.quantity <= 1;
};
