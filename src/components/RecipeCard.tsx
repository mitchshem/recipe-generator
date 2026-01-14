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

  const feasibilityLabel = matchResult
    ? getFeasibilityLabel(matchResult)
    : 'Missing Ingredients';

  const missingCount =
    matchResult
      ? matchResult.missingIngredients.length +
        matchResult.missingAppliances.length
      : 0;

  const missingText =
    missingCount > 0
      ? `Missing ${missingCount} ${missingCount === 1 ? 'item' : 'items'}`
      : 'All ingredients available';

  const handleClick = () => {
    navigate(`/recipes/${recipe.id}`);
  };

  return (
    <div
      className="recipe-card"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <h3>{recipe.name}</h3>

      <div className="recipe-card-status">
        <strong>{feasibilityLabel}</strong>
        <span className="recipe-card-subtext">
          {missingText}
        </span>
        <span className="recipe-card-explanation">
          Based on your current kitchen
        </span>
      </div>
    </div>
  );
};