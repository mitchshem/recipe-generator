import type { Recipe } from '../models/Recipe';
import type { KitchenState } from '../models/KitchenState';
import type { Ingredient } from '../models/Ingredient';

/**
 * Apply recipe ingredient deductions to kitchen state
 * Returns updated kitchen state with quantities deducted
 * Ingredients with quantity <= 0 are removed
 */
export const applyRecipeToKitchen = (
  recipe: Recipe,
  kitchen: KitchenState
): KitchenState => {
  const updatedIngredients: Ingredient[] = [...kitchen.ingredients];

  // Process each required ingredient
  recipe.requiredIngredients.forEach((requiredIng) => {
    // Find matching ingredient in kitchen (case-insensitive)
    const kitchenIndex = updatedIngredients.findIndex(
      (kitchenIng) => kitchenIng.name.toLowerCase() === requiredIng.name.toLowerCase()
    );

    if (kitchenIndex === -1) {
      // Ingredient not found - should not happen if feasibility check passed
      return;
    }

    const kitchenIng = updatedIngredients[kitchenIndex];
    const newQuantity = kitchenIng.quantity - requiredIng.quantity;

    if (newQuantity <= 0) {
      // Remove ingredient if depleted
      updatedIngredients.splice(kitchenIndex, 1);
    } else {
      // Update quantity
      updatedIngredients[kitchenIndex] = {
        ...kitchenIng,
        quantity: newQuantity,
      };
    }
  });

  return {
    ...kitchen,
    ingredients: updatedIngredients,
    appliances: [...kitchen.appliances], // Appliances unchanged
  };
};

/**
 * Check if all required ingredients are available in sufficient quantities
 */
export const canCookRecipe = (
  recipe: Recipe,
  kitchen: KitchenState
): { canCook: boolean; missingItems: string[] } => {
  const missingItems: string[] = [];

  recipe.requiredIngredients.forEach((requiredIng) => {
    const kitchenIng = kitchen.ingredients.find(
      (ing) => ing.name.toLowerCase() === requiredIng.name.toLowerCase()
    );

    if (!kitchenIng) {
      missingItems.push(requiredIng.name);
      return;
    }

    if (kitchenIng.quantity < requiredIng.quantity) {
      missingItems.push(`${requiredIng.name} (need ${requiredIng.quantity}, have ${kitchenIng.quantity})`);
    }
  });

  return {
    canCook: missingItems.length === 0,
    missingItems,
  };
};
