import { useEffect, useState } from 'react';
import { NewWishlistItem, WishlistFilters, WishlistItem } from '../types';
import { apiClient } from '../utils/api';
import { filterAndSortItems } from '../utils/helpers';
import { useAuth } from './useAuth';

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [filters, setFilters] = useState<WishlistFilters>({
    sortBy: 'dateAdded',
    sortOrder: 'desc',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, getToken } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadItems();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const updateToken = async () => {
      if (isAuthenticated) {
        const token = await getToken();
        apiClient.setAuthToken(token);
      } else {
        apiClient.setAuthToken(null);
      }
    };
    updateToken();
  }, [isAuthenticated, getToken]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      // Ensure the API client has a fresh auth token before making requests
      if (isAuthenticated) {
        const token = await getToken();
        apiClient.setAuthToken(token);
        if (!token) {
          throw new Error('Unauthorized');
        }
      } else {
        apiClient.setAuthToken(null);
        throw new Error('Unauthorized');
      }
      const items = await apiClient.getWishlistItems();
      setItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (newItem: NewWishlistItem) => {
    try {
      setError(null);
      const item = await apiClient.addWishlistItem(newItem);
      setItems((prev) => [...prev, item]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
      throw err; // Re-throw so the UI can handle it
    }
  };

  const updateItem = async (id: string, updates: Partial<WishlistItem>) => {
    try {
      setError(null);
      const updatedItem = await apiClient.updateWishlistItem(id, updates);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err; // Re-throw so the UI can handle it
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setError(null);
      await apiClient.deleteWishlistItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      throw err; // Re-throw so the UI can handle it
    }
  };

  const togglePurchased = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      const updates: Partial<WishlistItem> = {
        purchased: !item.purchased,
      };

      if (!item.purchased) {
        updates.datePurchased = new Date().toISOString();
      } else {
        updates.datePurchased = undefined;
      }

      await updateItem(id, updates);
    }
  };

  const updatePrice = async (id: string, newPrice: number) => {
    try {
      setError(null);
      const updatedItem = await apiClient.addPriceEntry(id, newPrice);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update price');
      throw err; // Re-throw so the UI can handle it
    }
  };

  const filteredItems = filterAndSortItems(items, filters);

  return {
    items,
    filteredItems,
    filters,
    setFilters,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    togglePurchased,
    updatePrice,
    refreshItems: loadItems,
  };
};
