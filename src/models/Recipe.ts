import type { RecipeIngredient } from './Ingredient';
import type { Appliance } from './Appliance';

export interface Recipe {
  id: string;
  name: string;
  requiredIngredients: RecipeIngredient[];
  optionalIngredients: RecipeIngredient[];
  requiredAppliances: Appliance[];
  steps: string[];
}
