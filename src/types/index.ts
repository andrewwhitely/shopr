export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  dateAdded: string; // ISO date string
  purchased: boolean;
  datePurchased?: string; // ISO date string
  priceHistory: PriceEntry[];
  notes?: string;
  category?: string;
  url?: string;
}

export interface PriceEntry {
  price: number;
  date: string; // ISO date string
}

export interface WishlistFilters {
  purchased?: boolean;
  category?: string;
  sortBy: 'dateAdded' | 'price' | 'name';
  sortOrder: 'asc' | 'desc';
}

export type NewWishlistItem = Omit<
  WishlistItem,
  'id' | 'dateAdded' | 'priceHistory'
> & {
  priceHistory?: PriceEntry[];
};
