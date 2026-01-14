import type { Recipe } from '../models/Recipe';
import type { KitchenState } from '../models/KitchenState';
import { RecipeList } from '../components/RecipeList';
import { matchRecipe } from '../utils/recipeMatcher';
import type { RecipeMatchResult } from '../utils/recipeMatcher';

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

  return (
    <div className="recipes-page">
      <h1>All Recipes</h1>
      <p>Browse all available recipes with feasibility information.</p>
      <RecipeList recipes={recipes} matchResults={matchResults} />
    </div>
  );
};
