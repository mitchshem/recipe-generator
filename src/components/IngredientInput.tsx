import { useState } from 'react';
import type { Ingredient, IngredientCategory, StorageLocation } from '../models/Ingredient';

interface IngredientInputProps {
  onAdd: (ingredient: Omit<Ingredient, 'id'>) => void;
  storageLocation: StorageLocation;
}

const CATEGORIES: IngredientCategory[] = [
  'Produce',
  'Meat & Seafood',
  'Dairy & Eggs',
  'Bakery',
  'Pantry Staples',
  'Spices & Seasonings',
  'Sauces & Condiments',
  'Snacks',
  'Frozen Foods',
  'Beverages',
  'Other',
];

export const IngredientInput = ({ onAdd, storageLocation }: IngredientInputProps) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState<IngredientCategory>('Other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && quantity && unit) {
      onAdd({
        name,
        quantity: parseFloat(quantity),
        unit,
        category,
        storageLocation,
      });
      setName('');
      setQuantity('');
      setUnit('');
      setCategory('Other');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ingredient-input">
      <input
        type="text"
        placeholder="Ingredient name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        step="0.01"
        required
      />
      <input
        type="text"
        placeholder="Unit (e.g., g, ml, pieces)"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as IngredientCategory)}
        required
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <button type="submit">Add Ingredient</button>
    </form>
  );
};
