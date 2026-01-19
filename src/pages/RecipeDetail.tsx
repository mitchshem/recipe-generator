import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Recipe } from '../models/Recipe';
import type { KitchenState } from '../models/KitchenState';
import type { ListItem } from '../models/ListItem';
import { matchRecipe } from '../utils/recipeMatcher';
import { getFeasibilityLabel } from '../utils/recipeMatcher';
import { applyRecipeToKitchen, canCookRecipe } from '../utils/kitchenDeduction';

interface RecipeDetailProps {
  recipes: Recipe[];
  kitchen: KitchenState;
  onCookRecipe: (updatedKitchen: KitchenState, addedShoppingListItems: ListItem[]) => void;
  shoppingList: ListItem[];
  setShoppingList: React.Dispatch<React.SetStateAction<ListItem[]>>;
}

export const RecipeDetail = ({ recipes, kitchen, onCookRecipe, shoppingList, setShoppingList }: RecipeDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

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
  const canMakeNow = feasibilityLabel === 'Can Make Now';

  // Preview inventory changes
  const getInventoryPreview = () => {
    const reduced: Array<{ name: string; current: number; after: number; unit: string }> = [];
    const depleted: Array<{ name: string; quantity: number; unit: string }> = [];

    recipe.requiredIngredients.forEach((requiredIng) => {
      const kitchenIng = kitchen.ingredients.find(
        (ing) => ing.name.toLowerCase() === requiredIng.name.toLowerCase()
      );
      if (kitchenIng) {
        const after = kitchenIng.quantity - requiredIng.quantity;
        if (after <= 0) {
          depleted.push({
            name: kitchenIng.name,
            quantity: requiredIng.quantity,
            unit: requiredIng.unit,
          });
        } else {
          reduced.push({
            name: kitchenIng.name,
            current: kitchenIng.quantity,
            after,
            unit: kitchenIng.unit,
          });
        }
      }
    });

    return { reduced, depleted };
  };

  const handleShowConfirmation = () => {
    const { canCook, missingItems } = canCookRecipe(recipe, kitchen);
    if (!canCook) {
      alert(`Cannot cook recipe. Missing or insufficient: ${missingItems.join(', ')}`);
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmCook = () => {
    // Safety guard: Check if all ingredients are available
    const { canCook, missingItems } = canCookRecipe(recipe, kitchen);
    
    if (!canCook) {
      alert(`Cannot cook recipe. Missing or insufficient: ${missingItems.join(', ')}`);
      return;
    }

    // Get ingredients that will be depleted
    const depletedIngredients: Array<{ name: string; quantity?: number; unit?: string }> = [];
    
    recipe.requiredIngredients.forEach((requiredIng) => {
      const kitchenIng = kitchen.ingredients.find(
        (ing) => ing.name.toLowerCase() === requiredIng.name.toLowerCase()
      );
      if (kitchenIng && kitchenIng.quantity <= requiredIng.quantity) {
        depletedIngredients.push({
          name: kitchenIng.name,
          quantity: requiredIng.quantity,
          unit: requiredIng.unit,
        });
      }
    });

    // Apply recipe to kitchen
    const updatedKitchen = applyRecipeToKitchen(recipe, kitchen);

    // Prepare shopping list items to be added (if any)
    const newListItems: ListItem[] = [];
    if (depletedIngredients.length > 0) {
      depletedIngredients.forEach((ing) => {
        // Check if already in shopping list
        const exists = shoppingList.some(
          (item) => item.name.toLowerCase() === ing.name.toLowerCase()
        );
        if (!exists) {
          newListItems.push({
            id: Date.now().toString() + Math.random(),
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            sourceRecipe: recipe.name,
          });
        }
      });
    }

    // Call onCookRecipe callback (handles state updates and undo tracking)
    onCookRecipe(updatedKitchen, newListItems);

    // Navigate to kitchen page
    navigate('/kitchen');
    setShowConfirmation(false);
  };

  const handleCancelCook = () => {
    setShowConfirmation(false);
  };

  const handleAddToList = (ingredientName: string, quantity?: number, unit?: string) => {
    // Check if item with same name already exists
    const exists = shoppingList.some(
      (item) => item.name.toLowerCase() === ingredientName.toLowerCase()
    );
    
    if (exists) {
      alert(`${ingredientName} is already in your shopping list.`);
      return;
    }

    const newItem: ListItem = {
      id: Date.now().toString(),
      name: ingredientName,
      quantity,
      unit,
      sourceRecipe: recipe.name,
    };

    setShoppingList((prev) => [...prev, newItem]);
    alert(`${ingredientName} added to shopping list!`);
  };

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
        {canMakeNow && !showConfirmation && (
          <button onClick={handleShowConfirmation} className="recipe-detail-cook-button">
            Cook This Recipe
          </button>
        )}
      </div>

      {showConfirmation && (
        <div className="recipe-detail-confirmation">
          <h2>Confirm Recipe Cooking</h2>
          <p>This will update your kitchen inventory:</p>
          
          {(() => {
            const { reduced, depleted } = getInventoryPreview();
            return (
              <>
                {reduced.length > 0 && (
                  <div className="recipe-detail-preview-section">
                    <h3>Ingredients to be Reduced:</h3>
                    <ul>
                      {reduced.map((item, idx) => (
                        <li key={idx}>
                          {item.name}: {item.current} {item.unit} → {item.after} {item.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {depleted.length > 0 && (
                  <div className="recipe-detail-preview-section">
                    <h3>Ingredients to be Depleted (will be removed):</h3>
                    <ul>
                      {depleted.map((item, idx) => (
                        <li key={idx}>
                          {item.name}: {item.quantity} {item.unit} (will be removed)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            );
          })()}

          <div className="recipe-detail-confirmation-buttons">
            <button onClick={handleConfirmCook} className="recipe-detail-confirm-button">
              Confirm Cook
            </button>
            <button onClick={handleCancelCook} className="recipe-detail-cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}

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
                <span>
                  {isMissing && <strong>[Missing] </strong>}
                  {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                </span>
                {isMissing && (
                  <button
                    onClick={() => handleAddToList(ingredient.name, ingredient.quantity, ingredient.unit)}
                    className="recipe-detail-add-to-list"
                  >
                    Add to List
                  </button>
                )}
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
