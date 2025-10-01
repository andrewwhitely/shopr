import { SortAsc, SortDesc } from 'lucide-react';
import React from 'react';
import { WishlistFilters } from '../types';

interface FilterBarProps {
  filters: WishlistFilters;
  onFiltersChange: (filters: WishlistFilters) => void;
  categories: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  categories,
}) => {
  const handleFilterChange = (key: keyof WishlistFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleSortOrder = () => {
    handleFilterChange(
      'sortOrder',
      filters.sortOrder === 'asc' ? 'desc' : 'asc'
    );
  };

  return (
    <div className='card space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='grid grid-cols-2 gap-2 w-full'>
          <button
            onClick={() =>
              handleFilterChange(
                'purchased',
                filters.purchased === false ? undefined : false
              )
            }
            className={`btn text-sm px-3 py-1 flex items-center gap-1 w-full ${
              filters.purchased === false ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Wishlist
          </button>
          <button
            onClick={() =>
              handleFilterChange(
                'purchased',
                filters.purchased === true ? undefined : true
              )
            }
            className={`btn text-sm px-3 py-1 w-full ${
              filters.purchased === true
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'btn-secondary'
            }`}
          >
            Purchased
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Sort by
          </label>
          <div className='flex items-center gap-2'>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleFilterChange('sortBy', e.target.value as any)
              }
              className='input flex-1'
            >
              <option value='dateAdded'>Date Added</option>
              <option value='price'>Price</option>
              <option value='name'>Name</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className='btn btn-secondary p-2'
              title={`Sort ${
                filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'
              }`}
            >
              {filters.sortOrder === 'asc' ? (
                <SortAsc className='w-4 h-4' />
              ) : (
                <SortDesc className='w-4 h-4' />
              )}
            </button>
          </div>
        </div>

        {categories.length > 0 && (
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Category
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) =>
                handleFilterChange('category', e.target.value || undefined)
              }
              className='input'
            >
              <option value=''>All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {(filters.purchased !== undefined || filters.category) && (
        <button
          onClick={() =>
            onFiltersChange({ sortBy: 'dateAdded', sortOrder: 'desc' })
          }
          className='btn btn-secondary text-sm w-full'
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};
