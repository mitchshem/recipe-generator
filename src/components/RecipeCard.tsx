import type { Recipe } from '../models/Recipe';
import type { RecipeMatchResult } from '../utils/recipeMatcher';

interface RecipeCardProps {
  recipe: Recipe;
  matchResult?: RecipeMatchResult;
}

export const RecipeCard = ({ recipe, matchResult }: RecipeCardProps) => {
  const feasibilityScore = matchResult?.feasibilityScore ?? 0;
  const missingIngredients = matchResult?.missingIngredients ?? [];
  const missingAppliances = matchResult?.missingAppliances ?? [];

  return (
    <div className="recipe-card">
      <h3>{recipe.name}</h3>
      <div className="recipe-score">
        Feasibility: {feasibilityScore}%
      </div>
      {missingIngredients.length > 0 && (
        <div className="recipe-missing">
          <strong>Missing Ingredients:</strong>
          <ul>
            {missingIngredients.map((ing, idx) => (
              <li key={idx}>
                {ing.name} ({ing.quantity} {ing.unit})
              </li>
            ))}
          </ul>
        </div>
      )}
      {missingAppliances.length > 0 && (
        <div className="recipe-missing">
          <strong>Missing Appliances:</strong>
          <ul>
            {missingAppliances.map((app, idx) => (
              <li key={idx}>{app.name}</li>
            ))}
          </ul>
        </div>
      )}
      {feasibilityScore === 100 && (
        <div className="recipe-feasible">✓ All requirements met!</div>
      )}
    </div>
  );
};
