import { useParams, useNavigate } from 'react-router-dom';
import type { Recipe } from '../models/Recipe';
import type { KitchenState } from '../models/KitchenState';
import { matchRecipe } from '../utils/recipeMatcher';
import { getFeasibilityLabel } from '../utils/recipeMatcher';

interface RecipeDetailProps {
  recipes: Recipe[];
  kitchen: KitchenState;
}

export const RecipeDetail = ({ recipes, kitchen }: RecipeDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className="recipe-detail">
        <p>Recipe not found</p>
        <button onClick={() => navigate('/recipes')}>Back to Recipes</button>
      </div>
    );
  }

  const matchResult = matchRecipe(recipe, kitchen);
  const feasibilityLabel = getFeasibilityLabel(matchResult);
  const missingIngredientNames = new Set(matchResult.missingIngredients);

  return (
    <div className="recipe-detail">
      <button onClick={() => navigate('/recipes')} className="recipe-detail-back">
        ← Back to Recipes
      </button>
      <h1>{recipe.name}</h1>
      
      <div className="recipe-detail-status">
        <strong>Status: {feasibilityLabel}</strong>
        {matchResult.missingIngredients.length + matchResult.missingAppliances.length > 0 && (
          <span className="recipe-detail-status-count">
            Missing {matchResult.missingIngredients.length + matchResult.missingAppliances.length}{' '}
            {matchResult.missingIngredients.length + matchResult.missingAppliances.length === 1
              ? 'item'
              : 'items'}
          </span>
        )}
        <span className="recipe-detail-status-explanation">
          Based on your current kitchen inventory
        </span>
      </div>

      <section className="recipe-detail-section">
        <h2>Required Ingredients</h2>
        <ul>
          {recipe.requiredIngredients.map((ingredient, idx) => {
            const isMissing = missingIngredientNames.has(ingredient.name);
            return (
              <li
                key={idx}
                className={isMissing ? 'recipe-detail-missing' : ''}
              >
                {isMissing && <strong>[Missing] </strong>}
                {ingredient.name} - {ingredient.quantity} {ingredient.unit}
              </li>
            );
          })}
        </ul>
      </section>

      {recipe.optionalIngredients.length > 0 && (
        <section className="recipe-detail-section">
          <h2>Optional Ingredients</h2>
          <ul>
            {recipe.optionalIngredients.map((ingredient, idx) => (
              <li key={idx}>
                {ingredient.name} - {ingredient.quantity} {ingredient.unit}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="recipe-detail-section">
        <h2>Required Appliances</h2>
        <ul>
          {recipe.requiredAppliances.map((appliance, idx) => {
            const isMissing = matchResult.missingAppliances.includes(appliance.name);
            return (
              <li
                key={idx}
                className={isMissing ? 'recipe-detail-missing' : ''}
              >
                {isMissing && <strong>[Missing] </strong>}
                {appliance.name} ({appliance.type})
              </li>
            );
          })}
        </ul>
      </section>

      <section className="recipe-detail-section">
        <h2>Cooking Instructions</h2>
        <ol>
          {recipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
};
