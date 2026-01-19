import type { KitchenState } from '../models/KitchenState';

export const mockKitchen: KitchenState = {
  ingredients: [
    // Perishable items with expiration dates
    { 
      id: '1', 
      name: 'Eggs', 
      quantity: 6, 
      unit: 'pieces', 
      category: 'Dairy & Eggs', 
      storageLocation: 'fridge',
      expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    },
    { 
      id: '3', 
      name: 'Butter', 
      quantity: 200, 
      unit: 'g', 
      category: 'Dairy & Eggs', 
      storageLocation: 'fridge',
      expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
    },
    // Non-perishable items without expiration dates
    { id: '2', name: 'Flour', quantity: 500, unit: 'g', category: 'Pantry Staples', storageLocation: 'pantry' },
    { id: '4', name: 'Sugar', quantity: 300, unit: 'g', category: 'Pantry Staples', storageLocation: 'pantry' },
  ],
  appliances: [
    { id: '1', name: 'Oven', type: 'cooking' },
    { id: '2', name: 'Mixer', type: 'preparation' },
  ],
};
