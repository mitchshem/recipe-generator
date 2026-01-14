import type { Recipe } from '../models/Recipe';
import type { KitchenState } from '../models/KitchenState';
import type { Ingredient } from '../models/Ingredient';
import type { Appliance } from '../models/Appliance';

export interface RecipeMatchResult {
  feasibilityScore: number; // 0-100, starts at 100, deducts for missing items
  missingIngredients: string[];
  missingAppliances: string[];
}

export type FeasibilityCategory = 'can-make' | 'almost-can-make' | 'missing-key-items';

export type FeasibilityLabel = 'Can Make Now' | 'Almost Ready' | 'Missing Ingredients';

/**
 * Check if an ingredient exists in the kitchen with sufficient quantity
 */
const hasIngredient = (required: Ingredient, kitchen: Ingredient[]): boolean => {
  const found = kitchen.find(
    (ing) => ing.name.toLowerCase() === required.name.toLowerCase()
  );
  return found !== undefined && found.quantity >= required.quantity;
};

/**
 * Check if an appliance exists in the kitchen
 */
const hasAppliance = (required: Appliance, kitchen: Appliance[]): boolean => {
  return kitchen.some(
    (app) => app.name.toLowerCase() === required.name.toLowerCase()
  );
};

/**
 * Match a recipe against kitchen state and return feasibility info
 * Scoring: Starts at 100, deducts -15 per missing required ingredient, -40 per missing required appliance
 * Optional ingredients do not reduce score
 * Minimum score is 0
 */
export const matchRecipe = (
  recipe: Recipe,
  kitchen: KitchenState
): RecipeMatchResult => {
  const missingIngredients: string[] = [];
  const missingAppliances: string[] = [];
  let score = 100;

  // Check required ingredients (-15 each)
  recipe.requiredIngredients.forEach((ing) => {
    if (!hasIngredient(ing, kitchen.ingredients)) {
      missingIngredients.push(ing.name);
      score -= 15;
    }
  });

  // Check required appliances (-40 each)
  recipe.requiredAppliances.forEach((app) => {
    if (!hasAppliance(app, kitchen.appliances)) {
      missingAppliances.push(app.name);
      score -= 40;
    }
  });

  // Optional ingredients do not reduce score
  // (No check needed as per requirements)

  // Ensure minimum score is 0
  const feasibilityScore = Math.max(0, score);

  return {
    feasibilityScore,
    missingIngredients,
    missingAppliances,
  };
};

/**
 * Get feasibility label from match result
 */
export const getFeasibilityLabel = (matchResult: RecipeMatchResult): FeasibilityLabel => {
  const totalMissing = matchResult.missingIngredients.length + matchResult.missingAppliances.length;
  
  if (matchResult.feasibilityScore === 100) {
    return 'Can Make Now';
  } else if (totalMissing <= 2) {
    return 'Almost Ready';
  } else {
    return 'Missing Ingredients';
  }
};

/**
 * Get feasibility category from match result
 */
export const getFeasibilityCategory = (matchResult: RecipeMatchResult): FeasibilityCategory => {
  const totalMissing = matchResult.missingIngredients.length + matchResult.missingAppliances.length;
  
  if (matchResult.feasibilityScore === 100) {
    return 'can-make';
  } else if (totalMissing <= 2) {
    return 'almost-can-make';
  } else {
    return 'missing-key-items';
  }
};
