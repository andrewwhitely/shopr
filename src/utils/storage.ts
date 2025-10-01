import { WishlistItem } from '../types';

const STORAGE_KEY = 'shopr-wishlist';

export const loadWishlist = (): WishlistItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading wishlist from storage:', error);
    return [];
  }
};

export const saveWishlist = (items: WishlistItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving wishlist to storage:', error);
  }
};

export const addWishlistItem = (item: WishlistItem): void => {
  const items = loadWishlist();
  items.push(item);
  saveWishlist(items);
};

export const updateWishlistItem = (
  id: string,
  updates: Partial<WishlistItem>
): void => {
  const items = loadWishlist();
  const index = items.findIndex((item) => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    saveWishlist(items);
  }
};

export const deleteWishlistItem = (id: string): void => {
  const items = loadWishlist();
  const filteredItems = items.filter((item) => item.id !== id);
  saveWishlist(filteredItems);
};

export const addPriceEntry = (itemId: string, price: number): void => {
  const items = loadWishlist();
  const item = items.find((i) => i.id === itemId);
  if (item) {
    const priceEntry = {
      price,
      date: new Date().toISOString(),
    };
    item.priceHistory.push(priceEntry);
    item.price = price; // Update current price
    saveWishlist(items);
  }
};
