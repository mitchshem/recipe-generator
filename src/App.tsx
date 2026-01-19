import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import type { KitchenState } from './models/KitchenState';
import type { Recipe } from './models/Recipe';
import type { ListItem } from './models/ListItem';
import { Home } from './pages/Home';
import { Kitchen } from './pages/Kitchen';
import { Recipes } from './pages/Recipes';
import { RecipeDetail } from './pages/RecipeDetail';
import { Lists } from './pages/Lists';
import { loadKitchenState, saveKitchenState, loadShoppingList, saveShoppingList } from './utils/storage';
import { mockKitchen } from './data/mockKitchen';
import recipesData from './data/recipes.json';
import './App.css';

function App() {
  const [kitchen, setKitchen] = useState<KitchenState>(mockKitchen);
  const [recipes] = useState<Recipe[]>(recipesData as Recipe[]);
  const [shoppingList, setShoppingList] = useState<ListItem[]>([]);
  const [previousKitchen, setPreviousKitchen] = useState<KitchenState | null>(null);
  const [lastAddedShoppingItems, setLastAddedShoppingItems] = useState<ListItem[]>([]);
  const [canUndo, setCanUndo] = useState<boolean>(false);

  // Load kitchen state from localStorage on mount
  useEffect(() => {
    const saved = loadKitchenState();
    if (saved) {
      setKitchen(saved);
    }
  }, []);

  // Save kitchen state to localStorage whenever it changes
  useEffect(() => {
    saveKitchenState(kitchen);
  }, [kitchen]);

  // Load shopping list from localStorage on mount
  useEffect(() => {
    const saved = loadShoppingList();
    setShoppingList(saved);
  }, []);

  // Save shopping list to localStorage whenever it changes
  useEffect(() => {
    saveShoppingList(shoppingList);
  }, [shoppingList]);

  const handleKitchenChange = (newKitchen: KitchenState) => {
    setKitchen(newKitchen);
    // Clear undo state when kitchen changes manually (not from cooking)
    if (canUndo) {
      setCanUndo(false);
      setPreviousKitchen(null);
      setLastAddedShoppingItems([]);
    }
  };

  const handleCookRecipe = (updatedKitchen: KitchenState, addedShoppingListItems: ListItem[]) => {
    // Save current kitchen as previousKitchen BEFORE applying update
    setPreviousKitchen(kitchen);
    
    // Store added shopping list items for undo
    setLastAddedShoppingItems(addedShoppingListItems);
    
    // Apply updatedKitchen
    setKitchen(updatedKitchen);
    
    // Append addedShoppingListItems to shoppingList
    if (addedShoppingListItems.length > 0) {
      setShoppingList((prev) => [...prev, ...addedShoppingListItems]);
    }
    
    // Set canUndo = true
    setCanUndo(true);
  };

  const undoLastCook = () => {
    if (!canUndo || previousKitchen === null) {
      return;
    }

    // Restore previousKitchen
    setKitchen(previousKitchen);

    // Remove lastAddedShoppingItems from shoppingList
    if (lastAddedShoppingItems.length > 0) {
      const addedIds = new Set(lastAddedShoppingItems.map((item) => item.id));
      setShoppingList((prev) => prev.filter((item) => !addedIds.has(item.id)));
    }

    // Reset undo state
    setCanUndo(false);
    setPreviousKitchen(null);
    setLastAddedShoppingItems([]);
  };

  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/kitchen">Kitchen</Link>
          <Link to="/recipes">Recipes</Link>
          <Link to="/lists">Lists</Link>
          {canUndo && (
            <button onClick={undoLastCook} className="nav-undo-button">
              Undo last cook
            </button>
          )}
        </nav>
        <main className="main">
          <Routes>
            <Route
              path="/"
              element={<Home recipes={recipes} kitchen={kitchen} />}
            />
            <Route
              path="/kitchen"
              element={
                <Kitchen
                  kitchen={kitchen}
                  onKitchenChange={handleKitchenChange}
                  shoppingList={shoppingList}
                  setShoppingList={setShoppingList}
                />
              }
            />
            <Route
              path="/recipes"
              element={<Recipes recipes={recipes} kitchen={kitchen} />}
            />
            <Route
              path="/recipes/:id"
              element={<RecipeDetail recipes={recipes} kitchen={kitchen} onCookRecipe={handleCookRecipe} shoppingList={shoppingList} setShoppingList={setShoppingList} />}
            />
            <Route path="/lists" element={<Lists shoppingList={shoppingList} setShoppingList={setShoppingList} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
