import { DollarSign, ShoppingBag, Tag, TrendingUp } from 'lucide-react';
import React from 'react';
import { WishlistItem } from '../types';
import {
  calculatePurchasedValue,
  calculateTotalValue,
  formatCurrency,
  getCategories,
} from '../utils/helpers';

interface StatsCardProps {
  items: WishlistItem[];
}

export const StatsCard: React.FC<StatsCardProps> = ({ items }) => {
  const totalValue = calculateTotalValue(items);
  const purchasedValue = calculatePurchasedValue(items);
  const remainingValue = totalValue - purchasedValue;
  const categories = getCategories(items);

  const purchasedCount = items.filter((item) => item.purchased).length;
  const remainingCount = items.length - purchasedCount;

  return (
    <div className='grid grid-cols-2 gap-3 mb-6'>
      <div className='card text-center p-3'>
        <div className='flex items-center justify-center mb-2'>
          <DollarSign className='w-5 h-5 text-green-600 mr-1' />
          <span className='text-sm font-medium text-gray-600'>Total Value</span>
        </div>
        <div className='text-sm font-semibold text-gray-900 break-words overflow-hidden'>
          {formatCurrency(totalValue)}
        </div>
      </div>

      <div className='card text-center p-3'>
        <div className='flex items-center justify-center mb-2'>
          <ShoppingBag className='w-5 h-5 text-blue-600 mr-1' />
          <span className='text-sm font-medium text-gray-600'>Remaining</span>
        </div>
        <div className='text-sm font-semibold text-gray-900 break-words overflow-hidden'>
          {formatCurrency(remainingValue)}
        </div>
        <div className='text-xs text-gray-500'>{remainingCount} items</div>
      </div>

      <div className='card text-center p-3'>
        <div className='flex items-center justify-center mb-2'>
          <TrendingUp className='w-5 h-5 text-purple-600 mr-1' />
          <span className='text-sm font-medium text-gray-600'>Purchased</span>
        </div>
        <div className='text-sm font-semibold text-gray-900 break-words overflow-hidden'>
          {formatCurrency(purchasedValue)}
        </div>
        <div className='text-xs text-gray-500'>{purchasedCount} items</div>
      </div>

      <div className='card text-center p-3'>
        <div className='flex items-center justify-center mb-2'>
          <Tag className='w-5 h-5 text-orange-600 mr-1' />
          <span className='text-sm font-medium text-gray-600'>Categories</span>
        </div>
        <div className='text-lg font-semibold text-gray-900'>
          {categories.length}
        </div>
      </div>
    </div>
  );
};
