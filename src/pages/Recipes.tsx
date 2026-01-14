import type { Recipe } from '../models/Recipe';
import type { KitchenState } from '../models/KitchenState';
import { RecipeCard } from '../components/RecipeCard';
import { matchRecipe } from '../utils/recipeMatcher';
import type { RecipeMatchResult } from '../utils/recipeMatcher';
import { getFeasibilityCategory } from '../utils/recipeMatcher';

interface RecipesProps {
  recipes: Recipe[];
  kitchen: KitchenState;
}

export const Recipes = ({ recipes, kitchen }: RecipesProps) => {
  // Calculate match results for all recipes
  const matchResults = new Map<string, RecipeMatchResult>();
  recipes.forEach((recipe) => {
    const result = matchRecipe(recipe, kitchen);
    matchResults.set(recipe.id, result);
  });

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
