import type { Recipe } from '../models/Recipe';
import type { KitchenState } from '../models/KitchenState';
import type { Ingredient } from '../models/Ingredient';
import type { Appliance } from '../models/Appliance';

export interface RecipeMatchResult {
  feasibilityScore: number; // 0-100, where 100 = all requirements met
  missingIngredients: Ingredient[];
  missingAppliances: Appliance[];
}

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
 */
export const matchRecipe = (
  recipe: Recipe,
  kitchen: KitchenState
): RecipeMatchResult => {
  const missingIngredients: Ingredient[] = [];
  const missingAppliances: Appliance[] = [];

  // Check required ingredients
  recipe.requiredIngredients.forEach((ing) => {
    if (!hasIngredient(ing, kitchen.ingredients)) {
      missingIngredients.push(ing);
    }
  });

  // Check required appliances
  recipe.requiredAppliances.forEach((app) => {
    if (!hasAppliance(app, kitchen.appliances)) {
      missingAppliances.push(app);
    }
  });

  // Calculate feasibility score
  // Score = (matched requirements / total requirements) * 100
  const totalRequirements =
    recipe.requiredIngredients.length + recipe.requiredAppliances.length;
  const matchedRequirements =
    totalRequirements - missingIngredients.length - missingAppliances.length;
  const feasibilityScore =
    totalRequirements > 0
      ? Math.round((matchedRequirements / totalRequirements) * 100)
      : 100;

  return {
    feasibilityScore,
    missingIngredients,
    missingAppliances,
  };
};
