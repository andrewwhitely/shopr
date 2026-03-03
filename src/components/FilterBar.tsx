import { SortAsc, SortDesc } from 'lucide-react';
import { FC } from 'react';
import { WishlistFilters } from '../types';
import { SelectDropdown } from './SelectDropdown';

interface FilterBarProps {
	filters: WishlistFilters;
	onFiltersChange: (filters: WishlistFilters) => void;
	categories: string[];
}

export const FilterBar: FC<FilterBarProps> = ({
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
		<div className='space-y-5'>
			{/* Section header */}
			<h3 className='text-xs font-body font-semibold text-warm-stone-400 uppercase tracking-widest'>
				Filter
			</h3>

			{/* Status filter pills */}
			<div className='flex flex-wrap gap-2'>
				<button
					onClick={() =>
						handleFilterChange(
							'purchased',
							filters.purchased === false ? undefined : false
						)
					}
					className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200 border ${filters.purchased === false
						? 'bg-brand-500 text-white border-brand-500'
						: 'bg-white text-warm-stone-600 border-warm-stone-200 hover:border-warm-stone-300 hover:bg-warm-stone-50'
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
					className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200 border ${filters.purchased === true
						? 'bg-green-600 text-white border-green-600'
						: 'bg-white text-warm-stone-600 border-warm-stone-200 hover:border-warm-stone-300 hover:bg-warm-stone-50'
						}`}
				>
					Purchased
				</button>
			</div>

			{/* Sort */}
			<div>
				<label className='block text-xs font-body font-medium text-warm-stone-500 mb-2 uppercase tracking-wider'>
					Sort by
				</label>
				<div className='flex items-center gap-2'>
					<div className='flex-1 min-w-0'>
						<SelectDropdown
							value={filters.sortBy}
							onChange={(v) => handleFilterChange('sortBy', v as any)}
							options={[
								{ value: 'dateAdded', label: 'Date Added' },
								{ value: 'price', label: 'Price' },
								{ value: 'name', label: 'Name' },
							]}
						/>
					</div>
					<button
						onClick={toggleSortOrder}
						className='p-2.5 rounded-lg bg-white border border-warm-stone-200 text-warm-stone-600 hover:border-warm-stone-300 hover:bg-warm-stone-50 transition-all'
						title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'
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

			{/* Category filter */}
			{categories.length > 0 && (
				<div>
					<label className='block text-xs font-body font-medium text-warm-stone-500 mb-2 uppercase tracking-wider'>
						Category
					</label>
					<SelectDropdown
						value={filters.category || ''}
						onChange={(v) =>
							handleFilterChange('category', v || undefined)
						}
						placeholder='All categories'
						options={[
							{ value: '', label: 'All categories' },
							...categories.map((c) => ({
								value: c,
								label: c.charAt(0).toUpperCase() + c.slice(1),
							})),
						]}
					/>
				</div>
			)}

			{/* Clear filters */}
			{(filters.purchased !== undefined || filters.category) && (
				<button
					onClick={() =>
						onFiltersChange({ sortBy: 'dateAdded', sortOrder: 'desc' })
					}
					className='text-xs font-body text-brand-500 hover:text-brand-600 underline underline-offset-2 transition-colors'
				>
					Clear filters
				</button>
			)}
		</div>
	);
};
