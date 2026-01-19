import { useMemo } from 'react';
import type { Recipe } from '../models/Recipe';
import type { KitchenState } from '../models/KitchenState';
import { RecipeCard } from '../components/RecipeCard';
import { matchRecipe } from '../utils/recipeMatcher';
import type { RecipeMatchResult } from '../utils/recipeMatcher';
import { getFeasibilityCategory } from '../utils/recipeMatcher';
import { getRecommendedRecipes } from '../utils/recipeRecommender';

interface RecipesProps {
  recipes: Recipe[];
  kitchen: KitchenState;
}

export const Recipes = ({ recipes, kitchen }: RecipesProps) => {
  // Calculate match results for all recipes
  const matchResults = useMemo(() => {
    const results = new Map<string, RecipeMatchResult>();
    recipes.forEach((recipe) => {
      const result = matchRecipe(recipe, kitchen);
      results.set(recipe.id, result);
    });
    return results;
  }, [recipes, kitchen]);

  // Get recommended recipes (updates when kitchen changes)
  const recommendedRecipes = useMemo(() => {
    return getRecommendedRecipes(recipes, kitchen, 5);
  }, [recipes, kitchen]);

  // Categorize recipes
  const canMakeRecipes: Recipe[] = [];
  const almostCanMakeRecipes: Recipe[] = [];
  const missingKeyItemsRecipes: Recipe[] = [];

  recipes.forEach((recipe) => {
    const result = matchResults.get(recipe.id);
    if (!result) {
      missingKeyItemsRecipes.push(recipe);
      return;
    }
    const category = getFeasibilityCategory(result);
    if (category === 'can-make') {
      canMakeRecipes.push(recipe);
    } else if (category === 'almost-can-make') {
      almostCanMakeRecipes.push(recipe);
    } else {
      missingKeyItemsRecipes.push(recipe);
    }
  });

  return (
    <div className="recipes-page">
      <h1>All Recipes</h1>
      <p>
        Recipes are evaluated based on what you currently have in your kitchen. Click any recipe to
        see full cooking instructions and detailed ingredient requirements.
      </p>

      {recommendedRecipes.length > 0 && (
        <section className="recipe-category-section">
          <h2>Recommended for You</h2>
          <p className="recipe-category-description">
            Recipes tailored to your current kitchen inventory. Uses ingredients expiring soon to help reduce food waste.
          </p>
          <div className="recipe-list">
            {recommendedRecipes.map((item) => (
              <div key={item.recipe.id}>
                <RecipeCard
                  recipe={item.recipe}
                  matchResult={item.matchResult}
                />
                {item.expiringIngredients.length > 0 && (
                  <p className="recipe-expiring-ingredients">
                    Uses ingredients expiring soon: {item.expiringIngredients
                      .map((ing) => `${ing.name} (${ing.daysLeft} ${ing.daysLeft === 1 ? 'day' : 'days'})`)
                      .join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {canMakeRecipes.length > 0 && (
        <section className="recipe-category-section">
          <h2>Can Make Now</h2>
          <div className="recipe-list">
            {canMakeRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                matchResult={matchResults.get(recipe.id)}
              />
            ))}
          </div>
        </section>
      )}

      {almostCanMakeRecipes.length > 0 && (
        <section className="recipe-category-section">
          <h2>Almost Can Make</h2>
          <p className="recipe-category-description">Missing 1–2 items</p>
          <div className="recipe-list">
            {almostCanMakeRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                matchResult={matchResults.get(recipe.id)}
              />
            ))}
          </div>
        </section>
      )}

      {missingKeyItemsRecipes.length > 0 && (
        <section className="recipe-category-section">
          <h2>Missing Key Items</h2>
          <div className="recipe-list">
            {missingKeyItemsRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                matchResult={matchResults.get(recipe.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
