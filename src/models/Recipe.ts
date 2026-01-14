import type { Ingredient } from './Ingredient';
import type { Appliance } from './Appliance';

export interface Recipe {
  id: string;
  name: string;
  requiredIngredients: Ingredient[];
  optionalIngredients: Ingredient[];
  requiredAppliances: Appliance[];
  steps: string[];
}
