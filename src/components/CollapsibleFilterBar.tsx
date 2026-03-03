import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { FC, useState } from 'react';
import { WishlistFilters } from '../types';
import { FilterBar } from './FilterBar';

interface CollapsibleFilterBarProps {
  filters: WishlistFilters;
  onFiltersChange: (filters: WishlistFilters) => void;
  categories: string[];
}

export const CollapsibleFilterBar: FC<CollapsibleFilterBarProps> = ({
  filters,
  onFiltersChange,
  categories,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.purchased !== undefined || filters.category !== undefined;

  return (
    <div className='bg-white rounded-xl border border-warm-stone-200 overflow-hidden'>
      {/* Toggle header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex items-center justify-between w-full px-4 py-3 hover:bg-warm-stone-50 transition-colors'
      >
        <div className='flex items-center gap-2'>
          <SlidersHorizontal className='w-4 h-4 text-warm-stone-500' />
          <span className='text-sm font-body font-medium text-espresso'>
            Filter & Sort
          </span>
          {hasActiveFilters && (
            <span className='bg-brand-100 text-brand-600 text-xs px-2 py-0.5 rounded-full font-body font-medium'>
              Active
            </span>
          )}
        </div>
        <div className='text-warm-stone-400'>
          {isExpanded ? (
            <ChevronUp className='w-4 h-4' />
          ) : (
            <ChevronDown className='w-4 h-4' />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className='px-4 pb-4 pt-1 border-t border-warm-stone-100'>
          <FilterBar
            filters={filters}
            onFiltersChange={onFiltersChange}
            categories={categories}
          />
        </div>
      )}
    </div>
  );
};
