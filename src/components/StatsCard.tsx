import { FC } from 'react';
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

export const StatsCard: FC<StatsCardProps> = ({ items }) => {
  const totalValue = calculateTotalValue(items);
  const purchasedValue = calculatePurchasedValue(items);
  const remainingValue = totalValue - purchasedValue;
  const categories = getCategories(items);

  const purchasedCount = items.filter((item) => item.purchased).length;
  const remainingCount = items.length - purchasedCount;

  return (
    <div>
      {/* Mobile: 2×2 grid */}
      <div className='grid grid-cols-2 gap-3 sm:hidden'>
        <div className='bg-white rounded-xl border border-warm-stone-200 p-4'>
          <div className='font-mono text-base font-medium text-espresso truncate'>
            {formatCurrency(totalValue)}
          </div>
          <div className='text-xs font-body text-warm-stone-500 mt-1 uppercase tracking-wider'>
            Total
          </div>
        </div>
        <div className='bg-white rounded-xl border border-warm-stone-200 p-4'>
          <div className='font-mono text-base font-medium text-espresso truncate'>
            {formatCurrency(remainingValue)}
          </div>
          <div className='text-xs font-body text-warm-stone-500 mt-1 uppercase tracking-wider'>
            Remaining · {remainingCount}
          </div>
        </div>
        <div className='bg-white rounded-xl border border-warm-stone-200 p-4'>
          <div className='font-mono text-base font-medium text-green-700 truncate'>
            {formatCurrency(purchasedValue)}
          </div>
          <div className='text-xs font-body text-warm-stone-500 mt-1 uppercase tracking-wider'>
            Purchased · {purchasedCount}
          </div>
        </div>
        <div className='bg-white rounded-xl border border-warm-stone-200 p-4'>
          <div className='font-mono text-base font-medium text-espresso'>
            {categories.length}
          </div>
          <div className='text-xs font-body text-warm-stone-500 mt-1 uppercase tracking-wider'>
            Categories
          </div>
        </div>
      </div>

      {/* Desktop: vertical list */}
      <div className='hidden sm:block'>
        <h3 className='text-xs font-body font-semibold text-warm-stone-400 uppercase tracking-widest mb-4'>
          Overview
        </h3>
        <div className='space-y-3'>
          <div className='flex items-baseline justify-between'>
            <span className='text-sm font-body text-warm-stone-600'>Total</span>
            <span className='font-mono text-sm font-medium text-espresso'>
              {formatCurrency(totalValue)}
            </span>
          </div>
          <div className='flex items-baseline justify-between'>
            <span className='text-sm font-body text-warm-stone-600'>
              Remaining
            </span>
            <div className='text-right'>
              <span className='font-mono text-sm font-medium text-espresso'>
                {formatCurrency(remainingValue)}
              </span>
              <span className='text-xs text-warm-stone-400 ml-1'>
                ({remainingCount})
              </span>
            </div>
          </div>
          <div className='flex items-baseline justify-between'>
            <span className='text-sm font-body text-warm-stone-600'>
              Purchased
            </span>
            <div className='text-right'>
              <span className='font-mono text-sm font-medium text-green-700'>
                {formatCurrency(purchasedValue)}
              </span>
              <span className='text-xs text-warm-stone-400 ml-1'>
                ({purchasedCount})
              </span>
            </div>
          </div>
          <div className='h-px bg-warm-stone-100' />
          <div className='flex items-baseline justify-between'>
            <span className='text-sm font-body text-warm-stone-600'>
              Categories
            </span>
            <span className='font-mono text-sm font-medium text-espresso'>
              {categories.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
