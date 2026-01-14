import { useState } from 'react';
import type { Ingredient } from '../models/Ingredient';

interface IngredientInputProps {
  onAdd: (ingredient: Omit<Ingredient, 'id'>) => void;
}

export const IngredientInput = ({ onAdd }: IngredientInputProps) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && quantity && unit && category) {
      onAdd({
        name,
        quantity: parseFloat(quantity),
        unit,
        category,
      });
      setName('');
      setQuantity('');
      setUnit('');
      setCategory('');
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
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <button type="submit">Add Ingredient</button>
    </form>
  );
};
