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
  };

  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/kitchen">Kitchen</Link>
          <Link to="/recipes">Recipes</Link>
          <Link to="/lists">Lists</Link>
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
                <Kitchen kitchen={kitchen} onKitchenChange={handleKitchenChange} />
              }
            />
            <Route
              path="/recipes"
              element={<Recipes recipes={recipes} kitchen={kitchen} />}
            />
            <Route
              path="/recipes/:id"
              element={<RecipeDetail recipes={recipes} kitchen={kitchen} shoppingList={shoppingList} setShoppingList={setShoppingList} />}
            />
            <Route path="/lists" element={<Lists shoppingList={shoppingList} setShoppingList={setShoppingList} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
