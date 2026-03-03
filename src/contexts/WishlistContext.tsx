import { createContext, useContext } from 'react';

export interface WishlistStats {
  itemCount: number;
  totalValue: number;
}

export const WishlistContext = createContext<WishlistStats>({
  itemCount: 0,
  totalValue: 0,
});

export const useWishlistStats = () => useContext(WishlistContext);
