import type { Ingredient } from '../models/Ingredient';

/**
 * Calculate days until expiration for an ingredient
 * Returns null if no expirationDate exists
 * @param ingredient - The ingredient to check
 * @returns number of days until expiration, or null if no expiration date
 */
export const getDaysUntilExpiration = (ingredient: Ingredient): number | null => {
  if (!ingredient.expirationDate) {
    return null;
  }

  const expirationDate = new Date(ingredient.expirationDate);
  const today = new Date();
  
  // Set time to midnight for accurate day comparison
  today.setHours(0, 0, 0, 0);
  expirationDate.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = expirationDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Check if an ingredient is expiring soon
 * Returns true if expirationDate exists and is within the threshold
 * @param ingredient - The ingredient to check
 * @param daysThreshold - Number of days to consider "soon" (default: 5)
 * @returns true if expiring within threshold, false otherwise
 */
export const isExpiringSoon = (
  ingredient: Ingredient,
  daysThreshold: number = 5
): boolean => {
  const daysLeft = getDaysUntilExpiration(ingredient);
  
  if (daysLeft === null) {
    return false;
  }
  
  // Return true if expiration is within threshold (0 to daysThreshold days)
  return daysLeft >= 0 && daysLeft <= daysThreshold;
};
