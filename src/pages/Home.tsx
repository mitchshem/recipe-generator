import type { Recipe } from '../models/Recipe';
import type { KitchenState } from '../models/KitchenState';
import { RecipeList } from '../components/RecipeList';
import { matchRecipe } from '../utils/recipeMatcher';
import type { RecipeMatchResult } from '../utils/recipeMatcher';

interface HomeProps {
  recipes: Recipe[];
  kitchen: KitchenState;
}

export const Home = ({ recipes, kitchen }: HomeProps) => {
  // Calculate match results for all recipes
  const matchResults = new Map<string, RecipeMatchResult>();
  recipes.forEach((recipe) => {
    const result = matchRecipe(recipe, kitchen);
    matchResults.set(recipe.id, result);
  });

  // Sort recipes by feasibility score (highest first)
  const sortedRecipes = [...recipes].sort((a, b) => {
    const scoreA = matchResults.get(a.id)?.feasibilityScore ?? 0;
    const scoreB = matchResults.get(b.id)?.feasibilityScore ?? 0;
    return scoreB - scoreA;
  });

  return (
    <div className="home-page">
      <h1>Recipe Generator</h1>
      <h2>Possible Recipes</h2>
      <p>Recipes sorted by feasibility based on your kitchen inventory.</p>
      <RecipeList recipes={sortedRecipes} matchResults={matchResults} />
    </div>
  );
};
