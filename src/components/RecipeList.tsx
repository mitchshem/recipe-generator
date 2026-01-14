import type { Recipe } from '../models/Recipe';
import type { RecipeMatchResult } from '../utils/recipeMatcher';
import { RecipeCard } from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
  matchResults?: Map<string, RecipeMatchResult>;
}

export const RecipeList = ({ recipes, matchResults }: RecipeListProps) => {
  return (
    <div className="recipe-list">
      {recipes.length === 0 ? (
        <p>No recipes available</p>
      ) : (
        recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            matchResult={matchResults?.get(recipe.id)}
          />
        ))
      )}
    </div>
  );
};
