export type IngredientCategory =
  | 'Produce'
  | 'Meat & Seafood'
  | 'Dairy & Eggs'
  | 'Bakery'
  | 'Pantry Staples'
  | 'Spices & Seasonings'
  | 'Sauces & Condiments'
  | 'Snacks'
  | 'Frozen Foods'
  | 'Beverages'
  | 'Other';

export type StorageLocation = 'fridge' | 'freezer' | 'pantry';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
  storageLocation: StorageLocation;
  expirationDate?: string; // ISO date format (optional)
}

// Recipe ingredients don't need storageLocation
export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
}
