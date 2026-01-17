import { useMemo } from 'react';
import type { ListItem } from '../models/ListItem';

interface ListsProps {
  shoppingList: ListItem[];
  setShoppingList: React.Dispatch<React.SetStateAction<ListItem[]>>;
}

export const Lists = ({ shoppingList, setShoppingList }: ListsProps) => {
  const handleRemoveItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearList = () => {
    if (window.confirm('Are you sure you want to clear the entire list?')) {
      setShoppingList([]);
    }
  };

  // Group items by sourceRecipe
  const groupedItems = useMemo(() => {
    const grouped = new Map<string, ListItem[]>();
    shoppingList.forEach((item) => {
      const recipe = item.sourceRecipe;
      if (!grouped.has(recipe)) {
        grouped.set(recipe, []);
      }
      grouped.get(recipe)!.push(item);
    });
    return grouped;
  }, [shoppingList]);

  return (
    <div className="lists-page">
      <div className="lists-header">
        <h1>Shopping List</h1>
        {shoppingList.length > 0 && (
          <button onClick={handleClearList} className="lists-clear-button">
            Clear All
          </button>
        )}
      </div>

      {shoppingList.length === 0 ? (
        <p>Your shopping list is empty. Add missing ingredients from recipe pages.</p>
      ) : (
        <div className="lists-groups">
          {Array.from(groupedItems.entries()).map(([recipeName, items]) => (
            <section key={recipeName} className="lists-group">
              <h2>{recipeName}</h2>
              <ul className="lists-items">
                {items.map((item) => (
                  <li key={item.id} className="lists-item">
                    <span className="lists-item-name">{item.name}</span>
                    {item.quantity !== undefined && item.unit && (
                      <span className="lists-item-quantity">
                        {item.quantity} {item.unit}
                      </span>
                    )}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="lists-item-remove"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
