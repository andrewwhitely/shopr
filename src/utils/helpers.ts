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

// Color coding for categories
const categoryColors = [
  { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
  { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
  { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
  {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-200' },
];

export const getCategoryColor = (
  category: string
): { bg: string; text: string; border: string } => {
  if (!category)
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
    };

  // Create a simple hash from the category name to get consistent colors
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    const char = category.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get a valid index
  const index = Math.abs(hash) % categoryColors.length;
  return categoryColors[index];
};

export const calculatePurchasedValue = (items: WishlistItem[]): number => {
  return items
    .filter((item) => item.purchased)
    .reduce((total, item) => total + item.price, 0);
};
