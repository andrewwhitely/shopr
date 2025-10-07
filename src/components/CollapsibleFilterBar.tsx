import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import React, { useState } from 'react';
import { WishlistFilters } from '../types';
import { FilterBar } from './FilterBar';

interface CollapsibleFilterBarProps {
  filters: WishlistFilters;
  onFiltersChange: (filters: WishlistFilters) => void;
  categories: string[];
}

export const CollapsibleFilterBar: React.FC<CollapsibleFilterBarProps> = ({
  filters,
  onFiltersChange,
  categories,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.purchased !== undefined || filters.category !== undefined;

  return (
    <div className='card'>
      {/* Filter Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex items-center justify-between w-full p-2 -m-2 rounded-lg hover:bg-gray-50 transition-colors'
      >
        <div className='flex items-center gap-2'>
          <Filter className='w-4 h-4 text-gray-600' />
          <span className='font-medium text-gray-900'>Filters</span>
          {hasActiveFilters && (
            <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
              Active
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className='w-4 h-4 text-gray-600' />
        ) : (
          <ChevronDown className='w-4 h-4 text-gray-600' />
        )}
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className='mt-4 pt-4 border-t border-gray-200'>
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
