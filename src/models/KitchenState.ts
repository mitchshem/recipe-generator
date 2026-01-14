import type { Ingredient } from './Ingredient';
import type { Appliance } from './Appliance';

export interface KitchenState {
  ingredients: Ingredient[];
  appliances: Appliance[];
}
