import { useState } from 'react';
import type { KitchenState } from '../models/KitchenState';
import type { Ingredient } from '../models/Ingredient';
import type { Appliance } from '../models/Appliance';
import { IngredientInput } from '../components/IngredientInput';
import { ApplianceSelector } from '../components/ApplianceSelector';

interface KitchenProps {
  kitchen: KitchenState;
  onKitchenChange: (kitchen: KitchenState) => void;
}

export const Kitchen = ({ kitchen, onKitchenChange }: KitchenProps) => {
  const [applianceName, setApplianceName] = useState('');
  const [applianceType, setApplianceType] = useState('');

  const handleAddIngredient = (ingredientData: Omit<Ingredient, 'id'>) => {
    const newIngredient: Ingredient = {
      ...ingredientData,
      id: Date.now().toString(),
    };
    onKitchenChange({
      ...kitchen,
      ingredients: [...kitchen.ingredients, newIngredient],
    });
  };

  const handleRemoveIngredient = (id: string) => {
    onKitchenChange({
      ...kitchen,
      ingredients: kitchen.ingredients.filter((ing) => ing.id !== id),
    });
  };

  const handleAddAppliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (applianceName && applianceType) {
      const newAppliance: Appliance = {
        id: Date.now().toString(),
        name: applianceName,
        type: applianceType,
      };
      onKitchenChange({
        ...kitchen,
        appliances: [...kitchen.appliances, newAppliance],
      });
      setApplianceName('');
      setApplianceType('');
    }
  };

  const handleToggleAppliance = (id: string) => {
    // For now, toggle means remove (since we don't have "off" state yet)
    onKitchenChange({
      ...kitchen,
      appliances: kitchen.appliances.filter((app) => app.id !== id),
    });
  };

  return (
    <div className="kitchen-page">
      <h1>My Kitchen</h1>
      
      <section>
        <h2>Ingredients</h2>
        <IngredientInput onAdd={handleAddIngredient} />
        {kitchen.ingredients.length === 0 ? (
          <p>No ingredients added yet</p>
        ) : (
          <ul>
            {kitchen.ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.name} - {ingredient.quantity} {ingredient.unit} (
                {ingredient.category})
                <button onClick={() => handleRemoveIngredient(ingredient.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Appliances</h2>
        <form onSubmit={handleAddAppliance} className="appliance-input">
          <input
            type="text"
            placeholder="Appliance name"
            value={applianceName}
            onChange={(e) => setApplianceName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Type (e.g., cooking, preparation)"
            value={applianceType}
            onChange={(e) => setApplianceType(e.target.value)}
            required
          />
          <button type="submit">Add Appliance</button>
        </form>
        <ApplianceSelector
          appliances={kitchen.appliances}
          onToggle={handleToggleAppliance}
        />
      </section>
    </div>
  );
};
