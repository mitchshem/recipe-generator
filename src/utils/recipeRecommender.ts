import type { Recipe } from '../models/Recipe';
import type { KitchenState } from '../models/KitchenState';
import { matchRecipe } from './recipeMatcher';
import type { RecipeMatchResult } from './recipeMatcher';
import { isExpiringSoon, getDaysUntilExpiration } from './expirationHelper';

export interface ExpiringIngredient {
  name: string;
  daysLeft: number;
}

interface RecipeWithScore {
  recipe: Recipe;
  matchResult: RecipeMatchResult;
  recommendationScore: number;
  expiringIngredients: ExpiringIngredient[];
}

/**
 * Calculate recommendation score for a recipe
 * Higher score = better recommendation
 * 
 * Scoring rules:
 * - Base: feasibilityScore (0-100)
 * - Bonus: +20 for each expiring-soon ingredient used (to reduce food waste)
 * - Prefer recipes that can be made now (feasibilityScore === 100)
 */
const calculateRecommendationScore = (
  recipe: Recipe,
  matchResult: RecipeMatchResult,
  kitchen: KitchenState
): number => {
  let score = matchResult.feasibilityScore;

  // Bonus for recipes that use ingredients expiring soon (to reduce food waste)
  const expiringSoonIngredientCount = recipe.requiredIngredients.filter((requiredIng) => {
    const kitchenIng = kitchen.ingredients.find(
      (ing) => ing.name.toLowerCase() === requiredIng.name.toLowerCase()
    );
    return kitchenIng && isExpiringSoon(kitchenIng);
  }).length;

  // Add bonus points for each expiring-soon ingredient used
  // Higher bonus than low-stock to prioritize expiration
  score += expiringSoonIngredientCount * 20;

  return score;
};

/**
 * Get recommended recipes based on current kitchen state
 * Returns top 3-5 recipes that:
 * - Can be made now (preferred)
 * - Use ingredients expiring soon (to reduce food waste)
 */
export const getRecommendedRecipes = (
  recipes: Recipe[],
  kitchen: KitchenState,
  maxCount: number = 5
): RecipeWithScore[] => {
  // Calculate scores for all recipes
  const scoredRecipes: RecipeWithScore[] = recipes.map((recipe) => {
    const matchResult = matchRecipe(recipe, kitchen);
    const recommendationScore = calculateRecommendationScore(recipe, matchResult, kitchen);
    
    // Collect expiring ingredients used by this recipe
    const expiringIngredients: ExpiringIngredient[] = [];
    recipe.requiredIngredients.forEach((requiredIng) => {
      const kitchenIng = kitchen.ingredients.find(
        (ing) => ing.name.toLowerCase() === requiredIng.name.toLowerCase()
      );
      if (kitchenIng && isExpiringSoon(kitchenIng)) {
        const daysLeft = getDaysUntilExpiration(kitchenIng);
        if (daysLeft !== null) {
          expiringIngredients.push({
            name: kitchenIng.name,
            daysLeft,
          });
        }
      }
    });
    
    return {
      recipe,
      matchResult,
      recommendationScore,
      expiringIngredients,
    };
  });

  // Sort by recommendation score (descending), then by feasibilityScore (descending)
  scoredRecipes.sort((a, b) => {
    if (b.recommendationScore !== a.recommendationScore) {
      return b.recommendationScore - a.recommendationScore;
    }
    return b.matchResult.feasibilityScore - a.matchResult.feasibilityScore;
  });

  // Prefer recipes that can be made now (feasibilityScore === 100)
  // Filter to only recipes that can be made now, if any exist
  const canMakeRecipes = scoredRecipes.filter(
    (item) => item.matchResult.feasibilityScore === 100
  );

  if (canMakeRecipes.length > 0) {
    // Return top can-make recipes, prioritizing those with expiring ingredients
    return canMakeRecipes.slice(0, maxCount);
  }

  // If no recipes can be made, return top recipes by recommendation score
  return scoredRecipes.slice(0, maxCount);
};
