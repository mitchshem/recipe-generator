import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../models/Recipe';
import type { RecipeMatchResult } from '../utils/recipeMatcher';
import { getFeasibilityLabel } from '../utils/recipeMatcher';

interface RecipeCardProps {
  recipe: Recipe;
  matchResult?: RecipeMatchResult;
}

export const RecipeCard = ({ recipe, matchResult }: RecipeCardProps) => {
  const navigate = useNavigate();
  const missingIngredients = matchResult?.missingIngredients ?? [];
  const missingAppliances = matchResult?.missingAppliances ?? [];
  const feasibilityLabel = matchResult
    ? getFeasibilityLabel(matchResult)
    : 'Missing Ingredients';

  const totalMissing = missingIngredients.length + missingAppliances.length;
  const missingCountText =
    totalMissing > 0
      ? `Missing ${totalMissing} ${totalMissing === 1 ? 'item' : 'items'}`
      : null;

  const handleClick = () => {
    navigate(`/recipes/${recipe.id}`);
  };

  return (
    <div className="recipe-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <h3>{recipe.name}</h3>
      <div className="recipe-score">
        <strong>{feasibilityLabel}</strong>
        {missingCountText && (
          <span className="recipe-score-count">{missingCountText}</span>
        )}
        <span className="recipe-score-explanation">
          Based on your current kitchen inventory
        </span>
      </div>
      {missingIngredients.length > 0 && (
        <div className="recipe-missing">
          <strong>Missing Ingredients:</strong>
          <ul>
            {missingIngredients.map((ingredientName, idx) => (
              <li key={idx}>{ingredientName}</li>
            ))}
          </ul>
        </div>
      )}
      {missingAppliances.length > 0 && (
        <div className="recipe-missing">
          <strong>Missing Appliances:</strong>
          <ul>
            {missingAppliances.map((applianceName, idx) => (
              <li key={idx}>{applianceName}</li>
            ))}
          </ul>
        </div>
      )}
      {feasibilityLabel === 'Can Make Now' && (
        <div className="recipe-feasible">✓ All requirements met!</div>
      )}
    </div>
  );
};
