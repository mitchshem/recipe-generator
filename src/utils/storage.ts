import type { KitchenState } from '../models/KitchenState';

const STORAGE_KEY = 'recipe-generator-kitchen-state';

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
