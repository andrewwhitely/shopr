import { format, parseISO } from 'date-fns';
import { WishlistFilters, WishlistItem } from '../types';

export const formatCurrency = (
  amount: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
};

export const formatDateShort = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd');
  } catch {
    return 'Invalid date';
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const filterAndSortItems = (
  items: WishlistItem[],
  filters: WishlistFilters
): WishlistItem[] => {
  let filtered = [...items];

  // Apply filters
  if (filters.purchased !== undefined) {
    filtered = filtered.filter((item) => item.purchased === filters.purchased);
  }

  if (filters.category) {
    filtered = filtered.filter((item) => item.category === filters.category);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case 'dateAdded':
        comparison =
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
    }

    return filters.sortOrder === 'desc' ? -comparison : comparison;
  });

  return filtered;
};

export const getCategories = (items: WishlistItem[]): string[] => {
  const categories = new Set(
    items
      .map((item) => item.category)
      .filter((cat): cat is string => typeof cat === 'string' && cat.length > 0)
  );
  return Array.from(categories).sort();
};

export const calculateTotalValue = (items: WishlistItem[]): number => {
  return items.reduce((total, item) => total + item.price, 0);
};

export const calculatePurchasedValue = (items: WishlistItem[]): number => {
  return items
    .filter((item) => item.purchased)
    .reduce((total, item) => total + item.price, 0);
};
