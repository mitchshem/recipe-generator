import type { KitchenState } from '../models/KitchenState';
import type { ListItem } from '../models/ListItem';

const STORAGE_KEY = 'recipe-generator-kitchen-state';
const LIST_STORAGE_KEY = 'recipe-generator-shopping-list';

/**
 * Save kitchen state to localStorage
 */
export const saveKitchenState = (state: KitchenState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save kitchen state:', error);
  }
};

/**
 * Load kitchen state from localStorage
 * Returns null if no state is found or if parsing fails
 */
export const loadKitchenState = (): KitchenState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as KitchenState;
  } catch (error) {
    console.error('Failed to load kitchen state:', error);
    return null;
  }
};

/**
 * Save shopping list to localStorage
 */
export const saveShoppingList = (list: ListItem[]): void => {
  try {
    localStorage.setItem(LIST_STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error('Failed to save shopping list:', error);
  }
};

/**
 * Load shopping list from localStorage
 * Returns empty array if no list is found or if parsing fails
 */
export const loadShoppingList = (): ListItem[] => {
  try {
    const stored = localStorage.getItem(LIST_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as ListItem[];
  } catch (error) {
    console.error('Failed to load shopping list:', error);
    return [];
  }
};
