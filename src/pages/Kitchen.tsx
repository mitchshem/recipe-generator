import { useState, useMemo } from 'react';
import type { KitchenState } from '../models/KitchenState';
import type { Ingredient, IngredientCategory, StorageLocation } from '../models/Ingredient';
import type { Appliance } from '../models/Appliance';
import { IngredientInput } from '../components/IngredientInput';
import { getItemImageUrl } from '../utils/imageHelper';

interface KitchenProps {
  kitchen: KitchenState;
  onKitchenChange: (kitchen: KitchenState) => void;
}

type Tab = 'fridge' | 'freezer' | 'pantry' | 'appliances';
type SortOption = 'name' | 'quantity';

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

export const Kitchen = ({ kitchen, onKitchenChange }: KitchenProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('fridge');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('name');
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
    onKitchenChange({
      ...kitchen,
      appliances: kitchen.appliances.filter((app) => app.id !== id),
    });
  };

  // Filter and sort ingredients for active tab
  const filteredAndSortedIngredients = useMemo(() => {
    if (activeTab === 'appliances') return [];

    let filtered = kitchen.ingredients.filter(
      (ing) => ing.storageLocation === activeTab
    );

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((ing) => ing.name.toLowerCase().includes(query));
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((ing) => ing.category === selectedCategory);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return b.quantity - a.quantity;
      }
    });

    return sorted;
  }, [kitchen.ingredients, activeTab, searchQuery, selectedCategory, sortBy]);

  const currentStorageLocation: StorageLocation =
    activeTab === 'fridge' ? 'fridge' : activeTab === 'freezer' ? 'freezer' : 'pantry';

  return (
    <div className="kitchen-page">
      <h1>My Kitchen</h1>

      {/* Tabs */}
      <div className="kitchen-tabs">
        <button
          className={activeTab === 'fridge' ? 'active' : ''}
          onClick={() => setActiveTab('fridge')}
        >
          Refrigerator
        </button>
        <button
          className={activeTab === 'freezer' ? 'active' : ''}
          onClick={() => setActiveTab('freezer')}
        >
          Freezer
        </button>
        <button
          className={activeTab === 'pantry' ? 'active' : ''}
          onClick={() => setActiveTab('pantry')}
        >
          Pantry
        </button>
        <button
          className={activeTab === 'appliances' ? 'active' : ''}
          onClick={() => setActiveTab('appliances')}
        >
          Appliances
        </button>
      </div>

      {activeTab !== 'appliances' ? (
        <>
          {/* Add Ingredient Form */}
          <section className="kitchen-add-section">
            <h2>Add Ingredient</h2>
            <IngredientInput onAdd={handleAddIngredient} storageLocation={currentStorageLocation} />
          </section>

          {/* Filters and Sort */}
          <section className="kitchen-filters">
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="kitchen-search"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as IngredientCategory | 'All')}
              className="kitchen-category-filter"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="kitchen-sort"
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="quantity">Sort: Quantity (High → Low)</option>
            </select>
          </section>

          {/* Ingredients List */}
          <section className="kitchen-items">
            {filteredAndSortedIngredients.length === 0 ? (
              <p>No ingredients in {activeTab === 'fridge' ? 'refrigerator' : activeTab === 'freezer' ? 'freezer' : 'pantry'}</p>
            ) : (
              <div className="kitchen-items-grid">
                {filteredAndSortedIngredients.map((ingredient) => (
                  <div key={ingredient.id} className="kitchen-item-card">
                    <img
                      src={getItemImageUrl(ingredient.name)}
                      alt={ingredient.name}
                      className="kitchen-item-image"
                    />
                    <div className="kitchen-item-info">
                      <h3>{ingredient.name}</h3>
                      <p>
                        {ingredient.quantity} {ingredient.unit}
                      </p>
                      <p className="kitchen-item-category">{ingredient.category}</p>
                      <button
                        onClick={() => handleRemoveIngredient(ingredient.id)}
                        className="kitchen-item-remove"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          {/* Add Appliance Form */}
          <section className="kitchen-add-section">
            <h2>Add Appliance</h2>
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
          </section>

          {/* Appliances List */}
          <section className="kitchen-items">
            {kitchen.appliances.length === 0 ? (
              <p>No appliances added yet</p>
            ) : (
              <div className="kitchen-items-grid">
                {kitchen.appliances.map((appliance) => (
                  <div key={appliance.id} className="kitchen-item-card">
                    <img
                      src={getItemImageUrl(appliance.name)}
                      alt={appliance.name}
                      className="kitchen-item-image"
                    />
                    <div className="kitchen-item-info">
                      <h3>{appliance.name}</h3>
                      <p className="kitchen-item-category">{appliance.type}</p>
                      <button
                        onClick={() => handleToggleAppliance(appliance.id)}
                        className="kitchen-item-remove"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};
