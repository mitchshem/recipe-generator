import type { KitchenState } from '../models/KitchenState';

export const mockKitchen: KitchenState = {
  ingredients: [
    { id: '1', name: 'Eggs', quantity: 6, unit: 'pieces', category: 'Dairy & Eggs', storageLocation: 'fridge' },
    { id: '2', name: 'Flour', quantity: 500, unit: 'g', category: 'Pantry Staples', storageLocation: 'pantry' },
    { id: '3', name: 'Butter', quantity: 200, unit: 'g', category: 'Dairy & Eggs', storageLocation: 'fridge' },
    { id: '4', name: 'Sugar', quantity: 300, unit: 'g', category: 'Pantry Staples', storageLocation: 'pantry' },
  ],
  appliances: [
    { id: '1', name: 'Oven', type: 'cooking' },
    { id: '2', name: 'Mixer', type: 'preparation' },
  ],
};
